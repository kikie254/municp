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
    body: "Browse municipal information, services and public resources. Contact the municipal office for further assistance.",
  },
  projects: {
    title: "Municipal projects and development",
    body: "Explore the Municipality's development priorities and project information.",
  },
  news: {
    title: "Municipal announcements and public notices",
    body: "Visit this page for municipal announcements, public notices and community updates.",
  },
  documents: {
    title: "Municipal publications",
    body: "Browse municipal plans, policies, financial reports and public participation records.",
  },
} as const;
