# API DOCUMENTATION

All endpoints are same-origin and return JSON unless noted. Administrative endpoints require the
`itm_session` cookie; the browser sends it automatically for the same origin.

## GET /api/health

Readiness probe. No configuration values are disclosed.

```json
{ "status": "ok", "database": "ok", "email": "not-configured", "documents": "local" }
```

`503` when the database check fails. Used by uptime monitoring and the deployment checklist.

## GET /api/search?q=<term>

Site search across **published** records only (news, notices, projects, documents).

| Condition | Response |
|---|---|
| `q` shorter than 2 or longer than 120 characters | `400 {"error":"…"}` |
| More than 40 requests / 60 s from one address | `429` |
| Success | `200 {"results":[{id,type,title,excerpt,href,meta}]}` |
| Query failure | `503 {"error":"Search is temporarily unavailable. Please try again shortly."}` |

The publication filter is inside the query, so an unpublished title cannot be returned even if guessed.

## POST /api/submissions

Machine intake for citizen submissions (also used by integrations).

Request:

```json
{
  "type": "COMPLAINT",
  "name": "Grace Jepkosgei",
  "email": "grace@example.com",
  "phone": "[contact removed]",
  "subject": "Street lighting",
  "message": "The street lights on the main road have been out for two weeks.",
  "location": "Iten Central",
  "consent": true,
  "website": ""
}
```

| Condition | Response |
|---|---|
| `Origin` host ≠ request host | `403 {"error":"Request rejected: invalid origin."}` |
| Schema failure | `422 {"error":…, "fields":{…}}` |
| Honeypot `website` non-empty | `201` with a decoy reference; nothing is stored |
| More than 5 per hour per address | `429` with `Retry-After` |
| Accepted | `201 {"reference":"ITM-CMP-KGFX-XXUA","status":"RECEIVED"}` |

The `reference` is the identifier the citizen quotes when following up. Verified in this session:
`HTTP 201` and `{"reference":"ITM-CMP-KGFX-XXUA","status":"RECEIVED"}`.

## GET /api/documents/{id}/download

| Case | Response |
|---|---|
| Published document | `200` attachment, `X-Content-Type-Options: nosniff`, `CSP: default-src 'none'; sandbox` |
| Unpublished + no session | `404` (existence is not confirmed) |
| Unpublished + valid session | `200` |
| Row exists, bytes missing | `410` |

## GET /api/admin/submissions/export

CSV of up to 5,000 submissions, newest first. Requires `submissions:read`.

* `403 {"error":"Not authorised."}` without a permitted session — verified in this session.
* `200` `text/csv`, `Cache-Control: no-store`, filename `submissions-YYYY-MM-DD.csv`.
* Cells beginning `=`, `+`, `-`, `@` are prefixed with `'` to defuse spreadsheet formula injection.
* Writes an `SUBMISSIONS_EXPORTED` audit row with the row count.

## GET /api/admin/participation/{id}/export

CSV of responses for one consultation. Requires `participation:manage`. Audits
`PARTICIPATION_RESPONSES_EXPORTED`. Same CSV hardening as above.

## Server Actions (not HTTP in the REST sense)

Called by the browser through Next.js's action protocol; each one re-checks the session and permission
server-side. A call from a page the actor may not use returns
`{"status":"error","message":"Your role does not permit this action."}`.

| Action | Permission | Effect |
|---|---|---|
| `loginAction` | — | 5 attempts / 10 min per address+email; identical failure text for wrong password, unknown account and inactive account |
| `logoutAction` | session | Deletes the session row and clears the cookie |
| `requestPasswordResetAction` | — | 3 / hour; always the same response; 60-minute single-use token |
| `completePasswordResetAction` | token | Policy check, password change, all sessions revoked |
| `submitSubmissionAction` | — | 5 / hour; stores the record, returns the reference |
| `submitParticipationResponseAction` | — | 5 / hour; refuses a closed or unpublished consultation |
| `saveNewsAction` / `transitionNewsAction` | `news:write` / `news:review` | Create, edit, submit, approve, reject, publish, unpublish |
| `saveProjectAction` / `transitionProjectAction` | `projects:write` / `projects:review` | Same lifecycle for projects |
| `saveNoticeAction` / `transitionNoticeAction` | `notices:write` | Create, publish, withdraw, archive |
| `uploadDocumentAction` / `transitionDocumentAction` | `documents:write` | Upload with signature check; publish, withdraw, delete |
| `saveParticipationAction` / `transitionParticipationAction` | `participation:manage` | Create, publish, close |
| `updateSubmissionAction` / `addSubmissionNoteAction` | `submissions:manage` | Status, assignment, internal notes |
| `saveUserAction` / `toggleUserAction` | `users:manage` | Create, edit, disable; guards self-demotion and last super admin |
| `retryEmailAction` | `settings:read` | Re-queues an outbox row |
