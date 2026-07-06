"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid2X2, Expand } from "lucide-react";
import PhotoWatermark from "@/components/PhotoWatermark";

const noSave = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  draggable: false,
  style: { userSelect: "none" as const, WebkitUserDrag: "none" as unknown as undefined },
};

export default function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const main = photos[0];
  const previews = photos.slice(1, 5);
  const hasMore = photos.length > 5;

  function onGalleryMouseMove(e: React.MouseEvent) {
    setCursor({ x: e.clientX, y: e.clientY, show: true });
  }

  // Subtle parallax "recede": gallery gently scales + fades as content scrolls over it
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const p = Math.min(scrollY, 400) / 400;
  const galleryStyle = { transform: `scale(${1 - p * 0.04})`, opacity: 1 - p * 0.25 };

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % photos.length));
  }, [photos.length]);

  // Keyboard navigation + body scroll lock while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxIndex(null);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, prev, next]);

  return (
    <>
      {/* ── Mobile: full-bleed swipeable carousel ── */}
      <div className="md:hidden relative bg-[#0A0A0A]">
        <MobileCarousel photos={photos} title={title} onOpen={setLightboxIndex} />
      </div>

      {/* ── Desktop: gallery grid ── */}
      <div className="hidden md:block relative bg-[#0A0A0A] gallery-cursor" style={galleryStyle} onMouseMove={onGalleryMouseMove} onMouseLeave={() => setCursor((c) => ({ ...c, show: false }))}>
        {/* Custom "View" cursor */}
        <div
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
          style={{ left: cursor.x, top: cursor.y, opacity: cursor.show ? 1 : 0 }}
        >
          <div className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-white text-[11px] font-sans font-medium tracking-wide" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(6px)" }}>
            <Expand size={12} /> View
          </div>
        </div>

        {photos.length === 1 ? (
          <div className="relative h-[60vh] cursor-pointer" onClick={() => setLightboxIndex(0)} onContextMenu={(e) => e.preventDefault()}>
            <PhotoWatermark size="md">
              <Image src={main} alt={title} fill className="object-cover opacity-90" priority sizes="100vw" {...noSave} />
            </PhotoWatermark>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 h-[60vh] gap-1">
            {/* Main large photo */}
            <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => setLightboxIndex(0)} onContextMenu={(e) => e.preventDefault()}>
              <PhotoWatermark size="md">
                <Image src={main} alt={title} fill className="object-cover hover:scale-105 transition-transform duration-500" priority sizes="50vw" {...noSave} />
              </PhotoWatermark>
            </div>
            {/* 4 smaller previews */}
            {previews.map((photo, i) => (
              <div key={i} className="relative cursor-pointer overflow-hidden" onClick={() => setLightboxIndex(i + 1)} onContextMenu={(e) => e.preventDefault()}>
                <Image src={photo} alt="" fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="25vw" {...noSave} />
                {/* "Show all" overlay on last thumbnail */}
                {i === 3 && hasMore && (
                  <div
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(4); }}
                  >
                    <Grid2X2 size={20} className="text-white" />
                    <span className="font-sans text-white text-sm font-medium">+{photos.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
            {/* Fill empty slots if < 5 photos */}
            {Array.from({ length: Math.max(0, 4 - previews.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-[#111]" />
            ))}
          </div>
        )}

        {/* Photo count badge */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          <Grid2X2 size={13} /> {photos.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          {/* Close */}
          <button className="absolute top-4 right-4 text-white/80 hover:text-white z-10" onClick={() => setLightboxIndex(null)}>
            <X size={28} />
          </button>

          {/* Counter pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-sans text-white/90 text-xs tracking-[1px] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image — keyed so each photo fades in */}
          <div
            key={lightboxIndex}
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-16"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <PhotoWatermark size="md">
              <Image
                src={photos[lightboxIndex]}
                alt={`${title} — photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                {...noSave}
              />
            </PhotoWatermark>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 overflow-x-auto">
            {photos.map((p, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative w-14 h-10 shrink-0 rounded cursor-pointer overflow-hidden border-2 transition-colors ${
                  i === lightboxIndex ? "border-[#B8935A]" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={p} alt="" fill className="object-cover" sizes="56px" {...noSave} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Mobile carousel: edge-to-edge snap scroll with counter ──────────────────
function MobileCarousel({
  photos,
  title,
  onOpen,
}: {
  photos: string[];
  title: string;
  onOpen: (i: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            className="relative w-full h-[62vh] min-h-[380px] shrink-0 snap-center"
            onClick={() => onOpen(i)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <PhotoWatermark size="md">
              <Image
                src={photo}
                alt={i === 0 ? title : `${title} — photo ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
                {...noSave}
              />
            </PhotoWatermark>
            {/* Soft cinematic gradient at the base */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0A0A]/45 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Counter pill */}
      <div className="absolute bottom-4 right-4 font-sans text-[11px] tracking-[1px] text-white px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md pointer-events-none">
        {current + 1} / {photos.length}
      </div>

      {/* Dot indicators */}
      {photos.length > 1 && photos.length <= 8 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
