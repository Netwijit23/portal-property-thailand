import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Creates an UNPUBLISHED listing (visibility private, is_published false) from an
// owner's website submission so the admin can review, edit, and publish it.
export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const body = await req.json();
  const {
    name, phone, email, line,
    listType, project, zone, propType,
    beds, size, price, goal, notes, photos,
  } = body ?? {};

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const service = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  // Normalise inputs
  const bedrooms = beds === "Studio" ? 0 : beds === "4+" ? 4 : parseInt(beds) || null;
  const sizeNum = size ? parseFloat(String(size).replace(/[^\d.]/g, "")) : null;
  const priceNum = price ? parseFloat(String(price).replace(/[^\d.]/g, "")) : null;
  const listingType = listType === "sale" ? "sale" : listType === "both" ? "both" : "rent";

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
    photos: Array.isArray(photos) && photos.length ? photos : null,
    // Owner contact — internal only, never shown publicly
    agent_name: name,
    agent_tel: phone,
    agent_line: line || null,
    agent_email: email || null,
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
        Array.isArray(photos) ? `Photos submitted: ${photos.length}` : null,
        `→ Draft listing #${listing.id} created (unpublished) — review in Listings`,
      ].filter(Boolean).join("\n"),
    });
  } catch { /* lead is best-effort */ }

  return NextResponse.json({ id: listing.id });
}
