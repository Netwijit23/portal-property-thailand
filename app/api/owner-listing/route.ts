import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, clientIp, str } from "@/lib/api";
import type { SupabaseClient } from "@supabase/supabase-js";

// Creates (or reuses) an Owner record for the submitter, then an UNPUBLISHED
// listing (visibility private, is_published false) linked to that owner via
// owner_id — so it shows up correctly under Owners, not just as an orphan
// draft with contact info stuffed into the listing's agent_* fields.
export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // 5 submissions per 10 minutes per IP
  if (!rateLimit(`owner:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const b = (rawBody ?? {}) as Record<string, unknown>;

  // Validate + cap every free-text field
  const name = str(b.name, 200);
  const phone = str(b.phone, 50);
  const email = str(b.email, 200);
  const line = str(b.line, 100);
  const listType = str(b.listType, 20);
  const project = str(b.project, 200);
  const zone = str(b.zone, 200);
  const propType = str(b.propType, 50);
  const beds = str(b.beds, 20);
  const size = str(b.size, 50);
  const price = str(b.price, 50);
  const goal = str(b.goal, 50);
  const notes = str(b.notes, 2000);

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Photos must be URLs from our own Supabase storage (set by /api/owner-photo)
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
  const photos = Array.isArray(b.photos)
    ? b.photos
        .filter((p): p is string => typeof p === "string" && p.startsWith(storagePrefix))
        .slice(0, 30)
    : [];

  const service = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  // Normalise inputs
  const bedrooms = beds === "Studio" ? 0 : beds === "4+" ? 4 : parseInt(beds || "") || null;
  const sizeNum = size ? parseFloat(String(size).replace(/[^\d.]/g, "")) : null;
  const priceNum = price ? parseFloat(String(price).replace(/[^\d.]/g, "")) : null;
  const listingType = listType === "sale" ? "sale" : listType === "both" ? "both" : "rent";

  const ownerId = await findOrCreateOwner(service, {
    name, phone, email, line,
    submissionNote: [
      "── Website submission — List My Property ──",
      goal === "full" ? "Wants full marketing service" : "Wants to list the unit",
      project ? `Building / project: ${project}` : null,
      zone ? `Zone / BTS: ${zone}` : null,
      `Listing type: ${listingType}`,
      notes ? `Owner notes: ${notes}` : null,
    ].filter(Boolean).join("\n"),
  });
  if (!ownerId) return NextResponse.json({ error: "Could not create owner record" }, { status: 500 });

  const listingPayload = {
    project: project || null,
    title: project || zone || `Owner submission — ${name}`,
    zone: zone || null,
    bts_mrt: zone || null,
    listing_type: listingType,
    property_type: propType || "condo",
    building_type: propType || "condo",
    bedrooms,
    size_sqm: sizeNum,
    // Price goes to the matching field based on listing type
    rent_price_1m: listingType !== "sale" ? priceNum : null,
    sale_price: listingType !== "rent" ? priceNum : null,
    photos: photos.length ? photos : null,
    owner_id: ownerId,
    status: "available",
    visibility: "private",
    is_published: false,
    notes: [
      "── Submitted by owner via website ──",
      goal === "full" ? "Wants full marketing service" : "Wants to list the unit",
      notes ? `Owner notes: ${notes}` : null,
    ].filter(Boolean).join("\n"),
  };

  const { data: listing, error } = await service
    .from("listings")
    .insert(listingPayload)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Also create a CRM lead so it flows through the Owner leads pipeline
  try {
    await service.from("leads").insert({
      client_name: name,
      client_phone: phone,
      client_line: line || null,
      status: "new",
      notes: [
        "── OWNER — LIST A PROPERTY ──",
        `Owner: ${name}`,
        email ? `Email: ${email}` : null,
        project ? `Building / project: ${project}` : null,
        zone ? `Zone / BTS: ${zone}` : null,
        `Listing type: ${listingType}`,
        photos.length ? `Photos submitted: ${photos.length}` : null,
        `→ Owner #${ownerId} · Draft listing #${listing.id} created (unpublished) — review in Owners`,
      ].filter(Boolean).join("\n"),
    });
  } catch { /* lead is best-effort */ }

  return NextResponse.json({ id: listing.id });
}

/** Matches an existing owner by phone (then email, then LINE id) so repeat
 * submissions from the same person don't spawn duplicate owner records —
 * updates missing contact fields and appends the new submission to notes
 * instead. Creates a fresh owner when no match is found. */
async function findOrCreateOwner(
  service: SupabaseClient,
  input: { name: string; phone: string; email: string | null; line: string | null; submissionNote: string },
): Promise<number | null> {
  const { name, phone, email, line, submissionNote } = input;

  const orFilters = [`phone.eq.${phone}`];
  if (email) orFilters.push(`email.eq.${email}`);
  if (line) orFilters.push(`line_id.eq.${line}`);

  const { data: existing } = await service
    .from("owners")
    .select("id, name, phone, email, line_id, notes")
    .or(orFilters.join(","))
    .limit(1)
    .maybeSingle();

  if (existing) {
    await service.from("owners").update({
      name: existing.name || name,
      phone: existing.phone || phone,
      email: existing.email || email || null,
      line_id: existing.line_id || line || null,
      notes: existing.notes ? `${existing.notes}\n\n${submissionNote}` : submissionNote,
      updated_at: new Date().toISOString(),
    }).eq("id", existing.id);
    return existing.id;
  }

  const { data: created, error } = await service
    .from("owners")
    .insert({
      name,
      phone,
      email: email || null,
      line_id: line || null,
      status: "active",
      notes: submissionNote,
    })
    .select("id")
    .single();

  if (error) return null;
  return created.id;
}
