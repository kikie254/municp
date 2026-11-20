import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Phone, Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { ServiceIcon } from "@/components/ServiceIcon";
import { services } from "@/lib/data/services";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        title={service.title}
        intro={service.description}
        image="/images/town-centre.jpg"
        imageAlt="Town centre street scene in Iten, Elgeyo Marakwet County"
        eyebrow="Municipal Service"
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-green-800 text-gold-400">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-1.5 font-display text-[1.15rem] font-bold leading-snug text-green-900">
                  What this service covers
                </h2>
              </div>

              <div className="prose-gov mt-6 space-y-4 border-l border-paper-line pl-5">
                {service.detail.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>

              <div className="mt-8 border border-paper-line bg-paper-warm p-5">
                <h3 className="font-display text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-900">
                  How to raise a matter
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "Use the complaints and feedback page to prepare a written description of the matter.",
                    "Visit the municipal office in person at the address above, or write to P.O. Box 220-30700, Iten. Office operating hours have not been confirmed for publication.",
                    "Write to the municipal office at P.O. Box 220-30700, Iten, with the location and nature of the concern.",
                  ].map((step) => (
                    <li key={step} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link href="/feedback" className="btn btn-primary !py-2.5 !text-[11.5px]">
                    Open feedback page <ArrowRight aria-hidden="true" />
                  </Link>
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="btn btn-outline !py-2.5 !text-[11.5px]">
                    <Phone aria-hidden="true" /> {site.contact.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4">
              <div className="border-t-[3px] border-gold-400 bg-green-950 p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">Municipal office</p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/75">{site.contact.physical}</p>
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="mt-3 flex items-center gap-2 text-[12.5px] font-semibold text-white hover:text-gold-300">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {site.contact.phoneDisplay}
                </a>
                <a href={`mailto:${site.contact.email}`} className="mt-1.5 flex items-center gap-2 break-all text-[12.5px] text-white/75 hover:text-gold-300">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {site.contact.email}
                </a>
              </div>

              <div className="border border-paper-line bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Related services</p>
                <ul className="mt-3 space-y-2.5">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/services/${o.slug}`} className="group flex items-start gap-2 text-[12.5px] font-medium text-green-900 hover:text-green-600">
                        <ServiceIcon name={o.icon} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                        <span className="group-hover:underline">{o.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" /> All services
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
