"use client";
import { useRef, type ReactNode } from "react";

// 3D perspective tilt that follows the cursor on desktop. Wrap any card.
// No-op on touch (pointer:coarse) so mobile taps stay flat and fast.
export default function Tilt({
  children,
  max = 6,
  scale = 1.02,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  scale?: number;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  function onMove(e: React.MouseEvent) {
    const el = inner.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale(${scale})`;
    });
  }

  function reset() {
    const el = inner.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={inner}
        style={{
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
