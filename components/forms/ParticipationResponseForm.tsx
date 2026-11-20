"use client";

import { Field } from "./Field";
import { ActionForm, FieldError } from "./ActionForm";
import { submitParticipationResponseAction } from "@/lib/actions/submissions";

export function ParticipationResponseForm({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="border-t-[3px] border-green-800 bg-white p-5 shadow-card md:p-6">
      <h2 className="font-display text-[1.05rem] font-bold text-green-900">Submit your response</h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
        Your response to <strong className="text-green-900">{title}</strong> is recorded against this consultation and
        visible only to authorised municipal officers.
      </p>

      <ActionForm action={submitParticipationResponseAction} submitLabel="Submit response" pendingLabel="Submitting…" className="mt-5">
        {(state, pending) => (
          <div className="space-y-4">
            <input type="hidden" name="opportunitySlug" value={slug} />
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="p-website">Website</label>
              <input id="p-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="p-name" required error={state.errors?.name}>
                <input id="p-name" name="name" type="text" required className="field" autoComplete="name"
                  aria-invalid={Boolean(state.errors?.name)} disabled={pending} />
                <FieldError id="p-name" message={state.errors?.name} />
              </Field>
              <Field label="Email address" htmlFor="p-email" required error={state.errors?.email}>
                <input id="p-email" name="email" type="email" required className="field" autoComplete="email"
                  aria-invalid={Boolean(state.errors?.email)} disabled={pending} />
                <FieldError id="p-email" message={state.errors?.email} />
              </Field>
              <Field label="Telephone" htmlFor="p-phone" error={state.errors?.phone}>
                <input id="p-phone" name="phone" type="tel" className="field" autoComplete="tel" disabled={pending} />
              </Field>
              <Field label="Ward or area" htmlFor="p-ward">
                <input id="p-ward" name="ward" type="text" className="field" disabled={pending} />
              </Field>
            </div>

            <Field label="Organisation" htmlFor="p-org" hint="Optional — for businesses, groups or institutions.">
              <input id="p-org" name="organisation" type="text" className="field" disabled={pending} />
            </Field>

            <Field label="Your response" htmlFor="p-response" required error={state.errors?.response}>
              <textarea id="p-response" name="response" rows={7} required className="field resize-y"
                placeholder="Set out your views, comments or recommendations."
                aria-invalid={Boolean(state.errors?.response)} disabled={pending} />
              <FieldError id="p-response" message={state.errors?.response} />
            </Field>

            <label htmlFor="p-consent" className="flex items-start gap-2.5 text-[12px] leading-relaxed text-ink-soft">
              <input id="p-consent" name="consent" type="checkbox" required
                className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-paper-line text-green-700 focus:ring-2 focus:ring-green-600/30"
                aria-describedby={state.errors?.consent ? "p-consent-error" : undefined} disabled={pending} />
              <span>
                I consent to this response being recorded and considered as part of the consultation. I understand it
                will not be published in a form that identifies me without my agreement.
              </span>
            </label>
            <FieldError id="p-consent" message={state.errors?.consent} />
          </div>
        )}
      </ActionForm>
    </div>
  );
}
