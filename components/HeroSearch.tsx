"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronDown, X, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type LiveListing = {
  id: number | string;
  project: string | null;
  zone: string | null;
  bts_mrt: string | null;
  photos: string[] | null;
  rent_price_1m: number | null;
  sale_price: number | null;
  listing_type: string | null;
};

// ── Location suggestions ─────────────────────────────────────────────────────
// Station lists follow the real line topology (Siam is the interchange hub)
const LOCATION_GROUPS: { label: string; icon: string; items: string[] }[] = [
  {
    label: "BTS Sukhumvit Line",
    icon: "🟢",
    items: [
      "Mo Chit", "Saphan Khwai", "Ari", "Sanam Pao", "Victory Monument",
      "Phaya Thai", "Ratchathewi", "Siam", "Chit Lom", "Phloen Chit",
      "Nana", "Asok", "Phrom Phong", "Thong Lo", "Ekkamai",
      "Phra Khanong", "On Nut",
    ],
  },
  {
    label: "BTS Silom Line",
    icon: "🟢",
    items: [
      "Siam", "Ratchadamri", "Sala Daeng", "Chong Nonsi",
      "Saint Louis", "Surasak", "Saphan Taksin",
      "Krung Thon Buri", "Wongwian Yai",
    ],
  },
  {
    label: "Popular Areas",
    icon: "📍",
    items: [
      "Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai",
      "Ari", "Ladprao", "Chatuchak", "Ratchada", "Rama 9",
      "Ratchathewi", "Phahon Yothin", "Vibhavadi", "Bang Na",
      "Udomsuk", "Pattanakarn", "Bearing", "Srinakarin",
    ],
  },
];

// ── Budget presets ────────────────────────────────────────────────────────────
// Each preset carries the numeric bounds sent to /listings as priceMin/priceMax.
type BudgetPreset = { label: string; min?: number; max?: number };
const RENT_BUDGETS: BudgetPreset[] = [
  { label: "Any budget" },
  { label: "Under ฿15,000", max: 15000 },
  { label: "฿15,000 – 25,000", min: 15000, max: 25000 },
  { label: "฿25,000 – 40,000", min: 25000, max: 40000 },
  { label: "฿40,000 – 60,000", min: 40000, max: 60000 },
  { label: "฿60,000 – 100,000", min: 60000, max: 100000 },
  { label: "฿100,000+", min: 100000 },
];
const SALE_BUDGETS: BudgetPreset[] = [
  { label: "Any budget" },
  { label: "Under ฿3M", max: 3_000_000 },
  { label: "฿3M – 8M", min: 3_000_000, max: 8_000_000 },
  { label: "฿8M – 15M", min: 8_000_000, max: 15_000_000 },
  { label: "฿15M – 30M", min: 15_000_000, max: 30_000_000 },
  { label: "฿30M – 50M", min: 30_000_000, max: 50_000_000 },
  { label: "฿50M+", min: 50_000_000 },
];

// ── Bedroom options ───────────────────────────────────────────────────────────
const BED_OPTIONS = [
  { label: "Studio", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5+", value: 5 },
];

// Only types that exist in the data model — every listing maps to condo or
// house, so offering more here just produces guaranteed-empty result pages.
const PROP_TYPES = ["Any type", "Condo", "House"];

export default function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<"rent" | "sale">("rent");

  // Location
  const [location, setLocation] = useState("");
  const [showLoc, setShowLoc] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownMaxH, setDropdownMaxH] = useState(420);

  // When the dropdown opens, make sure there's actually room to show it: if the
  // search bar sits low on screen (as it does in the hero), scroll it up first
  // so the dropdown has space below instead of hanging off-screen unreachable.
  useEffect(() => {
    if (!showLoc) return;
    const el = locRef.current;
    if (!el) return;

    const MIN_SPACE = 260; // minimum comfortable dropdown height
    const NAV_OFFSET = 80; // don't tuck the input under the sticky navbar

    const rect = el.getBoundingClientRect();
    const availNow = window.innerHeight - rect.bottom - 20;
    if (availNow < MIN_SPACE) {
      const target = window.scrollY + rect.top - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    }

    const recalc = () => {
      const r = el.getBoundingClientRect();
      const avail = window.innerHeight - r.bottom - 20;
      setDropdownMaxH(Math.max(160, Math.min(avail, 460)));
    };
    recalc();
    // Recalculate a few times while the smooth-scroll settles, then on resize.
    const t1 = setTimeout(recalc, 120);
    const t2 = setTimeout(recalc, 320);
    const t3 = setTimeout(recalc, 550);
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, { passive: true });
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc);
    };
  }, [showLoc]);

  // Scroll containment inside the dropdown is handled purely by CSS
  // (overscroll-behavior: contain below) — no JS wheel interception, which
  // proved unreliable across trackpads/devices.

  // Condo / building names + live listings, loaded once on first focus
  const [buildings, setBuildings] = useState<string[]>([]);
  const [allListings, setAllListings] = useState<LiveListing[]>([]);
  const buildingsLoaded = useRef(false);

  async function loadBuildings() {
    if (buildingsLoaded.current) return;
    buildingsLoaded.current = true;
    const [{ data }, { data: directoryRows }] = await Promise.all([
      supabase
        .from("listings")
        .select("id, project, zone, bts_mrt, photos, rent_price_1m, sale_price, listing_type")
        .eq("is_published", true)
        .in("status", ["available", "reserved", "rented"])
        .order("created_at", { ascending: false }),
      supabase.from("condo_directory").select("name"),
    ]);
    const rows = (data ?? []) as LiveListing[];
    setAllListings(rows);
    // Live listings + the condo reference directory — so typing a real
    // Bangkok building surfaces a suggestion even with zero listings there.
    const fromListings = rows.map((r) => (r.project ?? "").trim());
    const fromDirectory = (directoryRows ?? []).map((r) => (r as { name: string }).name.trim());
    const unique = Array.from(new Set([...fromListings, ...fromDirectory].filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));
    setBuildings(unique);
  }

  // Bedrooms multi-select
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);

  // Budget
  const [budget, setBudget] = useState("Any budget");
  const [budgetCustom, setBudgetCustom] = useState("");
  const [showBudget, setShowBudget] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);

  // Property type
  const [propType, setPropType] = useState("Any type");

  const budgetOptions = tab === "rent" ? RENT_BUDGETS : SALE_BUDGETS;

  // Filtered suggestions
  const q = location.trim().toLowerCase();
  const filtered = LOCATION_GROUPS.map((g) => ({
    ...g,
    items: q ? g.items.filter((i) => i.toLowerCase().includes(q)) : g.items,
  })).filter((g) => g.items.length > 0);

  // Matching condo names — shown once the customer starts typing
  const matchedBuildings = q
    ? buildings.filter((b) => b.toLowerCase().includes(q)).slice(0, 6)
    : [];

  // Matching live listings (thumbnail + price) — instant results
  const matchedListings = q
    ? allListings
        .filter((l) =>
          (l.project ?? "").toLowerCase().includes(q) ||
          (l.zone ?? "").toLowerCase().includes(q) ||
          (l.bts_mrt ?? "").toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  function listingPrice(l: LiveListing): string {
    if (l.listing_type === "sale") return l.sale_price ? `฿${l.sale_price.toLocaleString()}` : "Price on request";
    if (l.rent_price_1m) return `฿${l.rent_price_1m.toLocaleString()}/mo`;
    if (l.sale_price) return `฿${l.sale_price.toLocaleString()}`;
    return "Price on request";
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLoc(false);
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) setShowBudget(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Reset budget presets when switching tab
  function switchTab(t: "rent" | "sale") {
    setTab(t);
    setBudget("Any budget");
    setBudgetCustom("");
  }

  function toggleBed(val: number) {
    setSelectedBeds((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );
  }

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("type", tab);
    // Free-text location maps to the `q` search param (unified with the results
    // search box), not `zone` — `zone` is reserved for the sidebar's fixed
    // dropdown so the term stays visible and individually removable.
    if (location.trim()) params.set("q", location.trim());
    if (propType !== "Any type") params.set("propType", propType.toLowerCase());
    if (selectedBeds.length > 0) params.set("bedrooms", selectedBeds.join(","));
    const custom = parseInt(budgetCustom.replace(/[^\d]/g, ""), 10);
    if (budgetCustom.trim() && !isNaN(custom) && custom > 0) {
      params.set("priceMax", String(custom));
    } else {
      const preset = budgetOptions.find((b) => b.label === budget);
      if (preset?.min) params.set("priceMin", String(preset.min));
      if (preset?.max) params.set("priceMax", String(preset.max));
    }
    router.push(`/listings?${params.toString()}`);
  }

  const budgetLabel = budgetCustom ? `฿${budgetCustom}` : budget;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Rent / Buy tabs */}
      <div className="flex gap-2 mb-4 justify-center">
        {(["rent", "sale"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`font-sans text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 ${
              tab === t
                ? "bg-[#B8935A] text-white shadow-md"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            }`}
          >
            {t === "rent" ? "Rent" : "Buy"}
          </button>
        ))}
      </div>

      {/* Search card */}
      <div className="bg-white rounded-[14px] shadow-[0_8px_48px_rgba(0,0,0,0.2)] p-3 flex flex-col gap-2">

        {/* ── Row 1: Location + Property type — stacks on phones so the
             location placeholder isn't squeezed down to a few characters ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Location with autocomplete */}
          <div ref={locRef} className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2 border border-[#E8E4DC] rounded-xl px-3.5 py-3 focus-within:border-[#B8935A] transition-colors bg-white">
              <Search size={15} className="text-[#8A8680] shrink-0" />
              <input
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLoc(true); loadBuildings(); }}
                onFocus={() => { setShowLoc(true); loadBuildings(); }}
                placeholder="Area, BTS station or condo..."
                className="font-sans text-sm text-[#0A0A0A] placeholder-[#C0BBB4] outline-none flex-1 min-w-0 bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { setShowLoc(false); handleSearch(); }
                  if (e.key === "Escape") setShowLoc(false);
                }}
              />
              {location && (
                <button
                  onClick={() => { setLocation(""); setShowLoc(false); }}
                  className="text-[#8A8680] hover:text-[#0A0A0A] shrink-0 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Location dropdown */}
            {showLoc && (filtered.length > 0 || matchedBuildings.length > 0 || matchedListings.length > 0) && (
              <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E8E4DC] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-y-auto overscroll-contain scrollbar-hide" style={{ WebkitOverflowScrolling: "touch", maxHeight: dropdownMaxH }}>
                {/* Condo name matches — shown first while typing */}
                {matchedBuildings.length > 0 && (
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] px-4 pt-3.5 pb-1.5 sticky top-0 bg-white border-b border-[#F5F2EC]">
                      🏢 Condos & Residences
                    </p>
                    <div className="py-1">
                      {matchedBuildings.map((b) => (
                        <button
                          key={b}
                          className="w-full flex items-center gap-2.5 text-left font-sans text-[13px] text-[#0A0A0A] px-4 py-2.5 hover:bg-[#F5F2EC] transition-colors"
                          onClick={() => { setLocation(b); setShowLoc(false); }}
                        >
                          <Building2 size={13} className="text-[#B8935A] shrink-0" />
                          <HighlightMatch text={b} query={q} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* BTS / area groups */}
                {filtered.map(({ label, icon, items }) => (
                  <div key={label}>
                    <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] px-4 pt-3.5 pb-1.5 sticky top-0 bg-white border-b border-[#F5F2EC]">
                      {icon} {label}
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-3 py-2">
                      {items.map((item) => (
                        <button
                          key={item}
                          className="font-sans text-[12px] text-[#0A0A0A] px-3 py-1.5 rounded-full bg-[#F5F2EC] hover:bg-[#B8935A] hover:text-white transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLocation(item);
                            setShowLoc(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Instant listing results with thumbnails — shown last */}
                {matchedListings.length > 0 && (
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] px-4 pt-3.5 pb-1.5 sticky top-0 bg-white border-b border-[#F5F2EC]">
                      Matching Properties
                    </p>
                    <div className="py-1">
                      {matchedListings.map((l) => (
                        <a
                          key={`live-${l.id}`}
                          href={`/listings/${l.id}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-[#F5F2EC] transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F0ECE4] shrink-0">
                            {l.photos?.[0] && (
                              <Image src={l.photos[0]} alt={`${l.project || l.zone || "Property"}, Bangkok`} fill className="object-cover" sizes="48px" draggable={false} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-sans text-[13px] font-medium text-[#0A0A0A] truncate">{l.project || l.zone || "Property"}</p>
                            <p className="font-sans text-[11px] text-[#8A8680] truncate">{[l.zone, l.bts_mrt].filter(Boolean).join(" · ")}</p>
                          </div>
                          <span className="font-sans text-[12px] font-medium text-[#B8935A] shrink-0">{listingPrice(l)}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Property type */}
          <select
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
            className="font-sans text-sm text-[#0A0A0A] border border-[#E8E4DC] rounded-xl px-3.5 py-3 outline-none bg-white cursor-pointer focus:border-[#B8935A] transition-colors w-full sm:w-auto sm:shrink-0"
          >
            {PROP_TYPES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* ── Row 2: Bedrooms + Budget + Search ── */}
        <div className="flex gap-2 items-stretch">
          {/* Bedroom multi-select */}
          <div className="flex items-center gap-1.5 border border-[#E8E4DC] rounded-xl px-3 py-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            <span className="font-sans text-[11px] text-[#8A8680] shrink-0 pr-1">Beds</span>
            <div className="w-px h-4 bg-[#E8E4DC] shrink-0" />
            {BED_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => toggleBed(value)}
                className={`shrink-0 font-sans text-[12px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 ${
                  selectedBeds.includes(value)
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#F5F2EC] text-[#4A4840] hover:bg-[#E8E4DC]"
                }`}
              >
                {label}
              </button>
            ))}
            {selectedBeds.length > 0 && (
              <button
                onClick={() => setSelectedBeds([])}
                className="shrink-0 text-[#8A8680] hover:text-[#0A0A0A] transition-colors ml-0.5"
                title="Clear bedrooms"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Budget combobox */}
          <div ref={budgetRef} className="relative shrink-0">
            <button
              onClick={() => setShowBudget((s) => !s)}
              className={`flex items-center gap-2 font-sans text-sm border rounded-xl px-4 py-3 bg-white cursor-pointer transition-colors whitespace-nowrap h-full ${
                showBudget || budget !== "Any budget" || budgetCustom
                  ? "border-[#B8935A] text-[#0A0A0A]"
                  : "border-[#E8E4DC] text-[#8A8680]"
              }`}
            >
              <span className="font-sans text-[13px]">
                {budgetLabel === "Any budget" ? "Budget" : budgetLabel}
              </span>
              <ChevronDown
                size={14}
                className={`text-[#8A8680] transition-transform duration-200 ${showBudget ? "rotate-180" : ""}`}
              />
            </button>

            {showBudget && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#E8E4DC] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 w-[220px]">
                {/* Custom input */}
                <div className="p-3 border-b border-[#F0EDE8]">
                  <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] mb-2">
                    Type a custom budget
                  </p>
                  <div className="flex items-center gap-1.5 border border-[#E8E4DC] rounded-lg px-3 py-2 focus-within:border-[#B8935A] transition-colors">
                    <span className="font-sans text-sm text-[#B8935A] font-medium">฿</span>
                    <input
                      type="text"
                      value={budgetCustom}
                      onChange={(e) => {
                        setBudgetCustom(e.target.value);
                        if (e.target.value) setBudget("Any budget");
                      }}
                      placeholder={tab === "rent" ? "e.g. 35,000" : "e.g. 12,000,000"}
                      className="font-sans text-sm outline-none flex-1 min-w-0 text-[#0A0A0A]"
                    />
                    {budgetCustom && (
                      <button onClick={() => setBudgetCustom("")} className="text-[#8A8680]">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset list */}
                <div className="py-1.5">
                  <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] px-4 pt-1 pb-1.5">
                    Or choose a range
                  </p>
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setBudget(opt.label);
                        setBudgetCustom("");
                        setShowBudget(false);
                      }}
                      className={`w-full text-left font-sans text-[13px] px-4 py-2 hover:bg-[#F5F2EC] transition-colors ${
                        budget === opt.label && !budgetCustom
                          ? "text-[#B8935A] font-medium"
                          : "text-[#0A0A0A]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="press font-sans text-sm font-medium px-5 py-3 rounded-[10px] bg-[#B8935A] text-white hover:bg-[#a07d4a] transition-colors whitespace-nowrap shrink-0"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

// Bolds the typed part of a condo name inside the suggestion row
function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1 || !query) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}
