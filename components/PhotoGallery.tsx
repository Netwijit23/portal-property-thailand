"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react";
import PhotoWatermark from "@/components/PhotoWatermark";

const noSave = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  draggable: false,
  style: { userSelect: "none" as const, WebkitUserDrag: "none" as unknown as undefined },
};

export default function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const main = photos[0];
  const previews = photos.slice(1, 5);
  const hasMore = photos.length > 5;

  function prev() {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
  }
  function next() {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % photos.length));
  }

  return (
    <>
      {/* Main gallery grid */}
      <div className="relative bg-[#0A0A0A]">
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

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-sans text-white/70 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-16" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
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
            className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={36} />
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
