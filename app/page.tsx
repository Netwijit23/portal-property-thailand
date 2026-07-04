export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { unstable_noStore as noStore } from "next/cache";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import HotListingsSection from "@/components/HotListingsSection";
// import HeroBackground from "@/components/HeroBackground"; // slideshow option

import BTSMap from "@/components/BTSMap";
import StatsSection from "@/components/StatsSection";
import FloatingContact from "@/components/FloatingContact";
import { supabase, dbToListing } from "@/lib/supabase";
import type { Listing, DBListing } from "@/lib/supabase";
import type { HotBadge } from "@/components/HotListingCard";

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
    if (error || !data?.length) return getMockListings();
    return (data as DBListing[]).map(dbToListing);
  } catch {
    return getMockListings();
  }
}

function computeBadges(listings: Listing[]): HotBadge[] {
  const now = Date.now();

  // Average price per listing_type
  const rentPrices = listings.filter((l) => l.listing_type === "rent" && l.rent_price).map((l) => l.rent_price!);
  const salePrices = listings.filter((l) => l.listing_type === "sale" && l.sale_price).map((l) => l.sale_price!);
  const rentAvg = rentPrices.length ? rentPrices.reduce((a, b) => a + b, 0) / rentPrices.length : 0;
  const saleAvg = salePrices.length ? salePrices.reduce((a, b) => a + b, 0) / salePrices.length : 0;

  return listings.map((l): HotBadge => {
    const created = new Date(l.created_at).getTime();
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
    if (daysDiff < 7) return "New";

    if (l.listing_type === "rent" && l.rent_price && rentAvg > 0 && l.rent_price < rentAvg * 0.88) {
      return "Reduced";
    }
    if (l.listing_type === "sale" && l.sale_price && saleAvg > 0 && l.sale_price < saleAvg * 0.88) {
      return "Reduced";
    }

    return "Hot";
  });
}

function getMockListings(): Listing[] {
  return [
    {
      id: "1", title: "Modern High-Rise Condo with City Views", title_th: null, type: "condo",
      listing_type: "rent", zone: "Sukhumvit", building_name: "Ashton Asoke", bts_station: "Asoke",
      floor: 28, bedrooms: 2, bathrooms: 2, size_sqm: 65, sale_price: null, rent_price: 45000,
      description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
      agent_name: "Khun Somchai", agent_phone: "+66 81 234 5678", agent_line: "somchai.property",
      status: "available", created_at: new Date().toISOString(), featured: true,
    },
    {
      id: "2", title: "Spacious Townhouse in Thonglor", title_th: null, type: "house",
      listing_type: "sale", zone: "Thonglor", building_name: null, bts_station: "Thonglor",
      floor: null, bedrooms: 4, bathrooms: 3, size_sqm: 220, sale_price: 18500000, rent_price: null,
      description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
      agent_name: "Khun Priya", agent_phone: "+66 82 345 6789", agent_line: "priya.homes",
      status: "available", created_at: new Date().toISOString(),
    },
    {
      id: "3", title: "Cozy 1-Bedroom near Phrom Phong", title_th: null, type: "condo",
      listing_type: "rent", zone: "Sukhumvit 39", building_name: "The Lofts Ekkamai",
      bts_station: "Phrom Phong", floor: 12, bedrooms: 1, bathrooms: 1, size_sqm: 38,
      sale_price: null, rent_price: 22000, description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
      agent_name: "Khun Nit", agent_phone: "+66 83 456 7890", agent_line: "nit.bkk",
      status: "available", created_at: new Date().toISOString(),
    },
    {
      id: "4", title: "Luxury Penthouse on Sathorn", title_th: null, type: "condo",
      listing_type: "sale", zone: "Sathorn", building_name: "The Ritz-Carlton Residences",
      bts_station: "Chong Nonsi", floor: 42, bedrooms: 3, bathrooms: 4, size_sqm: 280,
      sale_price: 95000000, rent_price: null, description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
      agent_name: "Khun Wanchai", agent_phone: "+66 84 567 8901", agent_line: "wanchai.luxury",
      status: "available", created_at: new Date().toISOString(), featured: true,
    },
    {
      id: "5", title: "Garden Villa in Ekkamai", title_th: null, type: "house",
      listing_type: "rent", zone: "Ekkamai", building_name: null, bts_station: "Ekkamai",
      floor: null, bedrooms: 3, bathrooms: 3, size_sqm: 180, sale_price: null, rent_price: 75000,
      description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"],
      agent_name: "Khun Aom", agent_phone: "+66 85 678 9012", agent_line: "aom.ekkamai",
      status: "available", created_at: new Date().toISOString(),
    },
    {
      id: "6", title: "Studio Condo near Ari BTS", title_th: null, type: "condo",
      listing_type: "rent", zone: "Ari", building_name: "Rhythm Rangnam", bts_station: "Ari",
      floor: 8, bedrooms: 1, bathrooms: 1, size_sqm: 30, sale_price: null, rent_price: 15000,
      description: null, description_th: null,
      photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
      agent_name: "Khun Beam", agent_phone: "+66 86 789 0123", agent_line: "beam.ari",
      status: "available", created_at: new Date().toISOString(),
    },
  ];
}

export default async function HomePage() {
  const listings = await getHotListings();
  const badges = computeBadges(listings);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative w-full min-h-[640px] flex items-center justify-center"
          style={{
            height: "100vh",
            backgroundImage: "url('https://images.unsplash.com/photo-1582535200497-8d831d74d18b?w=1920&q=90')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Deep navy top-left, transparent centre, warm gold bottom */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(5,10,20,0.80) 0%, rgba(5,10,20,0.40) 40%, rgba(5,10,20,0.20) 60%, rgba(12,8,2,0.65) 100%)"
          }} />
          {/* Subtle gold radial glow from bottom-centre */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(184,147,90,0.22) 0%, transparent 70%)"
          }} />

          {/* Bottom fade to page background */}
          <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
            background: "linear-gradient(to bottom, transparent 0%, #FAFAF8 100%)"
          }} />

          {/* Hero content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span
                className="font-sans uppercase text-white"
                style={{ fontSize: 10, letterSpacing: "3px" }}
              >
                Bangkok Real Estate
              </span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>

            {/* H1 */}
            <h1
              className="font-cormorant font-light text-white leading-[1.05] mb-5"
              style={{ fontSize: "clamp(44px, 7vw, 82px)" }}
            >
              Bangkok&apos;s{" "}
              <em className="italic not-italic text-[#B8935A]">Finest</em>{" "}
              Properties
            </h1>

            {/* Subheading */}
            <p
              className="font-sans font-light text-white/70 max-w-[480px] text-center mb-10 leading-relaxed"
              style={{ fontSize: 15 }}
            >
              Explore condos, houses and apartments across Bangkok&apos;s most
              sought-after neighbourhoods
            </p>

            {/* Search module */}
            <HeroSearch />
          </div>
        </section>

        {/* ─── HOT LISTINGS ─────────────────────────────────────── */}
        <HotListingsSection listings={listings} badges={badges} />

        {/* ─── WHY US ───────────────────────────────────────────── */}
        <StatsSection />

        {/* ─── BTS ZONE GUIDE ───────────────────────────────────── */}
        <BTSMap />
      </main>
      <FloatingContact />
      <Footer />
    </>
  );
}
