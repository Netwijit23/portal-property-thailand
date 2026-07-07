import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, clientIp, str } from "@/lib/api";

// Admin-only: re-stamps updated_at on an available listing so the public
// "Confirmed available Xd ago" badge resets — used after phoning the owner
// to re-confirm availability. Guarded by ADMIN_CONFIRM_TOKEN.
export async function POST(req: NextRequest) {
  if (!rateLimit(`confirm:${clientIp(req)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = process.env.ADMIN_CONFIRM_TOKEN;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token || !serviceKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const key = str(body.key, 200);
  if (key !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number.parseInt(String(body.id), 10);
  if (!id || id < 0) {
    return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
  }

  const service = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  // Only refresh listings that are actually available — flipping a rented
  // listing back to available belongs in the admin app, not this button.
  const { data, error } = await service
    .from("listings")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "available")
    .select("id, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Listing not found or not marked available" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, updated_at: data.updated_at });
}
