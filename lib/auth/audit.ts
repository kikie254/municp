/**
 * Append-only audit trail — application entry point.
 *
 * The implementation lives in lib/services/audit.service.ts; this module keeps the historical
 * import path (`@/lib/auth/audit`) working for every action and route handler. Writes never update
 * or delete records; audit failure handling (lenient vs strict) is documented there.
 */
export { recordAudit, recordAuditStrict, type AuditInput } from "@/lib/services/audit.service";
