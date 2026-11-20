"use client";

import { useActionState } from "react";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialActionState);
  return (
    <form action={action} className="mt-6 space-y-4">
      {state.status === "error" && (
        <div role="alert" className="flex gap-2.5 border border-flag-red/40 bg-flag-red/[0.05] px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
          <p className="text-[12.5px] text-flag-red">{state.message}</p>
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" aria-invalid={Boolean(state.errors?.email)} />
        {state.errors?.email && <p role="alert" className="mt-1.5 text-[11.5px] text-flag-red">{state.errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" aria-invalid={Boolean(state.errors?.password)} />
        {state.errors?.password && <p role="alert" className="mt-1.5 text-[11.5px] text-flag-red">{state.errors.password}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-[11.5px] text-ink-muted">
        <a href="/admin/reset-password" className="font-semibold text-green-800 hover:text-gold-700">Forgot your password?</a>
      </p>
    </form>
  );
}
