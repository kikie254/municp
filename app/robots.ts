import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { municipalPublicationApproved } from "@/lib/config/env";

/**
 * The administration demonstration is disallowed for every crawler, whether or not it is enabled
 * in this build, so the rule does not need revisiting when the build flag changes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin-preview", "/__admin-preview-withdrawn"] },
    ],
    ...(process.env.MUNICIPAL_PUBLICATION_APPROVED === "true" ? { sitemap: `${site.url}/sitemap.xml` } : {}),
    host: site.url,
  };
}
