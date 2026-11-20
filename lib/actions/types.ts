/** Shared shape for every server action consumed by useActionState. */
export type ActionState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Record<string, string>;
  reference?: string;
  emailStatus?: "SENT" | "QUEUED" | "FAILED" | "NOT_CONFIGURED";
};

export const initialActionState: ActionState = { status: "idle" };
