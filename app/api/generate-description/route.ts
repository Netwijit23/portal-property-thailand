import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { building_name, zone, bts_station, bedrooms, bathrooms, size_sqm, floor, listing_type, type } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ description: null });
  }

  const client = new Anthropic({ apiKey });

  const bedLabel = bedrooms === 0 ? "studio" : `${bedrooms}-bedroom`;
  const prompt = `Write a concise, professional 3–4 sentence description for a real estate listing in Bangkok, Thailand.

Property details:
- Building: ${building_name || "Residential condominium"}
- Type: ${type === "house" ? "House/Villa" : "Condominium"}
- Location: ${zone || "Bangkok"}${bts_station ? `, near ${bts_station} BTS station` : ""}
- Unit: ${bedLabel}, ${bathrooms} bathroom${bathrooms > 1 ? "s" : ""}, ${size_sqm} sqm${floor ? `, floor ${floor}` : ""}
- Available for: ${listing_type === "rent" ? "rent" : "purchase"}

Include mention of:
1. The building and its key facilities (pool, gym, concierge, etc.) — use your knowledge of this Bangkok building if you know it
2. The unit's highlights (views, layout, finishes)
3. The neighbourhood's lifestyle appeal (nearby BTS, restaurants, malls, parks)

Write in elegant, aspirational English. Do not invent specific prices or unit numbers. Output only the description text, no headers.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const description = message.content[0].type === "text" ? message.content[0].text : null;
  return NextResponse.json({ description });
}
