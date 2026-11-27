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
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  const active = slides[activeSlide];

  return (
    <section
      aria-label="Iten-Tambach Municipality introduction"
      aria-roledescription="carousel"
      className="bg-white"
    >
      <div className="relative h-[44vh] min-h-[280px] max-h-[680px] w-full overflow-hidden bg-stone-200 sm:h-[58vh] sm:min-h-[400px] lg:h-[68vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={index === activeSlide ? slide.alt : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              unoptimized
              className="object-cover object-center"
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
              className="flex h-10 w-10 items-center justify-center border border-white/75 bg-black/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              className="flex h-10 w-10 items-center justify-center border border-white/75 bg-black/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={isPaused}
            >
              {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-10 w-10 items-center justify-center border border-white/75 bg-black/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-stone-200 bg-stone-50">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
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

      <div className="shell py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-800 sm:text-xs">
            Elgeyo Marakwet County · Kenya
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
            Iten-Tambach Municipality
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-display text-lg font-semibold leading-relaxed text-green-900 sm:text-xl">
            A town of choice for sports, tourism and investment
          </p>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-left text-sm leading-7 text-stone-700 sm:text-base sm:leading-8">
            <p>
              Iten-Tambach is the sole municipality in Elgeyo Marakwet County and the home of the County headquarters. Its municipal charter was granted in December 2018 under the Urban Areas and Cities Act, 2011.
            </p>
            <p>
              The Municipality's chartered responsibilities cover urban planning, roads and drainage, waste management, public spaces, street lighting, markets and other services that shape everyday life.
            </p>
            <p>
              The Municipality’s vision is “A town of choice for sports, tourism and investment.” Its mission is “To transform the delivery of services by ensuring equitable access, development and excellence at all levels and harness the socio-economic contributions that can create a liveable environment for all residents.”
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
        <div className="shell grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
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
