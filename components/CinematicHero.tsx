"use client";
import { useEffect, useRef, useState } from "react";
import HeroSearch from "./HeroSearch";

const HERO_IMG = "https://images.unsplash.com/photo-1582535200497-8d831d74d18b?w=1920&q=90";

export default function CinematicHero() {
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Staggered entrance for each headline element
  const entrance = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <section className="relative w-full min-h-[640px] flex items-center justify-center" style={{ height: "100vh" }}>
      {/* Background + overlays live in their own clipping layer so the search
          autocomplete dropdown can overflow the hero without being cut off */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ken Burns background with scroll parallax */}
        <div
          className="absolute inset-[-10%] animate-kenburns"
          style={{
            backgroundImage: `url('${HERO_IMG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${offset * 0.25}px)`,
            willChange: "transform",
          }}
        />

        {/* Deep navy top-left, transparent centre, warm gold bottom */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(5,10,20,0.80) 0%, rgba(5,10,20,0.40) 40%, rgba(5,10,20,0.20) 60%, rgba(12,8,2,0.65) 100%)"
        }} />
        {/* Subtle gold radial glow from bottom-centre */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(184,147,90,0.22) 0%, transparent 70%)"
        }} />
        {/* Bottom fade to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent 0%, #FAFAF8 100%)"
        }} />
      </div>

      {/* Hero content — same layout as before; only the heading text fades on
          scroll now, the search module stays fully legible */}
      <div
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-6 mb-6" style={{ ...entrance(100), opacity: Math.min(entrance(100).opacity, Math.max(0, 1 - offset / 500)) }}>
          <div className="h-px w-8 bg-[#B8935A]" />
          <span className="font-sans uppercase text-white" style={{ fontSize: 10, letterSpacing: "3px" }}>
            Bangkok Real Estate
          </span>
          <div className="h-px w-8 bg-[#B8935A]" />
        </div>

        {/* H1 */}
        <h1
          className="font-cormorant font-light text-white leading-[1.05] mb-5"
          style={{ fontSize: "clamp(44px, 7vw, 82px)", ...entrance(250), opacity: Math.min(entrance(250).opacity, Math.max(0, 1 - offset / 500)) }}
        >
          Bangkok&apos;s <em className="italic text-[#E5C795]">Finest</em> Properties
        </h1>

        {/* Subheading */}
        <p
          className="font-sans font-light text-white/70 max-w-[480px] text-center mb-10 leading-relaxed"
          style={{ fontSize: 15, ...entrance(400), opacity: Math.min(entrance(400).opacity, Math.max(0, 1 - offset / 500)) }}
        >
          Explore condos, houses and apartments across Bangkok&apos;s most
          sought-after neighbourhoods
        </p>

        {/* Search module — kept fully opaque and legible regardless of scroll */}
        <div className="w-full" style={entrance(550)}>
          <HeroSearch />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: Math.max(0, 0.7 - offset / 200), ...(!mounted ? { opacity: 0 } : {}) }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[2.5px] text-white/60">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
