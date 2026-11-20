# FIRESTORE SECURITY AUDIT — Iten–Tambach Municipality

Audit date: 2026-11-13. Primary evidence: **executed emulator rules suite** — 13/13 tests pass
(`logs/rules-test.log`, firebase-tools 15.36.0, Firestore emulator v1.22.0). This is the first
session in which `npm run test:rules` has actually run (previously it failed with "No test files
found" — ITM-004).

## 1. Rules posture (tested)

- Global default-deny `match /{document=**} { allow read, write: if false; }`.
- Public reads only for `news`, `projects`, `notices`, `documents` with
  `status == "PUBLISHED" && publishedAt != null && archivedAt == null`, and
  `participationOpportunities` with `status == "PUBLISHED" && publishedAt != null`.
  **Tested**: published news readable unauthenticated; draft news denied; client writes denied.
- Confidential collections (`submissions`, `submissionNotes`, `participationResponses`,
  `adminUsers`, `auditLogs`, `settings`, `rateLimits`, `emailOutbox`) — **tested**: unauthenticated
  read AND write denied for every one of the eight collections.
- Storage rules tested in the same suite (see STORAGE_SECURITY_AUDIT.md).

## 2. Server-side authorisation (Admin SDK bypasses rules)

Because the Admin SDK ignores security rules, every server action and route handler re-checks
authorisation itself. Verified by code inspection across the surface:

- Every mutation in `lib/actions/{auth,admin,content,submissions}.ts` starts with
  `assertPermission(<permission>)` against the server-resolved session.
- Page-level guard: `requireUser()` in the dashboard layout.
- Role source: Firestore `/adminUsers/{uid}` profile; custom claims are only a cache and are
  revoked on change.
- Export endpoints (`/api/admin/submissions/export`, `/api/admin/participation/[id]/export`) check
  `can(user.role, ...)` — **live-tested**: anonymous requests receive 403 `{"error":"Not authorised."}`
  (`logs/verify-api.log`).
- Document download route re-derives publication state from metadata and falls back to a session
  for anything unpublished — **live-tested**: unknown/unpublished document → 404 without a session.

## 3. Query safety

- All reads go through `lib/firebase/db.ts`: bounded queries (`MAX_PAGE = 500` cap applied in
  `list()`), malformed-ID rejection (`/^[A-Za-z0-9_-]+$/`), Firestore auto IDs (20 random chars —
  not enumerable).
- Search (`/api/search`) queries only published content inside the services, bounded to 8 hits per
  section, rate-limited 40/min/IP — live-tested bounds (too-short, over-long, labelled outage).
- No collection-group enumeration, no client-supplied query operators anywhere in the codebase
  (inspected all `list()` call sites).

## 4. Mass assignment and validation

Every write path parses input through a Zod schema (`lib/validation/schemas.ts`) and services write
explicit field maps — no spread of user-controlled objects into documents. Live-tested: invalid
intake payload returns 422 with per-field errors (`logs/verify-api.log`).

## 5. Data separation (Phase 5)

| Data | Location | Exposure |
|---|---|---|
| Public content | `news/projects/notices/documents` | published-only client read |
| Citizen contact info | `submissions` fields | no client access (tested) |
| Complaints / enquiries / feedback | `submissions` | no client access (tested) |
| Participation responses | `participationResponses` | no client access (tested) |
| Internal notes | `submissionNotes` | no client access (tested); only `submissions:manage` holders via server action |
| Administrator profiles | `adminUsers` | no client access (tested) |
| Audit records | `auditLogs` | no client access (tested); append-only application path |
| Rate-limit counters | `rateLimits` | no client access (tested) |

A citizen cannot retrieve another citizen's submission (no client read path at all; references are
the only citizen-visible identifier). A public visitor cannot reach internal notes (no read path).

## 6. Indexes

`firestore.indexes.json` covers every composite query used by the services (status/archived/
published ordering for the four content collections, participation ordering, submission status/
type/created, notes by submission, responses by opportunity, adminUsers email and role/isActive).
Deployed with `firebase deploy --only firestore:rules,firestore:indexes` (needs project
credentials → C).

## 7. Findings

| ID | Severity | Summary | Status |
|---|---|---|---|
| ITM-004 | MEDIUM | Rules suite never executable | Fixed — **13/13 executed pass** (A) |
| ITM-007 | LOW | Lint errors in rules tests | Fixed (A) |

Residual: rules deployment to the live project and a re-check of rule behaviour against the real
(Identity-enabled) project remain → C.
