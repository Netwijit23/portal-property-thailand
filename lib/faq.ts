// FAQ content — grouped for the /faq page and its FAQPage JSON-LD.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Foreign ownership",
    items: [
      {
        question: "Can foreigners buy property in Bangkok?",
        answer:
          "Yes, for condominiums. Foreigners can own a condo unit in freehold, the same ownership a Thai national has, as long as foreign ownership across the building stays under the legal 49% quota. Land and houses can't be owned freehold by foreigners — those are typically held via long-term leasehold instead. See our guide on foreign condo ownership for the full breakdown.",
      },
      {
        question: "What is the 49% foreign ownership quota?",
        answer:
          "Thai law requires at least 51% of a condominium building's total saleable floor area to be owned by Thai nationals or entities. Foreigners can collectively own up to 49%. Popular buildings sometimes reach that cap, so we check quota availability before arranging a viewing on any condo you're considering as a foreign buyer.",
      },
      {
        question: "Do I need to bring money in from overseas to buy a condo?",
        answer:
          "Yes. To register foreign ownership, the full purchase amount needs to arrive in Thailand from abroad in foreign currency and be converted to Thai baht, documented with a Foreign Exchange Transaction (FET) form from your Thai bank. Paying in cash or from an existing Thai bank account won't satisfy this requirement.",
      },
    ],
  },
  {
    title: "Renting: deposits & lease terms",
    items: [
      {
        question: "How much deposit do I need to rent in Bangkok?",
        answer:
          "The standard is a 2-month security deposit plus 1 month's rent in advance — 3 months' rent upfront in total. The deposit is refundable at lease-end, minus any damage or unpaid utility bills, typically within 30 days of move-out.",
      },
      {
        question: "How long are typical lease terms?",
        answer:
          "Most residential leases in Bangkok run 12 months, with break clauses that usually require 1-2 months' written notice. Shorter-term leases (3-6 months) are available on some units, often at a modest premium over the 12-month rate.",
      },
      {
        question: "Who pays for building maintenance fees — landlord or tenant?",
        answer:
          "Under a standard Bangkok lease, the landlord covers the building's common-area maintenance fee (juristic person fee). The tenant is responsible for their own electricity, water, and internet. We make sure this is explicit in every lease we arrange.",
      },
    ],
  },
  {
    title: "Fees & costs",
    items: [
      {
        question: "Do renters pay an agency fee?",
        answer:
          "No. In the Bangkok rental market, the landlord pays the agent's commission, not the tenant. You should not be asked to pay an upfront agency fee to view or rent a property through us.",
      },
      {
        question: "What fees does a buyer pay when purchasing a condo?",
        answer:
          "Buyers typically split the 2% transfer fee with the seller (1% each, by convention, though this is negotiable), and the seller usually covers specific business tax or stamp duty depending on how long they've held the property. Your agent and the developer's or seller's transfer team will confirm the exact split before you sign.",
      },
    ],
  },
  {
    title: "The buying process",
    items: [
      {
        question: "How long does buying a condo in Bangkok take?",
        answer:
          "From an accepted offer to completed transfer, a straightforward cash purchase typically takes 4-8 weeks — mainly the time needed to move funds internationally and obtain the Foreign Exchange Transaction form. Financed purchases and resale units with existing tenants can take longer.",
      },
      {
        question: "Can I view properties remotely before visiting Bangkok?",
        answer:
          "Yes. We regularly run live video walkthroughs for clients who haven't yet arrived in Thailand, and can shortlist units against your budget and criteria in advance so your in-person viewing trip is focused on serious contenders.",
      },
    ],
  },
  {
    title: "Viewings",
    items: [
      {
        question: "How do I arrange a viewing?",
        answer:
          "Message us through WhatsApp, LINE, or our enquiry form with the listing you're interested in, and we'll confirm a time — usually within a few hours during business hours (Mon–Sat, 9am–7pm). Most viewings can be arranged same-day or next-day.",
      },
      {
        question: "Is there a cost to view properties?",
        answer:
          "No, viewings are free for prospective tenants and buyers. There's no obligation to proceed after a viewing.",
      },
    ],
  },
];
