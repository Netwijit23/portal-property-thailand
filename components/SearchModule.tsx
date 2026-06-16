"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const zones = ["Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai", "Ari", "Ratchada", "Ladprao", "On Nut", "Bearing"];
const types = ["Condo", "House", "Townhouse"];
const rentBudgets = ["Under ฿15,000", "฿15,000 – ฿30,000", "฿30,000 – ฿60,000", "฿60,000 – ฿100,000", "฿100,000+"];
const saleBudgets = ["Under ฿3M", "฿3M – ฿8M", "฿8M – ฿20M", "฿20M – ฿50M", "฿50M+"];

export default function SearchModule() {
  const router = useRouter();
  const [tab, setTab] = useState<"rent" | "buy">("rent");
  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("type", tab === "rent" ? "rent" : "sale");
    if (zone) params.set("zone", zone);
    if (type) params.set("propType", type.toLowerCase());
    if (budget) params.set("budget", budget);
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <div className="bg-[#0A0A0A] rounded-[24px] p-2 shadow-2xl">
      {/* Tabs */}
      <div className="flex gap-1 p-1 mb-0">
        {(["rent", "buy"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setBudget(""); }}
            className={`flex-1 font-sans text-sm font-medium py-2.5 rounded-[16px] transition-colors capitalize ${
              tab === t ? "bg-[#B8935A] text-white" : "text-[#8A8680] hover:text-white"
            }`}
          >
            {t === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-2 p-2">
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="flex-1 bg-[#1a1a1a] text-[#FAFAF8] font-sans text-sm px-4 py-3.5 rounded-[14px] border border-[#2a2a2a] focus:outline-none focus:border-[#B8935A] appearance-none"
        >
          <option value="">Any location</option>
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex-1 bg-[#1a1a1a] text-[#FAFAF8] font-sans text-sm px-4 py-3.5 rounded-[14px] border border-[#2a2a2a] focus:outline-none focus:border-[#B8935A] appearance-none"
        >
          <option value="">Property type</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="flex-1 bg-[#1a1a1a] text-[#FAFAF8] font-sans text-sm px-4 py-3.5 rounded-[14px] border border-[#2a2a2a] focus:outline-none focus:border-[#B8935A] appearance-none"
        >
          <option value="">Budget</option>
          {(tab === "rent" ? rentBudgets : saleBudgets).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-[#B8935A] hover:bg-[#a07d4a] text-white font-sans text-sm font-medium px-8 py-3.5 rounded-[14px] transition-colors whitespace-nowrap"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </div>
  );
}
