export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { buildMetadata } from "@/lib/seo";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicHero from "@/components/CinematicHero";
import StickySearch from "@/components/StickySearch";
import HotListingsSection from "@/components/HotListingsSection";
// import HeroBackground from "@/components/HeroBackground"; // slideshow option

import BTSMap from "@/components/BTSMap";
import RecentlyViewed from "@/components/RecentlyViewed";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RentVsBuyCalculator from "@/components/RentVsBuyCalculator";
import { supabase, dbToListing } from "@/lib/supabase";
import type { Listing, DBListing } from "@/lib/supabase";
import type { HotBadge } from "@/components/HotListingCard";

export const metadata: Metadata = buildMetadata({
  title: "Portal Property Thailand — Bangkok Condos & Houses for Rent and Sale",
  description:
    "Find condos and houses for rent and sale along Bangkok's BTS Skytrain corridor — Sukhumvit, Thonglor, Silom and more. Book a viewing today.",
  path: "/",
});

async function getHotListings(): Promise<Listing[]> {
  noStore();
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .in("status", ["available", "rented"])
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error || !data?.length) return [];
    return (data as DBListing[]).map(dbToListing);
  } catch {
    return [];
  }
}

function computeBadges(listings: Listing[]): HotBadge[] {
  const now = Date.now();

  // Only "New" (genuinely recent) and "Hot" are derivable from data we have.
  // The old "Reduced" badge compared a listing against the average of a handful
  // of other recent listings — not an actual price cut — which is misleading
  // (and a consumer-claims risk). Removed until there's a real prior-price
  // field to drive it from (see MIGRATION_NOTES.md).
  return listings.map((l): HotBadge => {
    const created = new Date(l.created_at).getTime();
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
    return daysDiff < 7 ? "New" : "Hot";
  });
}

// NOTE: a hardcoded getMockListings() fallback used to live here and was
// returned whenever the Supabase query errored or came back empty — which
// meant a transient DB hiccup could show real visitors a fake agent name
// and phone number. Removed in favour of an honest empty state (see
// HotListingsSection gating below); if you want local dev fixtures back,
// pull them from git history rather than reintroducing a prod fallback.

export default async function HomePage() {
  const listings = await getHotListings();
  const badges = computeBadges(listings);

  return (
    <>
      <Navbar />
      <StickySearch />
      <main>
        {/* ─── HERO ─────────────────────────────────────────────── */}
        <CinematicHero />

        {/* ─── HOT LISTINGS ─────────────────────────────────────── */}
        {/* Only render when we actually have live listings — an empty
            Supabase result (error or genuinely zero rows) now just skips
            this section instead of falling back to fake data. */}
        {listings.length > 0 && <HotListingsSection listings={listings} badges={badges} />}

        {/* ─── RECENTLY VIEWED (renders only when the visitor has
             browsing history — reads pp_recently_viewed locally) ── */}
        <div className="max-w-7xl mx-auto px-6">
          <RecentlyViewed />
        </div>

        {/* ─── WHY US ───────────────────────────────────────────── */}
        <StatsSection />

        {/* ─── CLIENT REVIEWS ───────────────────────────────────── */}
        <TestimonialsSection />

        {/* ─── RENT VS BUY CALCULATOR ───────────────────────────── */}
        <RentVsBuyCalculator />

        {/* ─── BTS ZONE GUIDE ───────────────────────────────────── */}
        <BTSMap />
      </main>
      <Footer />
    </>
  );
}
