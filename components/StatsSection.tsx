import Reveal from "./Reveal";
import CountUp from "./CountUp";

const STATS: {
  count: number; prefix?: string; suffix?: string; static?: string;
  title: string; caption: string;
}[] = [
  {
    count: 500, suffix: "+",
    title: "Curated Properties",
    caption: "Hand-picked condos, houses and villas across Bangkok's finest addresses",
  },
  {
    count: 2, suffix: " min",
    title: "BTS-Connected Living",
    caption: "Every listing mapped to its nearest station, from Ari to On Nut",
  },
  {
    count: 20, suffix: "+",
    title: "Nationalities Served",
    caption: "Trusted by expats and international investors relocating to Thailand",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#0A0A0A] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#B8935A]" />
            <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">
              Why Portal Property
            </span>
            <div className="h-px w-8 bg-[#B8935A]" />
          </div>
          <h2 className="font-cormorant text-[36px] md:text-[42px] font-light text-white leading-tight">
            Bangkok, <em className="italic text-[#B8935A]">understood</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.title}
              delay={i * 120}
              className={`text-center px-8 py-8 md:py-2 ${
                i > 0 ? "border-t md:border-t-0 md:border-l border-[#B8935A]/20" : ""
              }`}
            >
              <CountUp
                end={stat.count}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="block font-cormorant text-[56px] md:text-[64px] font-light text-[#E5C795] leading-none mb-4"
              />
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-white mb-3">
                {stat.title}
              </p>
              <p className="font-sans text-[13px] font-light text-white/50 leading-relaxed max-w-[260px] mx-auto">
                {stat.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
