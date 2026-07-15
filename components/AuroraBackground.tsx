// Slow, living mesh-gradient glow. Drop it inside any `relative` section as an
// ambient backdrop. Pure CSS — no JS, no deps. `tone` picks the palette.
export default function AuroraBackground({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const light = {
    a: "rgba(184,147,90,0.55)",
    b: "rgba(120,90,200,0.30)",
    c: "rgba(90,150,220,0.28)",
  };
  const dark = {
    a: "rgba(200,160,95,0.75)",
    b: "rgba(130,95,225,0.72)",
    c: "rgba(70,140,235,0.68)",
  };
  const p = tone === "dark" ? dark : light;
  const boost = tone === "dark" ? { opacity: 0.9 } : undefined;

  // Single `background` shorthand per layer: gradient position / size no-repeat
  const blob = (color: string, pos: string, size: string) =>
    `radial-gradient(closest-side, ${color}, transparent) ${pos} / ${size} no-repeat`;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden style={boost}>
      <div className="aurora-layer" style={{ background: blob(p.a, "18% 28%", "62% 62%") }} />
      <div className="aurora-layer two" style={{ background: blob(p.b, "82% 18%", "58% 58%") }} />
      <div className="aurora-layer" style={{ background: blob(p.c, "58% 88%", "54% 54%"), animationDelay: "-12s" }} />
    </div>
  );
}
