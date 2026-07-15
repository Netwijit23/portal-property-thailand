"use client";
import { useEffect, useRef } from "react";

// A soft radial light that trails the cursor inside its parent (which must be
// `relative`). Desktop only. Pure atmosphere for dark hero sections.
export default function CursorGlow({
  color = "rgba(184,147,90,0.22)",
  size = 520,
}: {
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      });
    };
    const onLeave = () => { el.style.opacity = "0"; };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute top-0 left-0 pointer-events-none z-[1]"
      style={{
        width: size,
        height: size,
        opacity: 0,
        background: `radial-gradient(closest-side, ${color}, transparent)`,
        transition: "opacity 0.4s ease, transform 0.15s ease-out",
        mixBlendMode: "screen",
        willChange: "transform, opacity",
      }}
    />
  );
}
