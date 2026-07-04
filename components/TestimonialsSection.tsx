"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink, PenLine } from "lucide-react";
import Reveal from "./Reveal";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Portal+Property+Thailand+reviews";

const GOOGLE_WRITE_REVIEW_URL = "https://g.page/r/Cf-uZ_ZcPJ37EBM/review";

const REVIEWS = [
  {
    name: "Herve Touron",
    date: "2026",
    text: "Recently arrived in Bangkok, we fully relied on the expertise of Khun Golf to find the best and most convenient place for our family. He first took time to discuss our criteria and understand our needs — he was spot-on from the first visit. It took only 6 viewings to find the perfect home. We recommend Khun Golf to anyone new in Bangkok!",
  },
  {
    name: "David Berghaeuser",
    date: "January 2025",
    text: "Unlike many agents who just send you a flood of random options, Golf takes the time to truly understand your needs. What really sets him apart is his role as an advocate for the tenant — during negotiations he does an incredible job protecting the lessee's interests, something rare in Thailand. Professional, trustworthy, and genuinely cares about his clients.",
  },
  {
    name: "Nawin Sribhadung",
    date: "January 2025",
    text: "One of the best property agents I have worked with so far. Despite all my requirements being sometimes above and beyond average, he managed to deliver high quality service with an amazing attitude that earned my trust so quickly and gave me the peace of mind I'm after.",
  },
  {
    name: "Hasan Manzoor Chaudhry",
    date: "November 2024",
    text: "We contacted several agents and viewed countless properties, only to be met with disappointment. Then we got in touch with Golf. He took effort in understanding our needs and our budget, and got back to us within a week — with the most amazing house we could have asked for. We can't recommend him enough.",
  },
  {
    name: "J V",
    date: "October 2024",
    text: "From the very start, he was incredibly attentive, handling every question and request I threw at him. Even with me still in San Francisco, he made the whole process feel easy and seamless. His dedication and attention to detail helped me lock in the perfect place, without any of the usual stress.",
  },
  {
    name: "Paul Thailand",
    date: "May 2025",
    text: "Khun Golf was amazing from start to finish. He totally understands what a client is looking for and went out of his way to make sure the move went well once he found our dream place. Highly recommended.",
  },
  {
    name: "Nick Sternaras",
    date: "April 2025",
    text: "I had the great pleasure of working with Khun Saint, a real estate agent who goes the extra mile for his clients. He knows the ins and outs of the Bangkok property market, puts his clients' interests first, and his advice is always tailored to your needs. Always available, never loses his patience. Highly recommend!",
  },
  {
    name: "Justin Felde",
    date: "March 2025",
    text: "Working with Koi at Portal Property has been one of the most seamless moving experiences in my life. Koi was very attentive and always answered when I had questions. She was a great mediator between the property owner and me. When I move back to Bangkok, I know who I will be calling.",
  },
  {
    name: "Alyson Yang",
    date: "March 2025",
    text: "K.Koi is an amazing person who does not hesitate to help me and is so enthusiastic to show nice units. I can definitely feel that she tries to do her best.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill="#B8935A" stroke="#B8935A" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const review = REVIEWS[index];

  const prev = () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIndex((i) => (i + 1) % REVIEWS.length);

  return (
    <section className="bg-white border-y border-[#E8E4DC] py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#B8935A]" />
            <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">
              Client Stories
            </span>
            <div className="h-px w-8 bg-[#B8935A]" />
          </div>
          <h2 className="font-cormorant text-[36px] md:text-[42px] font-light text-[#0A0A0A] leading-tight mb-12">
            In their <em className="italic text-[#B8935A]">own words</em>
          </h2>
        </Reveal>

        {/* Rotating quote */}
        <Reveal>
          <div key={index} style={{ animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <Stars />
            <blockquote className="font-cormorant text-[22px] md:text-[26px] font-light text-[#2A2825] leading-[1.6] mt-6 mb-8 min-h-[160px] md:min-h-[140px]">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <p className="font-sans text-[12px] uppercase tracking-[2px] text-[#0A0A0A]">
              {review.name}
            </p>
            <p className="font-sans text-[11px] text-[#8A8680] mt-1">
              Google Review · {review.date}
            </p>
          </div>
        </Reveal>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="w-10 h-10 rounded-full border border-[#E8E4DC] flex items-center justify-center text-[#8A8680] hover:border-[#B8935A] hover:text-[#B8935A] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[#B8935A]" : "w-1.5 bg-[#E8E4DC] hover:bg-[#B8935A]/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next review"
            className="w-10 h-10 rounded-full border border-[#E8E4DC] flex items-center justify-center text-[#8A8680] hover:border-[#B8935A] hover:text-[#B8935A] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Google links */}
        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-[12px] font-medium px-6 py-3 rounded-full bg-[#B8935A] text-white hover:bg-[#a07d4a] transition-colors"
          >
            <PenLine size={13} />
            Share your experience
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[2px] text-[#8A8680] hover:text-[#B8935A] transition-colors pb-1 border-b border-[#E8E4DC] hover:border-[#B8935A]"
          >
            See all reviews on Google
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
