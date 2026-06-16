"use client";
import type { ReactNode } from "react";

/**
 * Wraps any image container and overlays a subtle brand watermark.
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
    <div className="relative w-full h-full">
      {children}
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
