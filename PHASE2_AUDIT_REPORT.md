# PHASE 2 AUDIT REPORT — Visual and Interaction Review

Method: source inspection of every page and shared component, plus measured browser checks where a
statement could be tested (viewport overflow, focus ring, dialog behaviour). Where a claim could not be
measured, it is marked NOT TESTED rather than asserted.

## 1. Component inventory reviewed

| Surface | File | Finding | Action |
|---|---|---|---|
| Header / utility bar / masthead | `components/SiteHeader.tsx` | Sticky desktop nav, accessible sub-menus, drawer dialog, no hardcoded route | None needed |
| Footer | `components/SiteFooter.tsx` | Contact block carries the Phase 1 pending-verification notice | None needed |
| Hero | `components/PageHero.tsx` | One `h1`, breadcrumb `nav`, gradient overlay for contrast | Reused by new detail pages |
| Cards (news / project / document) | `components/NewsCard.tsx`, `ProjectCard.tsx`, `DocumentCard.tsx`, `components/content/PublishedBlocks.tsx` | Consistent border, radius and hover lift | Database-backed variants added |
| Buttons | `.btn` variants in `app/globals.css` | Clear hierarchy: primary / gold / outline / ghost | Reused in admin |
| Forms | `components/forms/*` | Labels bound with `htmlFor`, errors announced | Demo forms replaced by server-action forms |
| Search | `components/SearchDialog.tsx` | Was a client-side index over sample data | Rewritten to query `/api/search` (published records only) |
| Tables | public + admin listings | No table existed with a caption/scope pattern | All new tables carry `caption` + `scope="col"` + `overflow-x-auto` |
| Dialogs | `SearchDialog`, mobile drawer | `role="dialog"`, `aria-modal`, Escape, focus restore | Escape handler moved to document level (see §3) |
| Error / empty / loading states | `app/not-found.tsx`, `EmptyState.tsx`, `loading.tsx` | Present in Phase 1 | Extended with admin-specific copy |

## 2. Typography and spacing

Body text is 15–16 px at ≥ 768 px and 13.5–14 px on administrative screens; line height 1.75 for prose.
Headings use Manrope with negative tracking at display sizes only. Section rhythm is `py-14`/`py-20`
(`.section`) on public pages and `py-8` inside the administration, so the two surfaces share a language
but not a density.

## 3. Defects found and fixed in Phase 2 scope

1. **Search dialog did not always close on Escape.** The panel's `onKeyDown` only fires when focus is
   already inside the panel; immediately after the trigger is activated the key can land on `<body>`.
   Fixed with a document-level `keydown` listener that is removed when the dialog closes.
   Re-verified by the Playwright test *search dialog opens, is announced and closes on Escape*.
2. **`/public-participation/[slug]` had no route.** Consultation detail links had nowhere to go.
   Added, with open/closed/opening-soon states and the server-validated response form.
3. **Contact and feedback pages still used preview-only forms.** Replaced with `PublicSubmissionForm`,
   which posts to a server action and returns a real reference number.

## 4. Accessibility position statement

Implemented and verified in this session: skip link, single `h1` per route, focus-visible outline,
Escape-to-close dialog, labelled form fields, `role="alert"`/`role="status"` messaging, table captions
and column headers, `aria-current` navigation, reduced-motion support, `lang="en-KE"`.

NOT TESTED and therefore not claimed: a screen-reader walkthrough (NVDA/JAWS/VoiceOver), a full axe
scan of every route, and WCAG 2.2 AA conformance as a whole. The project states "WCAG 2.2 AA targeted",
never "compliant".

## 5. Responsive measurement

| Width | What was measured | Result |
|---|---|---|
| 360 px | `scrollWidth − clientWidth` on `/`, `/news`, `/projects`, `/resources`, `/contact` | ≤ 1 px on all five (automated, passed) |
| 320 / 390 / 430 / 768 / 1024 / 1280 / 1440 px | Layout reviewed in source (breakpoints `sm/md/lg/xl`), not captured | NOT TESTED as a browser capture |

## 6. Outstanding visual items (honest list)

* No visual-regression baseline (Percy/Chromatic) exists, so future styling changes are not diffed.
* `/admin-preview` still exists as a withdrawn static demonstration; it returns 404 unless
  `NEXT_PUBLIC_ADMIN_PREVIEW=enabled` and is not a substitute for the real `/admin` area.
* Photography licences remain a launch blocker inherited from Phase 1 (`ASSET_CREDITS.md`).
