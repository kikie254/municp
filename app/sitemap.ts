import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/data/services";
import { publishedNews, publishedProjects } from "@/lib/content";

/**
 * Only published (verified) records are submitted. Demonstration project and news records are
 * excluded: listing template articles in a sitemap would present them to search engines as
 * municipal announcements. The administration demonstration is excluded as well — it is a private
 * review surface, not a public page. See lib/content.ts for the publication policy.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/about", priority: 0.9, freq: "monthly" as const },
    { path: "/governance", priority: 0.8, freq: "monthly" as const },
    { path: "/development-plan", priority: 0.9, freq: "monthly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/projects", priority: 0.9, freq: "weekly" as const },
    { path: "/public-participation", priority: 0.85, freq: "weekly" as const },
    { path: "/investment", priority: 0.8, freq: "monthly" as const },
    { path: "/resources", priority: 0.9, freq: "weekly" as const },
    { path: "/news", priority: 0.9, freq: "daily" as const },
    { path: "/feedback", priority: 0.8, freq: "monthly" as const },
    { path: "/contact", priority: 0.8, freq: "yearly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/accessibility", priority: 0.4, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
    { path: "/sitemap-page", priority: 0.4, freq: "monthly" as const },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...publishedProjects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...publishedNews.map((n) => ({
      url: `${base}/news/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
