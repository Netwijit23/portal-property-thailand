"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink, PenLine } from "lucide-react";
import Reveal from "./Reveal";
import AuroraBackground from "./AuroraBackground";
import { REVIEWS } from "@/lib/reviews";
import { BUSINESS } from "@/lib/business";

const GOOGLE_REVIEWS_URL = BUSINESS.googleReviewsUrl;

const GOOGLE_WRITE_REVIEW_URL = `${BUSINESS.googleBusinessProfile}/review`;

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
    <section className="relative overflow-hidden bg-white border-y border-[#E8E4DC] py-20 md:py-24">
      <AuroraBackground tone="light" className="opacity-60" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
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
