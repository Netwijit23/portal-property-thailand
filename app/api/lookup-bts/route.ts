import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp, str } from "@/lib/api";
import { lookupNearestStation } from "@/lib/ai";

// Internal-only enrichment endpoint. The public site no longer calls this on
// render (the listing page uses lib/ai directly), so it is gated behind a
// shared secret to stop anonymous callers from running up the Anthropic bill.
// Requires AI_INTERNAL_SECRET to be set AND matched via the x-internal-secret
// header — fail-closed so a missing secret disables the route rather than
// leaving it open. See MIGRATION_NOTES.md.
function authed(req: NextRequest): boolean {
  const secret = process.env.AI_INTERNAL_SECRET;
  return Boolean(secret && req.headers.get("x-internal-secret") === secret);
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!rateLimit(`lookup-bts:${clientIp(req)}`, 20, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  const bts = await lookupNearestStation({
    building_name: str(b.building_name, 200),
    zone: str(b.zone, 200),
  });
  return NextResponse.json({ bts });
}
