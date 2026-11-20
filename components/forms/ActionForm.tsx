"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/actions/types";
import { initialActionState } from "@/lib/actions/types";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Shared submission shell.
 *
 * Every public form posts to a server action. The result rendered here is what the server actually
 * returned — there is no optimistic "success" state, so a message can never appear when the write
 * failed. Validation errors arrive as `errors[field]` and are wired to the inputs by the caller.
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Sending…",
  resetLabel,
  className,
}: {
  action: Action;
  children: (state: ActionState, pending: boolean) => React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  resetLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} noValidate className={className}>
      {children(state, pending)}

      {state.status === "error" && (
        <div role="alert" className="mt-4 flex gap-3 border border-flag-red/40 bg-flag-red/[0.05] px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
          <p className="text-[12.5px] leading-relaxed text-flag-red">{state.message ?? "Please check the form and try again."}</p>
        </div>
      )}

      {state.status === "ok" && (
        <div role="status" className="mt-4 border border-green-300 bg-green-50 px-4 py-3.5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold leading-relaxed text-green-900">{state.message}</p>
              {state.reference && (
                <p className="mt-2 text-[12px] text-ink-soft">
                  Your reference:{" "}
                  <strong className="select-all font-mono text-[13px] tracking-[0.04em] text-green-900">{state.reference}</strong>
                </p>
              )}
              {state.emailStatus === "NOT_CONFIGURED" && (
                <p className="mt-2 text-[11.5px] leading-relaxed text-ink-muted">
                  No acknowledgement email was sent because this deployment has no email provider configured. The
                  record itself is stored.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {pending ? pendingLabel : submitLabel}
        </button>
        {resetLabel && (
          <button type="reset" className="btn btn-outline" disabled={pending}>
            {resetLabel}
          </button>
        )}
      </div>
    </form>
  );
}

/** Server-returned error text for one field, announced to assistive technology. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11.5px] font-medium text-flag-red">
      {message}
    </p>
  );
}
