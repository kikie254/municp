# ASSET CREDITS AND RIGHTS REGISTER

**Project:** Iten–Tambach Municipality website
**Status of this register:** every entry below was checked against the files in `public/` and against
the pages that use them. **No licence has been invented, assumed or inferred.** Where the source is
unknown it is recorded as unknown, and the asset is treated as not cleared for publication.

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


**Homepage slideshow addition:** `components/HeroSlideshow.tsx` now uses seven Iten/Kerio-region Wikimedia Commons photographs, with photographer and licence links displayed on each active slide. The additions are credited to Elias Yator (CC BY-SA 4.0), Mekami (CC BY-SA 4.0), edskoch (CC BY 2.0) and Ronguno Bernard (CC BY-SA 4.0). Full source-file links and licence terms are recorded in `public/images/SLIDESHOW-IMAGE-CREDITS.md`. The older local files listed above remain uncleared and are not the slideshow sources. Next.js image optimisation is enabled for these Commons files; responsive `sizes` allow device-appropriate image variants.

### 1.4 Destination gallery photographs

The Places to Visit section uses only these traceable, openly licensed photographs:

| Destination | Photographer | Source | Licence |
|---|---|---|---|
| Iten View Point | Shadychiri | https://commons.wikimedia.org/wiki/File:Iten_view_point.jpg | CC BY-SA 4.0 |
| St Patrick's High School, Iten | edskoch | https://commons.wikimedia.org/wiki/File:Entrance_to_St._Patrick's_High_School_(4260378669).jpg | CC BY 2.0 |
| Cheploch (Chebloch) Gorge | Ronguno Bernard | https://commons.wikimedia.org/wiki/File:A_section_of_cheploch_gorge.jpg | CC BY-SA 4.0 |

Attribution and licence links are displayed immediately below each photograph. The images are delivered through Wikimedia Commons' `Special:FilePath` endpoint and are not represented as commissioned municipal photography. No photograph is currently shown for Rimoi Game Reserve or Kessup Falls: a location-matched image with documented reuse rights has not yet been verified. Do not replace those neutral placeholders with unrelated scenery or an unlicensed image.

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
