"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

const slides = [
  {
    src: "/images/1733467649360.jpg",
    alt: "Elephants moving through woodland at Rimoi Game Reserve",
    label: "Rimoi Game Reserve",
  },
  {
    src: "/images/iten-town-aerial.webp",
    alt: "Aerial view of Iten town and the surrounding highlands",
    label: "Iten Town",
  },
  {
    src: "/images/highlands.webp",
    alt: "Highland scenery in the Iten-Tambach area",
    label: "The Highlands",
  },
  {
    src: "/images/iten-hero.webp",
    alt: "The welcome entrance to Iten town",
    label: "Welcome to Iten",
  },
  {
    src: "/images/kerio-escarpment.webp",
    alt: "The dramatic Kerio Valley escarpment and surrounding landscape",
    label: "Kerio Valley Escarpment",
  },
  {
    src: "/images/kerio-forest-road.webp",
    alt: "A road passing through the green highland forest",
    label: "Highland Forests",
  },
  {
    src: "/images/conservation.webp",
    alt: "A natural conservation landscape in the municipality region",
    label: "Conservation and Nature",
  },
  {
    src: "/images/farmland.webp",
    alt: "Farmland and cultivated countryside in the highlands",
    label: "Agriculture and Rural Enterprise",
  },
  {
    src: "/images/town-centre.webp",
    alt: "Buildings and streets in the Iten town centre",
    label: "Iten Town Centre",
  },
  {
    src: "/images/town-life.webp",
    alt: "Everyday activity and local life in the town",
    label: "Life in Iten",
  },
  {
    src: "/images/trading.webp",
    alt: "Local trading activity and small businesses",
    label: "Local Trade",
  },
  {
    src: "/images/market-development.webp",
    alt: "Market facilities and local economic development",
    label: "Market Development",
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
  const touchStartX = useRef<number | null>(null);

  const showNext = useCallback(() => {
    setActiveSlide((current) => (current + 1) % slides.length);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(showNext, 6500);
    return () => window.clearInterval(interval);
  }, [isPaused, showNext]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showNext, showPrevious]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) showNext();
      else showPrevious();
    }
    touchStartX.current = null;
  };

  return (
    <section aria-label="Explore Iten-Tambach Municipality" className="bg-green-950">
      <div
        className="relative isolate h-[clamp(300px,52vw,650px)] min-h-[300px] overflow-hidden bg-green-950 sm:min-h-[380px] lg:min-h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            aria-hidden={index !== activeSlide}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={slide.src}
              alt={index === activeSlide ? slide.alt : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/75 via-green-950/10 to-green-950/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300 sm:text-xs">
                Iten-Tambach Municipality
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl md:text-5xl">
                {slides[activeSlide].label}
              </h1>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button type="button" onClick={showPrevious} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center border border-white/70 bg-green-950/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Play slideshow" : "Pause slideshow"} className="flex h-11 w-11 items-center justify-center border border-white/70 bg-green-950/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400">
                {isPaused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
              </button>
              <button type="button" onClick={showNext} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center border border-white/70 bg-green-950/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-green-950">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2" aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}: ${slide.label}`}
                aria-current={index === activeSlide ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${index === activeSlide ? "w-9 bg-gold-400" : "w-4 bg-white/45 hover:bg-white"}`}
              />
            ))}
          </div>
          <p className="text-[10px] text-white/60">Photographs are presented for public information and destination awareness.</p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-green-950/95">
        <div className="shell grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 py-4 first:pl-0 sm:px-5 sm:py-5">
              <p className="font-display text-lg font-extrabold leading-none text-gold-400 sm:text-2xl">{stat.value}</p>
              <p className="mt-1.5 text-[9px] font-medium uppercase leading-tight tracking-[0.12em] text-white/60 sm:text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
