"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

// Openly licensed Iten photographs. Credit and licence are shown for each slide.
const slides = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten_view_point.jpg?width=1800",
    alt: "View across the Kerio Valley from Iten View Point",
    label: "Iten View Point",
    credit: "Shadychiri",
    source: "https://commons.wikimedia.org/wiki/File:Iten_view_point.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten_kerio_view.jpg?width=1800",
    alt: "Looking down the Rift Valley from Kerio View in Iten",
    label: "The Kerio Valley Escarpment",
    credit: "Appleslerp",
    source: "https://commons.wikimedia.org/wiki/File:Iten_kerio_view.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten,_Kenya_(4202106764).jpg?width=1800",
    alt: "Athletes training in Iten, Kenya",
    label: "A Home of Champions",
    credit: "edskoch",
    source: "https://commons.wikimedia.org/wiki/File:Iten,_Kenya_(4202106764).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    position: "center 48%",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/KERIO_VIEW_POINT_ON_THE_KIEYO_ESCARPMENT_-_ITEN_KENYA.jpg?width=1800",
    alt: "Wide view over the Kerio Valley from the Iten escarpment",
    label: "The Kerio Escarpment",
    credit: "Elias Yator",
    source: "https://commons.wikimedia.org/wiki/File:KERIO_VIEW_POINT_ON_THE_KIEYO_ESCARPMENT_-_ITEN_KENYA.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    position: "center 48%",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kerio_valley.jpg?width=1800",
    alt: "Kerio Valley seen from a ridge beneath a wide sky",
    label: "The Kerio Valley Landscape",
    credit: "Mekami",
    source: "https://commons.wikimedia.org/wiki/File:Kerio_valley.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    position: "center 55%",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Entrance_to_St._Patrick%27s_High_School_%284260378669%29.jpg?width=1800",
    alt: "Entrance to St Patrick's High School in Iten",
    label: "St Patrick's Athletics Heritage",
    credit: "edskoch",
    source: "https://commons.wikimedia.org/wiki/File:Entrance_to_St._Patrick's_High_School_(4260378669).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    position: "center 52%",
  },
  {
    src: "https://www.elgeyomarakwet.go.ke/docs/HTML/hmfile_hash_a297bba8.jpg",
    alt: "Elephants at Rimoi National Reserve in the Kerio Valley",
    label: "Rimoi Game Reserve",
    credit: "County Government of Elgeyo Marakwet",
    source: "https://www.elgeyomarakwet.go.ke/docs/HTML/rimoi_national_reserve.html",
    license: "Official County resource — reuse authorised by the Municipality",
    licenseUrl: "https://www.elgeyomarakwet.go.ke/docs/HTML/rimoi_national_reserve.html",
    position: "center 50%",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/A_section_of_cheploch_gorge.jpg?width=1800",
    alt: "A section of the Kerio River flowing through Cheploch Gorge",
    label: "Cheploch Gorge",
    credit: "Ronguno Bernard",
    source: "https://commons.wikimedia.org/wiki/File:A_section_of_cheploch_gorge.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    position: "center 50%",
  },
];

const stats = [
  { value: "183.4 km²", label: "Municipal area" },
  { value: "54,158", label: "2019 census population" },
  { value: "2,400 m", label: "Elevation above sea level" },
  { value: "May 2019", label: "World Athletics Heritage recognition" },
];

export function HeroSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const showNext = () => setActiveSlide((current) => (current + 1) % slides.length);
  const showPrevious = () =>
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (isPaused || reducedMotion.matches) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [isPaused, activeSlide]);

  const active = slides[activeSlide];
  const previousSlideIndex = (activeSlide - 1 + slides.length) % slides.length;
  const nextSlideIndex = (activeSlide + 1) % slides.length;

  return (
    <section
      aria-label="Iten-Tambach Municipality introduction"
      aria-roledescription="carousel"
      className="bg-white"
    >
      <div
        className="group relative h-[46svh] min-h-[320px] max-h-[560px] w-full touch-pan-y overflow-hidden bg-stone-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400 sm:h-[54svh] sm:min-h-[420px] sm:max-h-[640px] lg:h-[68svh] lg:min-h-[520px] lg:max-h-[760px]"
        onTouchStart={(event) => {
          (event.currentTarget as HTMLDivElement).dataset.touchStartX = String(event.touches[0]?.clientX ?? 0);
        }}
        onTouchEnd={(event) => {
          const startX = Number((event.currentTarget as HTMLDivElement).dataset.touchStartX || 0);
          const delta = (event.changedTouches[0]?.clientX ?? startX) - startX;
          if (Math.abs(delta) > 48) {
            if (delta < 0) showNext();
            else showPrevious();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrevious();
          }
        }}
        tabIndex={0}
        aria-label="Photograph slideshow. Use arrow keys or swipe to change slides."
      >
        {slides
          .map((slide, index) => ({ slide, index }))
          .filter(({ index }) => index === activeSlide || index === previousSlideIndex || index === nextSlideIndex)
          .map(({ slide, index }) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={index === activeSlide ? slide.alt : ""}
              fill
              priority={index === activeSlide}
              loading={index === activeSlide ? undefined : index === nextSlideIndex ? "eager" : "lazy"}
              sizes="100vw"
              style={{ objectPosition: slide.position ?? "center" }}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 sm:px-8 sm:pb-6 lg:px-12">
          <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-white drop-shadow sm:text-sm">
            {active.label}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-black/45 text-white shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-12 sm:w-12"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-black/45 text-white shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-12 sm:w-12"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={isPaused}
            >
              {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-black/45 text-white shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-12 sm:w-12"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-stone-200 bg-stone-50">
        <div className="shell flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
          <p className="text-[11px] text-stone-600">
            Photograph:{" "}
            <a href={active.source} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-green-900">
              {active.credit}
            </a>
            {" · "}
            <a href={active.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-green-900">
              {active.license}
            </a>
          </p>
          <div className="flex items-center gap-2" aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}: ${slide.label}`}
                aria-current={index === activeSlide ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800 ${index === activeSlide ? "w-8 bg-green-900" : "w-2 bg-stone-400 hover:bg-green-700"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shell py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-800 sm:text-xs">
            Elgeyo Marakwet County · Kenya
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-4xl lg:text-5xl xl:text-6xl">
            Iten-Tambach Municipality
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-display text-lg font-semibold leading-relaxed text-green-900 sm:text-xl">
            A global athletics and sporting municipality of choice
          </p>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-left text-sm leading-7 text-stone-700 sm:text-base sm:leading-8">
            <p>
              Iten-Tambach is the sole municipality in Elgeyo Marakwet County and the home of the County headquarters. Its municipal charter was granted in December 2018 under the Urban Areas and Cities Act, 2011.
            </p>
            <p>
              The Municipality's chartered responsibilities cover urban planning, roads and drainage, waste management, public spaces, street lighting, markets and other services that shape everyday life.
            </p>
            <p>
              The approved Integrated Development Plan (2025–2029) sets the Municipality’s vision as “A global athletics and sporting municipality of choice.” Its mission is “To foster development and excellence at all levels by harnessing the socio-economic contributions, transforming the delivery of services, ensuring inclusivity and equitable access that creates a livable environment for all residents.”
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="btn btn-gold">
              Explore Our Municipality <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/projects" className="btn btn-ghost">
              Discover Our Projects
            </Link>
            <Link href="/feedback" className="btn btn-ghost">
              Citizen Feedback
            </Link>
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-green-950">
        <div className="shell grid grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 py-5 first:pl-0 sm:px-5">
              <p className="font-display text-xl font-extrabold leading-none text-gold-400 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase leading-tight tracking-[0.13em] text-white/65 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
