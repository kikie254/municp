"use client";

import { useState } from "react";
import { Send, RotateCcw, CheckCircle2, Printer } from "lucide-react";
import { Field } from "./Field";
import { DemoNotice } from "./DemoNotice";
import { isEmail, isPhone, useDemoForm } from "./useFormState";

const categories = [
  "Environmental cleanliness",
  "Waste management",
  "Public spaces",
  "Urban planning enquiries",
  "Infrastructure concerns",
  "Public participation",
  "General enquiries",
  "Other",
];

export function FeedbackForm() {
  const initial = {
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    subject: "",
    description: "",
  };

  const [fileName, setFileName] = useState<string>("");

  const form = useDemoForm(initial, (v) => {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 3) e.name = "Please enter your full name (at least 3 characters).";
    if (!isEmail(v.email)) e.email = "Please enter a valid email address, for example name@example.com.";
    if (v.phone.trim() && !isPhone(v.phone)) e.phone = "Please enter a valid Kenyan number, for example the municipal office.";
    if (v.location.trim().length < 2) e.location = "Please tell us the area or ward concerned.";
    if (!v.category) e.category = "Please select the category that best describes your feedback.";
    if (v.subject.trim().length < 5) e.subject = "Please provide a short subject of at least 5 characters.";
    if (v.description.trim().length < 20) e.description = "Please describe the matter in at least 20 characters so it can be understood.";
    return e;
  });

  return (
    <div className="space-y-6">
      <DemoNotice />

      <form onSubmit={form.onSubmit} noValidate className="card p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required error={form.errors.name}>
            <input id="name" name="name" className="field" value={form.values.name} onChange={form.set("name")} autoComplete="name" aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? "name-error" : undefined} placeholder="e.g. Chemtai Kimutai" />
          </Field>
          <Field label="Email address" htmlFor="email" required error={form.errors.email}>
            <input id="email" name="email" type="email" className="field" value={form.values.email} onChange={form.set("email")} autoComplete="email" aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? "email-error" : undefined} placeholder="name@example.com" />
          </Field>
          <Field label="Telephone" htmlFor="phone" error={form.errors.phone} hint="Format: 07XX XXX XXX">
            <input id="phone" name="phone" type="tel" className="field" value={form.values.phone} onChange={form.set("phone")} autoComplete="tel" aria-invalid={Boolean(form.errors.phone)} aria-describedby={form.errors.phone ? "phone-error" : undefined} placeholder="the municipal office" />
          </Field>
          <Field label="Location or ward" htmlFor="location" required error={form.errors.location}>
            <input id="location" name="location" className="field" value={form.values.location} onChange={form.set("location")} aria-invalid={Boolean(form.errors.location)} aria-describedby={form.errors.location ? "location-error" : undefined} placeholder="e.g. Iten town centre" />
          </Field>
          <Field label="Category" htmlFor="category" required error={form.errors.category}>
            <select id="category" name="category" className="field" value={form.values.category} onChange={form.set("category")} aria-invalid={Boolean(form.errors.category)} aria-describedby={form.errors.category ? "category-error" : undefined}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Subject" htmlFor="subject" required error={form.errors.subject}>
            <input id="subject" name="subject" className="field" value={form.values.subject} onChange={form.set("subject")} aria-invalid={Boolean(form.errors.subject)} aria-describedby={form.errors.subject ? "subject-error" : undefined} placeholder="Brief summary of your feedback" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="description" required error={form.errors.description} hint="Please include what happened, where, and when. Minimum 20 characters.">
              <textarea id="description" name="description" rows={6} className="field resize-y" value={form.values.description} onChange={form.set("description")} aria-invalid={Boolean(form.errors.description)} aria-describedby={form.errors.description ? "description-error" : undefined} placeholder="Describe your concern or suggestion…" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Attachment" htmlFor="attachment" hint="PDF, JPG or PNG. In this demonstration the file stays on your device and is not uploaded.">
              <input id="attachment" name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} className="block w-full cursor-pointer border border-paper-line bg-white text-[13px] text-ink-muted file:mr-3 file:cursor-pointer file:border-0 file:bg-green-50 file:px-4 file:py-2.5 file:text-[12px] file:font-semibold file:text-green-900" />
              {fileName && <p className="mt-1.5 text-[11.5px] text-green-700">Selected on your device: {fileName}</p>}
            </Field>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-paper-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-ink-muted">Fields marked <span className="text-flag-red">*</span> are required.</p>
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={form.reset} className="btn btn-outline !py-3 !text-[12.5px]"><RotateCcw aria-hidden="true" /> Clear form</button>
            <button type="submit" className="btn btn-primary !py-3 !text-[12.5px]"><Send aria-hidden="true" /> Validate &amp; preview</button>
          </div>
        </div>
      </form>

      {form.submitted && (
        <div id="form-preview" className="animate-scale-in border-l-[3px] border-gold-400 bg-green-950 p-5 text-white sm:p-7">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-gold-400" aria-hidden="true" />
            <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.06em] text-white">Preview only — your feedback has not been sent</h3>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-white/65">
            The entry below passed validation and is displayed locally in your browser. It has <strong className="text-white">not</strong> been transmitted to, stored by or registered with Iten-Tambach Municipality, and no reference number has been issued. To raise this matter officially, visit the municipal office in person or write to <span className="text-gold-300 font-semibold">P.O. Box 220-30700, Iten</span>.
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-3 text-[12.5px] sm:grid-cols-2">
            {([["Name", form.values.name],["Email", form.values.email],["Telephone", form.values.phone || "Not provided"],["Location", form.values.location],["Category", form.values.category],["Subject", form.values.subject],["Attachment", fileName || "None selected"]] as [string,string][]).map(([k, v]) => (
              <div key={k} className="border-t border-white/10 pt-2">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{k}</dt>
                <dd className="mt-0.5 break-words text-white/90">{v}</dd>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 sm:col-span-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Description</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-white/90">{form.values.description}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => window.print()} className="mt-5 inline-flex items-center gap-2 border border-white/25 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/80 hover:bg-white/10 print:hidden">
            <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Print this preview
          </button>
        </div>
      )}
    </div>
  );
}
