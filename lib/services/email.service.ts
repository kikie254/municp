import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, updateDoc } from "../firebase/db";
import { logError } from "../firebase/errors";
import type { EmailOutboxRecord } from "../firebase/types";

/**
 * Email delivery.
 *
 * The platform never pretends a message was sent. Every notification is written to /emailOutbox and
 * its status reflects what actually happened:
 *   QUEUED           — stored, no provider configured yet (nothing was transmitted)
 *   SENT             — the provider accepted the message (HTTP 2xx)
 *   FAILED           — the provider rejected the message or was unreachable
 *   NOT_CONFIGURED   — returned to the caller so the UI can state it honestly
 */

export type MailResult = { status: "SENT" | "QUEUED" | "FAILED" | "NOT_CONFIGURED"; detail?: string; outboxId: string };
export type MailInput = { to: string | null; subject: string; body: string; replyTo?: string };

export function mailerConfigured(): boolean {
  return Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM && process.env.EMAIL_PROVIDER);
}

async function enqueue(input: MailInput): Promise<string> {
  const created = await addDoc(COLLECTIONS.emailOutbox, {
    toAddress: input.to,
    subject: input.subject.slice(0, 200),
    body: input.body,
    status: "QUEUED",
    provider: null,
    error: null,
    attempts: 0,
    createdAt: new Date(),
    sentAt: null,
  } as never);
  return created.id;
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  if (!input.to) {
    return { status: "NOT_CONFIGURED", outboxId: "", detail: "No approved recipient is configured." };
  }
  const outboxId = await enqueue(input);

  if (!mailerConfigured()) {
    return {
      status: "NOT_CONFIGURED",
      outboxId,
      detail: "No email provider is configured (EMAIL_PROVIDER / EMAIL_API_KEY / EMAIL_FROM).",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        text: input.body,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      await updateDoc(COLLECTIONS.emailOutbox as never, outboxId, {
        status: "FAILED",
        error: detail,
        attempts: 1,
        provider: process.env.EMAIL_PROVIDER,
      } as never);
      return { status: "FAILED", detail, outboxId };
    }
    await updateDoc(COLLECTIONS.emailOutbox as never, outboxId, {
      status: "SENT",
      sentAt: new Date(),
      attempts: 1,
      provider: process.env.EMAIL_PROVIDER,
    } as never);
    return { status: "SENT", outboxId };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown provider error";
    logError("email", error);
    await updateDoc(COLLECTIONS.emailOutbox as never, outboxId, {
      status: "FAILED",
      error: detail.slice(0, 300),
      attempts: 1,
    } as never).catch(() => undefined);
    return { status: "FAILED", detail, outboxId };
  }
}

/** Internal notification recipient. Missing or invalid configuration fails closed. */
export function municipalRecipient(): string | null {
  const address = process.env.MUNICIPAL_NOTIFICATIONS_EMAIL?.trim();
  if (!address || !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(address)) return null;
  return address;
}

export async function listOutbox(limit = 20): Promise<(EmailOutboxRecord & { id: string })[]> {
  const snap = await col(COLLECTIONS.emailOutbox).orderBy("createdAt", "desc").limit(limit).get();
  const out: (EmailOutboxRecord & { id: string })[] = [];
  for (const d of snap.docs) {
    const data = d.data() as Omit<EmailOutboxRecord, "id">;
    out.push({
      ...data,
      id: d.id,
      createdAt: (data.createdAt as unknown as { toDate(): Date }).toDate(),
      sentAt: data.sentAt ? (data.sentAt as unknown as { toDate(): Date }).toDate() : null,
    });
  }
  return out;
}

export async function countFailedEmails(): Promise<number> {
  const snap = await col(COLLECTIONS.emailOutbox).where("status", "==", "FAILED").count().get();
  return snap.data().count;
}

export async function requeueEmail(id: string): Promise<void> {
  await updateDoc(COLLECTIONS.emailOutbox as never, id, { status: "QUEUED", error: null } as never);
}
