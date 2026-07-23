// Client testimonials — shared between the homepage TestimonialsSection UI
// and the Review/AggregateRating JSON-LD on OrganizationSchema, so the two
// can never drift out of sync. Sourced from Google Reviews.
export interface Review {
  name: string;
  date: string;
  /** ISO 8601 date — the real value fed to JSON-LD Review.datePublished.
   * `date` above stays a loose display string ("2026", "January 2025", …)
   * matching how Google Reviews shows relative dates; isoDate is the
   * schema-valid stand-in so structured data doesn't break. */
  isoDate: string;
  text: string;
  rating: number;
}

export const REVIEWS: Review[] = [
  {
    name: "Herve Touron",
    date: "2026",
    isoDate: "2026-01-01",
    rating: 5,
    text: "Recently arrived in Bangkok, we fully relied on the expertise of Khun Golf to find the best and most convenient place for our family. He first took time to discuss our criteria and understand our needs — he was spot-on from the first visit. It took only 6 viewings to find the perfect home. We recommend Khun Golf to anyone new in Bangkok!",
  },
  {
    name: "David Berghaeuser",
    date: "January 2025",
    isoDate: "2025-01-01",
    rating: 5,
    text: "Unlike many agents who just send you a flood of random options, Golf takes the time to truly understand your needs. What really sets him apart is his role as an advocate for the tenant — during negotiations he does an incredible job protecting the lessee's interests, something rare in Thailand. Professional, trustworthy, and genuinely cares about his clients.",
  },
  {
    name: "Nawin Sribhadung",
    date: "January 2025",
    isoDate: "2025-01-01",
    rating: 5,
    text: "One of the best property agents I have worked with so far. Despite all my requirements being sometimes above and beyond average, he managed to deliver high quality service with an amazing attitude that earned my trust so quickly and gave me the peace of mind I'm after.",
  },
  {
    name: "Hasan Manzoor Chaudhry",
    date: "November 2024",
    isoDate: "2024-11-01",
    rating: 5,
    text: "We contacted several agents and viewed countless properties, only to be met with disappointment. Then we got in touch with Golf. He took effort in understanding our needs and our budget, and got back to us within a week — with the most amazing house we could have asked for. We can't recommend him enough.",
  },
  {
    name: "J V",
    date: "October 2024",
    isoDate: "2024-10-01",
    rating: 5,
    text: "From the very start, he was incredibly attentive, handling every question and request I threw at him. Even with me still in San Francisco, he made the whole process feel easy and seamless. His dedication and attention to detail helped me lock in the perfect place, without any of the usual stress.",
  },
  {
    name: "Paul Thailand",
    date: "May 2025",
    isoDate: "2025-05-01",
    rating: 5,
    text: "Khun Golf was amazing from start to finish. He totally understands what a client is looking for and went out of his way to make sure the move went well once he found our dream place. Highly recommended.",
  },
  {
    name: "Nick Sternaras",
    date: "April 2025",
    isoDate: "2025-04-01",
    rating: 5,
    text: "I had the great pleasure of working with Khun Saint, a real estate agent who goes the extra mile for his clients. He knows the ins and outs of the Bangkok property market, puts his clients' interests first, and his advice is always tailored to your needs. Always available, never loses his patience. Highly recommend!",
  },
  {
    name: "Justin Felde",
    date: "March 2025",
    isoDate: "2025-03-01",
    rating: 5,
    text: "Working with Koi at Portal Property has been one of the most seamless moving experiences in my life. Koi was very attentive and always answered when I had questions. She was a great mediator between the property owner and me. When I move back to Bangkok, I know who I will be calling.",
  },
  {
    name: "Alyson Yang",
    date: "March 2025",
    isoDate: "2025-03-01",
    rating: 5,
    text: "K.Koi is an amazing person who does not hesitate to help me and is so enthusiastic to show nice units. I can definitely feel that she tries to do her best.",
  },
];

export function getAggregateRating() {
  const reviewCount = REVIEWS.length;
  const ratingValue = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  return { ratingValue: Number(ratingValue.toFixed(1)), reviewCount };
}
