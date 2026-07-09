"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const zones = ["Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai", "Ari", "Ratchada", "Ladprao", "On Nut"];

function PriceRange({ current, updateParam }: {
  current: { type: string; priceMin: string; priceMax: string };
  updateParam: (k: string, v: string) => void;
}) {
  const [min, setMin] = useState(current.priceMin);
  const [max, setMax] = useState(current.priceMax);
  useEffect(() => { setMin(current.priceMin); setMax(current.priceMax); }, [current.priceMin, current.priceMax]);

  function commit(key: "priceMin" | "priceMax", raw: string) {
    const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
    updateParam(key, !isNaN(n) && n > 0 ? String(n) : "");
  }

  const isRent = current.type !== "sale";
  const inputCls = "w-full font-sans text-sm bg-[#F5F2EC] border border-[#E8E4DC] rounded-xl pl-7 pr-2 py-2.5 text-[#0A0A0A] placeholder-[#B0AAA2] focus:outline-none focus:border-[#B8935A]";

  return (
    <div>
      <label className="font-sans text-xs uppercase tracking-widest text-[#8A8680] mb-3 block">
        Price {isRent ? "(per month)" : ""}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-[#B8935A]">฿</span>
          <input
            inputMode="numeric"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={() => commit("priceMin", min)}
            onKeyDown={(e) => e.key === "Enter" && commit("priceMin", min)}
            placeholder={isRent ? "Min" : "Min"}
            className={inputCls}
          />
        </div>
        <span className="font-sans text-xs text-[#8A8680]">–</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-[#B8935A]">฿</span>
          <input
            inputMode="numeric"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={() => commit("priceMax", max)}
            onKeyDown={(e) => e.key === "Enter" && commit("priceMax", max)}
            placeholder={isRent ? "50,000" : "20M"}
            className={inputCls}
          />
        </div>
      </div>
      <p className="font-sans text-[10px] text-[#B0AAA2] mt-2">
        Listings without a published price are hidden when a budget is set.
      </p>
    </div>
  );
}

function FilterContent({ current, updateParam, clearAll }: {
  current: { type: string; zone: string; propType: string; bedrooms: string; priceMin: string; priceMax: string };
  updateParam: (k: string, v: string) => void;
  clearAll: () => void;
}) {
  const hasFilters = current.type || current.zone || current.propType || current.bedrooms || current.priceMin || current.priceMax;

  return (
    <div className="flex flex-col gap-6">
      {/* Rent / Sale */}
      <div>
        <label className="font-sans text-xs uppercase tracking-widest text-[#8A8680] mb-3 block">Listing type</label>
        <div className="flex gap-2">
          {[{ label: "All", value: "" }, { label: "Rent", value: "rent" }, { label: "Sale", value: "sale" }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("type", opt.value)}
              className={`flex-1 font-sans text-xs py-2 rounded-full border transition-colors ${
                current.type === opt.value
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-[#8A8680] border-[#E8E4DC] hover:border-[#0A0A0A]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone */}
      <div>
        <label className="font-sans text-xs uppercase tracking-widest text-[#8A8680] mb-3 block">Zone</label>
        <select
          value={current.zone}
          onChange={(e) => updateParam("zone", e.target.value)}
          className="w-full font-sans text-sm bg-[#F5F2EC] border border-[#E8E4DC] rounded-xl px-4 py-2.5 text-[#0A0A0A] focus:outline-none focus:border-[#B8935A] appearance-none"
        >
          <option value="">Any zone</option>
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      {/* Property type */}
      <div>
        <label className="font-sans text-xs uppercase tracking-widest text-[#8A8680] mb-3 block">Property type</label>
        <div className="flex gap-2">
          {[{ label: "All", value: "" }, { label: "Condo", value: "condo" }, { label: "House", value: "house" }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("propType", opt.value)}
              className={`flex-1 font-sans text-xs py-2 rounded-full border transition-colors ${
                current.propType === opt.value
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-[#8A8680] border-[#E8E4DC] hover:border-[#0A0A0A]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <PriceRange current={current} updateParam={updateParam} />

      {/* Bedrooms */}
      <div>
        <label className="font-sans text-xs uppercase tracking-widest text-[#8A8680] mb-3 block">Min bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {[{ label: "Any", value: "" }, { label: "1+", value: "1" }, { label: "2+", value: "2" }, { label: "3+", value: "3" }, { label: "4+", value: "4" }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("minBeds", opt.value)}
              className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
                current.bedrooms === opt.value
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-[#8A8680] border-[#E8E4DC] hover:border-[#0A0A0A]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="font-sans text-xs text-[#8A8680] hover:text-[#B8935A] transition-colors underline underline-offset-4 text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default function ListingsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value); else params.delete(key);
      // The sidebar's minimum-bedrooms filter supersedes the hero search's
      // exact-count selection — keeping both active would confuse results.
      if (key === "minBeds") params.delete("bedrooms");
      params.delete("page"); // any filter change goes back to page 1
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const clearAll = () => router.push(pathname);

  const current = {
    type: searchParams.get("type") || "",
    zone: searchParams.get("zone") || "",
    propType: searchParams.get("propType") || "",
    bedrooms: searchParams.get("minBeds") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
  };

  const activeCount = [current.type, current.zone, current.propType, current.bedrooms, current.priceMin || current.priceMax].filter(Boolean).length;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-white border border-[#E8E4DC] rounded-2xl p-6 sticky top-24">
        <h2 className="font-cormorant text-xl text-[#0A0A0A] mb-6">Filters</h2>
        <FilterContent current={current} updateParam={updateParam} clearAll={clearAll} />
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 font-sans text-sm font-medium px-4 py-2.5 rounded-full border border-[#E8E4DC] bg-white text-[#0A0A0A] hover:border-[#B8935A] transition-colors shadow-sm"
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-[#B8935A] text-white font-sans text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0EDE8]">
          <h2 className="font-cormorant text-xl text-[#0A0A0A]">Filters</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">
          <FilterContent
            current={current}
            updateParam={(k, v) => { updateParam(k, v); setDrawerOpen(false); }}
            clearAll={() => { clearAll(); setDrawerOpen(false); }}
          />
        </div>
        <div className="px-6 pb-8">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full font-sans text-sm font-medium py-3.5 rounded-xl bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
          >
            Show results
          </button>
        </div>
      </div>
    </>
  );
}
