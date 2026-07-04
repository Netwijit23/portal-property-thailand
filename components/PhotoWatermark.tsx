"use client";
import type { ReactNode, CSSProperties } from "react";

const noCallout: CSSProperties = {
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  userSelect: "none",
} as CSSProperties;

/**
 * Wraps any image container, overlays a subtle brand watermark, and blocks
 * the save paths (long-press save on mobile, right-click, drag-to-desktop).
 * Usage: <PhotoWatermark><img ... /></PhotoWatermark>
 */
export default function PhotoWatermark({
  children,
  position = "bottom-right",
  size = "sm",
}: {
  children: ReactNode;
  position?: "bottom-right" | "bottom-left" | "center";
  size?: "sm" | "md";
}) {
  const posClass =
    position === "bottom-right" ? "bottom-2 right-2.5 text-right" :
    position === "bottom-left"  ? "bottom-2 left-2.5 text-left" :
    "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-center";

  const textSize = size === "md" ? "text-[11px] tracking-[3px]" : "text-[9px] tracking-[2.5px]";

  return (
    <div
      className="relative w-full h-full select-none"
      style={noCallout}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
      {/* Transparent shield: long-press and right-click land on this div
          instead of the image, so "Save Image" never appears. Taps still
          bubble up to the surrounding link. */}
      <div
        className="absolute inset-0 z-[5]"
        aria-hidden
        style={noCallout}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <div
        className={`absolute ${posClass} pointer-events-none select-none z-10`}
        aria-hidden
      >
        <span
          className={`font-sans font-medium uppercase ${textSize} text-white`}
          style={{
            opacity: 0.45,
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            letterSpacing: "0.2em",
          }}
        >
          Portal Property
        </span>
      </div>
    </div>
  );
}
