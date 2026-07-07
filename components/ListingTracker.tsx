"use client";
import { useEffect } from "react";
import { saveRecentlyViewed, type RecentListing } from "./RecentlyViewed";

export default function ListingTracker({ listing }: { listing: RecentListing }) {
  useEffect(() => {
    saveRecentlyViewed(listing);

    // Internal view counter — fire-and-forget, once per page load
    const payload = JSON.stringify({ id: listing.id });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track-view", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch { /* tracking must never break the page */ }
  }, [listing]);

  return null;
}
