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

// Shared classes for the clickable gallery tiles — real <button>s so they're
// keyboard-focusable and Enter/Space-activatable, with a visible focus ring.
function tileCls(extra = "") {
  return `group relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#B8935A] ${extra}`.trim();
}

export default function PhotoGallery({ photos, title, heroId, altContext }: { photos: string[]; title: string; heroId?: string; altContext?: string }) {
  const heroStyle = heroId ? { viewTransitionName: `listing-photo-${heroId}` } : undefined;
  // Full descriptive alt e.g. "MUNIQ Sukhumvit 23, 2 bed condo in Sukhumvit, Bangkok"
  const baseAlt = altContext ? `${title}, ${altContext}` : title;
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

  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation, body scroll lock, focus trap + restore while the
  // lightbox (a modal dialog) is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const restoreTo = document.activeElement as HTMLElement | null;

    function focusable(): HTMLElement[] {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute("disabled"));
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey && (active === firstEl || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && active === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog on open
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo?.focus?.();
    };
  }, [lightboxIndex, prev, next]);

  return (
    <>
      {/* ── Mobile: full-bleed swipeable carousel ── */}
      <div className="md:hidden relative bg-[#0A0A0A]">
        <MobileCarousel photos={photos} title={baseAlt} onOpen={setLightboxIndex} />
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

        {/* Adaptive grid — the cell count is chosen so the photos always tile
            the frame exactly, never leaving an empty black cell (1, 2, 3, 4,
            and 5+ photos each get their own fitting layout). */}
        {photos.length === 1 ? (
          <button type="button" onClick={() => setLightboxIndex(0)} onContextMenu={(e) => e.preventDefault()} style={heroStyle} aria-label={`Open photo 1 of ${photos.length}`} className={tileCls("relative block w-full h-[60vh]")}>
            <PhotoWatermark size="md">
              <Image src={main} alt={baseAlt} fill className="object-cover opacity-90" priority sizes="100vw" {...noSave} />
            </PhotoWatermark>
            <span className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent pointer-events-none" />
          </button>
        ) : photos.length === 2 ? (
          <div className="grid grid-cols-2 h-[60vh] gap-1">
            {photos.slice(0, 2).map((photo, i) => (
              <button key={i} type="button" onClick={() => setLightboxIndex(i)} onContextMenu={(e) => e.preventDefault()} style={i === 0 ? heroStyle : undefined} aria-label={`Open photo ${i + 1} of ${photos.length}`} className={tileCls()}>
                <PhotoWatermark size="md">
                  <Image src={photo} alt={i === 0 ? baseAlt : `${baseAlt} — photo ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority={i === 0} sizes="50vw" {...noSave} />
                </PhotoWatermark>
              </button>
            ))}
          </div>
        ) : (
          <div className={`grid ${photos.length === 3 ? "grid-cols-3" : "grid-cols-4"} grid-rows-2 h-[60vh] gap-1`}>
            {/* Main large photo */}
            <button type="button" onClick={() => setLightboxIndex(0)} onContextMenu={(e) => e.preventDefault()} style={heroStyle} aria-label={`Open photo 1 of ${photos.length}`} className={tileCls("col-span-2 row-span-2")}>
              <PhotoWatermark size="md">
                <Image src={main} alt={baseAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority sizes="50vw" {...noSave} />
              </PhotoWatermark>
            </button>
            {/* Smaller previews (photos 2–5) */}
            {previews.map((photo, i) => {
              const isLast = i === previews.length - 1;
              // Exactly 4 photos → 3 previews in a 4-col grid: let the last one
              // span two columns so the bottom-right cell isn't left empty.
              const spanTwo = photos.length === 4 && isLast;
              return (
                <button key={i} type="button" onClick={() => setLightboxIndex(i + 1)} onContextMenu={(e) => e.preventDefault()} aria-label={`Open photo ${i + 2} of ${photos.length}`} className={tileCls(spanTwo ? "col-span-2" : "")}>
                  <Image src={photo} alt={`${baseAlt} — photo ${i + 2}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" {...noSave} />
                  {isLast && hasMore && (
                    <span className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 pointer-events-none">
                      <Grid2X2 size={20} className="text-white" />
                      <span className="font-sans text-white text-sm font-medium">+{photos.length - 5} more</span>
                    </span>
                  )}
                </button>
              );
            })}
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
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxIndex + 1} of ${photos.length}`}
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center focus:outline-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button aria-label="Close photo viewer" className="absolute top-4 right-4 text-white/80 hover:text-white z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full" onClick={() => setLightboxIndex(null)}>
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
                alt={`${baseAlt} — photo ${lightboxIndex + 1}`}
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
                <Image src={p} alt={`${baseAlt} — thumbnail ${i + 1}`} fill className="object-cover" sizes="56px" {...noSave} />
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
