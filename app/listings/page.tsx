export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { unstable_noStore as noStore } from "next/cache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import ListingsFilters from "@/components/ListingsFilters";
import Reveal from "@/components/Reveal";
import { supabase, dbToListing } from "@/lib/supabase";
import type { Listing, DBListing } from "@/lib/supabase";

// Mock data preserved for local development — not used in production
/* const ALL_MOCK: Listing[] = [
  {
    id: "1", title: "Modern High-Rise Condo with City Views", title_th: null, type: "condo", listing_type: "rent",
    zone: "Sukhumvit", building_name: "Ashton Asoke", bts_station: "Asoke", floor: 28,
    bedrooms: 2, bathrooms: 2, size_sqm: 65, sale_price: null, rent_price: 45000,
    description: "Stunning city views from the 28th floor.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
    agent_name: "Khun Somchai", agent_phone: "+66 81 234 5678", agent_line: "somchai.property",
    status: "available", created_at: new Date().toISOString(), featured: true,
  },
  {
    id: "2", title: "Spacious Townhouse in Thonglor", title_th: null, type: "house", listing_type: "sale",
    zone: "Thonglor", building_name: null, bts_station: "Thonglor", floor: null,
    bedrooms: 4, bathrooms: 3, size_sqm: 220, sale_price: 18500000, rent_price: null,
    description: "Elegant townhouse steps from Thonglor BTS.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    agent_name: "Khun Priya", agent_phone: "+66 82 345 6789", agent_line: "priya.homes",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "3", title: "Cozy 1-Bedroom near Phrom Phong", title_th: null, type: "condo", listing_type: "rent",
    zone: "Sukhumvit 39", building_name: "The Lofts Ekkamai", bts_station: "Phrom Phong", floor: 12,
    bedrooms: 1, bathrooms: 1, size_sqm: 38, sale_price: null, rent_price: 22000,
    description: "Beautifully furnished studio in a boutique building.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    agent_name: "Khun Nit", agent_phone: "+66 83 456 7890", agent_line: "nit.bkk",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "4", title: "Luxury Penthouse on Sathorn", title_th: null, type: "condo", listing_type: "sale",
    zone: "Sathorn", building_name: "The Ritz-Carlton Residences", bts_station: "Chong Nonsi", floor: 42,
    bedrooms: 3, bathrooms: 4, size_sqm: 280, sale_price: 95000000, rent_price: null,
    description: "Unrivalled panoramic views of the city skyline.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    agent_name: "Khun Wanchai", agent_phone: "+66 84 567 8901", agent_line: "wanchai.luxury",
    status: "available", created_at: new Date().toISOString(), featured: true,
  },
  {
    id: "5", title: "Garden Villa in Ekkamai", title_th: null, type: "house", listing_type: "rent",
    zone: "Ekkamai", building_name: null, bts_station: "Ekkamai", floor: null,
    bedrooms: 3, bathrooms: 3, size_sqm: 180, sale_price: null, rent_price: 75000,
    description: "Private tropical garden with pool.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"],
    agent_name: "Khun Aom", agent_phone: "+66 85 678 9012", agent_line: "aom.ekkamai",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "6", title: "Studio Condo near Ari BTS", title_th: null, type: "condo", listing_type: "rent",
    zone: "Ari", building_name: "Rhythm Rangnam", bts_station: "Ari", floor: 8,
    bedrooms: 1, bathrooms: 1, size_sqm: 30, sale_price: null, rent_price: 15000,
    description: "Smart studio in the heart of Ari neighborhood.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
    agent_name: "Khun Beam", agent_phone: "+66 86 789 0123", agent_line: "beam.ari",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "7", title: "3-Bed Corner Unit in Silom", title_th: null, type: "condo", listing_type: "sale",
    zone: "Silom", building_name: "State Tower", bts_station: "Surasak", floor: 22,
    bedrooms: 3, bathrooms: 2, size_sqm: 120, sale_price: 12800000, rent_price: null,
    description: "Rare corner unit with panoramic river views.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80"],
    agent_name: "Khun Toon", agent_phone: "+66 87 890 1234", agent_line: "toon.silom",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "8", title: "Family Home in Ladprao", title_th: null, type: "house", listing_type: "rent",
    zone: "Ladprao", building_name: null, bts_station: "Lat Phrao", floor: null,
    bedrooms: 5, bathrooms: 4, size_sqm: 350, sale_price: null, rent_price: 95000,
    description: "Spacious family home with large garden.", description_th: null,
    photos: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"],
    agent_name: "Khun Pan", agent_phone: "+66 88 901 2345", agent_line: "pan.homes",
    status: "available", created_at: new Date().toISOString(),
  },
]; */

async function getListings(): Promise<Listing[]> {
  noStore();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["available", "reserved", "rented"])
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as DBListing[]).map(dbToListing);
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; zone?: string; propType?: string; bedrooms?: string }>;
}) {
  const params = await searchParams;
  const listings = await getListings();

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Browse</span>
            </div>
            <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A]">
              All Properties
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <ListingsFilters />
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <ListingsGrid listings={listings} initialParams={params} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ListingsGrid({
  listings,
  initialParams,
}: {
  listings: Listing[];
  initialParams: { type?: string; zone?: string; propType?: string; bedrooms?: string };
}) {
  let filtered = listings;
  if (initialParams.type) {
    filtered = filtered.filter((l) =>
      l.listing_type === initialParams.type || l.listing_type === "both"
    );
  }
  if (initialParams.zone) {
    const q = initialParams.zone.toLowerCase();
    filtered = filtered.filter((l) =>
      l.zone?.toLowerCase().includes(q) ||
      l.zone_th?.toLowerCase().includes(q) ||
      l.title?.toLowerCase().includes(q) ||
      l.building_name?.toLowerCase().includes(q)
    );
  }
  if (initialParams.propType) filtered = filtered.filter((l) => l.type === initialParams.propType);
  if (initialParams.bedrooms) {
    const beds = initialParams.bedrooms.split(",").map(Number).filter((n) => !isNaN(n));
    filtered = filtered.filter((l) =>
      beds.some((b) => (b >= 5 ? l.bedrooms >= 5 : l.bedrooms === b))
    );
  }

  if (!filtered.length) {
    const noResults = listings.length > 0;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-cormorant text-3xl text-[#8A8680] mb-3">
          {noResults ? "No properties match your filters" : "No properties available"}
        </p>
        <p className="font-sans text-sm text-[#8A8680]">
          {noResults ? "Try adjusting your filters" : "Check back soon — new listings are added regularly"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-sans text-sm text-[#8A8680] mb-6">{filtered.length} properties</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((listing, i) => (
          <Reveal key={listing.id} delay={(i % 3) * 80}>
            <ListingCard listing={listing} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
