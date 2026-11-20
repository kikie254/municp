"use client";

import { Send, RotateCcw, CheckCircle2 } from "lucide-react";
import { Field } from "./Field";
import { DemoNotice } from "./DemoNotice";
import { isEmail, isPhone, useDemoForm } from "./useFormState";

const interests = [
  "Trade and retail",
  "Hospitality and tourism",
  "Agro-processing and value addition",
  "Construction and property",
  "Professional services",
  "Development partnership",
  "Other",
];

export function EnquiryForm() {
  const initial = {
    name: "",
    organisation: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  };

  const form = useDemoForm(initial, (v) => {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 3) e.name = "Please enter your name (at least 3 characters).";
    if (!isEmail(v.email)) e.email = "Please enter a valid email address, for example name@example.com.";
    if (v.phone.trim() && !isPhone(v.phone)) e.phone = "Please enter a valid Kenyan mobile number, for example 0712 345 678.";
    if (!v.interest) e.interest = "Please select an area of interest.";
    if (v.message.trim().length < 20) e.message = "Please describe your enquiry in at least 20 characters.";
    return e;
  });

  return (
    <div id="enquiry-form" className="border border-paper-line bg-white p-5 shadow-card md:p-7">
      <h3 className="font-display text-[1.1rem] font-bold text-green-900">Investment enquiry form</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
        For entrepreneurs, investors and development partners who wish to open a conversation with the municipality.
      </p>
      <div className="mt-4">
        <DemoNotice>
          This enquiry form is a demonstration. Your entry is validated and previewed on your device, is not
          transmitted to the municipality, and does not create an official enquiry or application. No investment
          incentive, land allocation, tax treatment or return is offered or implied by this page.
        </DemoNotice>
      </div>

      <form onSubmit={form.onSubmit} noValidate className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required error={form.errors.name}>
            <input id="name" name="name" type="text" className="input" placeholder="e.g. Peter Kimutai"
              value={form.values.name} onChange={form.set("name")}
              aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? "name-error" : undefined} />
          </Field>
          <Field label="Organisation" htmlFor="organisation">
            <input id="organisation" name="organisation" type="text" className="input" placeholder="Company or institution"
              value={form.values.organisation} onChange={form.set("organisation")} />
          </Field>
          <Field label="Email address" htmlFor="email" required error={form.errors.email}>
            <input id="email" name="email" type="email" className="input" placeholder="name@example.com"
              value={form.values.email} onChange={form.set("email")}
              aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? "email-error" : undefined} />
          </Field>
          <Field label="Telephone" htmlFor="phone" error={form.errors.phone}>
            <input id="phone" name="phone" type="tel" className="input" placeholder="0712 345 678"
              value={form.values.phone} onChange={form.set("phone")}
              aria-invalid={Boolean(form.errors.phone)} aria-describedby={form.errors.phone ? "phone-error" : undefined} />
          </Field>
        </div>

        <Field label="Area of interest" htmlFor="interest" required error={form.errors.interest}>
          <select id="interest" name="interest" className="input"
            value={form.values.interest} onChange={form.set("interest")}
            aria-invalid={Boolean(form.errors.interest)} aria-describedby={form.errors.interest ? "interest-error" : undefined}>
            <option value="">Select an area of interest</option>
            {interests.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>

        <Field label="Enquiry" htmlFor="message" required error={form.errors.message}>
          <textarea id="message" name="message" rows={6} className="input resize-y"
            placeholder="Describe your proposed activity, the information you need and any relevant timelines."
            value={form.values.message} onChange={form.set("message")}
            aria-invalid={Boolean(form.errors.message)} aria-describedby={form.errors.message ? "message-error" : undefined} />
        </Field>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn btn-primary"><Send aria-hidden="true" /> Prepare preview</button>
          <button type="button" onClick={form.reset} className="btn btn-outline"><RotateCcw aria-hidden="true" /> Clear form</button>
        </div>
      </form>

      {form.submitted && (
        <div id="form-preview" className="mt-6 border border-green-200 bg-green-50/60 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.06em] text-green-900">
                Preview only — your enquiry has not been sent
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
                Nothing was transmitted, stored or registered. For a formal enquiry, email the municipal office (P.O. Box 220-30700, Iten)
                or write to P.O. Box 220-30700, Iten.
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[12px] sm:grid-cols-2">
                {[
                  ["Name", form.values.name],
                  ["Organisation", form.values.organisation || "—"],
                  ["Email", form.values.email],
                  ["Telephone", form.values.phone || "—"],
                  ["Area of interest", form.values.interest],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">{k}</dt>
                    <dd className="mt-0.5 break-words text-green-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t border-green-200 pt-3">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">Enquiry</p>
                <p className="mt-1 whitespace-pre-line text-[12px] leading-relaxed text-green-900">{form.values.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
