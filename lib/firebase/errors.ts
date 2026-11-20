/**
 * Centralised error handling.
 *
 * Server actions and route handlers never leak stack traces, database internals or configuration to
 * the browser. Every caught error is normalised through `publicError` so the response to a visitor
 * is a stable, human message while the real cause goes to the server log.
 */

/** Messages safe to return to a browser. Never include error details. */
export const PUBLIC_MESSAGES = {
  dbUnavailable: "The service is temporarily unavailable. Please try again shortly.",
  notFound: "The requested record could not be found.",
  notAuthorised: "You are not authorised to perform this action.",
  validationFailed: "Please correct the highlighted fields.",
  rateLimited: "Too many requests. Please wait a moment and try again.",
} as const;

export function logError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${scope}]`, message);
}

/** Firestore error codes that indicate a user-visible condition rather than an outage. */
export function publicError(scope: string, error: unknown, fallback: string = PUBLIC_MESSAGES.dbUnavailable): string {
  logError(scope, error);
  return fallback;
}

/** Thrown by services when a precondition the caller must satisfy is not met. */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "not-found" | "permission" | "conflict" | "invalid" = "invalid",
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
