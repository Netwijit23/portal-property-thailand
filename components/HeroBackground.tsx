"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=85",
    alt: "Luxury Bangkok condominium pool",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85",
    alt: "Modern luxury penthouse",
  },
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85",
    alt: "Bangkok luxury villa",
  },
  {
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=85",
    alt: "Luxury high-rise interior",
  },
];

export default function HeroBackground() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current);
      setTransitioning(true);
      setCurrent((c) => (c + 1) % SLIDES.length);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 1400);
    }, 6000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous slide (fading out) */}
      {prev !== null && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <Image
            src={SLIDES[prev].src}
            alt={SLIDES[prev].alt}
            fill
            className="object-cover scale-105"
            sizes="100vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}

      {/* Current slide (fading in) */}
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
        style={{ opacity: transitioning ? 1 : 1 }}
      >
        <Image
          src={SLIDES[current].src}
          alt={SLIDES[current].alt}
          fill
          className={`object-cover transition-transform duration-[8000ms] ease-out ${transitioning ? "scale-100" : "scale-105"}`}
          priority={current === 0}
          sizes="100vw"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Rich gradient overlay — deep navy at top, warm dark at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,16,28,0.55) 0%, rgba(10,10,10,0.28) 50%, rgba(20,12,4,0.50) 100%)",
        }}
      />

      {/* Subtle gold vignette glow at bottom centre */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(184,147,90,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade to page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #FAFAF8 100%)" }}
      />

      {/* Slide indicators */}
      <div className="absolute bottom-52 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i); setTransitioning(true); setTimeout(() => { setPrev(null); setTransitioning(false); }, 1400); }}
            className="transition-all duration-300"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-1.5 bg-[#B8935A]"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
