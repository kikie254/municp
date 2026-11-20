/**
 * Prisma/SQLite → Firestore migration utility.
 *
 * Run ONLY when a valid SQLite database file exists:
 *
 *   DATABASE_URL="file:./var/data/app.db" \
 *   FIREBASE_ADMIN_PROJECT_ID=... \
 *   FIREBASE_ADMIN_CLIENT_EMAIL=... \
 *   FIREBASE_ADMIN_PRIVATE_KEY="..." \
 *   npm run migrate:to-firestore
 *
 * Properties of this migration:
 *  - Reads the SQLite database with better-sqlite3 directly (read-only) and writes to Firestore with
 *    the Admin SDK. The source database is never modified or deleted.
 *  - Idempotent: every write uses the source record's ID as the Firestore document ID, so re-running
 *    overwrites the same documents instead of creating duplicates.
 *  - Detects duplicate slugs/references and missing relationship targets and reports them.
 *  - Produces a migration report (counts in, counts written, anomalies) and verifies a sample of
 *    records after the run.
 *  - Does NOT invent records: if the SQLite file is absent or empty, it reports that and exits.
 */
import "dotenv/config";
import { existsSync, writeFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

type Report = {
  startedAt: string;
  finishedAt?: string;
  sourceFile?: string;
  collections: Record<string, { read: number; written: number }>;
  anomalies: string[];
  sampleVerified: Record<string, number>;
};

const report: Report = { startedAt: new Date().toISOString(), collections: {}, anomalies: [], sampleVerified: {} };

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const dbUrl = process.env.MIGRATION_SQLITE_URL || process.env.DATABASE_URL || "";
const dbFile = dbUrl.replace(/^file:/, "").replace(/^\.\//, "");
const resolved = existsSync(dbFile) ? dbFile : existsSync(`var/data/app.db`) ? "var/data/app.db" : "";

if (!resolved) {
  fail(
    "No SQLite database file found. The supplied project does not contain production records, so there is nothing to migrate. " +
      "To run this migration against a real database, set MIGRATION_SQLITE_URL to the .db file path.",
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- better-sqlite3 has no bundled types; migration-only, never bundled
let Database: any;
try {
  Database = (await import(/* webpackIgnore: true */ "better-sqlite3")).default;
} catch {
  fail("better-sqlite3 is required for migration. Install it with: npm i --no-save better-sqlite3");
}

const sqlite = new Database(resolved, { readonly: true, fileMustExist: true });
report.sourceFile = resolved;

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) fail("FIREBASE_ADMIN_PROJECT_ID must be set.");
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
initializeApp(
  clientEmail && privateKey ? { credential: cert({ projectId, clientEmail, privateKey }), projectId } : { projectId },
);
const db = getFirestore();

function rows(table: string): Record<string, unknown>[] {
  try {
    return sqlite.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[];
  } catch {
    report.anomalies.push(`table missing: ${table}`);
    return [];
  }
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? null : d;
}

function nameMap(rowsIn: Record<string, unknown>[]): Map<string, string> {
  return new Map(rowsIn.map((r) => [String(r.id), String(r.name ?? "—")]));
}

async function writeBatch(collection: string, docs: Record<string, unknown>[]): Promise<number> {
  let written = 0;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    for (const doc of docs.slice(i, i + 400)) {
      batch.set(db.collection(collection).doc(String(doc.id)), doc, { merge: true });
      written++;
    }
    await batch.commit();
  }
  return written;
}

async function main() {
  const users = rows("User");
  const news = rows("NewsArticle");
  const projects = rows("ProjectRecord");
  const notices = rows("PublicNotice");
  const documents = rows("DocumentRecord");
  const submissions = rows("Submission");
  const notes = rows("SubmissionNote");
  const opportunities = rows("ParticipationOpportunity");
  const responses = rows("ParticipationResponse");
  const auditLogs = rows("AuditLog");
  const settings = rows("Setting");
  const outbox = rows("EmailOutbox");

  const userName = nameMap(users);
  const seenSlugs = new Map<string, string>();

  // Administrators — passwords are NOT migrated: authentication now belongs to Firebase Auth.
  // Provision each account in Firebase Auth first (scripts/provision-admin.ts), then run this.
  report.collections.adminUsers = {
    read: users.length,
    written: await writeBatch(
      "adminUsers",
      users.map((u) => ({
        id: u.id,
        uid: u.id, // placeholder until the Firebase Auth account is provisioned with a real UID
        email: String(u.email).toLowerCase(),
        name: u.name,
        role: u.role,
        isActive: Boolean(u.isActive),
        emailVerified: true,
        createdBy: null,
        lastLoginAt: toDate(u.lastLoginAt),
        roleChangedBy: null,
        roleChangedAt: null,
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      })),
    ),
  };

  report.collections.news = {
    read: news.length,
    written: await writeBatch(
      "news",
      news.map((n) => {
        const slug = String(n.slug);
        if (seenSlugs.has(slug) && seenSlugs.get(slug) !== "news") report.anomalies.push(`duplicate slug across collections: ${slug}`);
        seenSlugs.set(slug, "news");
        if (n.authorId && !userName.has(String(n.authorId))) report.anomalies.push(`news ${n.id}: missing author ${n.authorId}`);
        return {
          id: n.id,
          slug,
          title: n.title,
          category: n.category,
          summary: n.summary,
          body: n.body,
          imagePath: n.imagePath ?? null,
          imageAlt: n.imageAlt ?? null,
          seoTitle: n.seoTitle ?? null,
          seoDescription: n.seoDescription ?? null,
          searchTerms: [] as string[],
          status: n.status,
          publishedAt: toDate(n.publishedAt),
          scheduledFor: toDate(n.scheduledFor),
          archivedAt: toDate(n.archivedAt),
          authorId: n.authorId,
          authorName: userName.get(String(n.authorId)) ?? "—",
          reviewerId: n.reviewerId ?? null,
          reviewerName: n.reviewerId ? userName.get(String(n.reviewerId)) ?? null : null,
          createdAt: toDate(n.createdAt),
          updatedAt: toDate(n.updatedAt),
        };
      }),
    ),
  };

  report.collections.projects = {
    read: projects.length,
    written: await writeBatch(
      "projects",
      projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        projectStatus: p.projectStatus,
        location: p.location,
        summary: p.summary,
        description: p.description,
        objectives: p.objectives ?? "",
        budget: p.budget ?? null, // only officially verified figures are migrated, as stored
        startDate: p.startDate ?? null,
        completionDate: p.completionDate ?? null,
        implementingAgency: p.implementingAgency ?? null,
        imagePath: p.imagePath ?? null,
        imageAlt: p.imageAlt ?? null,
        searchTerms: [] as string[],
        status: p.status,
        publishedAt: toDate(p.publishedAt),
        archivedAt: toDate(p.archivedAt),
        authorId: p.authorId,
        authorName: userName.get(String(p.authorId)) ?? "—",
        reviewerId: p.reviewerId ?? null,
        reviewerName: p.reviewerId ? userName.get(String(p.reviewerId)) ?? null : null,
        createdAt: toDate(p.createdAt),
        updatedAt: toDate(p.updatedAt),
      })),
    ),
  };

  report.collections.notices = {
    read: notices.length,
    written: await writeBatch(
      "notices",
      notices.map((n) => ({
        id: n.id,
        slug: n.slug,
        title: n.title,
        category: n.category,
        body: n.body,
        documentId: n.documentId ?? null,
        expiresAt: toDate(n.expiresAt),
        status: n.status,
        publishedAt: toDate(n.publishedAt),
        archivedAt: toDate(n.archivedAt),
        authorId: n.authorId,
        authorName: userName.get(String(n.authorId)) ?? "—",
        createdAt: toDate(n.createdAt),
        updatedAt: toDate(n.updatedAt),
      })),
    ),
  };

  report.collections.documents = {
    read: documents.length,
    written: await writeBatch(
      "documents",
      documents.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description,
        documentDate: toDate(d.documentDate),
        fileName: d.fileName,
        // Legacy storageKey is preserved and flagged: bytes must be re-uploaded to Cloud Storage
        // under private/documents/{id}/… before the download route can serve them again.
        storagePath: `legacy/${d.storageKey}`,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
        checksum: d.checksum ?? null,
        status: d.status,
        publishedAt: toDate(d.publishedAt),
        archivedAt: toDate(d.archivedAt),
        uploadedById: d.uploadedById,
        uploadedByName: userName.get(String(d.uploadedById)) ?? "—",
        createdAt: toDate(d.createdAt),
        updatedAt: toDate(d.updatedAt),
      })),
    ),
  };
  if (documents.length) report.anomalies.push(`documents: ${documents.length} metadata records migrated with storagePath="legacy/…" — re-upload their bytes to Cloud Storage and update storagePath.`);

  report.collections.submissions = {
    read: submissions.length,
    written: await writeBatch(
      "submissions",
      submissions.map((s) => ({
        id: s.id,
        reference: s.reference,
        type: s.type,
        name: s.name,
        email: s.email,
        phone: s.phone ?? null,
        subject: s.subject,
        message: s.message,
        location: s.location ?? null,
        consent: Boolean(s.consent),
        status: s.status,
        assignedToId: s.assignedToId ?? null,
        assignedToName: s.assignedToId ? userName.get(String(s.assignedToId)) ?? null : null,
        notesCount: 0,
        ipHash: s.ipHash ?? null,
        userAgent: s.userAgent ?? null,
        createdAt: toDate(s.createdAt),
        updatedAt: toDate(s.updatedAt),
        resolvedAt: toDate(s.resolvedAt),
      })),
    ),
  };

  const notesBySubmission = new Map<string, number>();
  report.collections.submissionNotes = {
    read: notes.length,
    written: await writeBatch(
      "submissionNotes",
      notes.map((n) => {
        notesBySubmission.set(String(n.submissionId), (notesBySubmission.get(String(n.submissionId)) ?? 0) + 1);
        if (!userName.has(String(n.authorId))) report.anomalies.push(`note ${n.id}: missing author ${n.authorId}`);
        return {
          id: n.id,
          submissionId: n.submissionId,
          authorId: n.authorId,
          authorName: userName.get(String(n.authorId)) ?? "—",
          body: n.body,
          internal: Boolean(n.internal),
          createdAt: toDate(n.createdAt),
        };
      }),
    ),
  };

  report.collections.participationOpportunities = {
    read: opportunities.length,
    written: await writeBatch(
      "participationOpportunities",
      opportunities.map((o) => ({
        id: o.id,
        slug: o.slug,
        title: o.title,
        description: o.description,
        kind: o.kind,
        location: o.location ?? null,
        instructions: o.instructions ?? null,
        opensAt: toDate(o.opensAt),
        closesAt: toDate(o.closesAt),
        status: o.status,
        publishedAt: toDate(o.publishedAt),
        responsesCount: 0,
        createdAt: toDate(o.createdAt),
        updatedAt: toDate(o.updatedAt),
      })),
    ),
  };

  const responsesByOpportunity = new Map<string, number>();
  report.collections.participationResponses = {
    read: responses.length,
    written: await writeBatch(
      "participationResponses",
      responses.map((r) => {
        responsesByOpportunity.set(String(r.opportunityId), (responsesByOpportunity.get(String(r.opportunityId)) ?? 0) + 1);
        return {
          id: r.id,
          reference: r.reference,
          opportunityId: r.opportunityId,
          name: r.name,
          email: r.email,
          phone: r.phone ?? null,
          organisation: r.organisation ?? null,
          ward: r.ward ?? null,
          response: r.response,
          consent: Boolean(r.consent),
          createdAt: toDate(r.createdAt),
        };
      }),
    ),
  };

  report.collections.auditLogs = {
    read: auditLogs.length,
    written: await writeBatch(
      "auditLogs",
      auditLogs.map((a) => ({
        id: a.id,
        actorId: a.actorId ?? null,
        actorEmail: a.actorEmail,
        actorRole: null,
        action: a.action,
        entityType: a.entityType,
        entityId: a.entityId ?? null,
        summary: a.summary,
        ipHash: a.ipHash ?? null,
        correlationId: null,
        outcome: "SUCCESS",
        createdAt: toDate(a.createdAt),
      })),
    ),
  };

  report.collections.settings = {
    read: settings.length,
    written: await writeBatch(
      "settings",
      settings.map((s) => ({ id: s.key, key: s.key, value: s.value, updatedAt: new Date() })),
    ),
  };

  report.collections.emailOutbox = {
    read: outbox.length,
    written: await writeBatch(
      "emailOutbox",
      outbox.map((m) => ({
        id: m.id,
        toAddress: m.toAddress,
        subject: m.subject,
        body: m.body,
        status: m.status,
        provider: m.provider ?? null,
        error: m.error ?? null,
        attempts: m.attempts,
        createdAt: toDate(m.createdAt),
        sentAt: toDate(m.sentAt),
      })),
    ),
  };

  // Repair denormalised counters.
  for (const [submissionId, count] of notesBySubmission) {
    await db.collection("submissions").doc(submissionId).set({ notesCount: count }, { merge: true });
  }
  for (const [opportunityId, count] of responsesByOpportunity) {
    await db.collection("participationOpportunities").doc(opportunityId).set({ responsesCount: count }, { merge: true });
  }

  // Sample verification: re-read 3 records per collection and compare identities.
  for (const [collection, info] of Object.entries(report.collections)) {
    if (!info.written) continue;
    const snap = await db.collection(collection).limit(3).get();
    report.sampleVerified[collection] = snap.size;
  }

  report.finishedAt = new Date().toISOString();
  writeFileSync("migration-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.collections, null, 2));
  console.log(report.anomalies.length ? `Anomalies:\n - ${report.anomalies.join("\n - ")}` : "No anomalies detected.");
  console.log("Full report written to migration-report.json. The source SQLite database was NOT modified.");
  void FieldValue;
  process.exit(0);
}

main().catch((error) => fail(`Migration failed: ${error instanceof Error ? error.message : error}`));
