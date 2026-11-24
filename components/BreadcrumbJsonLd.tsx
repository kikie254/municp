import { site } from "@/lib/site";
import { municipalPublicationApproved } from "@/lib/config/env";

export function GovernmentJsonLd() {
  const approved = municipalPublicationApproved();
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: approved ? site.name : "Iten-Tambach Municipality — Demonstration Website",
    url: site.url,
    description: approved ? "Official municipal information published following institutional authorisation." : "Demonstration website prepared for institutional review. Not an approved official municipal publication.",
    inLanguage: "en-KE",
  };
  // Escape angle brackets so a value containing "</script>" cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
