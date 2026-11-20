import { news, type NewsItem } from "./data/news";
import type { Project } from "./data/projects";

/**
 * PUBLICATION STATUS POLICY
 * -------------------------
 * Every public-facing record carries a publication state. Phase 1 introduces this single
 * policy so that the rule is applied in one place rather than page by page:
 *
 *   verified              — checked against an official source and cleared for publication.
 *   pending-verification  — plausible but not confirmed by the Municipality. May be shown only
 *                           with an explicit label, and never in a promotional surface.
 *   demonstration         — sample/template content written to show a layout. Never an official
 *                           record. Excluded from every promotional surface, from site search,
 *                           from the XML sitemap, and marked noindex on its own route.
 *
 * No record in this build is "verified": the Municipality has not supplied verified project,
 * news or statistics data. The arrays below are therefore empty by design, and the pages that
 * consume them render a professional empty state instead of inventing content.
 */
export type PublicationStatus = "verified" | "pending-verification" | "demonstration";

/** Demo news articles are typed `isSample`. Verified items are those that are not. */
export const publishedNews: NewsItem[] = news.filter((n) => n.isSample !== true);

/**
 * No verified project records have been supplied. `projects.ts` is a demonstration dataset in
 * full, so the published collection is empty until real records replace it.
 */
export const publishedProjects: Project[] = [];

export const hasPublishedNews = publishedNews.length > 0;
export const hasPublishedProjects = publishedProjects.length > 0;

/** Wording used wherever nothing verified exists yet. Kept in one place so it stays consistent. */
export const emptyStateCopy = {
  generic: {
    title: "Official information is being updated",
    body: "Verified municipal information will be published here once it has been confirmed by the Municipality. Please check back, or contact the municipal office for current information.",
  },
  projects: {
    title: "No verified project records are published yet",
    body: "Project records are being confirmed with the Municipality before publication. The project template remains in place and will list verified records — including scope, status and any officially published figures — once they are supplied.",
  },
  news: {
    title: "No verified announcements are published yet",
    body: "Municipal announcements, public notices and updates will appear here once they have been issued and confirmed through official channels. For a matter requiring action, contact the municipal office directly.",
  },
  documents: {
    title: "No publications are listed yet",
    body: "Verified municipal publications will be listed here as they are confirmed and linked to their official source.",
  },
} as const;
