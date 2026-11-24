import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { ServiceIcon } from "@/components/ServiceIcon";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Municipal Services",
  description:
    "Information about municipal services in Iten-Tambach Municipality: urban planning, solid waste management, environmental management, public spaces, infrastructure coordination and trade.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Municipal Services"
        intro="The Municipal Charter identifies the services and responsibilities assigned to Iten-Tambach Municipality. These include urban planning, roads and drainage, waste management, public spaces, street lighting, markets, parking and public transport facilities. Some services are delivered in coordination with County departments and other public agencies."
        image="/images/town-life.jpg"
        imageAlt="Street scene in a Kenyan highland town with shops and roadside activity"
        eyebrow="Service Information"
        crumbs={[{ label: "Services" }]}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Service Areas"
              title="Eight areas of municipal attention"
              description="The pages below explain the Municipality's chartered functions and indicate where responsibility may rest with another public institution."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <article id={s.slug} className="group flex h-full flex-col border border-paper-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lift">
                  <span className="flex h-11 w-11 items-center justify-center bg-green-50 text-green-700 transition-colors group-hover:bg-green-800 group-hover:text-gold-400">
                    <ServiceIcon name={s.icon} className="h-[21px] w-[21px]" />
                  </span>
                  <h2 className="mt-4 font-display text-[15px] font-bold leading-snug text-green-900">{s.title}</h2>
                  <p className="mt-2 text-[12.5px] leading-[1.8] text-ink-muted">{s.description}</p>
                  <div className="mt-auto pt-5">
                    <Link href={`/services/${s.slug}`} className="link-arrow">
                      More information <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex gap-3.5 border-l-[3px] border-gold-400 bg-paper-warm p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
            <div>
              <h2 className="font-display text-[13.5px] font-bold uppercase tracking-[0.06em] text-green-900">
                About service delivery responsibilities
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-soft">
                Actual service delivery responsibilities depend on the applicable legal and institutional mandate. Some
                functions described on this website are carried out by the County Government of Elgeyo Marakwet or by
                national agencies, with the municipality contributing through planning, coordination and community
                communication. Where an enquiry falls outside the municipality's mandate, it will be directed to the
                institution responsible. This website does not publish service standards, charges or turnaround times
                that have not been officially confirmed.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/feedback" className="btn btn-primary !py-3 !text-[12px]">
              Raise a concern <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn btn-outline !py-3 !text-[12px]">
              Contact the Municipality
            </Link>
            <Link href="/resources" className="btn btn-outline !py-3 !text-[12px]">
              Service-related documents
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
