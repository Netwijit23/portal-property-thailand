import { NextRequest } from "next/server";

// ── Simple in-memory rate limiter ──────────────────────────────────────────
// Per serverless instance, so it's a soft cap rather than a guarantee — but
// it stops naive scripted abuse of the public endpoints without adding an
// external store.
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Prune expired buckets so the map can't grow unbounded
  if (buckets.size > 1000) {
    buckets.forEach((b, k) => {
      if (now > b.reset) buckets.delete(k);
    });
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// ── Input helpers ───────────────────────────────────────────────────────────

// Coerce an untrusted value to a trimmed string capped at maxLen; null if not
// a usable string.
export function str(v: unknown, maxLen = 500): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

// Escape a value for interpolation into HTML (email bodies etc.)
export function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
