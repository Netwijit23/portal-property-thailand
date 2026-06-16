"use client";
import { useEffect } from "react";
import { saveRecentlyViewed, type RecentListing } from "./RecentlyViewed";

export default function ListingTracker({ listing }: { listing: RecentListing }) {
  useEffect(() => {
    saveRecentlyViewed(listing);
  }, [listing]);

  return null;
}
