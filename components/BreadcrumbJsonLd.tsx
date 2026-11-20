import { site } from "@/lib/site";

export function GovernmentJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Iten-Tambach Municipality",
    alternateName: "Iten Tambach Municipality",
    url: site.url,
    logo: `${site.url}/brand/elgeyo-marakwet-crest.png`,
    description: site.description,
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "County Government of Elgeyo Marakwet",
      url: site.countyWebsite,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Opposite County Assembly, behind IEBC offices",
      addressLocality: "Iten",
      postalCode: "30700",
      addressCountry: "KE",
      postOfficeBoxNumber: "220",
    },
  };
  // Escape angle brackets so a value containing "</script>" cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
