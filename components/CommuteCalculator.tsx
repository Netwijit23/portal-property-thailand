"use client";
import { useState } from "react";
import { TrainFront, Clock, ArrowRight } from "lucide-react";
import { estimateCommute, COMMUTE_DESTINATIONS } from "@/lib/btsGraph";

// Shown on a listing detail. Client picks where they commute to; we estimate
// BTS travel time from the unit's nearest station using the line graph.
export default function CommuteCalculator({ fromStation }: { fromStation: string | null }) {
  const [dest, setDest] = useState("");
  const result = dest ? estimateCommute(fromStation, dest) : null;

  if (!fromStation) return null; // no nearest station on record → nothing to compute

  return (
    <div className="glass glow-hover rounded-2xl p-5 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <TrainFront size={16} className="text-[#B8935A]" />
        <h3 className="font-cormorant text-[20px] text-[#0A0A0A]">Commute check</h3>
      </div>
      <p className="font-sans text-[12px] text-[#8A8680] mb-4">
        Estimated BTS travel time from <span className="font-medium text-[#0A0A0A]">{fromStation}</span>.
      </p>

      <label className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#8A8680] mb-2 block">
        Where do you commute to?
      </label>
      <select
        value={dest}
        onChange={(e) => setDest(e.target.value)}
        className="w-full font-sans text-[14px] text-[#0A0A0A] bg-white/70 border border-[#E8E4DC] rounded-xl px-4 py-3 outline-none focus:border-[#B8935A] transition-colors cursor-pointer"
      >
        <option value="">Select a destination…</option>
        {COMMUTE_DESTINATIONS.map((d) => (
          <option key={d.station} value={d.station}>{d.label}</option>
        ))}
      </select>

      {dest && (
        <div className="mt-4">
          {result ? (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3.5"
              style={{ background: "linear-gradient(135deg, rgba(184,147,90,0.12), rgba(184,147,90,0.04))", border: "1px solid rgba(184,147,90,0.25)" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-sans text-[12px] text-[#8A8680] truncate">{fromStation}</span>
                <ArrowRight size={13} className="text-[#B8935A] shrink-0" />
                <span className="font-sans text-[12px] text-[#0A0A0A] font-medium truncate">{dest}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-3">
                <Clock size={14} className="text-[#B8935A]" />
                <span className="font-cormorant text-[24px] font-medium text-[#0A0A0A] leading-none">~{result.minutes}</span>
                <span className="font-sans text-[12px] text-[#8A8680]">min</span>
              </div>
            </div>
          ) : (
            <p className="font-sans text-[12px] text-[#8A8680]">
              Not directly on the BTS network from here — ask us about the best route.
            </p>
          )}
          {result && (
            <p className="font-sans text-[11px] text-[#A8A29A] mt-2">
              {result.stops} stop{result.stops === 1 ? "" : "s"}
              {result.transfers > 0 ? ` · ${result.transfers} interchange at Siam` : " · no changes"} · walking time not included
            </p>
          )}
        </div>
      )}
    </div>
  );
}
