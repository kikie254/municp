# STORAGE SECURITY AUDIT — Iten–Tambach Municipality

Audit date: 2026-11-13. Evidence: **executed emulator storage rules tests** (2/2 pass within the
13-test suite, `logs/rules-test.log`), unit tests for upload inspection (16 tests), code inspection
of every upload/download/delete path.

## 1. Rules posture (tested)

- `storage.rules`: global default-deny over `match /b/{bucket}/o { match /{allPaths=**} { allow
  read, write: if false; } }`, with an explicit redundant deny for `private/{privatePaths=**}`.
  Even `public/**` has no client rule — content images are delivered through the application.
- **Tested live against the emulator**: unauthenticated download of
  `private/documents/x/file.pdf` denied; unauthenticated upload to `public/news/x/img.png` denied.
  (Tests were rewritten in this audit to the modular JS SDK — the previous versions could not run:
  `bucketOf(...).file is not a function`, ITM-004.)

## 2. Upload path

1. Only administrators reach uploads (server actions behind `documents:write` /
   `news:write` / `projects:write`).
2. `lib/security/upload.ts` `inspectUpload()`: empty-file rejection, `MAX_UPLOAD_BYTES` cap
   (default 10 MB), extension allowlist (PDF/DOCX/XLSX/CSV/JPG/PNG/WEBP), **magic-byte signature
   verification** against the actual leading bytes (a renamed `.exe` fails), CSV binary/NUL/
   embedded-script rejection, SHA-256 checksum computed for every accepted file.
   **Repaired (ITM-006)**: `createHash` was referenced without an import — every accepted upload
   would have thrown. Fixed and covered by 16 unit tests.
3. `sanitiseFileName()` strips directories, control characters and shell-significant characters.
4. Object names are randomised: `randomObjectName()` = 12 CSPRNG bytes base64url + extension, under
   `private/documents/{id}/…`, `private/submissions/{id}/…`, or `public/{news|projects}/{id}/…`.
   Path traversal is impossible by construction (no client input reaches the path).
5. `uploadObject()` writes `private: true` with `cacheControl: private, no-store`.

## 3. Download path

The **only** path to stored bytes is `app/api/documents/[id]/download/route.ts`:

- Metadata must exist in Firestore (404 otherwise — no enumeration).
- Published + not archived + past `publishedAt` → public download (`public, max-age=3600`).
- Anything else requires a session; unpublished downloads are audited
  (`DOCUMENT_DOWNLOAD_UNPUBLISHED`) and served `no-store`.
- Response is always `Content-Disposition: attachment` with the record's verified MIME type,
  `X-Content-Type-Options: nosniff`, and `Content-Security-Policy: default-src 'none'; sandbox` —
  a crafted upload cannot execute in the site origin.
- **Live-tested**: unknown document → 404 (`logs/verify-api.log`). Authorised download of a real
  object requires storage credentials → C.

There are no signed URLs anywhere in the application — obscurity of an object path grants nothing,
because client rule access is denied outright.

## 4. Deletion and consistency

Archive/delete flows call `deleteObject()` (`ignoreNotFound: true`; failures logged) together with
the Firestore metadata update in the same action; `verifyChecksum()` exists for migration spot
audits. Archived documents remain gated: the download route checks `archivedAt` directly, so
archiving cannot bypass authorisation.

## 5. Findings

| ID | Severity | Summary | Status |
|---|---|---|---|
| ITM-006 | LOW | Missing `createHash` import broke accepted uploads | Fixed; 16/16 upload unit tests pass (A) |
| ITM-004 | MEDIUM | Storage rules tests never ran | Fixed; 2/2 executed pass (A) |

Residual: upload/download against the live bucket (real credentials) → C.
