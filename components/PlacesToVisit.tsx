import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MapPin, Mountain, School, Trees, Waves, Camera, ExternalLink } from "lucide-react";

const destinations = [
  {
    number: "01",
    name: "Iten View Point",
    category: "Scenic landscape",
    description:
      "About 500 metres beyond Iten on the C51 towards Kabarnet, the viewpoint opens across the Kerio Valley, with the Tugen Hills visible to the east. Use designated stopping areas and remain clear of the road edge.",
    icon: Mountain,
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten_view_point.jpg?width=1400",
      alt: "Panoramic view across the Kerio Valley from Iten View Point",
      credit: "Shadychiri",
      source: "https://commons.wikimedia.org/wiki/File:Iten_view_point.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    moreInfo: "https://www.elgeyomarakwet.go.ke/docs/HTML/iten_view_point.html",
    moreInfoLabel: "County tourism profile",
  },
  {
    number: "02",
    name: "St Patrick's High School, Iten",
    category: "Athletics heritage",
    description:
      "St Patrick's is an established part of Iten's athletics story and the wider Home of Champions identity. It remains an active school; visitors should seek permission before entering the grounds.",
    icon: School,
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Entrance_to_St._Patrick%27s_High_School_%284260378669%29.jpg?width=1400",
      alt: "Entrance to St Patrick's High School in Iten",
      credit: "edskoch",
      source: "https://commons.wikimedia.org/wiki/File:Entrance_to_St._Patrick%27s_High_School_(4260378669).jpg",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
    moreInfo: "https://stpatricksiten.sc.ke/",
    moreInfoLabel: "School website",
  },
  {
    number: "03",
    name: "Rimoi Game Reserve",
    category: "Wildlife and conservation",
    description:
      "Rimoi protects a section of the Kerio Valley landscape, with semi-arid habitats, rich birdlife and elephant sightings among its attractions. Confirm entry arrangements, road conditions and conservation guidance with the responsible authorities before travelling.",
    icon: Trees,
    moreInfo: "https://www.elgeyomarakwet.go.ke/docs/HTML/rimoi_national_reserve.html",
    moreInfoLabel: "County tourism profile",
  },
  {
    number: "04",
    name: "Kessup Falls",
    category: "Nature and outdoor exploration",
    description:
      "Kessup Falls is a natural waterfall in the Kessup area above the Kerio Valley. The approach includes uneven escarpment terrain; arrange local guidance, check conditions and do not attempt steep descents or enter the water without site-specific safety advice.",
    icon: Waves,
    moreInfo: "https://discoverkenya.co.ke/listing/kessup-falls",
    moreInfoLabel: "Visitor information",
  },
  {
    number: "05",
    name: "Cheploch (Chebloch) Gorge",
    category: "Geological landmark",
    description:
      "The Kerio River has cut a deep gorge through the valley's hard rock. The County's tourism profile places the gorge about 39 kilometres from Iten along the C51. View it from safe public areas; the river is dangerous and known to contain crocodiles.",
    icon: Camera,
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/A_section_of_cheploch_gorge.jpg?width=1400",
      alt: "A section of the Kerio River running through Cheploch Gorge",
      credit: "Ronguno Bernard",
      source: "https://commons.wikimedia.org/wiki/File:A_section_of_cheploch_gorge.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    moreInfo: "https://www.elgeyomarakwet.go.ke/docs/HTML/cheploch_gorge.html",
    moreInfoLabel: "County tourism profile",
  },
];

export function PlacesToVisit() {
  return (
    <section className="bg-paper-warm py-16 md:py-20" aria-labelledby="places-to-visit-heading">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Explore the Region"
            title="Places to Visit"
            description="Discover the viewpoints, athletics heritage and natural landscapes of Iten and the wider Elgeyo Marakwet region."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((place, index) => {
            const Icon = place.icon;
            return (
              <Reveal key={place.number} delay={index * 60}>
                <article className="group flex h-full flex-col overflow-hidden border border-paper-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden bg-green-950">
                    {place.image ? (
                      <Image
                        src={place.image.src}
                        alt={place.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,75,0.22),transparent_55%),linear-gradient(135deg,#123b2c,#071d18)] px-6 text-center">
                        <Icon className="h-9 w-9 text-gold-300" aria-hidden="true" />
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                          Official photograph pending clearance
                        </p>
                      </div>
                    )}
                    <span className="absolute right-4 top-4 bg-black/45 px-2 py-1 font-display text-[11px] font-bold tracking-[0.12em] text-white">{place.number}</span>
                  </div>
                  {place.image && (
                    <div className="border-b border-paper-line bg-stone-50 px-4 py-2 text-[10px] leading-relaxed text-stone-600">
                      Photograph: <a href={place.image.source} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">{place.image.credit}</a>
                      {" · "}
                      <a href={place.image.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{place.image.license}</a>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-gold-700">{place.category}</p>
                    <h3 className="mt-2 font-display text-[17px] font-bold leading-snug text-green-950">{place.name}</h3>
                    <p className="mt-3 flex-1 text-[12.5px] leading-[1.8] text-ink-muted">{place.description}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper-line pt-4">
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-green-800">
                        <MapPin className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
                        Elgeyo Marakwet
                      </span>
                      <a href={place.moreInfo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-green-800 underline underline-offset-4 hover:text-gold-700">
                        {place.moreInfoLabel}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-7 max-w-4xl text-[11px] leading-relaxed text-ink-muted">
          These destinations are in the wider region and are not all within the Municipality's administrative boundary. Three photographs are openly licensed and credited above. Images for Rimoi Game Reserve and Kessup Falls remain unpublished until a suitable photograph and its reuse permission are verified. Opening arrangements, access and visitor guidance should be confirmed with the relevant site authorities before travelling.
        </p>
      </div>
    </section>
  );
}
