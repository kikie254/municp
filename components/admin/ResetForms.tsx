"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordResetAction, completePasswordResetAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";

function Result({ status, message }: { status: string; message?: string }) {
  if (!message) return null;
  if (status === "ok") {
    return (
      <div role="status" className="mt-4 flex gap-2.5 border border-green-300 bg-green-50 px-4 py-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
        <p className="text-[12px] leading-relaxed text-green-900">{message}</p>
      </div>
    );
  }
  return (
    <div role="alert" className="mt-4 flex gap-2.5 border border-flag-red/40 bg-flag-red/[0.05] px-4 py-3">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
      <p className="text-[12px] leading-relaxed text-flag-red">{message}</p>
    </div>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initialActionState);
  return (
    <form action={action} className="mt-5 space-y-4">
      <div>
        <label className="label" htmlFor="email">Account email address</label>
        <input id="email" name="email" type="email" required className="field" autoComplete="username" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />} {pending ? "Issuing…" : "Issue reset link"}
      </button>
      <Result status={state.status} message={state.message} />
    </form>
  );
}

export function ResetCompleteForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(completePasswordResetAction, initialActionState);
  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="label" htmlFor="password">New password</label>
        <input id="password" name="password" type="password" required minLength={12} className="field" autoComplete="new-password"
          aria-invalid={Boolean(state.errors?.password)} />
        {state.errors?.password && <p role="alert" className="mt-1.5 text-[11.5px] text-flag-red">{state.errors.password}</p>}
        <p className="mt-1.5 text-[11px] text-ink-muted">At least 12 characters with upper case, lower case, a number and a symbol.</p>
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" required className="field" autoComplete="new-password"
          aria-invalid={Boolean(state.errors?.confirm)} />
        {state.errors?.confirm && <p role="alert" className="mt-1.5 text-[11.5px] text-flag-red">{state.errors.confirm}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />} {pending ? "Changing…" : "Change password"}
      </button>
      <Result status={state.status} message={state.message} />
    </form>
  );
}
