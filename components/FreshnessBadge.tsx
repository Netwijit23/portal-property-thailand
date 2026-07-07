"use client";
import type { Listing } from "@/lib/supabase";
import { useLang } from "@/lib/i18n";

// Days since the admin last confirmed availability via the admin app's
// "Check Now" panel (availability_checked_at — stamped on every save, unlike
// updated_at which any edit touches); null when stale (>14 days) or never
// confirmed — badge hidden entirely in that case.
export function freshnessDays(listing: Pick<Listing, "status" | "availability_checked_at">): number | null {
  if (listing.status !== "available" || !listing.availability_checked_at) return null;
  const days = Math.floor((Date.now() - new Date(listing.availability_checked_at).getTime()) / 86_400_000);
  return days >= 0 && days <= 14 ? days : null;
}

const VARIANTS = {
  // Flat square pill on the standard listing card photo (matches its badges)
  card: "font-sans text-[9px] font-medium px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#1A3A2A] w-fit",
  // Frosted glass on the dark Featured Residences photo overlay
  glass: "font-sans text-[9px] font-medium tracking-wide px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 w-fit",
  // Soft green pill beside the For Rent / For Sale badges on the detail page
  detail: "font-sans text-xs font-medium px-3 py-1 rounded-full bg-[#EAF3ED] text-[#1A3A2A] w-fit",
} as const;

const DOT = {
  card: "bg-[#2E9E5B]",
  glass: "bg-[#4ADE80]",
  detail: "bg-[#2E9E5B]",
} as const;

export default function FreshnessBadge({
  listing,
  variant = "card",
}: {
  listing: Pick<Listing, "status" | "availability_checked_at">;
  variant?: keyof typeof VARIANTS;
}) {
  const { t } = useLang();
  const days = freshnessDays(listing);
  if (days === null) return null;

  return (
    <span className={`flex items-center gap-1.5 ${VARIANTS[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT[variant]}`} />
      {days === 0 ? t("confirmedToday") : t("confirmedDaysAgo", { n: days })}
    </span>
  );
}
