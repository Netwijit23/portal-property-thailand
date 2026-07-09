// Curated neighbourhood guide content for /areas/[slug] landing pages.
// The `match` string is what gets tested against listing zone/BTS fields
// (the zone column holds district-cluster strings, so substring match works).

export interface AreaGuide {
  slug: string;
  name: string;
  tagline: string;
  intro: string[];
  highlights: { label: string; text: string }[];
  match: string;
  /** Typical monthly condo rents (THB) by bedroom count — Bangkok market
   *  benchmarks, not derived from our own inventory. Reviewed mid-2026. */
  marketRent: { br1: number; br2: number; br3: number };
}

export const AREA_GUIDES: AreaGuide[] = [
  {
    slug: "sukhumvit",
    name: "Sukhumvit",
    tagline: "Bangkok's cosmopolitan spine",
    intro: [
      "Sukhumvit Road is where Bangkok's international life happens — a corridor of residences, dining, and nightlife stitched together by the BTS Skytrain from Nana to On Nut and beyond. It's the first neighbourhood most expats consider, and for good reason: everything is within reach.",
      "The sois branching off the main road each have a character of their own — quiet, leafy residential lanes just seconds from some of the city's best restaurants, international schools, and private hospitals like Samitivej and Bumrungrad.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Sukhumvit line — Nana, Asok, Phrom Phong, Thong Lo, Ekkamai" },
      { label: "Known for", text: "International dining, EmQuartier & Emporium, nightlife, expat community" },
      { label: "Suits", text: "Professionals and families who want the city at their doorstep" },
    ],
    marketRent: { br1: 30000, br2: 55000, br3: 95000 },
    match: "sukhumvit",
  },
  {
    slug: "thonglor",
    name: "Thonglor",
    tagline: "The stylish heart of expat Bangkok",
    intro: [
      "Thonglor (Sukhumvit 55) is Bangkok's most fashionable address — a long, tree-lined soi packed with designer cafés, izakayas, rooftop bars, and some of the city's most sought-after condominiums.",
      "The Japanese community has shaped the neighbourhood's precise, quality-first character: excellent groceries, omakase counters, and immaculate services. Residences here command a premium, and hold it.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Thong Lo, plus easy access to Rama IV and the expressway" },
      { label: "Known for", text: "Café culture, Japanese dining, boutique fitness, nightlife done well" },
      { label: "Suits", text: "Design-conscious professionals and young families" },
    ],
    marketRent: { br1: 35000, br2: 65000, br3: 120000 },
    match: "thonglor",
  },
  {
    slug: "ekkamai",
    name: "Ekkamai",
    tagline: "Thonglor's cooler, calmer neighbour",
    intro: [
      "One soi east of Thonglor, Ekkamai delivers much of the same lifestyle at a gentler pace and a friendlier price. Independent coffee roasters, craft beer bars, and galleries give it a creative edge.",
      "It's popular with those who want Thonglor's restaurants within walking distance without paying Thonglor's rents — and the Ekkamai BTS puts the whole Sukhumvit line at your feet.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Ekkamai, Eastern Bus Terminal, quick expressway access" },
      { label: "Known for", text: "Specialty coffee, craft bars, a quieter residential feel" },
      { label: "Suits", text: "Creatives and professionals who like a local pace" },
    ],
    marketRent: { br1: 28000, br2: 50000, br3: 85000 },
    match: "ekkamai",
  },
  {
    slug: "sathorn",
    name: "Sathorn",
    tagline: "The embassy district — polished and green",
    intro: [
      "Sathorn is Bangkok's financial and diplomatic quarter: broad avenues, embassy compounds, five-star hotels, and some of the city's most prestigious residential towers.",
      "Despite the office towers, the sois off Sathorn Road are surprisingly leafy and quiet. Lumpini Park is minutes away, and the BTS and MRT interchange at Sala Daeng–Silom keeps the whole city within reach.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Chong Nonsi & Surasak, MRT Lumpini, expressway ramps" },
      { label: "Known for", text: "Embassies, banking headquarters, rooftop dining, Lumpini Park" },
      { label: "Suits", text: "Executives and families wanting prestige with calm" },
    ],
    marketRent: { br1: 32000, br2: 60000, br3: 110000 },
    match: "sathon",
  },
  {
    slug: "silom",
    name: "Silom",
    tagline: "Where old Bangkok meets the business district",
    intro: [
      "By day Silom is Bangkok's Wall Street; by night it's one of the city's liveliest quarters. Between the two lives a neighbourhood of classic shophouses, street food institutions, and increasingly refined residences.",
      "Living here means walking to work in the CBD, having Lumpini Park as your morning running track, and choosing between the BTS and MRT for everything else.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Sala Daeng, MRT Si Lom & Sam Yan interchange" },
      { label: "Known for", text: "Street food, Lumpini Park, nightlife, walk-to-work living" },
      { label: "Suits", text: "CBD professionals who want energy around the clock" },
    ],
    marketRent: { br1: 30000, br2: 55000, br3: 90000 },
    match: "silom",
  },
  {
    slug: "ari",
    name: "Ari",
    tagline: "Bangkok's favourite low-rise village",
    intro: [
      "Ari has quietly become one of Bangkok's most loved neighbourhoods — a low-rise pocket of cafés in converted houses, weekend markets, and a genuine local community feel that's rare this close to the BTS.",
      "It attracts a mix of Thai creatives and long-stay foreigners who want somewhere that feels like a neighbourhood, not a development. Inventory is tighter here, and good units move quickly.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Ari on the Sukhumvit line, 10 minutes to Siam" },
      { label: "Known for", text: "Garden cafés, brunch culture, village atmosphere" },
      { label: "Suits", text: "Anyone who wants character over convenience malls" },
    ],
    marketRent: { br1: 25000, br2: 45000, br3: 70000 },
    match: "ari",
  },
  {
    slug: "ratchada",
    name: "Ratchada",
    tagline: "The MRT corridor with room to breathe",
    intro: [
      "Ratchadaphisek Road runs the spine of Bangkok's newer business district, served end-to-end by the MRT Blue Line. Condos here offer noticeably more space per baht than Sukhumvit equivalents.",
      "The Rama 9 interchange area is Bangkok's fastest-changing skyline, with new offices, malls, and the Thailand Cultural Centre nearby — a smart pick for value with a commute anywhere.",
    ],
    highlights: [
      { label: "Transit", text: "MRT Blue Line — Rama 9, Thailand Cultural Centre, Huai Khwang" },
      { label: "Known for", text: "Value for space, night markets, the new CBD" },
      { label: "Suits", text: "Value-focused renters and buyers betting on growth" },
    ],
    marketRent: { br1: 18000, br2: 32000, br3: 55000 },
    match: "ratchada",
  },
  {
    slug: "on-nut",
    name: "On Nut",
    tagline: "Sukhumvit living, sensible prices",
    intro: [
      "On Nut marks the point where Sukhumvit rents come back down to earth without giving up the BTS. It has matured into a self-sufficient neighbourhood with markets, malls, and an easy-going international crowd.",
      "For many arrivals it's the smart first base: fifteen minutes to Asok on the Skytrain, at a fraction of mid-Sukhumvit prices.",
    ],
    highlights: [
      { label: "Transit", text: "BTS On Nut & Bang Chak, quick expressway access" },
      { label: "Known for", text: "Everyday value, local markets, easy BTS commutes" },
      { label: "Suits", text: "First-time Bangkok renters and budget-smart professionals" },
    ],
    marketRent: { br1: 15000, br2: 28000, br3: 45000 },
    match: "on nut",
  },
  {
    slug: "ladprao",
    name: "Ladprao",
    tagline: "North Bangkok's connected crossroads",
    intro: [
      "The Ladprao–Chatuchak junction is one of Bangkok's great transit crossroads, where the BTS and MRT meet beside Chatuchak Park and the weekend market that needs no introduction.",
      "The neighbourhood offers larger, quieter residences favoured by Thai families, with a growing set of modern condos around the interchange for those who commute in every direction.",
    ],
    highlights: [
      { label: "Transit", text: "BTS Mo Chit + MRT Chatuchak & Phahon Yothin interchange" },
      { label: "Known for", text: "Chatuchak market, park access, family-scale homes" },
      { label: "Suits", text: "Families and commuters who fan out across the city" },
    ],
    marketRent: { br1: 15000, br2: 26000, br3: 40000 },
    match: "lat phrao",
  },
];

export function getAreaGuide(slug: string): AreaGuide | undefined {
  return AREA_GUIDES.find((a) => a.slug === slug);
}
