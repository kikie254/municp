"use client";

import { useState } from "react";
import { Send, RotateCcw, CheckCircle2, Paperclip } from "lucide-react";
import { Field } from "./Field";
import { DemoNotice } from "./DemoNotice";
import { isEmail, isPhone, useDemoForm } from "./useFormState";

export function ParticipationForm() {
  const initial = {
    name: "",
    email: "",
    phone: "",
    area: "",
    subject: "",
    message: "",
  };

  const [fileName, setFileName] = useState("");
  const form = useDemoForm(initial, (v) => {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 3) e.name = "Please enter your full name (at least 3 characters).";
    if (!isEmail(v.email)) e.email = "Please enter a valid email address, for example name@example.com.";
    if (v.phone.trim() && !isPhone(v.phone)) e.phone = "Please enter a valid Kenyan number, for example the municipal office.";
    if (v.area.trim().length < 2) e.area = "Please tell us your area or ward.";
    if (v.subject.trim().length < 5) e.subject = "Please provide a subject of at least 5 characters.";
    if (v.message.trim().length < 20) e.message = "Please set out your contribution in at least 20 characters.";
    return e;
  });

  return (
    <div id="participation-form" className="border border-paper-line bg-white p-5 shadow-card md:p-7">
      <h3 className="font-display text-[1.1rem] font-bold text-green-900">Participation information form</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
        Use this form to prepare a contribution, a question or a request to be heard at a municipal forum.
      </p>
      <div className="mt-4">
        <DemoNotice />
      </div>

      <form onSubmit={form.onSubmit} noValidate className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required error={form.errors.name}>
            <input
              id="name" name="name" type="text" className="input" placeholder="e.g. Jane Cherono"
              value={form.values.name} onChange={form.set("name")}
              aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? "name-error" : undefined}
            />
          </Field>
          <Field label="Email address" htmlFor="email" required error={form.errors.email}>
            <input
              id="email" name="email" type="email" className="input" placeholder="name@example.com"
              value={form.values.email} onChange={form.set("email")}
              aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? "email-error" : undefined}
            />
          </Field>
          <Field label="Telephone" htmlFor="phone" error={form.errors.phone} hint="Optional, but helpful for follow-up.">
            <input
              id="phone" name="phone" type="tel" className="input" placeholder="the municipal office"
              value={form.values.phone} onChange={form.set("phone")}
              aria-invalid={Boolean(form.errors.phone)} aria-describedby={form.errors.phone ? "phone-error" : undefined}
            />
          </Field>
          <Field label="Area or ward" htmlFor="area" required error={form.errors.area}>
            <input
              id="area" name="area" type="text" className="input" placeholder="e.g. Iten town centre"
              value={form.values.area} onChange={form.set("area")}
              aria-invalid={Boolean(form.errors.area)} aria-describedby={form.errors.area ? "area-error" : undefined}
            />
          </Field>
        </div>

        <Field label="Subject" htmlFor="subject" required error={form.errors.subject}>
          <input
            id="subject" name="subject" type="text" className="input" placeholder="What is your contribution about?"
            value={form.values.subject} onChange={form.set("subject")}
            aria-invalid={Boolean(form.errors.subject)} aria-describedby={form.errors.subject ? "subject-error" : undefined}
          />
        </Field>

        <Field label="Message" htmlFor="message" required error={form.errors.message}>
          <textarea
            id="message" name="message" rows={6} className="input resize-y"
            placeholder="Set out your view, proposal or question, and the decision or service it relates to."
            value={form.values.message} onChange={form.set("message")}
            aria-invalid={Boolean(form.errors.message)} aria-describedby={form.errors.message ? "message-error" : undefined}
          />
        </Field>

        <Field label="Attachment" htmlFor="attachment" hint="Optional. The file stays on your device — nothing is uploaded.">
          <div className="flex items-center gap-3">
            <label htmlFor="attachment" className="btn btn-outline cursor-pointer !py-2.5 !text-[11.5px]">
              <Paperclip aria-hidden="true" /> Choose file
            </label>
            <input
              id="attachment" name="attachment" type="file" className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            <span className="truncate text-[11.5px] text-ink-muted">{fileName || "No file selected"}</span>
          </div>
        </Field>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn btn-primary">
            <Send aria-hidden="true" /> Prepare preview
          </button>
          <button type="button" onClick={() => { form.reset(); setFileName(""); }} className="btn btn-outline">
            <RotateCcw aria-hidden="true" /> Clear form
          </button>
        </div>
      </form>

      {form.submitted && (
        <div id="form-preview" className="mt-6 border border-green-200 bg-green-50/60 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.06em] text-green-900">
                Preview only — your contribution has not been sent
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
                This is a demonstration of the form. Nothing was transmitted to, stored by or registered with the
                municipality. To submit formally, call the municipal office or email Contact details are awaiting written municipal confirmation..
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[12px] sm:grid-cols-2">
                {[
                  ["Full name", form.values.name],
                  ["Email", form.values.email],
                  ["Telephone", form.values.phone || "—"],
                  ["Area or ward", form.values.area],
                  ["Subject", form.values.subject],
                  ["Attachment", fileName || "—"],
                ].map(([k, v]) => (
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
