import type { CollectionName } from "./collections";

/**
 * Firestore document types.
 *
 * These interfaces are the single typed description of the data model. Timestamp fields are plain
 * `Date` objects at the service boundary: services convert Firestore Timestamps on read, so no
 * page or action ever touches Firestore types.
 */

/** /adminUsers/{uid} — trusted profile, the source of truth for roles. Never stores passwords. */
export type AdminUserProfile = {
  uid: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "CONTENT_ADMIN" | "PROJECT_ADMIN" | "REVIEWER";
  isActive: boolean;
  emailVerified: boolean;
  createdBy: string | null;
  lastLoginAt: Date | null;
  roleChangedBy: string | null;
  roleChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/** /news/{newsId} */
export type NewsRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  imagePath: string | null;
  imageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  searchTerms: string[];
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
  authorId: string;
  /** Denormalised display name, written at create/migrate time. */
  authorName?: string | null;
  reviewerId: string | null;
  reviewerName?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** /projects/{projectId} */
export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  projectStatus: "Ongoing" | "Completed" | "Planned";
  location: string;
  summary: string;
  description: string;
  objectives: string;
  /** Only officially verified figures supplied by the Municipality. Null means "not published". */
  budget: string | null;
  startDate: string | null;
  completionDate: string | null;
  implementingAgency: string | null;
  imagePath: string | null;
  imageAlt: string | null;
  searchTerms: string[];
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  archivedAt: Date | null;
  authorId: string;
  authorName?: string | null;
  reviewerId: string | null;
  reviewerName?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** /notices/{noticeId} */
export type NoticeRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  body: string;
  documentId: string | null;
  expiresAt: Date | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  archivedAt: Date | null;
  authorId: string;
  authorName?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** /documents/{documentId} — metadata only; bytes live in Cloud Storage. */
export type DocumentRecord = {
  id: string;
  title: string;
  category: string;
  description: string;
  documentDate: Date | null;
  fileName: string;
  /** Cloud Storage object path under /private/documents/… — never a public URL. */
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  /** SHA-256 of the stored bytes, verified at upload time. */
  checksum: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  archivedAt: Date | null;
  uploadedById: string;
  uploadedByName?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** /submissions/{submissionId} — Firestore auto IDs, never sequential or guessable. */
export type SubmissionRecord = {
  id: string;
  reference: string;
  type: "ENQUIRY" | "FEEDBACK" | "COMPLAINT" | "SUGGESTION" | "PARTICIPATION";
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  location: string | null;
  consent: boolean;
  status: "RECEIVED" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  assignedToId: string | null;
  /** Denormalised for list display; updated on assignment. */
  assignedToName: string | null;
  notesCount: number;
  /** SHA-256 of the submitting IP with a server secret — never the raw address. */
  ipHash: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
};

/** /submissionNotes/{noteId} */
export type SubmissionNoteRecord = {
  id: string;
  submissionId: string;
  authorId: string;
  authorName: string;
  body: string;
  internal: boolean;
  createdAt: Date;
};

/** /participationOpportunities/{opportunityId} */
export type ParticipationOpportunityRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: "Consultation" | "Meeting" | "Notice" | "Survey";
  location: string | null;
  instructions: string | null;
  opensAt: Date | null;
  closesAt: Date | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
  responsesCount: number;
  createdAt: Date;
  updatedAt: Date;
};

/** /participationResponses/{responseId} */
export type ParticipationResponseRecord = {
  id: string;
  reference: string;
  opportunityId: string;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  ward: string | null;
  response: string;
  consent: boolean;
  createdAt: Date;
};

/** /auditLogs/{auditId} — append-only from the application's perspective. */
export type AuditLogRecord = {
  id: string;
  actorId: string | null;
  actorEmail: string;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  ipHash: string | null;
  correlationId: string | null;
  outcome: "SUCCESS" | "FAILURE" | "DENIED";
  createdAt: Date;
};

/** /emailOutbox/{emailId} */
export type EmailOutboxRecord = {
  id: string;
  toAddress: string;
  subject: string;
  body: string;
  status: "NOT_CONFIGURED" | "QUEUED" | "SENT" | "FAILED";
  provider: string | null;
  error: string | null;
  attempts: number;
  createdAt: Date;
  sentAt: Date | null;
};

/** /rateLimits/{rateLimitId} — fixed-window counters keyed by hashed key + window bucket. */
export type RateLimitRecord = {
  count: number;
  windowStart: Date;
};

/** /settings/{settingId} */
export type SettingRecord = {
  key: string;
  value: string;
  updatedAt: Date;
};

/** Maps each collection to its record type. */
export type CollectionRecordMap = {
  adminUsers: AdminUserProfile;
  news: NewsRecord;
  projects: ProjectRecord;
  notices: NoticeRecord;
  documents: DocumentRecord;
  submissions: SubmissionRecord;
  submissionNotes: SubmissionNoteRecord;
  participationOpportunities: ParticipationOpportunityRecord;
  participationResponses: ParticipationResponseRecord;
  auditLogs: AuditLogRecord;
  emailOutbox: EmailOutboxRecord;
  settings: SettingRecord;
  rateLimits: RateLimitRecord;
};

export type RecordOf<C extends CollectionName> = C extends keyof CollectionRecordMap
  ? CollectionRecordMap[C]
  : never;
