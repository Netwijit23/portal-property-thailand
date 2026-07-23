// Single source of truth for business identity — used in metadata, JSON-LD,
// the footer, and anywhere the NAP (Name/Address/Phone) needs to be
// consistent with Google Business Profile / Instagram / schema.
export const BUSINESS = {
  name: "Portal Property Thailand",
  legalName: "Portal Property Thailand",
  description:
    "Independent Bangkok real estate brokerage specialising in condo and house sales and rentals along the BTS Skytrain corridor.",
  phoneDisplay: "+66 65 059 5097",
  phoneE164: "+66650595097",
  email: "Portalproperty.th@gmail.com",
  hoursDisplay: "Mon–Sat, 9am–7pm",
  openingHours: "Mo-Sa 09:00-19:00", // schema.org format
  addressLocality: "Bangkok",
  addressCountry: "TH",
  areaServed: [
    "Bangkok",
    "Sukhumvit",
    "Thonglor",
    "Ekkamai",
    "Asok",
    "Phrom Phong",
    "Silom",
    "Sathorn",
    "Ari",
    "On Nut",
  ],
  languages: ["English", "Thai"],
  url: "https://portalpropertythailand.com",
  logoUrl: "https://portalpropertythailand.com/icon.svg",
  // Dynamically rendered via app/opengraph-image.tsx — used as the `image`
  // field on JSON-LD blocks that want a representative site image.
  ogImageUrl: "https://portalpropertythailand.com/opengraph-image",
  instagram: "https://www.instagram.com/portalproperty.th/",
  // Google Business Profile — the g.page short-link resolves to the live
  // profile/reviews. Keep NAP (name/phone/area) here identical to what's on
  // the GBP listing so search engines reconcile them as the same entity.
  googleBusinessProfile: "https://g.page/r/Cf-uZ_ZcPJ37EBM",
  googleReviewsUrl: "https://www.google.com/search?q=Portal+Property+Thailand+reviews",
  whatsapp:
    "https://wa.me/66650595097?text=Hi%20Portal%20Property%2C%20I%27d%20like%20to%20enquire%20about%20a%20property",
  line: "https://line.me/R/ti/p/@portalproperty",
  // Stats shown in the "Why Portal Property" homepage section — update these
  // as the business grows instead of hardcoding copy in the component.
  stats: {
    propertiesListed: "500+",
    yearsActive: "5+",
    clientsServed: "300+",
    nationalitiesServed: "20+",
  },
} as const;
