# ASSET CREDITS AND RIGHTS REGISTER

**Project:** Iten–Tambach Municipality website
**Status of this register:** the inventory below is a legacy baseline and must not be treated as a current file-by-file inventory after the November 2026 image renaming and additions. Rights remain unverified unless explicitly documented. No licence has been invented, assumed or inferred.

> **Publication rule.** A file existing in `public/` is served publicly by Next.js regardless of
> whether any page links to it. Until an asset's rights are documented it must be treated as
> **uncleared**, and the site carries a pre-launch review notice to that effect.

> **Fields marked "Pending"** are the Municipality's to complete. This register does not substitute
> for written permission.

---

## 1. Photographs — `public/images/`

Each photograph exists as both `.jpg` (source for the `next/image` pipeline) and `.webp`.
**Rights status for all 13: not established.** Creator, source and licence are unknown for every
file; none carries embedded authorship metadata usable as evidence.

| # | Filename | Native size | Used in (count) | Known source | Licence status | Rights risk | Required action |
|---|---|---|---|---|---|---|---|
| 1 | `iten-hero.jpg` | 2000×1332 | 5 — homepage hero, Open Graph + Twitter card, page metadata | Unknown | **Unknown** | **Highest** — also the social-sharing image for every page | Replace with Municipality-owned photograph + written web licence, or approved open-licensed image with attribution |
| 2 | `iten-town-aerial.jpg` | 1600×1000 | 6 — About, News hero, homepage about block, metadata | Unknown | **Unknown** | High — presents itself as an aerial of the town | Same as above |
| 3 | `market-development.jpg` | 1600×900 | 4 — homepage, Projects listing hero, project images | Unknown | **Unknown** | High — reads as a municipal development project | Same as above; do not reuse to illustrate a specific project until the location is confirmed |
| 4 | `public-engagement.jpg` | 1600×1066 | 4 — public participation, homepage participation block | Unknown | **Unknown** | **High** — shows identifiable people; implies a municipal consultation | Needs model/location release or replacement. Do not present as a municipal forum |
| 5 | `town-centre.jpg` | 595×372 | 4 — contact hero, service detail hero, metadata | Unknown | **Unknown** | Medium — **also displayed above native resolution** (soft on large screens) | Replace with a higher-resolution licensed original, which fixes rights and quality together |
| 6 | `town-life.jpg` | 780×520 | 4 — projects, public spaces | Unknown | **Unknown** | Medium | Same as above |
| 7 | `highlands.jpg` | 1400×607 | 5 — about identity block, sections, homepage slideshow | Unknown | **Unknown** | Medium — landscape, weak place claim | Confirm location if described in captions |
| 8 | `kerio-forest-road.jpg` | 1024×560 | 3 — climate/environment content, project images | Unknown | **Unknown** | Medium — names a specific place ("Kerio") in its use context | Confirm the location is accurate before captioning |
| 9 | `community-forum.jpg` | 640×559 | 3 — participation, community engagement | Unknown | **Unknown** | **High** — people in a meeting setting; implies an official forum | Release form or replacement |
| 10 | `kerio-escarpment.jpg` | 1184×864 | 2 — environmental content | Unknown | **Unknown** | Medium | As above |
| 11 | `conservation.jpg` | 768×528 | 2 — environmental initiatives | Unknown | **Unknown** | Medium | As above |
| 12 | `trading.jpg` | 750×375 | 1 — trade and enterprise | Unknown | **Unknown** | Medium — **displayed above native resolution** | Replace with a licensed higher-resolution original |
| 13 | `farmland.jpg` | 552×240 | 0 — unreferenced (retained) | Unknown | **Unknown** | Low — not linked from any page, but still publicly reachable in `public/` | Delete from `public/` or move to an `unpublished/` folder outside the web root |

**Total photographs: 13 files (26 with `.webp` derivatives). Documented licences: 0.**


**Homepage slideshow addition:** `components/HeroSlideshow.tsx` rotates through the existing `iten-hero.jpg`, `iten-town-aerial.jpg` and `highlands.jpg` files. No photographs were added or generated for this change. Their rights remain **uncleared** under the publication rule above; the slideshow must not be treated as permission to publish them. Replace them with Municipality-owned or explicitly licensed photographs and complete this register before launch.

### 1.1 Photographs that could imply an official relationship

Numbers 1, 3, 4, 9 and 12 sit on pages that also carry the County crest and the Municipality's name.
In that context an unlicensed stock photograph can read as commissioned municipal photography. This
is an **editorial and reputational risk**, not only a licensing one, and it is why the site now
states that photography is pending verification.

### 1.2 Replacement procedure (when cleared files arrive)

1. Keep the exact base filename and supply both `.jpg` and `.webp` — the `next/image` configuration
   and the data files reference the `.jpg` path.
2. Native width must be at least the largest rendered width (≥1600 px for hero images, ≥780 px for
   cards); items 5 and 12 need higher resolution regardless.
3. Preserve the current aspect ratio family (roughly 3:2, 16:9 or 2.35:1) so layouts do not reflow.
4. Add a row to this register with: filename, creator, source URL, licence name and version,
   attribution string, date obtained and who cleared it.
5. Update the `imageAlt` values in `lib/data/` and the page components if the new image shows
   something different — alt text must describe the image actually used.

### 1.3 Acceptable sources, in order of preference

1. Photography commissioned or owned by the Municipality, with written web-use permission.
2. A local photographer under a written licence covering web use, cropping and derivatives.
3. Explicitly open-licensed images only (CC0, CC BY, CC BY-SA) from Wikimedia Commons or Unsplash,
   recorded with source URL, creator, licence version and the exact attribution string required.

Unacceptable: an image with no traceable source; an image whose licence forbids commercial or
government use; any AI-generated image presented as a photograph of the Municipality, its officers,
projects or events.

---

## 2. Institutional marks

| Asset | File | Size | Source | Permission | Required action |
|---|---|---|---|---|---|
| County crest | `public/brand/elgeyo-marakwet-crest.png` | 264×264 PNG, transparent | Retrieved from the County Government of Elgeyo Marakwet website | **Not on file** — web availability is not permission | Obtain **written authorisation** from the County for use on this site, or replace with the Municipality's approved official artwork. Used in header, footer, favicon and JSON-LD `logo` |

The crest has **not** been redrawn, recoloured, cropped, regenerated or replaced, and no substitute
mark was created. Flag gradient bars in the header/footer are CSS, not image assets.

---

## 3. Typography

| Family | Weights | Files | Licence | Status |
|---|---|---|---|---|
| Inter | 400 / 500 / 600 / 700 | `public/fonts/inter-latin-*-normal.woff2` | SIL Open Font License 1.1 (Rasmus Andersson) | **Cleared** — redistributable with the licence text |
| Manrope | 600 / 700 / 800 | `public/fonts/manrope-latin-*-normal.woff2` | SIL Open Font License 1.1 (Mikhail Sharanda) | **Cleared** |

Both are self-hosted (no third-party font requests, no visitor IP disclosure to a font CDN). Retain
the OFL text alongside the fonts when redistributing.

---

## 4. Icons and interface graphics

`lucide-react` (ISC licence, declared in `package.json`). All decorative graphics in this phase's
additions — empty states, verification badges, contact notices, the review strip — are built from
CSS borders and lucide icons only. **No new image file was added in Phase 1, and no image was
generated by AI.**

---

## 5. Documents (linked, not hosted)

32 records in `lib/data/documents.ts`; 31 point at `https://elgeyomarakwet.go.ke/?mdocs-file=…` and
one at the County documents index page.

| Aspect | Status |
|---|---|
| Payload reachable | Yes — 31/31 endpoints returned a PDF (146 KB – 29 MB) |
| Payload matches displayed title | **11 confirmed by text extraction**; 20 file-only (scanned/no extractable text); 1 source-page-only |
| Right to link | Appears to be a public County publication endpoint; **redistribution right not established** — which is why files are linked, never copied |
| Right to present as "official municipal document" | Pending municipal confirmation per `MUNICIPAL_APPROVAL_CHECKLIST.md` §7 |
| Screenshot/preview | Uses Google Docs viewer by URL only; no document is re-hosted on this site |

`verification` values in the data file mean only what their labels say:
`content-confirmed` (the PDF's own text matches the record), `file-only` (the file resolves),
`source-page-only` (the record points at an official page, not a file).

---

## 6. Assets requiring approval before publication

**Launch blockers (must be resolved):**

1. All 13 photographs in `public/images/` — rights unestablished.
2. `public/brand/elgeyo-marakwet-crest.png` — no written County permission on file.
3. `public_engagement.jpg` and `community-forum.jpg` — identifiable people, implied municipal event
   (subsumed by item 1, called out separately because consent is a distinct question).

**Resolve before promoting content:**

4. `town-centre.jpg` and `trading.jpg` — below display resolution; replace with licensed originals.
5. `farmland.jpg` — unreferenced but publicly served; remove from the web root.
6. The 32 document records — confirm linking permission and that each title/category/year is correct
   (`MUNICIPAL_APPROVAL_CHECKLIST.md` §7).

**Cleared and may ship as-is:**

7. Inter and Manrope font files (OFL 1.1).
8. lucide-react icons (ISC).

---

*Last updated: Phase 1 corrections. This register is a record of what is known — it is not a
licence, and it does not grant any right to publish an asset.*


## 7. Current image-relevance remediation — 28 November 2026

- Removed `public/images/public-engagement.jpg` from the repository and all active page/data references. The image showed identifiable people, but no verified event provenance or usage release was available.
- Removed the Public Engagement background photograph from the homepage and the Public Participation page banners. Those sections now use the municipality's existing green visual system without an unverified event photograph.
- Removed generic meeting photographs from the Governance banner and removed unrelated images from project, resource-library, service-detail and legal/utility banners.
- All sample news and project records now use neutral labelled placeholders instead of photographs that could be mistaken for evidence of a real municipal event or project. A real image is shown only when a non-sample news record has an image and alt text, or a project record has both an image and descriptive alt text.
- Published news and project cards require both an uploaded image and non-empty alt text before displaying a photograph. Dynamic detail pages show an uploaded record image once in the article body rather than duplicating it in the page banner.
- The remaining photographs' rights and precise subject/location claims still require confirmation. Filename, alt text and visual appearance alone do not establish ownership, licence or that a depicted activity is an official municipal project.

The asset inventory above is retained as a historical rights review; it must be regenerated from the current `public/images/` directory before launch approval.
