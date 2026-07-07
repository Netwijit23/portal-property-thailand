"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in Vercel logs / browser console for debugging
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#B8935A] mb-4">Error</p>
        <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A] mb-4">
          Something went wrong
        </h1>
        <p className="font-sans text-[#8A8680] mb-8">
          Sorry — an unexpected error occurred. Please try again, or head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="font-sans text-sm bg-[#0A0A0A] text-white px-6 py-3 rounded-full hover:bg-[#B8935A] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-sans text-sm border border-[#E8E4DC] text-[#0A0A0A] px-6 py-3 rounded-full hover:border-[#B8935A] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
