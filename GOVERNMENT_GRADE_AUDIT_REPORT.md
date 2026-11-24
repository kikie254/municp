# Government-Grade Website Transformation — Phase 1 Repository Audit

**Repository:** `kikie254/municp`  
**Audit branch:** `audit/p0-institutional-integrity`  
**Baseline branch:** `master`  
**Audit date:** 24 November 2026  
**Status:** Source-level audit completed for the principal application paths; runtime verification remains in progress.

> **Institutional status:** This is a demonstration project. It is not an approved official publication of Iten–Tambach Municipality or the County Government of Elgeyo Marakwet. No municipal approval or government endorsement is claimed.

## 1. Audit scope and limits

The repository tree was inventoried (364 entries, including 42 route/page files). The review covered the package manifest, App Router pages, shared layouts and components, navigation, server actions, API routes, Firebase services and rules, authentication and RBAC, file handling, environment validation, deployment workflow, test scripts, content modules and existing technical/approval documents.

This is a source-code review, not a completed penetration test or independent legal audit. The production Firebase project, Vercel environment values, administrator accounts, MFA enrolment, email delivery, backup destination and live database contents were not inspected. Secret values were not requested or exposed. A fresh local checkout and full test run were not available during this review.

## 2. Existing architecture

| Layer | Current implementation |
|---|---|
| Frontend | Next.js 15.5.29 App Router, React 19, TypeScript 5.7, Tailwind CSS |
| Server | Next.js route handlers and server actions |
| Database | Cloud Firestore through Firebase Admin SDK |
| Authentication | Firebase Authentication with server-verified HTTP-only sessions |
| Authorisation | Server-side role and permission checks |
| File storage | Firebase Cloud Storage with application-controlled download routes |
| Validation | Zod schemas and file-signature validation |
| Tests | Vitest, Firebase emulator rules tests and Playwright E2E specifications |
| Hosting | Vercel |
| Legacy material | `prisma/` remains in the repository but is not the active application data path |

The README previously described the site as frontend-only. That was materially inaccurate: the repository already contains an authenticated administration portal, Firestore services, server actions, API handlers, content workflows, file handling and backup utilities. The README and environment guide have been corrected on this branch.

## 3. Existing functionality worth preserving

- Firebase-backed sign-in and server-side session verification.
- Role/permission checks on administrative server actions and routes.
- Firestore and Storage rules that deny direct unauthorised client access.
- News and project publication transitions with review controls.
- Public submission persistence and reference-number generation in the code path.
- Private document download route with publication-state checks.
- Search limited to published records.
- Upload validation using file signatures rather than trusting extensions alone.
- Audit logging, health checks, environment validation and backup/restore utilities.
- Unit tests, rules tests, route checks and API verification scripts.

The existence of these code paths does not prove that production credentials, services, policies, accounts or operational procedures are configured and working.

## 4. Priority findings

| Priority | Finding | Status on audit branch |
|---|---|---|
| P0 | Header contained `example@example.com`; internal mailer fell back to `municipal.office@example.com`. | Removed. Internal email now fails closed without a valid configured recipient. |
| P0 | Physical, postal and contact details were shown despite shared configuration marking them unverified. | Removed from shared public configuration and public-facing pages. Contact page explains that details await written confirmation. |
| P0 | No site-wide demonstration notice was rendered, despite a banner component existing. | Banner now renders globally until the institutional publication approval flag is set. |
| P0 | Public forms and API intake could accept submissions on a demonstration deployment. | UI hides forms and server actions/API reject intake unless both `MUNICIPAL_PUBLICATION_APPROVED=true` and `PUBLIC_SUBMISSIONS_ENABLED=true`. |
| P0 | County-hosted charter document was liable to be described as the adopted Iten–Tambach Charter. | Governance/about pages now identify the County-hosted PDF as a model draft and require confirmation of the operative signed charter and appointments. |
| P0 | Quarterly Citizen Fora claims were stated as an established municipal commitment without confirmation. | Unsupported frequency claims removed; current dates must come from authorised notices. |
| P1 | County crest was used without written permission recorded in the asset register. | Removed from UI, metadata and public assets pending written permission. |
| P1 | Photograph rights were undocumented for 13 images. | Former public photographs removed. Static and CMS-uploaded images are hidden unless `MUNICIPAL_IMAGE_ASSETS_APPROVED=true`. |
| P1 | Privacy page described the intake system as operational and implied approved municipal handling. | Replaced with a provisional demonstration data notice; it expressly says not to submit real personal or sensitive data. |
| P1 | Rate limiter failed open if both distributed backends failed. | Production now fails closed and returns temporary-unavailable responses at relevant call sites. |
| P1 | CSV formula scanning checked only the first 2 KB. | Full-file scan added, with a regression test for a formula after the first 2 KB. |
| P1 | GitHub workflow did not include active `master` and contained deployment steps. | Workflow now validates master/feature branches and builds Preview artifacts only; it has no deploy command. |
| P2 | README and environment guide described obsolete frontend-only/SQLite/Prisma architecture. | Rewritten to describe Firebase and current safe defaults. |
| P2 | Search metadata and sitemap could present the site as a live official publication. | Site is noindex and sitemap is suppressed until institutional publication approval. |

### Charter evidence

The County Government's [Iten Municipality documents page](https://elgeyomarakwet.go.ke/iten-municipality-documents/) links a PDF headed **“Model Municipal Charter prepared under the World Bank Kenya Urban Support Programme.”** The PDF contains blank grant-date/signature fields and an internal inconsistency in its Board composition clause. It is a research lead, not proof of the adopted charter or current appointments. The Municipality must supply or confirm the operative signed instrument.

## 5. Changes made on this branch

1. Removed placeholder email links and unverified contact values from the public header, footer, contact, feedback, service, accessibility, terms and error pages.
2. Removed the fallback internal notification recipient; no citizen submission is routed to a fabricated address.
3. Added a site-wide demonstration banner, demonstration metadata, noindex behaviour and an approval-gated sitemap.
4. Disabled public form rendering and intake handlers by default. Both institutional publication approval and explicit intake enablement are required.
5. Removed the County crest from active presentation and deleted the public asset pending written permission.
6. Removed the 13 unlicensed photographs from `public/images/`; added a separate image-rights gate for future licensed assets.
7. Rewrote privacy copy as a provisional demonstration data notice and removed unsupported statements that submissions are handled by authorised municipal officers.
8. Corrected charter, vision, mission, local mandate, quarterly participation, editorial approval and investment wording where adoption or authority was not established.
9. Removed unverified population, area and household statistics from the homepage until the source tables and geographic scope are confirmed.
10. Changed rate-limit backend failure behaviour to fail closed in production.
11. Extended CSV formula-injection scanning to the complete file and added a regression test.
12. Rewrote README/environment documentation and changed GitHub Actions to validate/build without deploying.

## 6. Security observations

### Positive controls present in source

- Firebase session verification and server-side authorisation.
- Default-deny Firestore/Storage client rules.
- Zod validation for public/admin inputs.
- Private file delivery through an authorised route.
- Upload signature checks and filename sanitisation.
- Rate limiting backed by Redis/Firestore.
- HTTP security headers and health/configuration checks.

### Remaining security work

- Verify the actual Vercel/Firebase production environment and IAM scope without exposing secrets.
- Confirm privileged accounts, MFA enforcement and account-recovery procedures.
- Test role escalation, direct API access and session revocation against a disposable test project.
- Confirm rate-limit proxy/IP assumptions under Vercel and test backend outage behaviour.
- Add malware scanning and a formal file quarantine/review process before accepting public uploads.
- Review data retention, deletion, audit-log access, backups and restore procedures.
- Independently review third-party email/data processor contracts and cross-border processing.

## 7. Accessibility, performance and SEO status

Code contains skip navigation, labelled inputs, focus styling and responsive layouts. These are positive implementation details, not proof of WCAG 2.2 AA conformance. No fresh keyboard-only, screen-reader, contrast, browser/device matrix, Lighthouse or Core Web Vitals run was completed in this audit.

SEO is deliberately held back: noindex is active until the Municipality authorises publication. Canonical URLs and structured data must be reviewed again when the approved domain, publisher identity and official publication status are confirmed.

## 8. Outstanding verification register

| Item | Severity | Required action | Responsible party | Approval/document needed |
|---|---|---|---|---|
| Adopted Municipal Charter | Critical | Supply signed operative charter and verify amendments. | Municipal Board / County legal office | Adopted charter and grant record |
| Board and Municipal Manager | High | Verify names, designations, appointment method, terms and responsibilities before publishing a directory. | County public service / Municipality | Appointment instruments and publication consent |
| Municipal contact details | High | Confirm phone, email, physical/postal address and office hours. | Municipal administration | Written institutional confirmation |
| Official branding | High | Supply approved municipal artwork or written County crest permission. | County communications / Municipality | Written licence/permission |
| Photographs | High | Supply licensed originals and creator/location/consent records. | Municipal communications | Image licences/releases |
| Service responsibilities | High | Distinguish Municipality, County and national agency responsibilities. | Municipal Manager / County departments | Delegation instruments and service charter |
| Project records and budgets | High | Supply verified projects, budgets, funding, progress and publication authority. | Engineering/planning/finance departments | Approved project registers and records |
| Document library | High | Confirm title, category, responsible department, date, version, publication status and disclosure authority. | Records office / departments | Approved publication register |
| Public participation | High | Supply current notices, calendar, agendas, deadlines and approved reports. | Public participation office | Authorised notices and resolutions |
| Complaints workflow | High | Approve categories, assignment, escalation, response SLA, closure and privacy controls. | Municipal administration | Approved grievance procedure |
| Investment enquiry workflow | High | Decide whether a distinct investor case workflow is required; approve attachments, assignment and response process. | Planning/investment office | Approved service procedure |
| Privacy/data protection | Critical | Designate controller/contact, lawful purposes, processors, transfers, retention and data-subject rights handling. | County/Municipal legal and data protection officers | Approved privacy notice and processor agreements |
| Admin accounts and MFA | Critical | Provision named accounts, least privilege and MFA; test revocation. | Institutional ICT administrator | Approved account register |
| Firebase and hosting ownership | High | Move project ownership, billing, repository and domain to institutional accounts. | County/Municipal ICT | Ownership/access records |
| Backup and recovery | High | Configure separate backup bucket, retention and restore test. | Institutional ICT | Backup schedule and restore evidence |
| Accessibility | High | Run WCAG 2.2 AA audit and remediate findings. | ICT / accessibility auditor | Independent test report |
| Performance | Medium | Run Lighthouse and Core Web Vitals on representative mobile/desktop routes. | Developer / ICT | Test results |
| Production release control | Critical | Review Vercel production-branch auto-deploy setting; require explicit promotion. | Vercel project owner / ICT | Approved deployment procedure |

## 9. Test and deployment status

- Repository source edits are on `audit/p0-institutional-integrity`; `master` was not changed.
- The existing production deployment remains the previously reported `READY` deployment from commit `d5e20cd2bc3f4a9ca09d5f5a6dc3cc73023b13e1`. No new production deployment was initiated.
- An earlier Preview build of an intermediate branch commit failed on a TypeScript literal-union issue in the contact-verification state. The type was corrected. That failure is not evidence that the current branch head passes.
- A fresh successful build, Vitest run, Firebase rules test, Playwright run, route smoke test, API test, security test, accessibility test and Lighthouse run are still outstanding.
- The API verification script now expects public intake to be disabled by default. Its enabled-path valid-payload test can write to a database; run it only against an emulator/disposable test project.

## 10. Release gates

Keep these values false/unset on the demonstration deployment:

- `MUNICIPAL_PUBLICATION_APPROVED`
- `PUBLIC_SUBMISSIONS_ENABLED`
- `MUNICIPAL_IMAGE_ASSETS_APPROVED`

Do not set the publication or intake flags until the relevant municipal approvals and operational evidence are complete. A Vercel Preview build is not an authorisation to publish or collect real public data.
