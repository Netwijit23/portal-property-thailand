export default function ListingCardSkeleton() {
  return (
    <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden">
      <div className="skeleton h-[260px] w-full" />
      <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
        <div className="skeleton h-6 w-3/4 rounded-md" />
        <div className="skeleton h-5 w-1/3 rounded-md" />
        <div className="flex gap-3 mt-1">
          <div className="skeleton h-4 w-12 rounded" />
          <div className="skeleton h-4 w-12 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
