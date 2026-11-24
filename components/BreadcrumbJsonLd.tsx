import { site } from "@/lib/site";

export function GovernmentJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Iten-Tambach Municipality — Demonstration Website",
    url: site.url,
    description: "Demonstration website prepared for institutional review. Not an approved official municipal publication.",
    inLanguage: "en-KE",
  };
  // Escape angle brackets so a value containing "</script>" cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
