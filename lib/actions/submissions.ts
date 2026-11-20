"use server";

import { headers } from "next/headers";

import { fieldErrors, submissionSchema, participationResponseSchema } from "@/lib/validation/schemas";
import { hashIp, publicReference } from "@/lib/security/tokens";
import { rateLimit } from "@/lib/auth/ratelimit";
import { sendMail, municipalRecipient, mailerConfigured } from "@/lib/services/email.service";
import { recordAudit } from "@/lib/auth/audit";
import { sameOrigin } from "@/lib/security/csrf";
import * as submissionService from "@/lib/services/submission.service";
import * as participationService from "@/lib/services/participation.service";
import { logError } from "@/lib/firebase/errors";
import { site } from "@/lib/site";
import type { ActionState } from "./types";

const TYPE_LABEL: Record<string, string> = {
  ENQUIRY: "General enquiry",
  FEEDBACK: "Citizen feedback",
  COMPLAINT: "Complaint",
  SUGGESTION: "Suggestion",
  PARTICIPATION: "Public participation submission",
};

/**
 * Citizen submission intake.
 *
 * The record is written to Firestore with an auto ID — 20 random characters, never sequential or
 * guessable — before the citizen is told anything. The confirmation reports the true outcome,
 * including when the notification email could not be sent because no provider is configured.
 */
export async function submitSubmissionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await sameOrigin())) return { status: "error", message: "Request rejected: invalid origin." };

  const raw = {
    type: String(formData.get("type") || "ENQUIRY"),
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    subject: String(formData.get("subject") || ""),
    message: String(formData.get("message") || ""),
    location: String(formData.get("location") || "") || undefined,
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    website: String(formData.get("website") || ""),
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  }
  if (parsed.data.website) {
    // Honeypot filled: behave normally to the bot, store nothing.
    return { status: "ok", reference: "ITM-RCV-RECEIVED", message: "Thank you. Your message has been received." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = await rateLimit(`submit:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return { status: "error", message: "You have submitted several messages recently. Please try again later, or contact the office by telephone." };
  }

  const ipHash = hashIp(ip);
  const reference = publicReference(parsed.data.type);
  let created: { id: string; reference: string };
  try {
    created = await submissionService.createSubmission({
      reference,
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      location: parsed.data.location ?? null,
      consent: parsed.data.consent,
      status: "RECEIVED",
      assignedToId: null,
      assignedToName: null,
      notesCount: 0,
      ipHash: ipHash ?? null,
      userAgent: (h.get("user-agent") || "").slice(0, 250),
      resolvedAt: null,
    });
  } catch (error) {
    logError("submission.persist", error);
    return {
      status: "error",
      message: `Your submission could not be recorded. Please try again, or contact the office on ${site.contact.phoneDisplay}.`,
    };
  }

  const label = TYPE_LABEL[parsed.data.type] ?? "Submission";
  const internal = await sendMail({
    to: municipalRecipient(),
    subject: `[${created.reference}] ${label}: ${parsed.data.subject}`,
    replyTo: parsed.data.email,
    body: [
      `Reference: ${created.reference}`,
      `Type: ${label}`,
      `From: ${parsed.data.name} <${parsed.data.email}>${parsed.data.phone ? ` · ${parsed.data.phone}` : ""}`,
      parsed.data.location ? `Area: ${parsed.data.location}` : "",
      `Received: ${new Date().toISOString()}`,
      "",
      parsed.data.message,
    ].filter(Boolean).join("\n"),
  });

  const acknowledgement = await sendMail({
    to: parsed.data.email,
    subject: `Your reference ${created.reference} — Iten-Tambach Municipality`,
    body: [
      `Dear ${parsed.data.name},`,
      "",
      `Your ${label.toLowerCase()} has been recorded by Iten-Tambach Municipality under reference ${created.reference}.`,
      "",
      `Subject: ${parsed.data.subject}`,
      "",
      "Please quote the reference above in any follow-up. This acknowledgement confirms that the message reached the municipal system; it is not a decision on the matter and no response time is implied.",
      "",
      "Iten-Tambach Municipality",
      site.county,
    ].join("\n"),
  });

  await recordAudit({
    actorEmail: parsed.data.email,
    action: "SUBMISSION_RECEIVED",
    entityType: "Submission",
    entityId: created.id,
    summary: `${label} ${created.reference} received. Internal notification: ${internal.status}. Acknowledgement: ${acknowledgement.status}.`,
    ipHash,
  });

  return {
    status: "ok",
    reference: created.reference,
    emailStatus: acknowledgement.status,
    message: mailerConfigured()
      ? `Your ${label.toLowerCase()} has been recorded under reference ${created.reference}.`
      : `Your ${label.toLowerCase()} has been recorded under reference ${created.reference}. An acknowledgement email could not be sent because no email provider is configured on this deployment — please keep the reference.`,
  };
}

/** Public participation response against a published opportunity. Rejects after closing time. */
export async function submitParticipationResponseAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await sameOrigin())) return { status: "error", message: "Request rejected: invalid origin." };
  const raw = {
    opportunitySlug: String(formData.get("opportunitySlug") || ""),
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    organisation: String(formData.get("organisation") || "") || undefined,
    ward: String(formData.get("ward") || "") || undefined,
    response: String(formData.get("response") || ""),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    website: String(formData.get("website") || ""),
  };
  const parsed = participationResponseSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  }

  const opportunity = await participationService.getOpportunityBySlug(parsed.data.opportunitySlug).catch(() => null);
  if (!opportunity || opportunity.status !== "PUBLISHED" || !opportunity.publishedAt || opportunity.publishedAt.getTime() > Date.now()) {
    return { status: "error", message: "This consultation is not open for submissions." };
  }
  if (opportunity.opensAt && opportunity.opensAt.getTime() > Date.now()) {
    // DB-08 fix: opensAt was stored but never enforced — responses were accepted before opening.
    return { status: "error", message: "This consultation has not opened for submissions yet." };
  }
  if (opportunity.closesAt && opportunity.closesAt.getTime() < Date.now()) {
    return { status: "error", message: "The submission period for this consultation has closed." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit(`participate:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) return { status: "error", message: "Too many submissions from this connection. Please try again later." };

  const reference = publicReference("PARTICIPATION");
  let created: { id: string };
  try {
    created = await participationService.createResponse({
      reference,
      opportunityId: opportunity.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      organisation: parsed.data.organisation ?? null,
      ward: parsed.data.ward ?? null,
      response: parsed.data.response,
      consent: parsed.data.consent,
    });
  } catch (error) {
    logError("participation.persist", error);
    return { status: "error", message: "Your response could not be recorded. Please try again." };
  }

  const mail = await sendMail({
    to: municipalRecipient(),
    subject: `[${reference}] Public participation response: ${opportunity.title}`,
    replyTo: parsed.data.email,
    body: `${parsed.data.name} <${parsed.data.email}>\n${parsed.data.organisation ?? ""}\nWard: ${parsed.data.ward ?? "—"}\n\n${parsed.data.response}`,
  });
  await recordAudit({
    actorEmail: parsed.data.email, action: "PARTICIPATION_RESPONSE_RECEIVED", entityType: "ParticipationResponse",
    entityId: created.id, summary: `Response ${reference} to "${opportunity.title}". Notification: ${mail.status}.`,
    ipHash: hashIp(ip),
  });

  return {
    status: "ok",
    reference,
    emailStatus: mail.status,
    message: `Your response has been recorded under reference ${reference}.`,
  };
}
