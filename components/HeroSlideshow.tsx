"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  Pause,
  Play,
} from "lucide-react";
import { site } from "@/lib/site";

// Images are sourced from Wikimedia Commons. Each file page records the
// photographer and the applicable Creative Commons licence. Keep the
// attribution visible whenever its slide is displayed.
const slides = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten_view_point.jpg?width=1600",
    alt: "View across the Kerio Valley from Iten View Point",
    label: "Welcome to Iten-Tambach",
    credit: "Shadychiri",
    source: "https://commons.wikimedia.org/wiki/File:Iten_view_point.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten_kerio_view.jpg?width=1600",
    alt: "Looking down the Rift Valley from Kerio View in Iten",
    label: "The Kerio Valley Escarpment",
    credit: "Appleslerp",
    source: "https://commons.wikimedia.org/wiki/File:Iten_kerio_view.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Iten,_Kenya_(4202106764).jpg?width=1600",
    alt: "Athletes training for the steeplechase in Iten",
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

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="relative isolate overflow-hidden bg-green-950"
      aria-label="Iten-Tambach Municipality introduction"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              unoptimized
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
      <div className="absolute inset-0 pattern-grid opacity-50" aria-hidden="true" />

      <div className="shell relative pb-14 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
        <div className="max-w-[760px]">
          <p className="inline-flex items-center gap-2.5 border border-white/20 bg-white/8 px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm sm:text-[10px]">
            <Landmark className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            {site.county}
          </p>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
            {slides[activeSlide].label}
          </p>

          <h1 className="mt-3 text-balance font-display text-[2rem] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] text-white sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.9rem]">
            Welcome to
            <br />
            <span className="text-gold-400">Iten-Tambach</span> Municipality
          </h1>

          <p className="mt-5 max-w-xl font-display text-[15px] font-semibold leading-snug text-white/90 sm:text-[17px] md:text-[19px]">
            A town of choice for sports, tourism and investment
          </p>

          <div className="mt-6 max-w-xl space-y-3.5 border-l-2 border-gold-400/70 pl-4 sm:pl-5">
            <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
              Iten-Tambach is the sole municipality in Elgeyo Marakwet County and the home of the County headquarters. Its municipal charter was granted in December 2018 under the Urban Areas and Cities Act, 2011.
            </p>
            <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
              The Municipality's chartered responsibilities cover urban planning, roads and drainage, waste management, public spaces, street lighting, markets and other services that shape everyday life.
            </p>
            <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
              The Municipality’s vision is “A town of choice for sports, tourism and investment.” Its mission is “To transform the delivery of services by ensuring equitable access, development and excellence at all levels and harness the socio-economic contributions that can create a liveable environment for all residents.”
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex items-center gap-2" aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.label}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-9 bg-gold-400" : "w-4 bg-white/45 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] leading-relaxed text-white/65">
              Photo:{" "}
              <a
                href={slides[activeSlide].source}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-white/40 underline-offset-2 hover:text-white"
              >
                {slides[activeSlide].credit}
              </a>
              {" · "}
              <a
                href={slides[activeSlide].licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-white/40 underline-offset-2 hover:text-white"
              >
                {slides[activeSlide].license}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-9 w-9 items-center justify-center border border-white/35 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              className="flex h-9 w-9 items-center justify-center border border-white/35 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-9 w-9 items-center justify-center border border-white/35 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/12 bg-green-950/70 backdrop-blur-sm">
        <div className="shell grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 py-5 first:pl-0 sm:px-5">
              <p className="font-display text-[19px] font-extrabold leading-none text-gold-400 sm:text-[23px]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[9.5px] font-medium uppercase leading-tight tracking-[0.13em] text-white/50 sm:text-[10.5px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
