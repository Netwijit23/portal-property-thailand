"use client";
import { useState } from "react";
import Link from "next/link";

type Station = {
  id: string;
  name: string;
  code: string;
  zoneQuery: string;
  line: "sukhumvit" | "silom" | "interchange";
  x: number;
  y: number;
  count: number;
  forWho: string;
  rent1: string;
  rent2: string;
  rent3: string;
  amenities: string[];
  tags: string[];
  access: string[];
  isMRTInterchange?: boolean;
  isHub?: boolean;
};

// Sukhumvit line — horizontal track
const S_Y  = 195; // track y
const S_X0 = 60;  // Ari x
const S_DX = 56;  // spacing per station

// Silom line — diagonal from Siam, 44px per step (both axes)
const SL_D  = 44;
const SL_X0 = S_X0 + 5 * S_DX; // Siam x
const SL_Y0 = S_Y;              // Siam y

function sx(i: number)  { return S_X0  + i * S_DX; }
function slx(i: number) { return SL_X0 + i * SL_D; }
function sly(i: number) { return SL_Y0 + i * SL_D; }

const GREEN = "#00964D";
const RED   = "#C63A2F";
const GOLD  = "#B8935A";
const MRT   = "#2563EB";

const STATIONS: Station[] = [
  // ── SUKHUMVIT LINE (Ari → On Nut) ────────────────────────────────
  {
    id: "ari", name: "Ari", code: "N5",
    zoneQuery: "Ari", line: "sukhumvit",
    x: sx(0), y: S_Y, count: 24,
    forWho: "☕ Young professionals & creatives",
    rent1: "฿18,000–26,000", rent2: "฿30,000–45,000", rent3: "฿50,000–70,000",
    amenities: [
      "☕ Ari café & restaurant strip",
      "🏥 Phyathai 1 Hospital",
      "🛒 Tops Supermarket",
      "🌳 Suan Rod Fai Park (Rot Fai)",
    ],
    tags: ["Young professionals", "Digital nomads", "Café culture", "Boutique lifestyle"],
    access: ["BTS Ari (N5)", "BTS Saphan Khwai walkable", "Expressway access"],
  },
  {
    id: "sanam-pao", name: "Sanam Pao", code: "N4",
    zoneQuery: "Sanam Pao", line: "sukhumvit",
    x: sx(1), y: S_Y, count: 12,
    forWho: "🏘️ Local residents & budget expats",
    rent1: "฿14,000–22,000", rent2: "฿25,000–38,000", rent3: "฿42,000–60,000",
    amenities: [
      "🛍️ Villa Market & local shops",
      "🏥 Phahonyothin Hospital nearby",
      "🍜 Excellent local street food",
      "🌳 Quiet residential sois",
    ],
    tags: ["Long-term residents", "Budget expats", "Quiet lifestyle", "Mid-range"],
    access: ["BTS Sanam Pao (N4)", "Near Phahonyothin Rd", "Expressway access"],
  },
  {
    id: "victory-monument", name: "Victory Mon.", code: "N3",
    zoneQuery: "Victory Monument", line: "sukhumvit",
    x: sx(2), y: S_Y, count: 8,
    forWho: "🎓 Students & young workers",
    rent1: "฿12,000–20,000", rent2: "฿22,000–35,000", rent3: "฿38,000–55,000",
    amenities: [
      "🚌 Major minibus & van hub",
      "🍜 Rangnam dining street",
      "🏫 Near several universities",
      "🛍️ Victory Mall & street market",
    ],
    tags: ["Students", "Young workers", "Budget-friendly", "Great transit hub"],
    access: ["BTS Victory Monument (N3)", "Many bus & van routes to provinces", "Expressway nearby"],
  },
  {
    id: "phaya-thai", name: "Phaya Thai", code: "N2",
    zoneQuery: "Phaya Thai", line: "sukhumvit",
    x: sx(3), y: S_Y, count: 10,
    forWho: "✈️ Airport commuters & mid-range expats",
    rent1: "฿14,000–22,000", rent2: "฿26,000–40,000", rent3: "฿44,000–65,000",
    amenities: [
      "✈️ Airport Rail Link (Suvarnabhumi 15 min)",
      "🏥 Phyathai 2 Hospital",
      "🛍️ Pratunam market nearby",
      "🍜 Rangnam street food",
    ],
    tags: ["Airport commuters", "Business travellers", "Mid-range", "Great connectivity"],
    access: ["BTS Phaya Thai (N2)", "Airport Rail Link interchange", "Phayathai Rd access"],
  },
  {
    id: "ratchathewi", name: "Ratchathewi", code: "N1",
    zoneQuery: "Ratchathewi", line: "sukhumvit",
    x: sx(4), y: S_Y, count: 9,
    forWho: "🛍️ Market lovers & mid-range renters",
    rent1: "฿16,000–25,000", rent2: "฿28,000–42,000", rent3: "฿46,000–68,000",
    amenities: [
      "🛍️ Pratunam wholesale market",
      "🏥 Rajavithi Hospital",
      "🏢 Petchaburi Rd office corridor",
      "🍜 Street food & local eateries",
    ],
    tags: ["Mid-range expats", "Families", "Central location", "Value for money"],
    access: ["BTS Ratchathewi (N1)", "Near Petchaburi Rd", "Short to Siam & Pratunam"],
  },
  {
    id: "siam", name: "Siam", code: "CEN",
    zoneQuery: "Siam", line: "interchange",
    x: sx(5), y: S_Y, count: 38,
    forWho: "🏙️ Central Bangkok — best of all worlds",
    rent1: "฿30,000–50,000", rent2: "฿60,000–100,000", rent3: "฿110,000–200,000",
    amenities: [
      "🛍️ Siam Paragon, MBK & CentralWorld",
      "🎓 Chulalongkorn University",
      "🎭 Bangkok Art & Culture Centre",
      "🏥 Chulalongkorn Hospital",
    ],
    tags: ["Central location", "Luxury shopping", "Students", "Culture & arts"],
    access: ["BTS Siam — all lines interchange", "Walking to all major malls", "Every route in Bangkok"],
    isHub: true,
  },
  {
    id: "chit-lom", name: "Chit Lom", code: "E1",
    zoneQuery: "Chidlom", line: "sukhumvit",
    x: sx(6), y: S_Y, count: 32,
    forWho: "💎 Finance executives & luxury shoppers",
    rent1: "฿30,000–48,000", rent2: "฿55,000–90,000", rent3: "฿100,000–200,000+",
    amenities: [
      "🛍️ Central Chidlom & Gaysorn Village",
      "🏢 Embassy district (Witthayu Rd)",
      "🌳 Lumpini Park 10 min",
      "🍷 Langsuan fine dining strip",
    ],
    tags: ["Executives", "Embassy staff", "Ultra-premium", "Finance sector"],
    access: ["BTS Chit Lom (E1)", "BTS Ploenchit walkable", "Near all embassies"],
  },
  {
    id: "phloen-chit", name: "Phloen Chit", code: "E2",
    zoneQuery: "Ploenchit", line: "sukhumvit",
    x: sx(7), y: S_Y, count: 21,
    forWho: "🌐 Diplomats & senior expat professionals",
    rent1: "฿28,000–45,000", rent2: "฿52,000–85,000", rent3: "฿95,000–180,000",
    amenities: [
      "🏢 Wireless Rd embassy corridor",
      "🛍️ Central Embassy & Ploenchit Center",
      "🏥 Bumrungrad 5 min taxi",
      "🌿 Quiet premium sois (Soi 1–4)",
    ],
    tags: ["Diplomats", "Senior executives", "Ultra-quiet premium", "Witthayu Rd"],
    access: ["BTS Phloen Chit (E2)", "BTS Chit Lom walkable", "Near expressway"],
  },
  {
    id: "nana", name: "Nana", code: "E3",
    zoneQuery: "Nana", line: "sukhumvit",
    x: sx(8), y: S_Y, count: 18,
    forWho: "🌍 Expats & international community",
    rent1: "฿22,000–35,000", rent2: "฿38,000–55,000", rent3: "฿65,000–90,000",
    amenities: [
      "🏥 Bumrungrad Int'l Hospital (5 min)",
      "🛍️ Terminal 21 (next stop)",
      "🍜 Sukhumvit Soi 11 dining",
      "🏨 International hotel strip",
    ],
    tags: ["Expats", "Short-term stay", "International community", "Business travelers"],
    access: ["BTS Nana (E3)", "Near Asok MRT", "Airport Rail Link 20 min"],
  },
  {
    id: "asok", name: "Asok", code: "E4",
    zoneQuery: "Asok", line: "sukhumvit",
    x: sx(9), y: S_Y, count: 96,
    forWho: "💼 Business professionals & CBD workers",
    rent1: "฿25,000–40,000", rent2: "฿45,000–70,000", rent3: "฿80,000–130,000",
    amenities: [
      "🛍️ Terminal 21 Mall",
      "🏥 Bumrungrad Int'l Hospital",
      "🏢 Major CBD office towers",
      "🍱 Huge dining & street food scene",
    ],
    tags: ["Business professionals", "Corporate expats", "CBD workers", "High-end lifestyle"],
    access: ["BTS Asok (E4)", "MRT Sukhumvit interchange", "Airport Rail Link 15 min"],
    isMRTInterchange: true,
  },
  {
    id: "phrom-phong", name: "Phrom Phong", code: "E5",
    zoneQuery: "Phrom Phong", line: "sukhumvit",
    x: sx(10), y: S_Y, count: 312,
    forWho: "👨‍👩‍👧 Japanese expat families & luxury professionals",
    rent1: "฿28,000–45,000", rent2: "฿50,000–80,000", rent3: "฿90,000–160,000",
    amenities: [
      "🛍️ EmQuartier & Emporium Malls",
      "🏥 Samitivej Sukhumvit Hospital",
      "🏫 NIST & Kensington Schools",
      "🍣 Japanese restaurants & supermarkets",
    ],
    tags: ["Japanese expats", "Families", "Luxury lifestyle", "Top-tier professionals"],
    access: ["BTS Phrom Phong (E5)", "Walking to EmQuartier", "Expressway 10 min"],
  },
  {
    id: "thong-lo", name: "Thong Lo", code: "E6",
    zoneQuery: "Thonglor", line: "sukhumvit",
    x: sx(11), y: S_Y, count: 180,
    forWho: "🍸 Affluent expats & Bangkok's social scene",
    rent1: "฿25,000–40,000", rent2: "฿50,000–85,000", rent3: "฿95,000–200,000",
    amenities: [
      "🛍️ J Avenue & Donki Mall Thonglor",
      "🏥 Thonglor Hospital",
      "🍽️ Bangkok's best dining strip",
      "☕ Specialty coffee & rooftop bars",
    ],
    tags: ["Luxury lifestyle", "Social & nightlife", "Japanese community", "High-net-worth"],
    access: ["BTS Thong Lo (E6)", "Taxi to Asok 10 min", "Expressway nearby"],
  },
  {
    id: "ekkamai", name: "Ekkamai", code: "E7",
    zoneQuery: "Ekkamai", line: "sukhumvit",
    x: sx(12), y: S_Y, count: 94,
    forWho: "🎨 Creative professionals & trendy expats",
    rent1: "฿20,000–32,000", rent2: "฿38,000–62,000", rent3: "฿70,000–120,000",
    amenities: [
      "🛍️ Gateway Ekkamai Mall",
      "🚌 Eastern Bus Terminal",
      "🍺 Thriving bar & café scene",
      "🏋️ Fitness & wellness studios",
    ],
    tags: ["Creatives", "Trendy lifestyle", "Young expats", "Affordable luxury"],
    access: ["BTS Ekkamai (E7)", "Eastern Bus Terminal", "Expressway to east Bangkok"],
  },
  {
    id: "phra-khanong", name: "Phra Khanong", code: "E8",
    zoneQuery: "Phra Khanong", line: "sukhumvit",
    x: sx(13), y: S_Y, count: 44,
    forWho: "🌱 Local lifestyle lovers & digital nomads",
    rent1: "฿10,000–18,000", rent2: "฿20,000–32,000", rent3: "฿35,000–55,000",
    amenities: [
      "🌿 Phra Khanong Market",
      "🛒 Villa Market & Tops",
      "🍜 Authentic local street food",
      "☕ Growing indie café scene",
    ],
    tags: ["Digital nomads", "Local lifestyle", "Budget expats", "Emerging area"],
    access: ["BTS Phra Khanong (E8)", "Quick to On Nut", "Airport 25 min"],
  },
  {
    id: "on-nut", name: "On Nut", code: "E9",
    zoneQuery: "On Nut", line: "sukhumvit",
    x: sx(14), y: S_Y, count: 64,
    forWho: "💰 Value-seekers & budget-conscious expats",
    rent1: "฿12,000–20,000", rent2: "฿22,000–35,000", rent3: "฿38,000–60,000",
    amenities: [
      "🛒 Tesco Lotus & Big C Extra",
      "🏥 Bangkok Hospital Srinakarin",
      "🏫 Bangkok Patana School nearby",
      "🍜 Local market & street food",
    ],
    tags: ["Value for money", "Families", "Long-term expats", "Budget-conscious"],
    access: ["BTS On Nut (E9)", "Expressway access", "Suvarnabhumi Airport 30 min"],
  },

  // ── SILOM LINE (Siam → Surasak) ──────────────────────────────────
  // Siam (step 0) is rendered as part of Sukhumvit above
  {
    id: "ratchadamri", name: "Ratchadamri", code: "S1",
    zoneQuery: "Ratchadamri", line: "silom",
    x: slx(1), y: sly(1), count: 28,
    forWho: "🏦 Finance & luxury-brand professionals",
    rent1: "฿28,000–45,000", rent2: "฿55,000–88,000", rent3: "฿95,000–180,000",
    amenities: [
      "🛍️ CentralWorld & Big C Ratchadamri",
      "🌳 Lumpini Park 5 min walk",
      "🏢 Insurance & banking towers",
      "🍽️ Rooftop restaurants & wine bars",
    ],
    tags: ["Finance professionals", "Luxury shoppers", "Park lifestyle", "High-income"],
    access: ["BTS Ratchadamri (S1)", "Walk to Lumpini Park", "Near CentralWorld"],
  },
  {
    id: "sala-daeng", name: "Sala Daeng", code: "S2",
    zoneQuery: "Silom", line: "silom",
    x: slx(2), y: sly(2), count: 28,
    forWho: "💼 Finance workers & CBD professionals",
    rent1: "฿22,000–36,000", rent2: "฿42,000–68,000", rent3: "฿75,000–130,000",
    amenities: [
      "🏥 Bangkok Christian Hospital",
      "🛍️ Silom Complex & Robinson",
      "🌳 Lumpini Park 5 min walk",
      "🏢 Bangkok CBD & financial district",
    ],
    tags: ["Finance professionals", "CBD workers", "Park lifestyle", "Business travelers"],
    access: ["BTS Sala Daeng (S2)", "MRT Si Lom interchange", "Lumpini Park walkable"],
    isMRTInterchange: true,
  },
  {
    id: "chong-nonsi", name: "Chong Nonsi", code: "S3",
    zoneQuery: "Sathorn", line: "silom",
    x: slx(3), y: sly(3), count: 51,
    forWho: "🌏 International professionals & diplomats",
    rent1: "฿25,000–40,000", rent2: "฿45,000–75,000", rent3: "฿85,000–160,000",
    amenities: [
      "🏥 Saint Louis Hospital nearby",
      "🏢 Sathorn CBD towers",
      "🌳 Quiet embassy sois",
      "🍽️ International restaurants & wine bars",
    ],
    tags: ["Diplomats", "International professionals", "Quiet premium", "Embassy district"],
    access: ["BTS Chong Nonsi (S3)", "Expressway 5 min", "River ferry access"],
  },
  {
    id: "saint-louis", name: "Saint Louis", code: "S4",
    zoneQuery: "Sathorn", line: "silom",
    x: slx(4), y: sly(4), count: 18,
    forWho: "🏥 Medical expats & quiet Sathorn residents",
    rent1: "฿20,000–32,000", rent2: "฿38,000–60,000", rent3: "฿68,000–110,000",
    amenities: [
      "🏥 Saint Louis Hospital (walking distance)",
      "🌿 Quiet premium residential sois",
      "🏢 Sathorn office corridor",
      "🛍️ Local markets & Villa Market",
    ],
    tags: ["Medical professionals", "Quiet lifestyle", "Premium residential", "Sathorn area"],
    access: ["BTS Saint Louis (S4)", "Near Sathorn Rd", "River boat access"],
  },
  {
    id: "surasak", name: "Surasak", code: "S5",
    zoneQuery: "Surasak", line: "silom",
    x: slx(5), y: sly(5), count: 22,
    forWho: "🌊 Riverside lifestyle & boutique living",
    rent1: "฿20,000–32,000", rent2: "฿38,000–60,000", rent3: "฿70,000–110,000",
    amenities: [
      "🌊 Chao Phraya River 10 min",
      "🏥 BNH Hospital",
      "🛍️ Si Phraya riverside",
      "🍷 Charoen Krung dining & art scene",
    ],
    tags: ["Riverside lifestyle", "Quiet professional", "Boutique area", "Emerging hip zone"],
    access: ["BTS Surasak (S5)", "River ferry access", "Expressway nearby"],
  },
];

const SUKHUMVIT_STATIONS = STATIONS.filter(s => s.line === "sukhumvit" || s.line === "interchange");
const SILOM_STATIONS     = STATIONS.filter(s => s.line === "silom");

function lineColor(line: Station["line"]) {
  if (line === "silom")       return RED;
  if (line === "interchange") return GOLD;
  return GREEN;
}

export default function BTSMap() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const station = STATIONS.find(s => s.id === active) ?? null;

  function toggle(id: string) {
    setActive(prev => (prev === id ? null : id));
  }

  const surasak = STATIONS.find(s => s.id === "surasak")!;
  const SVG_H = surasak.y + 80;
  const SVG_W = 940;

  return (
    <section id="bts-map" className="bg-white border-t border-[#F0EDE8] py-12 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#B8935A] mb-3">
          Explore by Area
        </p>
        <h2 className="font-cormorant text-[36px] md:text-[42px] font-light text-[#0A0A0A] leading-tight mb-3">
          Browse by{" "}
          <em className="italic text-[#B8935A]">BTS Skytrain</em> Station
        </h2>
        <p className="font-sans text-[14px] text-[#8A8680] max-w-md mx-auto">
          Click any station to see prices, amenities, and who each area is best for
        </p>
      </div>

      {/* Legend */}
      <div className="max-w-[980px] mx-auto flex flex-wrap gap-5 justify-center mb-6">
        {[
          { color: GREEN, label: "Sukhumvit Line (Ari → On Nut)" },
          { color: RED,   label: "Silom Line (Siam → Surasak)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-6 h-1.5 rounded" style={{ background: color }} />
            <span className="font-sans text-[11px] text-[#8A8680]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-dashed" style={{ borderColor: MRT }} />
          <span className="font-sans text-[11px] text-[#8A8680]">MRT Interchange</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[3px]" style={{ background: GOLD }} />
          <span className="font-sans text-[11px] text-[#8A8680]">Hub (both lines)</span>
        </div>
      </div>

      {/* SVG Map */}
      <div className="max-w-[980px] mx-auto overflow-x-auto pb-2">
        <div style={{ minWidth: 920 }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            style={{ height: SVG_H }}
          >
            {/* ── Track: Sukhumvit horizontal */}
            <line
              x1={S_X0 - 22} y1={S_Y}
              x2={sx(14) + 22} y2={S_Y}
              stroke={GREEN} strokeWidth="5" strokeLinecap="round"
            />
            {/* ── Track: Silom diagonal from Siam */}
            <line
              x1={SL_X0} y1={SL_Y0}
              x2={slx(5)} y2={sly(5)}
              stroke={RED} strokeWidth="5" strokeLinecap="round"
            />

            {/* ── End-of-line dashes with labels */}
            <line x1={S_X0 - 22} y1={S_Y} x2={S_X0 - 30} y2={S_Y}
              stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeDasharray="4,3" />
            <text x={S_X0 - 33} y={S_Y - 8} fontSize="8" fill="#bbb" textAnchor="end">← Mo Chit</text>
            <line x1={sx(14) + 22} y1={S_Y} x2={sx(14) + 30} y2={S_Y}
              stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeDasharray="4,3" />
            <text x={sx(14) + 33} y={S_Y - 8} fontSize="8" fill="#bbb" textAnchor="start">→ Bang Na</text>

            {/* ── Line name labels */}
            <text x={S_X0} y={S_Y + 16} fontSize="9" fill={GREEN} fontWeight="600">
              Sukhumvit Line
            </text>

            {/* ── Sukhumvit stations */}
            {SUKHUMVIT_STATIONS.map((s, idx) => {
              const isActive = active === s.id;
              const isHover  = hovered === s.id && !isActive;
              // Alternate labels above/below to reduce clutter
              const above = idx % 2 === 0;
              const nameY = above ? s.y - 16 : s.y + 26;
              const codeY = above ? s.y - 24 : s.y + 34;

              return (
                <g key={s.id}
                  onClick={() => toggle(s.id)}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  {/* MRT ring */}
                  {s.isMRTInterchange && (
                    <circle cx={s.x} cy={s.y} r="13"
                      fill="none" stroke={MRT} strokeWidth="1.8" strokeDasharray="4,2" />
                  )}

                  {/* Siam hub square */}
                  {s.isHub ? (
                    <rect x={s.x - 9} y={s.y - 9} width="18" height="18" rx="3"
                      fill={isActive ? "#a07d4a" : GOLD}
                      className="transition-all duration-200"
                      style={{ filter: isActive ? `drop-shadow(0 0 6px ${GOLD}88)` : undefined }}
                    />
                  ) : (
                    <circle cx={s.x} cy={s.y}
                      r={isActive ? 9 : isHover ? 8 : 6}
                      fill={isActive ? GOLD : isHover ? "#fdf7ee" : "white"}
                      stroke={isActive ? GOLD : GREEN}
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                      style={{ filter: isActive ? `drop-shadow(0 0 5px ${GOLD}88)` : undefined }}
                    />
                  )}

                  {/* Station code */}
                  <text x={s.x} y={codeY} textAnchor="middle" fontSize="7"
                    fill={isActive ? GOLD : "#bbb"}>
                    {s.code}
                  </text>
                  {/* Station name */}
                  <text x={s.x} y={nameY} textAnchor="middle" fontSize="9"
                    fill={isActive ? GOLD : isHover ? "#222" : "#555"}
                    fontWeight={isActive ? "700" : "400"}>
                    {s.name}
                  </text>
                </g>
              );
            })}

            {/* ── Silom stations */}
            {SILOM_STATIONS.map(s => {
              const isActive = active === s.id;
              const isHover  = hovered === s.id && !isActive;

              return (
                <g key={s.id}
                  onClick={() => toggle(s.id)}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  {s.isMRTInterchange && (
                    <circle cx={s.x} cy={s.y} r="13"
                      fill="none" stroke={MRT} strokeWidth="1.8" strokeDasharray="4,2" />
                  )}
                  <circle cx={s.x} cy={s.y}
                    r={isActive ? 9 : isHover ? 8 : 6}
                    fill={isActive ? RED : isHover ? "#fdf0ee" : "white"}
                    stroke={isActive ? RED : RED}
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                    style={{ filter: isActive ? `drop-shadow(0 0 5px ${RED}88)` : undefined }}
                  />
                  {/* Code above-left */}
                  <text x={s.x - 13} y={s.y - 5} textAnchor="end" fontSize="7"
                    fill={isActive ? RED : "#bbb"}>
                    {s.code}
                  </text>
                  {/* Name to the right */}
                  <text x={s.x + 13} y={s.y + 4} textAnchor="start" fontSize="9"
                    fill={isActive ? RED : isHover ? "#222" : "#555"}
                    fontWeight={isActive ? "700" : "400"}>
                    {s.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Station detail panel */}
      {station && (
        <div
          className="max-w-[980px] mx-auto mt-6 bg-white border border-[#E8E4DC] rounded-[18px] overflow-hidden shadow-lg"
          style={{ animation: "btsSlideUp 0.22s ease-out" }}
        >
          {/* Panel header */}
          <div
            className="px-6 py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            style={{ borderBottom: `3px solid ${lineColor(station.line)}` }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: lineColor(station.line) }} />
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680]">
                  {station.line === "sukhumvit" ? "Sukhumvit Line" :
                   station.line === "silom"     ? "Silom Line"     : "BTS Hub — both lines"}
                  {" · "}Station {station.code}
                </span>
              </div>
              <h3 className="font-cormorant text-[30px] font-light text-[#0A0A0A] leading-tight">
                {station.name === "Victory Mon." ? "Victory Monument" : station.name}
              </h3>
              <p className="font-sans text-[13px] text-[#8A8680] mt-1">
                📍 Near BTS {station.name === "Victory Mon." ? "Victory Monument" : station.name} station
              </p>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <span
                className="inline-block font-sans text-[12px] font-medium px-3.5 py-1.5 rounded-full"
                style={{ background: `${lineColor(station.line)}18`, color: lineColor(station.line) }}
              >
                {station.forWho}
              </span>
              <button
                onClick={() => setActive(null)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F5F2EC] text-[#8A8680] hover:text-[#0A0A0A] text-xs font-bold transition-colors shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Panel body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F0EDE8]">
            {/* Rent */}
            <div className="p-6">
              <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-4">
                Average Rent / Month
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Studio / 1 Bed (28–45 sqm)", value: station.rent1 },
                  { label: "2 Bedrooms (55–75 sqm)",      value: station.rent2 },
                  { label: "3 Bedrooms (85–130 sqm)",     value: station.rent3 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-sans text-[11px] text-[#8A8680] mb-0.5">{label}</p>
                    <p className="font-cormorant text-[18px] text-[#B8935A]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="p-6">
              <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-4">
                Nearby Amenities
              </p>
              <div className="flex flex-col gap-2.5">
                {station.amenities.map(a => (
                  <p key={a} className="font-sans text-[13px] text-[#0A0A0A]">{a}</p>
                ))}
              </div>
            </div>

            {/* Tags & Transit */}
            <div className="p-6">
              <div className="mb-5">
                <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-3">
                  Best For
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {station.tags.map(t => (
                    <span key={t}
                      className="font-sans text-[11px] px-2.5 py-1 rounded-full bg-[#F5F2EC] text-[#0A0A0A]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-3">
                  Transit Access
                </p>
                <div className="flex flex-col gap-1.5">
                  {station.access.map(a => (
                    <p key={a} className="font-sans text-[12px] text-[#8A8680] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#B8935A] shrink-0" />
                      {a}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel footer */}
          <div className="px-6 py-4 border-t border-[#F0EDE8] flex items-center justify-between bg-[#FAFAF8]">
            <p className="font-sans text-[13px] text-[#8A8680]">
              <span className="text-[#B8935A] font-medium">{station.count}</span> listings near this station
            </p>
            <Link
              href={`/listings?zone=${encodeURIComponent(station.zoneQuery)}`}
              className="font-sans text-[13px] font-medium text-[#B8935A] underline underline-offset-4 hover:text-[#a07d4a] transition-colors"
            >
              Browse {station.name === "Victory Mon." ? "Victory Monument" : station.name} listings →
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes btsSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
