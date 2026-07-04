import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About | Portal Property Thailand",
  description:
    "Portal Property Thailand is a boutique Bangkok real estate agency specialising in condos, houses and apartments for expats and international buyers.",
};

const VALUES = [
  {
    title: "Local Knowledge",
    body: "We live in the neighbourhoods we sell. From the cafés of Ari to the towers of Sathorn, our advice comes from walking these streets daily — not from a database.",
  },
  {
    title: "Honest Guidance",
    body: "We tell you when a unit is overpriced, when a building has issues, and when to walk away. Long-term trust matters more to us than a single commission.",
  },
  {
    title: "Full-Journey Support",
    body: "Contracts in Thai, negotiations with landlords, move-in logistics — we handle the details that make relocating to Bangkok feel effortless.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#FAFAF8]">
        {/* Hero */}
        <section
          className="relative flex items-end"
          style={{
            height: "52vh",
            minHeight: 380,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,8,15,0.75) 0%, rgba(5,8,15,0.25) 55%, rgba(5,8,15,0.35) 100%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#E5C795]">
                Our Story
              </span>
            </div>
            <h1 className="font-cormorant font-light text-white leading-[1.05]" style={{ fontSize: "clamp(38px, 5.5vw, 64px)" }}>
              A different kind of <em className="italic text-[#E5C795]">agency</em>
            </h1>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <Reveal>
            <p className="font-cormorant text-[26px] md:text-[30px] font-light text-[#0A0A0A] leading-[1.5] mb-10">
              Portal Property was founded on a simple observation: finding a home in Bangkok
              shouldn&apos;t feel like a gamble.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-6 font-sans text-[15px] font-light text-[#4A4840] leading-[1.9]">
              <p>
                For international buyers and renters, the Bangkok market can be opaque — listings
                that are already gone, photos that flatter, prices that shift depending on who is
                asking. We built Portal Property to be the counterweight: a curated portfolio of
                properties we have actually verified, presented honestly, and matched carefully to
                the people who will live in them.
              </p>
              <p>
                We focus on the neighbourhoods along the BTS — from Ari&apos;s leafy sois to the
                riverside towers of Sathorn — because connected living is what makes this city work.
                Every listing on our site is checked for availability, photographed truthfully, and
                priced against the market before it reaches you.
              </p>
              <p>
                Whether you are renting your first condo in Thailand or adding to an investment
                portfolio, you will work with someone who knows the building, knows the landlord,
                and will still answer your call a year after you move in.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Values */}
        <section className="bg-white border-y border-[#E8E4DC] py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal className="mb-14 text-center">
              <h2 className="font-cormorant text-[34px] md:text-[40px] font-light text-[#0A0A0A]">
                What we <em className="italic text-[#B8935A]">stand for</em>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 120} className="text-center md:text-left">
                  <p className="font-cormorant text-[42px] font-light text-[#E5C795] leading-none mb-4">
                    0{i + 1}
                  </p>
                  <p className="font-sans text-[12px] uppercase tracking-[2px] text-[#0A0A0A] mb-3">
                    {v.title}
                  </p>
                  <p className="font-sans text-[13.5px] font-light text-[#6B6963] leading-[1.8]">
                    {v.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center px-6">
          <Reveal>
            <h2 className="font-cormorant text-[34px] md:text-[42px] font-light text-[#0A0A0A] mb-4">
              Ready to find your place in Bangkok?
            </h2>
            <p className="font-sans text-[14px] font-light text-[#8A8680] mb-10 max-w-md mx-auto">
              Browse the portfolio or tell us what you are looking for — we will do the searching.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/listings"
                className="font-sans text-[13px] font-medium px-8 py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#2A2825] transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/submit"
                className="font-sans text-[13px] font-medium px-8 py-3.5 rounded-full border border-[#B8935A] text-[#B8935A] hover:bg-[#B8935A] hover:text-white transition-colors"
              >
                List a Property
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
