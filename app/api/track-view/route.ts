import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, clientIp } from "@/lib/api";

// Records a listing page view for internal analytics (admin dashboard).
// No PII stored — just listing id + timestamp. Fails silently so a missing
// table or config never affects the visitor.
export async function POST(req: NextRequest) {
  if (!rateLimit(`view:${clientIp(req)}`, 60, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: true }); // silently drop; never error a visitor
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ ok: true });

  let id: number | null = null;
  try {
    const body = await req.json();
    id = Number.parseInt(String(body?.id), 10);
  } catch { /* ignore */ }
  if (!id || id < 0 || id > 100_000_000) return NextResponse.json({ ok: true });

  try {
    const service = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
    await service.from("listing_views").insert({ listing_id: id });
  } catch { /* table may not exist yet — see supabase/listing_views.sql */ }

  return NextResponse.json({ ok: true });
}
