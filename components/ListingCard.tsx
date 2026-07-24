"use client";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { Bed, Bath, Maximize2, Building2 } from "lucide-react";
import type { Listing } from "@/lib/supabase";
import PhotoWatermark from "@/components/PhotoWatermark";
import SaveButton from "@/components/SaveButton";
import { useLang } from "@/lib/i18n";
import FreshnessBadge from "@/components/FreshnessBadge";
import Tilt from "@/components/Tilt";
import { listingPhotoAlt } from "@/lib/altText";

// Warm neutral blur-up shown while photos stream in — matches the site's
// linen/champagne palette so the load feels intentional rather than jarring.
const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F5F2EC"/><stop offset="100%" stop-color="#E8E0D2"/></linearGradient></defs><rect width="8" height="6" fill="url(#g)"/></svg>`);

export default function ListingCard({ listing, hero = false }: { listing: Listing; hero?: boolean }) {
  const { lang, t } = useLang();
  const photo = listing.photos?.[0] || "/placeholder.jpg";
  const displayName = listing.building_name || listing.title;
  // The zone column holds district-cluster strings ("Sukhumvit, Asok, Thonglor,
  // …"); show the most specific location instead: station + headline area.
  const rawZone = lang === "th" && listing.zone_th ? listing.zone_th : listing.zone;
  const headlineZone = rawZone?.split(",")[0]?.trim() || null;
  const locationParts = [listing.bts_station, headlineZone].filter(
    (part): part is string => Boolean(part)
  );
  // Drop a part that's contained in another ("Thong Lo" vs "Thong Lo BTS")
  // or an exact duplicate ("Ratchathewi · Ratchathewi").
  const displayZone = locationParts
    .filter((part, i) =>
      !locationParts.some((other, j) => {
        if (j === i) return false;
        const a = part.toLowerCase();
        const b = other.toLowerCase();
        return b.length > a.length ? b.includes(a) : a === b && j < i;
      })
    )
    .join(" · ") || rawZone;

  const isBoth = listing.listing_type === "both";
  const isRent = listing.listing_type === "rent";
  const isSale = listing.listing_type === "sale";

  const primaryPrice = isBoth || isSale
    ? listing.sale_price ? `฿${listing.sale_price.toLocaleString()}` : null
    : listing.rent_price ? `฿${listing.rent_price.toLocaleString()}${t("perMonth")}` : null;

  const secondaryPrice = isBoth && listing.rent_price
    ? `${t("or")} ฿${listing.rent_price.toLocaleString()}${t("perMonth")}`
    : null;

  const displayPrice = primaryPrice || t("priceOnRequest");

  function formatAvailableFrom(date: string | null): string {
    if (!date) return t("availableSoon");
    const d = new Date(date);
    return d.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { month: "long", year: "numeric" });
  }

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <Tilt className="h-full">
      <div className="glow-hover bg-white border border-[#E8E4DC] rounded-xl overflow-hidden flex flex-col h-full">

        {/* Photo */}
        <div
          className={`relative photo-grade ${hero ? "h-[380px]" : "h-[260px]"} flex-shrink-0 overflow-hidden`}
          onContextMenu={(e) => e.preventDefault()}
          style={{ viewTransitionName: `listing-photo-${listing.id}` }}
        >
          <PhotoWatermark>
            <Image
              src={photo}
              alt={listingPhotoAlt(listing)}
              fill
              priority={hero}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={hero ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </PhotoWatermark>

          {/* Top-left: status / featured / type badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {listing.status === "rented" ? (
              <>
                <span className="font-sans text-[10px] font-semibold px-2.5 py-1 bg-[#7B2020] text-white w-fit">
                  {t("rented")}
                </span>
                <span className="font-sans text-[9px] font-medium px-2.5 py-0.5 bg-black/60 text-white/90 backdrop-blur-sm w-fit">
                  {t("available")} {formatAvailableFrom(listing.available_from ?? null)}
                </span>
              </>
            ) : (
              <>
                {listing.featured && (
                  <span className="font-sans text-[10px] font-semibold px-2.5 py-1 bg-[#B8935A] text-white w-fit">
                    {t("featured")}
                  </span>
                )}
                <span className={`font-sans text-[10px] font-semibold px-2.5 py-1 w-fit ${
                  isSale ? "bg-[#0A0A0A] text-white"
                  : isRent ? "bg-[#1A3A2A] text-white"
                  : "bg-[#0A0A0A] text-white"
                }`}>
                  {isBoth ? t("forBoth") : isSale ? t("forSale") : t("forRent")}
                </span>
                <FreshnessBadge listing={listing} variant="card" />
              </>
            )}
          </div>

          {/* Top-right: save heart */}
          <div className="absolute top-3 right-3 z-10">
            <SaveButton
              listing={{
                id: listing.id,
                title: displayName,
                photo: listing.photos?.[0] ?? null,
                price: displayPrice,
                bts_station: listing.bts_station,
                type: listing.listing_type,
              }}
            />
          </div>

          {/* Bottom-right: BTS badge */}
          {listing.bts_station && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009B77] flex-shrink-0" />
              <span className="font-sans text-[10px] text-[#333]">
                {listing.bts_station}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-0 flex flex-col gap-2">
          <h3 className={`font-cormorant ${hero ? "text-[28px]" : "text-[22px]"} font-medium text-[#0A0A0A] leading-snug line-clamp-1`}>
            {displayName}
          </h3>

          <div>
            <p className="font-sans text-lg font-medium text-[#B8935A] leading-none">
              {displayPrice}
            </p>
            {secondaryPrice && (
              <p className="font-sans text-xs text-[#6B6863] mt-0.5">{secondaryPrice}</p>
            )}
          </div>

          <div className="flex items-center gap-3 text-[#6B6863]">
            <span className="flex items-center gap-1 font-sans text-xs">
              <Bed size={12} /> {listing.bedrooms === 0 ? t("studio") : `${listing.bedrooms}`}
            </span>
            <span className="flex items-center gap-1 font-sans text-xs">
              <Bath size={12} /> {listing.bathrooms}
            </span>
            {listing.size_sqm != null && (
              <span className="flex items-center gap-1 font-sans text-xs">
                <Maximize2 size={12} /> {listing.size_sqm} {t("sqm")}
              </span>
            )}
            {listing.floor != null && (
              <span className="flex items-center gap-1 font-sans text-xs" title={`Floor ${listing.floor}`}>
                <Building2 size={12} /> {listing.floor}F
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 mt-auto border-t border-[#E8E4DC] flex justify-between items-center">
          {displayZone && (
            <span className="font-sans text-[10px] tracking-wide text-[#6B6863] truncate mr-3">
              {displayZone}
            </span>
          )}
          <span className="font-sans text-[10px] tracking-[2px] uppercase text-[#B8935A] shrink-0 transition-all group-hover:tracking-[3px]">
            {t("viewProperty")}
          </span>
        </div>

      </div>
      </Tilt>
    </Link>
  );
}
