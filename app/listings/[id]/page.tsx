import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import PhotoGallery from "@/components/PhotoGallery";
import LeadForm from "@/components/LeadForm";
import ShareButton from "@/components/ShareButton";
import NeighbourhoodSection from "@/components/NeighbourhoodSection";
import RecentlyViewed from "@/components/RecentlyViewed";
import ListingTracker from "@/components/ListingTracker";
import { supabase, dbToListing } from "@/lib/supabase";
import type { Listing, DBListing } from "@/lib/supabase";
import { Bed, Bath, Maximize2, MapPin, Building2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import type { Metadata } from "next";
import AdminEditButton from "@/components/AdminEditButton";
import StickyEnquireBar from "@/components/StickyEnquireBar";
import ChatButtons from "@/components/ChatButtons";
import { T, BiText } from "@/lib/i18n";

// Mock data preserved for local development — not used in production
/* const MOCK_LISTINGS: Listing[] = [
  {
    id: "1", title: "Modern High-Rise Condo with City Views", title_th: null, type: "condo", listing_type: "rent",
    zone: "Sukhumvit", building_name: "Ashton Asoke", bts_station: "Asoke", floor: 28,
    bedrooms: 2, bathrooms: 2, size_sqm: 65, sale_price: null, rent_price: 45000,
    description: "This stunning 2-bedroom unit on the 28th floor of Ashton Asoke offers sweeping panoramic views across the Bangkok skyline. Fully furnished with premium fittings, it features an open-plan living area flooded with natural light, a modern kitchen with European appliances, and two spacious bedrooms. Building amenities include an infinity pool, fitness centre, and 24-hour concierge.",
    description_th: null,
    photos: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    agent_name: "Khun Somchai", agent_phone: "+66 81 234 5678", agent_line: "somchai.property",
    status: "available", created_at: new Date().toISOString(), featured: true,
  },
  {
    id: "2", title: "Spacious Townhouse in Thonglor", title_th: null, type: "house", listing_type: "sale",
    zone: "Thonglor", building_name: null, bts_station: "Thonglor", floor: null,
    bedrooms: 4, bathrooms: 3, size_sqm: 220, sale_price: 18500000, rent_price: null,
    description: "A rare 4-bedroom townhouse in the heart of Thonglor. Recently renovated with warm oak finishes and a private rooftop terrace, this is the perfect family home in one of Bangkok's most sought-after neighbourhoods. Walking distance to top restaurants, cafés, and Thonglor BTS.",
    description_th: null,
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"],
    agent_name: "Khun Priya", agent_phone: "+66 82 345 6789", agent_line: "priya.homes",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "3", title: "Cozy 1-Bedroom near Phrom Phong", title_th: null, type: "condo", listing_type: "rent",
    zone: "Sukhumvit 39", building_name: "The Lofts Ekkamai", bts_station: "Phrom Phong", floor: 12,
    bedrooms: 1, bathrooms: 1, size_sqm: 38, sale_price: null, rent_price: 22000,
    description: "Charming 1-bedroom unit in a boutique low-rise building on Sukhumvit 39. Fully furnished with high ceilings and a private balcony overlooking lush greenery. Close to Emporium, EmQuartier, and Phrom Phong BTS.",
    description_th: null,
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"],
    agent_name: "Khun Nit", agent_phone: "+66 83 456 7890", agent_line: "nit.bkk",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "4", title: "Luxury Penthouse on Sathorn", title_th: null, type: "condo", listing_type: "sale",
    zone: "Sathorn", building_name: "The Ritz-Carlton Residences", bts_station: "Chong Nonsi", floor: 42,
    bedrooms: 3, bathrooms: 4, size_sqm: 280, sale_price: 95000000, rent_price: null,
    description: "The pinnacle of luxury living in Bangkok. This 3-bedroom penthouse on the 42nd floor offers unparalleled 270-degree views of the city, Chao Phraya River, and Lumpini Park. Featuring custom Italian interiors, private elevator access, and an expansive wraparound terrace.",
    description_th: null,
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"],
    agent_name: "Khun Wanchai", agent_phone: "+66 84 567 8901", agent_line: "wanchai.luxury",
    status: "available", created_at: new Date().toISOString(), featured: true,
  },
  {
    id: "5", title: "Garden Villa in Ekkamai", title_th: null, type: "house", listing_type: "rent",
    zone: "Ekkamai", building_name: null, bts_station: "Ekkamai", floor: null,
    bedrooms: 3, bathrooms: 3, size_sqm: 180, sale_price: null, rent_price: 75000,
    description: "A beautifully maintained 3-bedroom villa with a private tropical garden and plunge pool. Located on a quiet soi in Ekkamai, this property feels like a private retreat within the city.",
    description_th: null,
    photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"],
    agent_name: "Khun Aom", agent_phone: "+66 85 678 9012", agent_line: "aom.ekkamai",
    status: "available", created_at: new Date().toISOString(),
  },
  {
    id: "6", title: "Studio Condo near Ari BTS", title_th: null, type: "condo", listing_type: "rent",
    zone: "Ari", building_name: "Rhythm Rangnam", bts_station: "Ari", floor: 8,
    bedrooms: 1, bathrooms: 1, size_sqm: 30, sale_price: null, rent_price: 15000,
    description: "Smart and efficiently designed studio in the trendy Ari neighbourhood. All furniture and appliances included. Steps from the BTS, cafés, farmers market, and weekend brunch spots.",
    description_th: null,
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"],
    agent_name: "Khun Beam", agent_phone: "+66 86 789 0123", agent_line: "beam.ari",
    status: "available", created_at: new Date().toISOString(),
  },
]; */

// cache() dedupes the fetch between generateMetadata and the page render
const getListing = cache(async (id: string): Promise<Listing | null> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  if (error || !data) return null;
  return dbToListing(data as DBListing);
});

async function getSimilar(listing: Listing): Promise<Listing[]> {
  const similarTypes = listing.listing_type === "both"
    ? ["rent", "sale", "both"]
    : [listing.listing_type, "both"];
  const { data } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["available", "reserved", "rented"])
    .in("listing_type", similarTypes)
    .eq("is_published", true)
    .neq("id", listing.id)
    .limit(3);
  return data ? (data as DBListing[]).map(dbToListing) : [];
}

async function lookupBts(listing: Listing): Promise<string | null> {
  if (listing.bts_station) return listing.bts_station;
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/lookup-bts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ building_name: listing.building_name, zone: listing.zone }),
    });
    const json = await res.json();
    return json.bts || null;
  } catch {
    return null;
  }
}

async function getDescription(listing: Listing): Promise<string | null> {
  if (listing.description) return listing.description;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/generate-description`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        building_name: listing.building_name,
        zone: listing.zone,
        bts_station: listing.bts_station,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        size_sqm: listing.size_sqm,
        floor: listing.floor,
        listing_type: listing.listing_type,
        type: listing.type,
      }),
    });
    const json = await res.json();
    return json.description || null;
  } catch {
    return null;
  }
}

function formatPrice(listing: Listing) {
  if (listing.listing_type === "rent" && listing.rent_price) return `฿${listing.rent_price.toLocaleString()} / month`;
  if (listing.listing_type === "sale" && listing.sale_price) return `฿${listing.sale_price.toLocaleString()}`;
  if (listing.listing_type === "both") {
    if (listing.rent_price && listing.sale_price) {
      return `฿${listing.rent_price.toLocaleString()} / month  ·  ฿${listing.sale_price.toLocaleString()} to buy`;
    }
    if (listing.rent_price) return `฿${listing.rent_price.toLocaleString()} / month`;
    if (listing.sale_price) return `฿${listing.sale_price.toLocaleString()}`;
  }
  return "Price on request";
}

// Runs before the response starts streaming, so a missing listing returns a
// real 404 status (the in-render notFound() below fires after the 200 shell
// has already been sent).
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const displayTitle = listing.type === "condo" && listing.building_name
    ? listing.building_name
    : listing.title;
  const price = formatPrice(listing);
  const title = `${displayTitle} — ${price}`;
  const bedrooms = listing.bedrooms ? `${listing.bedrooms}-bedroom` : "Studio";
  const description = (
    listing.description ||
    `${bedrooms} ${listing.type} for ${listing.listing_type === "both" ? "rent or sale" : listing.listing_type}${listing.zone ? ` in ${listing.zone}` : " in Bangkok"}${listing.bts_station ? `, near BTS ${listing.bts_station}` : ""}. ${listing.size_sqm} sqm. ${price}.`
  ).slice(0, 300);
  const image = listing.photos?.[0];

  return {
    title: `${title} | Portal Property Thailand`,
    description,
    alternates: { canonical: `/listings/${listing.id}` },
    openGraph: {
      title,
      description,
      url: `/listings/${listing.id}`,
      siteName: "Portal Property Thailand",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const [similar, description, btsStation] = await Promise.all([
    getSimilar(listing),
    getDescription(listing),
    lookupBts(listing),
  ]);
  const resolvedListing = { ...listing, bts_station: btsStation };

  const photos = listing.photos?.length ? listing.photos : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"];
  const price = formatPrice(listing);

  const displayTitle = listing.type === "condo" && listing.building_name
    ? listing.building_name
    : listing.title;
  const displaySubtitle = listing.type === "condo" && listing.building_name
    ? listing.title
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const listingUrl = `${siteUrl}/listings/${listing.id}`;

  // Structured data for search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: displayTitle,
    url: listingUrl,
    ...(photos.length ? { image: photos } : {}),
    ...(description ? { description } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      ...(listing.rent_price || listing.sale_price
        ? { price: listing.rent_price ?? listing.sale_price }
        : {}),
      availability: listing.status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Suspense fallback={null}>
        <AdminEditButton listingId={listing.id} />
      </Suspense>
      <StickyEnquireBar title={displayTitle} price={price} />
      <ListingTracker listing={{
        id: listing.id,
        title: displayTitle,
        photo: photos[0] || null,
        price,
        bts_station: resolvedListing.bts_station,
      }} />
      <main className="pt-16 bg-[#FAFAF8]">
        <PhotoGallery photos={photos} title={displayTitle} />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main */}
            <div className="flex-1">
              {/* Type badges + share */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-sans text-xs font-medium px-3 py-1 rounded-full ${
                    listing.listing_type === "rent" ? "bg-[#1A3A2A] text-white" :
                    listing.listing_type === "both" ? "bg-[#1A3A2A] text-white" : "bg-[#0A0A0A] text-white"
                  }`}>
                    {listing.listing_type === "rent" ? <T k="forRent" /> :
                     listing.listing_type === "both" ? <T k="forRentAndSale" /> : <T k="forSale" />}
                  </span>
                  <span className="font-sans text-xs text-[#8A8680] capitalize">{listing.type}</span>
                  {listing.status === "rented" && (
                    <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full bg-[#7B2020] text-white">
                      Rented
                    </span>
                  )}
                </div>
                <ShareButton title={displayTitle} url={listingUrl} />
              </div>

              {/* Rented availability banner */}
              {listing.status === "rented" && (
                <div className="bg-[#FDF2F2] border border-[#F0C0C0] rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
                  <span className="text-2xl">🗓</span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#7B2020]">Currently rented</p>
                    <p className="font-sans text-sm text-[#8A8680]">
                      Available from{" "}
                      <span className="font-semibold text-[#0A0A0A]">
                        {listing.available_from
                          ? new Date(listing.available_from).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
                          : "date TBC"}
                      </span>
                      {" "}— join the waitlist below
                    </p>
                  </div>
                </div>
              )}

              <h1 className="font-cormorant font-light text-3xl md:text-5xl text-[#0A0A0A] leading-tight mb-2">
                {displayTitle}
              </h1>

              {displaySubtitle && (
                <p className="font-sans text-sm text-[#8A8680] mb-2">{displaySubtitle}</p>
              )}

              {resolvedListing.bts_station && (
                <p className="font-sans text-sm flex items-center gap-1.5 text-[#1A3A2A] mb-2">
                  <MapPin size={14} /> BTS {resolvedListing.bts_station}{listing.zone ? ` · ${listing.zone}` : ""}
                </p>
              )}
              {!resolvedListing.bts_station && listing.zone && (
                <p className="font-sans text-sm flex items-center gap-1.5 text-[#8A8680] mb-2">
                  <Building2 size={14} /> {listing.zone}
                </p>
              )}

              {listing.listing_type === "both" ? (
                <div className="flex flex-col gap-1 mb-8">
                  {listing.rent_price && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] w-10">Rent</span>
                      <span className="font-sans text-2xl font-medium text-[#B8935A]">
                        ฿{listing.rent_price.toLocaleString()} <span className="text-base font-normal"><T k="perMonthLong" /></span>
                      </span>
                    </div>
                  )}
                  {listing.sale_price && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] w-10">Buy</span>
                      <span className="font-sans text-2xl font-medium text-[#B8935A]">
                        ฿{listing.sale_price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-sans text-2xl font-medium text-[#B8935A] mb-8">
                  {price}
                </p>
              )}

              {/* Key stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {([
                  { key: "bedrooms", icon: <Bed size={20} />, value: listing.bedrooms || <T k="studio" /> },
                  { key: "bathrooms", icon: <Bath size={20} />, value: listing.bathrooms },
                  { key: "size", icon: <Maximize2 size={20} />, value: <>{listing.size_sqm} <T k="sqm" /></> },
                  { key: "floor", icon: <Building2 size={20} />, value: listing.floor || "—" },
                ] as const).map((stat) => (
                  <div key={stat.key} className="bg-[#F5F2EC] rounded-2xl p-4 text-center">
                    <div className="flex justify-center text-[#B8935A] mb-2">{stat.icon}</div>
                    <div className="font-cormorant text-xl text-[#0A0A0A]">{stat.value}</div>
                    <div className="font-sans text-xs text-[#8A8680]"><T k={stat.key} /></div>
                  </div>
                ))}
              </div>

              {/* Description — Thai users see the original Thai copy when it exists */}
              {description && (
                <div className="mb-10">
                  <h2 className="font-cormorant text-2xl text-[#0A0A0A] mb-4"><T k="aboutProperty" /></h2>
                  <p className="font-sans text-[#8A8680] leading-relaxed">
                    <BiText en={description} th={listing.description_th} />
                  </p>
                </div>
              )}

              {/* Neighbourhood */}
              <NeighbourhoodSection
                bts_station={resolvedListing.bts_station}
                zone={listing.zone}
              />
            </div>

            {/* Lead form sidebar */}
            <aside id="lead-form" className="lg:w-80 shrink-0">
              <div className="mb-3">
                <ChatButtons title={displayTitle} price={price} url={listingUrl} />
              </div>
              <LeadForm
                listingId={listing.id}
                listingTitle={displayTitle}
                listingPrice={price}
                isRented={listing.status === "rented"}
              />
            </aside>
          </div>

          {/* Similar listings */}
          {similar.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#E8E4DC]">
              <h2 className="font-cormorant font-light text-3xl text-[#0A0A0A] mb-8"><T k="similarProperties" /></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}

          {/* Recently viewed */}
          <RecentlyViewed currentId={listing.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
