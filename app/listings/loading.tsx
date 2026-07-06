import Navbar from "@/components/Navbar";
import { ListingGridSkeleton } from "@/components/ListingCardSkeleton";

export default function LoadingListings() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="skeleton h-4 w-24 rounded mb-4" />
            <div className="skeleton h-12 w-72 rounded-lg" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 shrink-0 hidden lg:block">
              <div className="skeleton h-[420px] w-full rounded-2xl" />
            </aside>
            <div className="flex-1">
              <ListingGridSkeleton count={6} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
