/**
 * Centralised Firestore collection definitions.
 *
 * Every collection name in the application is declared here exactly once. Services must reference
 * these constants — never a string literal — so the data model can be reviewed in one place.
 */

export const COLLECTIONS = {
  adminUsers: "adminUsers",
  news: "news",
  projects: "projects",
  notices: "notices",
  documents: "documents",
  submissions: "submissions",
  submissionNotes: "submissionNotes",
  participationOpportunities: "participationOpportunities",
  participationResponses: "participationResponses",
  auditLogs: "auditLogs",
  settings: "settings",
  emailOutbox: "emailOutbox",
  rateLimits: "rateLimits",
  systemMetadata: "systemMetadata",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
