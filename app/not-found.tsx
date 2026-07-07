import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#FAFAF8] flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-md">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#B8935A] mb-4">404</p>
          <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A] mb-4">
            Page not found
          </h1>
          <p className="font-sans text-[#8A8680] mb-8">
            This property may have been rented, sold, or removed — or the link is incorrect.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/listings"
              className="font-sans text-sm bg-[#0A0A0A] text-white px-6 py-3 rounded-full hover:bg-[#B8935A] transition-colors"
            >
              Browse listings
            </Link>
            <Link
              href="/"
              className="font-sans text-sm border border-[#E8E4DC] text-[#0A0A0A] px-6 py-3 rounded-full hover:border-[#B8935A] transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
