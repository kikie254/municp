import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MapPin, Mountain, School, Trees, Waves, Camera } from "lucide-react";

const destinations = [
  {
    number: "01",
    name: "Iten Viewpoint",
    category: "Scenic landscape",
    description:
      "Take in wide views across the Kerio Valley and the dramatic escarpment. Iten Viewpoint is a memorable stop for visitors who want to appreciate the region's highland scenery and capture the landscape.",
    icon: Mountain,
  },
  {
    number: "02",
    name: "St Patrick's High School, Iten",
    category: "Athletics heritage",
    description:
      "A respected name in Kenyan athletics, St Patrick's High School has helped nurture generations of distance-running talent. Its story forms an important part of Iten's reputation as the Home of Champions.",
    icon: School,
  },
  {
    number: "03",
    name: "Rimoi Game Reserve",
    category: "Wildlife and conservation",
    description:
      "Discover the wildlife and semi-arid landscapes of the Kerio Valley at Rimoi. The reserve is known for its elephants and offers an opportunity to learn about the region's natural heritage and conservation.",
    icon: Trees,
  },
  {
    number: "04",
    name: "Kessup Falls",
    category: "Nature and outdoor exploration",
    description:
      "Explore the natural setting around Kessup Falls, where flowing water and the surrounding terrain create a distinctive landscape. It is a place to appreciate the area's natural features and enjoy the outdoors responsibly.",
    icon: Waves,
  },
  {
    number: "05",
    name: "Cheploch Gorge",
    category: "Geological landmark",
    description:
      "See the striking gorge carved by the Kerio River through the rock of the valley. Cheploch's dramatic terrain makes it one of the region's distinctive natural landmarks. Visitors should keep to safe areas and follow local guidance.",
    icon: Camera,
  },
];

export function PlacesToVisit() {
  return (
    <section className="bg-paper-warm py-16 md:py-20" aria-label="Places to Visit">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Explore the Region"
            title="Places to Visit"
            description="From the highland viewpoints of Iten to the landscapes and natural heritage of the Kerio Valley, discover places that make Elgeyo Marakwet distinctive."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((place, index) => {
            const Icon = place.icon;
            return (
              <Reveal key={place.number} delay={index * 60}>
                <article className="group flex h-full flex-col overflow-hidden border border-paper-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  {/* Replace this designed image placeholder with the matching licensed municipal photograph when supplied. */}
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-green-950">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,75,0.22),transparent_55%),linear-gradient(135deg,#123b2c,#071d18)]" />
                    <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full border border-white/10" />
                    <div className="absolute -bottom-20 -left-8 h-56 w-56 rounded-full border border-white/10" />
                    <div className="relative flex h-16 w-16 items-center justify-center border border-gold-400/50 bg-white/5 text-gold-300 backdrop-blur-sm">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="absolute right-4 top-4 font-display text-[11px] font-bold tracking-[0.12em] text-white/60">{place.number}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-gold-700">{place.category}</p>
                    <h3 className="mt-2 font-display text-[17px] font-bold leading-snug text-green-950">{place.name}</h3>
                    <p className="mt-3 flex-1 text-[12.5px] leading-[1.8] text-ink-muted">{place.description}</p>
                    <div className="mt-5 flex items-center gap-2 border-t border-paper-line pt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-800">
                      <MapPin className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
                      Elgeyo Marakwet region
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-7 max-w-4xl text-[11px] leading-relaxed text-ink-muted">
          These destinations are featured as places to explore in and around the wider region; not all are within the Municipality's administrative boundary. Access, opening arrangements and visitor guidance should be confirmed with the relevant site authorities before travelling.
        </p>
      </div>
    </section>
  );
}
