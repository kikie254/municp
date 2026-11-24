"use client";

import { Info } from "lucide-react";
import { Field } from "./Field";
import { ActionForm, FieldError } from "./ActionForm";
import { submitSubmissionAction } from "@/lib/actions/submissions";

/**
 * Citizen submission form — general enquiry, feedback, complaint, suggestion.
 *
 * The same component serves every entry point; the `type` decides which queue the record lands in.
 * There is no client-side "preview" any more: submitting writes to the database and returns a real
 * reference number. The notice below states exactly what happens to the data.
 */
export function PublicSubmissionForm({
  type,
  subjects,
  heading,
  intro,
  submitLabel = "Send submission",
  enabled = false,
}: {
  type: "ENQUIRY" | "FEEDBACK" | "COMPLAINT" | "SUGGESTION";
  subjects: string[];
  heading: string;
  intro: string;
  submitLabel?: string;
  enabled?: boolean;
}) {
  return (
    <div id="submission-form" className="border border-paper-line bg-white p-5 shadow-card md:p-7">
      <h2 className="font-display text-[1.1rem] font-bold text-green-900">{heading}</h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">{intro}</p>

      <div role="note" className="mt-4 flex gap-3 border border-gold-400/70 bg-gold-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
        <p className="text-[11.5px] leading-relaxed text-green-950">
          <strong className="font-semibold">Demonstration form — not an authorised municipal channel.</strong> Public
          submissions are disabled by default. They can be enabled only on an expressly authorised deployment.
          Do not enter real personal, financial or sensitive information. Read the{" "}
          <a href="/privacy" className="font-semibold underline decoration-gold-400 decoration-2 underline-offset-2">demonstration data notice</a>.
        </p>
      </div>

      {enabled ? (
      <ActionForm action={submitSubmissionAction} submitLabel={submitLabel} pendingLabel="Submitting…" resetLabel="Clear" className="mt-5">
        {(state, pending) => (
          <div className="space-y-4">
            <input type="hidden" name="type" value={type} />
            {/* Honeypot — visually hidden and not announced, so only automated clients fill it. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`website-${type}`}>Website</label>
              <input id={`website-${type}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" required error={state.errors?.name}>
                <input
                  id="name" name="name" type="text" required autoComplete="name"
                  className="field" placeholder="e.g. Grace Jepkosgei" aria-invalid={Boolean(state.errors?.name)}
                  aria-describedby={state.errors?.name ? "name-error" : undefined} disabled={pending}
                />
                <FieldError id="name" message={state.errors?.name} />
              </Field>
              <Field label="Email address" htmlFor="email" required error={state.errors?.email}>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  className="field" placeholder="name@example.com" aria-invalid={Boolean(state.errors?.email)}
                  aria-describedby={state.errors?.email ? "email-error" : undefined} disabled={pending}
                />
                <FieldError id="email" message={state.errors?.email} />
              </Field>
              <Field label="Telephone" htmlFor="phone" error={state.errors?.phone} hint="Kenyan mobile number, optional.">
                <input
                  id="phone" name="phone" type="tel" autoComplete="tel"
                  className="field" placeholder="0712 345 678" aria-invalid={Boolean(state.errors?.phone)}
                  aria-describedby={state.errors?.phone ? "phone-error" : undefined} disabled={pending}
                />
                <FieldError id="phone" message={state.errors?.phone} />
              </Field>
              <Field label="Subject" htmlFor="subject" required error={state.errors?.subject}>
                <select
                  id="subject" name="subject" required className="field" defaultValue=""
                  aria-invalid={Boolean(state.errors?.subject)}
                  aria-describedby={state.errors?.subject ? "subject-error" : undefined} disabled={pending}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <FieldError id="subject" message={state.errors?.subject} />
              </Field>
            </div>

            <Field label="Ward, street or area" htmlFor="location" error={state.errors?.location} hint="Helps route your matter to the right office.">
              <input
                id="location" name="location" type="text" className="field" placeholder="e.g. Iten Central"
                aria-invalid={Boolean(state.errors?.location)} disabled={pending}
              />
            </Field>

            <Field label="Your message" htmlFor="message" required error={state.errors?.message}>
              <textarea
                id="message" name="message" rows={6} required className="field resize-y"
                placeholder="Set out what happened, where, and when." aria-invalid={Boolean(state.errors?.message)}
                aria-describedby={state.errors?.message ? "message-error" : undefined} disabled={pending}
              />
              <FieldError id="message" message={state.errors?.message} />
            </Field>

            <div className="border-t border-paper-line pt-4">
              <label htmlFor="consent" className="flex items-start gap-2.5 text-[12px] leading-relaxed text-ink-soft">
                <input
                  id="consent" name="consent" type="checkbox" required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-paper-line text-green-700 focus:ring-2 focus:ring-green-600/30"
                  aria-invalid={Boolean(state.errors?.consent)}
                  aria-describedby={state.errors?.consent ? "consent-error" : undefined} disabled={pending}
                />
                <span>
                  I understand this is a demonstration environment. I will not enter real personal or sensitive information, and I understand test data may be stored only when an authorised test deployment enables submissions.
                </span>
              </label>
              <FieldError id="consent" message={state.errors?.consent} />
            </div>

            <p className="flex gap-2 text-[11px] leading-relaxed text-ink-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Fields marked <span className="font-semibold text-flag-red">*</span> are required. Do not include
              identity numbers, bank details or other sensitive personal data.
            </p>
          </div>
        )}
      </ActionForm>
      ) : (
        <div role="status" className="mt-5 border border-paper-line bg-paper-warm p-4 text-[12px] leading-relaxed text-ink-muted">
          Public submissions are disabled on this demonstration deployment. No form information is transmitted or stored.
        </div>
      )}
    </div>
  );
}
