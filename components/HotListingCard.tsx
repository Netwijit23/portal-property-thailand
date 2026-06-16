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
  badge: HotBadge;
  onEnquiry: (listing: Listing) => void;
};

export function formatHotPrice(listing: Listing): string {
  if (listing.listing_type === "rent" && listing.rent_price) {
    return `฿${listing.rent_price.toLocaleString()}/mo`;
  }
  if (listing.listing_type === "sale" && listing.sale_price) {
    const m = listing.sale_price / 1_000_000;
    return `฿${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (listing.listing_type === "both") {
    if (listing.rent_price) return `฿${listing.rent_price.toLocaleString()}/mo`;
    if (listing.sale_price) {
      const m = listing.sale_price / 1_000_000;
      return `฿${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
    }
  }
  return "Price on request";
}

const BADGE_STYLES: Record<HotBadge, string> = {
  Hot: "bg-[#B8935A] text-white",
  New: "bg-[#0A0A0A] text-white",
  Reduced: "bg-[#7B2020] text-white",
};

function formatAvailableFrom(date: string | null): string {
  if (!date) return "soon";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function HotListingCard({ listing, badge, onEnquiry }: Props) {
  const [saved, setSaved] = useState(false);
  const photo =
    listing.photos?.[0] ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";
  const price = formatHotPrice(listing);

  return (
    <Link href={`/listings/${listing.id}`} className="shrink-0 w-[288px] bg-white border border-[#E8E4DC] rounded-[18px] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 snap-start block">
      {/* Image */}
      <div className="relative h-[192px]" onContextMenu={(e) => e.preventDefault()}>
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

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1.5">
            {listing.status === "rented" ? (
              <span className="font-sans text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#7B2020] text-white">
                Rented
              </span>
            ) : (
              <span className={`font-sans text-[10px] font-medium px-2.5 py-1 rounded-full ${BADGE_STYLES[badge]}`}>
                {badge}
              </span>
            )}
            <span
              className={`font-sans text-[10px] font-medium px-2.5 py-1 rounded-full ${
                listing.listing_type === "rent" ? "bg-[#1A3A2A] text-white" : "bg-[#0D1F3C] text-white"
              }`}
            >
              {listing.listing_type === "rent" ? "Rent" : "Sale"}
            </span>
          </div>
          {listing.status === "rented" && (
            <span className="font-sans text-[9px] font-medium px-2.5 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-sm w-fit">
              Available {formatAvailableFrom(listing.available_from ?? null)}
            </span>
          )}
        </div>

        {/* Save / heart */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          <Heart
            size={14}
            fill={saved ? "#B8935A" : "none"}
            stroke={saved ? "#B8935A" : "#8A8680"}
          />
        </button>

      </div>

      {/* Card body */}
      <div className="px-[18px] pt-[14px] pb-3">
        <p className="font-cormorant text-[22px] font-medium text-[#0A0A0A] leading-snug truncate">
          {listing.building_name || listing.title}
        </p>
        {listing.bts_station && (
          <p className="font-sans text-[11px] text-[#1A3A2A] font-medium mt-0.5 mb-2">
            BTS {listing.bts_station}
          </p>
        )}
        {!listing.bts_station && listing.zone && (
          <p className="font-sans text-[11px] text-[#8A8680] mt-0.5 mb-2">{listing.zone}</p>
        )}
        <p className="font-cormorant text-[21px] text-[#B8935A] leading-tight font-light mb-2">
          {price}
        </p>
        <div className="flex items-center gap-2 font-sans text-[11px] text-[#8A8680]">
          <span>🛏 {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
          <span className="text-[#D8D4CC]">·</span>
          <span>🚿 {listing.bathrooms}</span>
          <span className="text-[#D8D4CC]">·</span>
          <span>📐 {listing.size_sqm} sqm</span>
          {listing.floor && (
            <>
              <span className="text-[#D8D4CC]">·</span>
              <span>🏢 Fl.{listing.floor}</span>
            </>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="border-t border-[#F5F2EC] px-[18px] pb-4 pt-3">
        <button
          onClick={(e) => { e.preventDefault(); onEnquiry(listing); }}
          className="w-full flex items-center justify-center gap-2 font-sans text-[12px] font-medium py-2.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Send Enquiry
        </button>
      </div>
    </Link>
  );
}
