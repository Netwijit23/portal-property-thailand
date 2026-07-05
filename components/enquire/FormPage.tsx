import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";

export default function FormPage({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/enquire"
            className="inline-flex items-center gap-1.5 font-sans text-[12px] text-[#86868B] hover:text-[#0A0A0A] transition-colors mb-6"
          >
            <ChevronLeft size={15} /> All options
          </Link>
          <div className="mb-8">
            <p className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A] mb-2">{eyebrow}</p>
            <h1 className="font-cormorant text-[36px] md:text-[42px] font-light text-[#0A0A0A] leading-tight">
              {heading}
            </h1>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
