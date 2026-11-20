import { safeRead } from "@/lib/db";
import * as newsService from "@/lib/services/news.service";
import * as projectService from "@/lib/services/project.service";
import * as noticeService from "@/lib/services/notice.service";
import * as documentService from "@/lib/services/document.service";
import * as participationService from "@/lib/services/participation.service";
import { news as demoNews } from "@/lib/data/news";
import { projects as demoProjects } from "@/lib/data/projects";
import { documents as demoDocuments } from "@/lib/data/documents";

/**
 * Public content reads (Firestore).
 *
 * Every function here filters on publication state in the query itself. An unpublished record can
 * never reach a public page, the sitemap or the search index because it is not selected at all —
 * the filter is not applied in the browser.
 *
 * If Firestore is unreachable the function returns an empty list, so the page renders its labelled
 * empty state instead of a 500. That is a deliberate availability trade-off and it is reported in
 * the health endpoint.
 */

export type PublishedNews = Awaited<ReturnType<typeof getPublishedNews>>[number];

export async function getPublishedNews(limit?: number) {
  return safeRead(() => newsService.listPublishedNews(limit), []);
}

export async function getNewsBySlug(slug: string) {
  return safeRead(() => newsService.getNewsBySlug(slug), null);
}

export async function getPublishedProjects(limit?: number) {
  return safeRead(() => projectService.listPublishedProjects(limit), []);
}

export async function getProjectBySlug(slug: string) {
  return safeRead(() => projectService.getProjectBySlug(slug), null);
}

/** Notices that are published and not past their expiry date. */
export async function getActiveNotices(limit?: number) {
  return safeRead(() => noticeService.listActiveNotices(limit), []);
}

/** Notices past their expiry date, shown in an explicitly labelled archive list. */
export async function getExpiredNotices(limit = 20) {
  return safeRead(() => noticeService.listExpiredNotices(limit), []);
}

export async function getPublishedDocuments(limit?: number) {
  return safeRead(() => documentService.listPublishedDocuments(limit), []);
}

export async function getParticipationOpportunities() {
  return safeRead(() => participationService.listPublishedOpportunities(), []);
}

export async function getParticipationBySlug(slug: string) {
  return safeRead(() => participationService.getOpportunityBySlug(slug), null);
}

/**
 * Counts shown on the homepage. Each one is a real query result; when Firestore is unreachable the
 * value is 0 rather than an invented figure.
 */
export async function getPlatformCounts() {
  return safeRead(
    async () => {
      const [news, projects, documents, notices] = await Promise.all([
        newsService.countPublishedNews(),
        projectService.countPublishedProjects(),
        documentService.countPublishedDocuments(),
        noticeService.countActiveNotices(),
      ]);
      return { news, projects, documents, notices };
    },
    { news: 0, projects: 0, documents: 0, notices: 0 },
  );
}

/** Demonstration datasets retained from Phase 1, clearly labelled on the pages that use them. */
export const demonstration = { news: demoNews, projects: demoProjects, documents: demoDocuments };

/** True when at least one verified record exists, used to decide which listing to lead with. */
export async function hasVerifiedContent(): Promise<boolean> {
  const counts = await getPlatformCounts();
  return counts.news + counts.projects + counts.documents + counts.notices > 0;
}
