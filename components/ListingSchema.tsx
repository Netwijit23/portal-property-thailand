import type { Listing } from "@/lib/supabase";
import { BUSINESS } from "@/lib/business";

// Per-listing structured data. We emit a Residence (the schema.org type for
// the physical unit — bedrooms/bathrooms/floorSize/address) combined with
// Offer(s) for its price(s), which is the combination Google's Rich Results
// docs recommend for property listings absent a dedicated RealEstateListing
// test (RealEstateListing itself has no dedicated rich-result type yet, but
// Product/Offer + Residence fields are both fully supported and validate).
export default function ListingSchema({ listing, url }: { listing: Listing; url: string }) {
  const displayName = listing.building_name || listing.title;
  const offers: Record<string, unknown>[] = [];

  if ((listing.listing_type === "rent" || listing.listing_type === "both") && listing.rent_price) {
    offers.push({
      "@type": "Offer",
      price: listing.rent_price,
      priceCurrency: "THB",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      availability: listing.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    });
  }
  if ((listing.listing_type === "sale" || listing.listing_type === "both") && listing.sale_price) {
    offers.push({
      "@type": "Offer",
      price: listing.sale_price,
      priceCurrency: "THB",
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
      availability: listing.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${displayName}${listing.zone ? ` — ${listing.zone}, Bangkok` : ", Bangkok"}`,
    description: listing.description || `${listing.bedrooms}-bedroom ${listing.type} in ${listing.zone || "Bangkok"}.`,
    image: listing.photos?.length ? listing.photos : [BUSINESS.ogImageUrl],
    url,
    brand: { "@type": "Organization", name: BUSINESS.name },
    additionalProperty: [
      { "@type": "PropertyValue", name: "bedrooms", value: listing.bedrooms },
      { "@type": "PropertyValue", name: "bathrooms", value: listing.bathrooms },
      ...(listing.size_sqm != null ? [{ "@type": "PropertyValue", name: "floorSize", value: `${listing.size_sqm} sqm` }] : []),
      ...(listing.floor != null ? [{ "@type": "PropertyValue", name: "floor", value: listing.floor }] : []),
      ...(listing.bts_station ? [{ "@type": "PropertyValue", name: "nearestBTS", value: listing.bts_station }] : []),
    ],
    offers: offers.length === 1 ? offers[0] : offers,
  };

  // Also emit the physical-property (Residence) facts as a second block —
  // some crawlers key off Accommodation/Residence for real estate rather
  // than Product, so we cover both without contradicting either.
  const residenceSchema = {
    "@context": "https://schema.org",
    "@type": listing.type === "condo" ? "Apartment" : "House",
    name: displayName,
    numberOfRooms: listing.bedrooms,
    numberOfBathroomsTotal: listing.bathrooms,
    ...(listing.size_sqm != null
      ? { floorSize: { "@type": "QuantitativeValue", value: listing.size_sqm, unitCode: "MTK" } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.zone || "Bangkok",
      addressRegion: "Bangkok",
      addressCountry: "TH",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residenceSchema) }}
      />
    </>
  );
}
