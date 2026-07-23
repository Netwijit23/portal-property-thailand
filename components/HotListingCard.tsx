"use client";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize2 } from "lucide-react";
import type { Listing } from "@/lib/supabase";
import PhotoWatermark from "@/components/PhotoWatermark";
import SaveButton from "@/components/SaveButton";
import FreshnessBadge from "@/components/FreshnessBadge";
import { listingPhotoAlt } from "@/lib/altText";

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
  const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";
  const { primary, secondary } = formatHotPrice(listing);
  const isBoth = listing.listing_type === "both";
  const isRent = listing.listing_type === "rent";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group shrink-0 w-[300px] snap-start block"
    >
      {/* Full-bleed photo with overlay */}
      <div
        className="relative photo-grade h-[400px] rounded-2xl overflow-hidden"
        onContextMenu={(e) => e.preventDefault()}
      >
        <PhotoWatermark>
          <Image
            src={photo}
            alt={listingPhotoAlt(listing)}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="300px"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </PhotoWatermark>

        {/* Bottom gradient for text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.35) 55%, transparent 100%)" }}
        />

        {/* Top-left: status / type badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {listing.status === "rented" ? (
            <>
              <span className="font-sans text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full bg-[#7B2020] text-white w-fit">
                Rented
              </span>
              <span className="font-sans text-[9px] font-medium px-3 py-1 rounded-full bg-black/50 text-white/90 backdrop-blur-sm w-fit">
                Available {formatAvailableFrom(listing.available_from ?? null)}
              </span>
            </>
          ) : (
            <>
              <span className="font-sans text-[10px] font-medium tracking-[1.5px] uppercase px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 w-fit">
                {isBoth ? "Rent · Sale" : isRent ? "For Rent" : "For Sale"}
              </span>
              <FreshnessBadge listing={listing} variant="glass" />
            </>
          )}
        </div>

        {/* Top-right: save heart */}
        <div className="absolute top-4 right-4">
          <SaveButton
            listing={{
              id: listing.id,
              title: listing.building_name || listing.title,
              photo: listing.photos?.[0] ?? null,
              price: primary,
              bts_station: listing.bts_station,
              type: listing.listing_type,
            }}
          />
        </div>

        {/* Bottom overlay: name, price, specs */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          {listing.bts_station && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              <span className="font-sans text-[10px] tracking-[1.5px] uppercase text-white/80">
                BTS {listing.bts_station}
              </span>
            </div>
          )}

          <p className="font-cormorant text-[24px] font-medium text-white leading-tight mb-1 line-clamp-1">
            {listing.building_name || listing.title}
          </p>

          <p className="font-sans text-[17px] font-medium text-[#E5C795] leading-tight">
            {primary}
            {secondary && (
              <span className="font-sans text-xs font-normal text-white/70 ml-2">{secondary}</span>
            )}
          </p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/15 text-white/85">
            <span className="flex items-center gap-1.5 font-sans text-[11px]">
              <Bed size={13} strokeWidth={1.5} /> {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
            </span>
            <span className="flex items-center gap-1.5 font-sans text-[11px]">
              <Bath size={13} strokeWidth={1.5} /> {listing.bathrooms}
            </span>
            <span className="flex items-center gap-1.5 font-sans text-[11px]">
              <Maximize2 size={13} strokeWidth={1.5} /> {listing.size_sqm} sqm
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
