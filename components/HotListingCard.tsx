"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/supabase";
import PhotoWatermark from "@/components/PhotoWatermark";

export type HotBadge = "Hot" | "New" | "Reduced";

type Props = {
  listing: Listing;
  badge?: HotBadge;
  onEnquiry?: (listing: Listing) => void;
};


export function formatHotPrice(listing: Listing): { primary: string; secondary: string | null } {
  const isBoth = listing.listing_type === "both";

  const primary = isBoth || listing.listing_type === "sale"
    ? listing.sale_price ? `฿${listing.sale_price.toLocaleString()}` : null
    : listing.rent_price ? `฿${listing.rent_price.toLocaleString()}/mo` : null;

  const secondary = isBoth && listing.rent_price
    ? `or ฿${listing.rent_price.toLocaleString()}/mo`
    : null;

  return { primary: primary || "Price on request", secondary };
}

function formatAvailableFrom(date: string | null): string {
  if (!date) return "soon";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function HotListingCard(props: Props) {
  const listing = props.listing;
  const [saved, setSaved] = useState(false);
  const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";
  const { primary, secondary } = formatHotPrice(listing);
  const isBoth = listing.listing_type === "both";
  const isRent = listing.listing_type === "rent";

  return (
    <Link href={`/listings/${listing.id}`} className="shrink-0 w-[288px] bg-white border border-[#E8E4DC] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all duration-300 snap-start flex flex-col">

      {/* Photo */}
      <div className="relative h-[192px] flex-shrink-0" onContextMenu={(e) => e.preventDefault()}>
        <PhotoWatermark>
          <Image
            src={photo}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="288px"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </PhotoWatermark>

        {/* Top-left: status / type badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.status === "rented" ? (
            <>
              <span className="font-sans text-[10px] font-semibold px-2.5 py-1 bg-[#7B2020] text-white w-fit">
                Rented
              </span>
              <span className="font-sans text-[9px] font-medium px-2.5 py-0.5 bg-black/60 text-white/90 backdrop-blur-sm w-fit">
                Available {formatAvailableFrom(listing.available_from ?? null)}
              </span>
            </>
          ) : (
            <span className={`font-sans text-[10px] font-semibold px-2.5 py-1 w-fit ${
              isRent ? "bg-[#1A3A2A] text-white" : "bg-[#0A0A0A] text-white"
            }`}>
              {isBoth ? "For Sale · For Rent" : isRent ? "For Rent" : "For Sale"}
            </span>
          )}
        </div>

        {/* Top-right: save heart */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved((s) => !s); }}
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          <Heart size={14} fill={saved ? "#B8935A" : "none"} stroke={saved ? "#B8935A" : "#8A8680"} />
        </button>

        {/* Bottom-right: BTS badge */}
        {listing.bts_station && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009B77] flex-shrink-0" />
            <span className="font-sans text-[10px] text-[#333]">{listing.bts_station}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-[18px] pt-[14px] pb-0 flex flex-col gap-2">
        <p className="font-cormorant text-[22px] font-medium text-[#0A0A0A] leading-snug truncate">
          {listing.building_name || listing.title}
        </p>

        <div>
          <p className="font-sans text-lg font-medium text-[#B8935A] leading-none">{primary}</p>
          {secondary && <p className="font-sans text-xs text-[#8A8680] mt-0.5">{secondary}</p>}
        </div>

        <div className="flex items-center gap-2 font-sans text-[11px] text-[#8A8680]">
          <span>🛏 {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
          <span className="text-[#D8D4CC]">·</span>
          <span>🚿 {listing.bathrooms}</span>
          <span className="text-[#D8D4CC]">·</span>
          <span>📐 {listing.size_sqm} sqm</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#E8E4DC] px-[18px] py-3 flex justify-end">
        <span className="font-sans text-[10px] tracking-widest uppercase text-[#B8935A]">
          View →
        </span>
      </div>

    </Link>
  );
}
