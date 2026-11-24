"use client";

import { Send, RotateCcw, CheckCircle2 } from "lucide-react";
import { Field } from "./Field";
import { DemoNotice } from "./DemoNotice";
import { isEmail, isPhone, useDemoForm } from "./useFormState";

const subjects = [
  "General enquiry",
  "Municipal services",
  "Documents and records",
  "Public participation",
  "Investment enquiry",
  "Media enquiry",
  "Other",
];

export function ContactForm() {
  const initial = { name: "", email: "", phone: "", subject: "", message: "" };

  const form = useDemoForm(initial, (v) => {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 3) e.name = "Please enter your full name (at least 3 characters).";
    if (!isEmail(v.email)) e.email = "Please enter a valid email address, for example name@example.com.";
    if (v.phone.trim() && !isPhone(v.phone)) e.phone = "Please enter a valid Kenyan mobile number, for example 0712 345 678.";
    if (!v.subject) e.subject = "Please select the subject of your enquiry.";
    if (v.message.trim().length < 20) e.message = "Please set out your enquiry in at least 20 characters.";
    return e;
  });

  return (
    <div id="contact-form" className="border border-paper-line bg-white p-5 shadow-card md:p-7">
      <h3 className="font-display text-[1.1rem] font-bold text-green-900">Contact enquiry form</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
        We welcome enquiries, suggestions and constructive engagement from residents, businesses, visitors and
        development partners.
      </p>
      <div className="mt-4">
        <DemoNotice>
          This contact form is a demonstration. Your enquiry is validated and previewed on your device and is not
          transmitted to, stored by or registered with the municipality. For official enquiries, please visit the municipal office in person or write to Contact details are awaiting written municipal confirmation..
        </DemoNotice>
      </div>

      <form onSubmit={form.onSubmit} noValidate className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required error={form.errors.name}>
            <input id="name" name="name" type="text" className="input" placeholder="e.g. Grace Jepkosgei"
              value={form.values.name} onChange={form.set("name")}
              aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? "name-error" : undefined} />
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
          <Field label="Subject" htmlFor="subject" required error={form.errors.subject}>
            <select id="subject" name="subject" className="input"
              value={form.values.subject} onChange={form.set("subject")}
              aria-invalid={Boolean(form.errors.subject)} aria-describedby={form.errors.subject ? "subject-error" : undefined}>
              <option value="">Select a subject</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Message" htmlFor="message" required error={form.errors.message}>
          <textarea id="message" name="message" rows={6} className="input resize-y"
            placeholder="How can we help?"
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
                Nothing was transmitted, stored or registered. For official enquiries, please visit the municipal office or write to Contact details are awaiting written municipal confirmation..
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[12px] sm:grid-cols-2">
                {[["Name", form.values.name], ["Email", form.values.email], ["Telephone", form.values.phone || "—"], ["Subject", form.values.subject]].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">{k}</dt>
                    <dd className="mt-0.5 break-words text-green-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t border-green-200 pt-3">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">Message</p>
                <p className="mt-1 whitespace-pre-line text-[12px] leading-relaxed text-green-900">{form.values.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
