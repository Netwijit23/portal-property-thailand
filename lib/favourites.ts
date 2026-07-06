"use client";
import { useEffect, useState, useCallback } from "react";

// Persisted saved listings ("favourites"), stored in localStorage.
export interface SavedListing {
  id: string;
  title: string;
  photo: string | null;
  price: string;
  bts_station?: string | null;
  type?: string | null;
}

const KEY = "pp_saved_listings";
const EVENT = "pp_saved_changed";

function read(): SavedListing[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list: SavedListing[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // Notify all hook instances in this tab (storage event only fires cross-tab)
  window.dispatchEvent(new Event(EVENT));
}

export function isSaved(id: string): boolean {
  return read().some((l) => l.id === id);
}

export function toggleSaved(listing: SavedListing): boolean {
  const list = read();
  const exists = list.some((l) => l.id === listing.id);
  const next = exists ? list.filter((l) => l.id !== listing.id) : [listing, ...list];
  write(next);
  return !exists;
}

// Hook: live list of saved listings, updates on any change in this or other tabs.
export function useSaved() {
  const [saved, setSaved] = useState<SavedListing[]>([]);

  const sync = useCallback(() => setSaved(read()), []);

  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const toggle = useCallback((listing: SavedListing) => toggleSaved(listing), []);

  return { saved, count: saved.length, toggle, isSaved: (id: string) => saved.some((l) => l.id === id) };
}
