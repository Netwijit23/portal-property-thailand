// Market-insights content — static for now (mirrors the AREA_GUIDES pattern
// in lib/areas.ts). Move to a CMS/table later if publish cadence picks up.

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string; // ISO date
  author: string;
  sections: BlogSection[];
  /** Slugs of other posts to cross-link at the end of the article. */
  related: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "can-foreigners-buy-condos-in-bangkok",
    title: "Can Foreigners Buy Condos in Bangkok? A Complete Guide",
    excerpt:
      "Thai law lets foreigners own condo units outright — but only under a 49% foreign-quota rule, and only if the money moves the right way. Here's exactly how it works.",
    publishDate: "2026-05-12",
    author: "Portal Property Team",
    sections: [
      {
        heading: "The short answer: yes, with conditions",
        paragraphs: [
          "Foreigners can legally own a condominium unit in Thailand in freehold — the same ownership a Thai national would have — under the Condominium Act. This is the one major exception to Thailand's general restriction on foreign land ownership: because a condo unit isn't land, it can be sold to a non-Thai buyer outright.",
          "The catch is the foreign-ownership quota. At least 51% of the total saleable floor area in any single condominium building must be held by Thai nationals or Thai entities. Foreigners can collectively own up to 49%. Popular buildings along the BTS corridor often fill their foreign quota, so quota availability is one of the first things to check when you shortlist a unit — our team checks it before every viewing on a foreign-quota building.",
        ],
      },
      {
        heading: "How the money has to move",
        paragraphs: [
          "To register foreign ownership at the Land Department, you'll need a Foreign Exchange Transaction (FET) form, issued by a Thai bank once the full purchase amount has arrived from overseas in foreign currency and been converted to Thai baht. This paper trail proves the funds originated abroad — a requirement that exists specifically to support foreign freehold condo ownership.",
          "In practice: transfer the purchase price from your home country account to a Thai bank account, in USD, GBP, EUR or another foreign currency (not THB), and keep every transfer confirmation. Your bank issues the FET (or a credit note for transfers under USD 50,000) once the funds have cleared.",
        ],
      },
      {
        heading: "Houses and land work differently",
        paragraphs: [
          "Foreigners generally cannot own land freehold in Thailand. If you want a house rather than a condo, the common structures are a long-term leasehold (typically up to 30 years, renewable by agreement) on the land with freehold ownership of the structure itself, or holding land through a Thai-majority company set up for genuine business purposes — not as a nominee workaround, which is illegal and actively enforced against.",
          "If a house purchase is what you're after, we'll walk you through leasehold terms property by property — the renewal language matters as much as the headline lease length.",
        ],
      },
      {
        heading: "What we handle for you",
        paragraphs: [
          "Every condo listing on our [site](/listings?type=sale) is checked for foreign-quota availability before we schedule a viewing, and we coordinate with your bank and the developer's transfer department on the FET paperwork. If you're weighing a purchase against renting first, our [rent-vs-buy calculator](/#calculator) is a useful starting point, and if you'd rather talk it through, [reach out here](/enquire/client) and we'll take you through the specifics for the building you have in mind.",
        ],
      },
    ],
    related: ["thonglor-vs-ekkamai-for-expats", "how-much-does-it-cost-to-rent-a-condo-in-bangkok-2026"],
  },
  {
    slug: "thonglor-vs-ekkamai-for-expats",
    title: "Thonglor vs. Ekkamai: Which Is Better for Expats Renting in Bangkok?",
    excerpt:
      "One soi apart, and priced noticeably differently. Here's how Bangkok's two most-asked-about expat neighbourhoods actually compare for day-to-day living.",
    publishDate: "2026-04-03",
    author: "Portal Property Team",
    sections: [
      {
        heading: "Two neighbourhoods, one BTS line apart",
        paragraphs: [
          "Thonglor (Sukhumvit Soi 55) and Ekkamai (Sukhumvit Soi 63) sit one BTS stop apart on the Sukhumvit Line, and the two names come up in almost every conversation we have with clients relocating to Bangkok. They share a similar café-and-condo character, but the differences matter once you're actually living there rather than just visiting for dinner.",
        ],
      },
      {
        heading: "Thonglor: polish, at a price",
        paragraphs: [
          "Thonglor is Bangkok's most fashion-forward district — a long, tree-lined soi dense with designer coffee shops, izakayas, and some of the city's most sought-after condo towers. The neighbourhood's large Japanese community has shaped a precise, quality-first standard for services and dining.",
          "That polish comes at a premium: a one-bedroom condo in Thonglor typically rents in the 30,000–40,000 THB range, with two-bedrooms often clearing 60,000 THB. You're paying for the address as much as the unit.",
        ],
      },
      {
        heading: "Ekkamai: the same lifestyle, gentler pace and price",
        paragraphs: [
          "Ekkamai delivers much of Thonglor's walkability and dining density at a noticeably friendlier price point — often 10-20% less for a comparable unit — while still putting you a five-minute taxi from everything Thonglor offers. Independent coffee roasters and a slightly quieter residential feel give it a more relaxed character.",
          "It's popular with clients who want the lifestyle without the Thonglor rent premium, and the Ekkamai BTS station puts the entire Sukhumvit line within easy reach for work commutes.",
        ],
      },
      {
        heading: "Our take",
        paragraphs: [
          "If proximity to EmQuartier, nightlife, and a design-forward building matter most, Thonglor is worth the premium. If you want 90% of that lifestyle for meaningfully less rent, Ekkamai is the better value call. Either way, both neighbourhoods sit inside our [area guides](/areas) with current listings and market rent benchmarks, and if you're not sure which suits your commute, our [enquiry form](/enquire/client) lets us match you to the right soi rather than just the right building.",
        ],
      },
    ],
    related: ["best-bts-lines-for-expats", "how-much-does-it-cost-to-rent-a-condo-in-bangkok-2026"],
  },
  {
    slug: "how-much-does-it-cost-to-rent-a-condo-in-bangkok-2026",
    title: "How Much Does It Really Cost to Rent a Condo in Bangkok in 2026?",
    excerpt:
      "The advertised rent is only part of the number. Here's what a condo in Bangkok actually costs once deposits, fees, and utilities are factored in.",
    publishDate: "2026-06-18",
    author: "Portal Property Team",
    sections: [
      {
        heading: "Typical monthly rent by neighbourhood",
        paragraphs: [
          "Rent varies a lot by BTS station and building age. As a rough 2026 benchmark for a one-bedroom, ~35 sqm condo: Sukhumvit runs roughly 25,000–35,000 THB, Thonglor and Phrom Phong 30,000–40,000 THB, Ekkamai and Asok slightly less, and Silom/Sathorn 28,000–38,000 THB depending on building age and view. Two-bedroom units generally run 1.6-2x the one-bedroom rate in the same building.",
        ],
      },
      {
        heading: "The upfront cost most people underestimate",
        paragraphs: [
          "Standard Bangkok lease terms are a 2-month security deposit plus 1 month's rent paid in advance at signing — so budget for 3x the monthly rent before you get the keys. The deposit is refundable at lease-end, minus any damage or unpaid utility bills, and is usually returned within 30 days of move-out per the lease.",
          "Agency fees for renters are typically zero — in the Bangkok market, the landlord pays the agent's commission, not the tenant. If anyone asks a prospective tenant for an upfront agency fee, that's worth double-checking.",
        ],
      },
      {
        heading: "Utilities and building fees",
        paragraphs: [
          "Electricity is billed at the building's rate — private buildings often charge 6-8 THB/unit versus the government rate of around 4 THB/unit, which adds up with air-conditioning running most of the year. Water is usually a flat monthly fee (100-200 THB per person) rather than metered. Common-area maintenance fees are the landlord's responsibility under a standard lease, not the tenant's, so confirm this is explicit in the contract before signing.",
        ],
      },
      {
        heading: "Getting a real number for your shortlist",
        paragraphs: [
          "Because building fees and electricity rates vary, the listed rent isn't always an apples-to-apples comparison between two units. Our [rent-vs-buy and monthly-cost calculator](/#calculator) breaks down the all-in monthly figure for any listing, and you can browse current availability by budget on our [listings page](/listings?type=rent). If you'd rather skip the spreadsheet, tell us your budget through our [enquiry form](/enquire/client) and we'll shortlist units that actually fit it, fees included.",
        ],
      },
    ],
    related: ["best-bts-lines-for-expats", "can-foreigners-buy-condos-in-bangkok"],
  },
  {
    slug: "best-bts-lines-for-expats",
    title: "Best BTS Lines for Expats: A Neighbourhood Guide",
    excerpt:
      "Sukhumvit or Silom? A station-by-station look at which BTS line fits your work, budget, and lifestyle in Bangkok.",
    publishDate: "2026-02-20",
    author: "Portal Property Team",
    sections: [
      {
        heading: "Sukhumvit Line: the expat default",
        paragraphs: [
          "The Sukhumvit Line — running through Asok, Phrom Phong, Thong Lo, and Ekkamai — is where most newly-arrived expats end up, and for good reason. It has the highest concentration of international schools, hospitals like Samitivej and Bumrungrad, and the dining and nightlife scene most people picture when they think of expat Bangkok. It's also the most expensive corridor to rent on.",
        ],
      },
      {
        heading: "Silom Line: business-first, better value",
        paragraphs: [
          "The Silom Line serves Bangkok's financial district — Sala Daeng, Chong Nonsi, and the Sathorn embassy belt. If you're working for a multinational with an office in this area, living along the Silom Line can cut your commute to a walk while renting for noticeably less than equivalent Sukhumvit units, since the neighbourhood skews more toward local professionals in the evenings and weekends.",
        ],
      },
      {
        heading: "Matching the line to your life, not just your office",
        paragraphs: [
          "The right line depends on what you actually optimise for: Sukhumvit if nightlife, schools, and an international social circle matter most; Silom/Sathorn if a short commute and better rent-for-size matter more and you don't mind a quieter evening scene. Both lines connect at Siam, so neither cuts you off from the other — it's a genuine trade-off, not a compromise.",
        ],
      },
      {
        heading: "Explore by station",
        paragraphs: [
          "Our [area guides](/areas) break down each BTS station along both lines with current listings and market rent, and our [commute calculator on every listing](/listings) shows the actual travel time to a station of your choice — useful if you already know your office address and want to work backwards from there. Not sure where to start? [Tell us your priorities](/enquire/client) and we'll point you at the right stretch of line.",
        ],
      },
    ],
    related: ["thonglor-vs-ekkamai-for-expats", "how-much-does-it-cost-to-rent-a-condo-in-bangkok-2026"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.related
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));
}
