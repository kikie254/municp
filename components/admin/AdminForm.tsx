"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionState } from "@/lib/actions/types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  extra?: React.ReactNode;
};

/** Server-action form with server-returned validation and status messages. */
export function AdminForm({ action, children, submitLabel, pendingLabel = "Saving…", extra }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as ActionState);
  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <div role="alert" className="flex gap-2.5 border border-flag-red/40 bg-flag-red/[0.05] px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
          <p className="text-[12.5px] text-flag-red">{state.message || "Please check the form and try again."}</p>
        </div>
      )}
      {state.status === "ok" && (
        <div role="status" className="flex gap-2.5 border border-green-300 bg-green-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
          <p className="text-[12.5px] text-green-900">
            {state.message}
            {state.reference ? <span className="ml-2 font-mono font-semibold">{state.reference}</span> : null}
          </p>
        </div>
      )}
      {children}
      <div className="flex flex-wrap items-center gap-3 border-t border-paper-line pt-5">
        <button type="submit" disabled={pending} className="btn btn-primary !py-2.5 !text-[11.5px] disabled:opacity-60">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {pending ? pendingLabel : submitLabel}
        </button>
        {extra}
      </div>
    </form>
  );
}

export function AdminField({
  label, name, value, error, hint, required, type = "text", placeholder, rows, options, help,
}: {
  label: string; name: string; value?: string | null; error?: string; hint?: string; required?: boolean;
  type?: string; placeholder?: string; rows?: number; options?: readonly string[]; help?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required ? <span className="text-flag-red"> *</span> : <span className="ml-1 font-normal normal-case tracking-normal text-ink-muted">(optional)</span>}
      </label>
      {options ? (
        <select id={id} name={name} defaultValue={value ?? ""} className="field" aria-describedby={hint ? `${id}-hint` : undefined}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea id={id} name={name} rows={rows} defaultValue={value ?? ""} placeholder={placeholder} className="field" aria-invalid={Boolean(error)} aria-describedby={hint ? `${id}-hint` : undefined} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={value ?? ""} placeholder={placeholder} className="field" aria-invalid={Boolean(error)} aria-describedby={hint ? `${id}-hint` : undefined} />
      )}
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">{hint}</p>}
      {help && <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">{help}</p>}
      {error && <p role="alert" className="mt-1.5 text-[11.5px] text-flag-red">{error}</p>}
    </div>
  );
}
