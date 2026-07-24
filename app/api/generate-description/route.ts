import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp, str } from "@/lib/api";
import { generateListingDescription } from "@/lib/ai";

// Internal-only enrichment endpoint. The public site generates descriptions via
// lib/ai directly (streamed, off the render path), so this HTTP route exists for
// internal/admin callers and is gated behind a shared secret. Fail-closed: a
// missing AI_INTERNAL_SECRET disables it. See MIGRATION_NOTES.md.
function authed(req: NextRequest): boolean {
  const secret = process.env.AI_INTERNAL_SECRET;
  return Boolean(secret && req.headers.get("x-internal-secret") === secret);
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!rateLimit(`gen-desc:${clientIp(req)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  const toInt = (v: unknown) => {
    const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const description = await generateListingDescription({
    building_name: str(b.building_name, 200),
    zone: str(b.zone, 200),
    bts_station: str(b.bts_station, 100),
    bedrooms: toInt(b.bedrooms),
    bathrooms: toInt(b.bathrooms),
    size_sqm: b.size_sqm != null ? toInt(b.size_sqm) : null,
    floor: b.floor != null ? toInt(b.floor) : null,
    listing_type: str(b.listing_type, 20) || "rent",
    type: str(b.type, 20) || "condo",
  });
  return NextResponse.json({ description });
}
