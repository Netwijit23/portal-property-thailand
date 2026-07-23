import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, Handshake, KeyRound, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Enquire — Find a Home, Co-broke, or List a Property | Portal Property",
  description: "Tell us what you're looking for — whether you're renting, buying, co-broking, or listing your property in Bangkok. Book a viewing today.",
  path: "/enquire",
});

const CARDS = [
  {
    href: "/enquire/client",
    icon: Home,
    eyebrow: "Renters & Buyers",
    title: "Find my home",
    body: "Tell us your ideal home and budget. We'll curate matching properties and guide you through every step.",
  },
  {
    href: "/enquire/agent",
    icon: Handshake,
    eyebrow: "Agents",
    title: "Co-broke with us",
    body: "Have a client with a specific brief? Share it and we'll open our inventory — fair, transparent splits.",
  },
  {
    href: "/enquire/owner",
    icon: KeyRound,
    eyebrow: "Owners & Landlords",
    title: "List my property",
    body: "Rent out or sell your unit with premium photography, honest pricing, and full-service marketing.",
  },
];

export default function EnquireHub() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">Get Started</span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>
            <h1 className="font-cormorant text-[40px] md:text-[52px] font-light text-[#0A0A0A] leading-tight">
              How can we <em className="italic text-[#B8935A]">help</em>?
            </h1>
            <p className="font-sans text-[14px] text-[#86868B] mt-3 max-w-md mx-auto">
              Choose what fits you best — it takes under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CARDS.map(({ href, icon: Icon, eyebrow, title, body }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-2xl p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F2EC] flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#B8935A]" strokeWidth={1.6} />
                </div>
                <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#B8935A] mb-2">{eyebrow}</p>
                <h2 className="font-cormorant text-[26px] font-medium text-[#0A0A0A] leading-tight mb-3">{title}</h2>
                <p className="font-sans text-[13px] text-[#6B6963] leading-relaxed flex-1">{body}</p>
                <span className="inline-flex items-center gap-2 mt-6 font-sans text-[12px] uppercase tracking-[1.5px] text-[#0A0A0A] group-hover:text-[#B8935A] transition-colors">
                  Start
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
