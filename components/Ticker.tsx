"use client";
import type { Listing } from "@/lib/supabase";
import type { HotBadge } from "./HotListingCard";
import { formatHotPrice } from "./HotListingCard";

const BADGE_EMOJI: Record<HotBadge, string> = {
  Hot: "🔥",
  New: "✨",
  Reduced: "💸",
};

type Props = { listings: Listing[]; badges: HotBadge[] };

export default function Ticker({ listings, badges }: Props) {
  const items = listings.map((l, i) => ({
    badge: (badges[i] || "Hot") as HotBadge,
    name: l.title,
    price: formatHotPrice(l),
  }));

  // Double for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#0A0A0A] overflow-hidden py-3 border-y border-[#1A1917]">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-sans text-[11px] text-[#6B6963] px-8 shrink-0"
          >
            <span className="text-[#B8935A] font-medium">
              {BADGE_EMOJI[item.badge]} {item.badge} listing
            </span>
            <span className="text-[#3A3830]">—</span>
            <span>{item.name}</span>
            <span className="text-[#B8935A] mx-1">·</span>
            <span className="text-[#B8935A] font-medium">{item.price}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
