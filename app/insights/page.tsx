import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bangkok Property Market Insights | Portal Property Thailand",
  description:
    "Guides on renting and buying property in Bangkok — foreign ownership rules, neighbourhood comparisons, real cost breakdowns, and BTS line guides for expats.",
  path: "/insights",
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function InsightsIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">Market Insights</span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>
            <h1 className="font-cormorant text-[40px] md:text-[52px] font-light text-[#0A0A0A] leading-tight">
              Guides for renting <em className="italic text-[#B8935A]">and buying</em> in Bangkok
            </h1>
            <p className="font-sans text-[14px] text-[#86868B] mt-3 max-w-lg mx-auto">
              Practical answers to the questions we hear most from expats and buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group bg-white rounded-2xl p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3 text-[#B8935A]">
                  <Calendar size={13} strokeWidth={1.8} />
                  <span className="font-sans text-[10px] uppercase tracking-[2px]">{formatDate(post.publishDate)}</span>
                </div>
                <h2 className="font-cormorant text-[26px] font-medium text-[#0A0A0A] leading-tight mb-2">{post.title}</h2>
                <p className="font-sans text-[13px] text-[#6B6963] leading-relaxed line-clamp-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-2 mt-5 font-sans text-[12px] uppercase tracking-[1.5px] text-[#0A0A0A] group-hover:text-[#B8935A] transition-colors">
                  Read more
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
