import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import FaqSchema from "@/components/FaqSchema";
import { FAQ_GROUPS } from "@/lib/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions | Portal Property Thailand",
  description:
    "Answers to common questions on foreign condo ownership, rental deposits and lease terms, agent fees, the buying process, and arranging viewings in Bangkok.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <FaqSchema groups={FAQ_GROUPS} />
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />

          <div className="mt-6 mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">FAQ</span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>
            <h1 className="font-cormorant text-[36px] md:text-[48px] font-light text-[#0A0A0A] leading-tight">
              Frequently asked <em className="italic text-[#B8935A]">questions</em>
            </h1>
            <p className="font-sans text-[14px] text-[#86868B] mt-3 max-w-lg mx-auto">
              Ownership rules, lease terms, fees, and how the process works — the questions we hear most.
            </p>
          </div>

          <FaqAccordion groups={FAQ_GROUPS} />

          <div className="mt-14 pt-10 border-t border-[#E8E4DC] text-center">
            <p className="font-sans text-[13px] text-[#8A8680] mb-4">Still have a question?</p>
            <Link
              href="/enquire"
              className="press inline-flex items-center gap-2 font-sans text-[13px] font-medium px-7 py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
