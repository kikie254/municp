/**
 * Email delivery — application entry point.
 *
 * The implementation lives in lib/services/email.service.ts, backed by /emailOutbox in Firestore.
 * Every notification's status reflects what actually happened; an unconfigured provider is reported
 * as NOT_CONFIGURED, never as sent.
 */
export { sendMail, mailerConfigured, municipalRecipient } from "@/lib/services/email.service";
