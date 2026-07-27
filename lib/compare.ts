"use client";
import { useEffect, useState, useCallback } from "react";

// Listings the visitor has picked to compare side-by-side, persisted in
// localStorage (mirrors lib/favourites.ts). Capped at MAX so the comparison
// table stays readable.
export interface CompareListing {
  id: string;
  title: string;
  photo: string | null;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  bts_station?: string | null;
  zone?: string | null;
  type?: string | null;
  floor?: number | null;
}

export const MAX_COMPARE = 4;
const KEY = "pp_compare_listings";
const EVENT = "pp_compare_changed";

function read(): CompareListing[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list: CompareListing[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

/** Toggle membership. Returns "added" | "removed" | "full" so the UI can warn
 * when the visitor tries to exceed MAX_COMPARE. */
export function toggleCompare(listing: CompareListing): "added" | "removed" | "full" {
  const list = read();
  const exists = list.some((l) => l.id === listing.id);
  if (exists) {
    write(list.filter((l) => l.id !== listing.id));
    return "removed";
  }
  if (list.length >= MAX_COMPARE) return "full";
  write([...list, listing]);
  return "added";
}

export function removeCompare(id: string) {
  write(read().filter((l) => l.id !== id));
}

export function clearCompare() {
  write([]);
}

// Hook: live compare list, synced across hook instances and tabs.
export function useCompare() {
  const [items, setItems] = useState<CompareListing[]>([]);
  const sync = useCallback(() => setItems(read()), []);

  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return {
    items,
    count: items.length,
    isFull: items.length >= MAX_COMPARE,
    isComparing: (id: string) => items.some((l) => l.id === id),
    toggle: useCallback((l: CompareListing) => toggleCompare(l), []),
    remove: useCallback((id: string) => removeCompare(id), []),
    clear: useCallback(() => clearCompare(), []),
  };
}
