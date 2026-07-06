import Navbar from "@/components/Navbar";

export default function LoadingListingDetail() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#FAFAF8] min-h-screen">
        {/* Gallery skeleton */}
        <div className="skeleton h-[60vh] w-full" />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-4">
              <div className="skeleton h-6 w-40 rounded" />
              <div className="skeleton h-12 w-2/3 rounded-lg" />
              <div className="skeleton h-8 w-1/3 rounded" />
              <div className="skeleton h-40 w-full rounded-xl mt-6" />
              <div className="skeleton h-64 w-full rounded-xl" />
            </div>
            <aside className="lg:w-80 shrink-0">
              <div className="skeleton h-[420px] w-full rounded-2xl" />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
