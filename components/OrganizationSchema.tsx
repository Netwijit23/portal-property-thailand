import { BUSINESS } from "@/lib/business";

// Site-wide RealEstateAgent + LocalBusiness JSON-LD, rendered once in the
// root layout so it's present on every page. RealEstateAgent is a more
// specific subtype of LocalBusiness that search engines understand for
// brokerages — we combine both via @type array so generic "local business"
// signals and specific "real estate agent" signals both match.
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: BUSINESS.url,
    logo: BUSINESS.logoUrl,
    image: BUSINESS.ogImageUrl,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.addressLocality,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "Place",
      name: `${name}, Bangkok`,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    knowsLanguage: BUSINESS.languages,
    sameAs: [BUSINESS.instagram, BUSINESS.googleBusinessProfile],
    hasMap: BUSINESS.googleBusinessProfile,
    // NOTE: aggregateRating + review were intentionally removed. Google
    // disallows self-serving review markup on LocalBusiness/Organization and
    // can issue a manual action for it. The testimonials still render as plain
    // UI on the homepage — they are just no longer emitted as structured data.
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
