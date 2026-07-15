"use client";
import { useRef, type ReactNode } from "react";

// Wraps a child so it gently pulls toward the cursor on desktop (pointer:fine).
// Falls back to no-op on touch. Uses spring-ish transition from globals.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-block will-change-transform ${className}`}
      style={{ transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {children}
    </span>
  );
}
