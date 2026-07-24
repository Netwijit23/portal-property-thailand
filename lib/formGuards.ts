"use client";
import { useRef } from "react";

// Shared client-side form validation + a lightweight spam guard (honeypot +
// minimum fill time). This is a FIRST layer only: because the public forms
// insert to Supabase with the anon key, a determined bot can skip the client
// entirely — the durable protection is an INSERT-only RLS policy on `leads`
// and/or a server-side token. See MIGRATION_NOTES.md.

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

// Accepts international formats; counts digits only (8–15 per E.164-ish range).
export function isValidPhone(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function useSpamGuard(minMs = 2500) {
  const mountedAt = useRef<number>(Date.now());
  const trapRef = useRef<HTMLInputElement>(null);
  // True when the hidden honeypot was filled (bots auto-complete every field)
  // or the form was submitted implausibly fast for a human.
  function isSpam(): boolean {
    if (trapRef.current && trapRef.current.value.trim() !== "") return true;
    if (Date.now() - mountedAt.current < minMs) return true;
    return false;
  }
  return { trapRef, isSpam };
}
