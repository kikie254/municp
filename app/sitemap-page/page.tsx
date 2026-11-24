import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { services } from "@/lib/data/services";
import { adminPreviewEnabled } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "A complete index of the pages published on the Iten-Tambach Municipality website.",
  alternates: { canonical: "/sitemap-page" },
};

const groups = [
  {
    title: "Municipal information",
    links: [
      { label: "Home", href: "/" },
      { label: "About the Municipality", href: "/about" },
      { label: "Municipal Governance", href: "/governance" },
      { label: "Municipal Services", href: "/services" },
      { label: "Projects and Development", href: "/projects" },
    ],
  },
  {
    title: "Engagement and access",
    links: [
      { label: "Public Participation", href: "/public-participation" },
      { label: "Investment Opportunities", href: "/investment" },
      { label: "Documents and Resources", href: "/resources" },
      { label: "News and Announcements", href: "/news" },
      { label: "Complaints and Feedback", href: "/feedback" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Policies and utilities",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Terms of Use", href: "/terms" },
      ...(adminPreviewEnabled ? [{ label: "Administration Preview (demo)", href: "/admin-preview" }] : []),
      { label: "XML sitemap", href: "/sitemap.xml" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero
        title="Sitemap"
        intro="Every page published on this website, grouped by purpose."
        image="/images/kerio-escarpment.jpg"
        imageAlt="The Elgeyo escarpment rising above the Kerio Valley"
        eyebrow="Site Index"
        crumbs={[{ label: "Sitemap" }]}
      />
      <section className="bg-white py-14">
        <div className="shell grid gap-10 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="border-b border-paper-line pb-2 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
                {g.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[12.5px] text-ink-soft hover:text-green-700 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="shell mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="border-b border-paper-line pb-2 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
              Service pages ({services.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-[12px] text-ink-soft hover:text-green-700 hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
