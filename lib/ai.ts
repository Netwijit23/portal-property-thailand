import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Direct server-side Anthropic helpers. Calling these from a Server Component
// avoids a self-referential HTTP round-trip to our own /api routes (which also
// made rendering depend on NEXT_PUBLIC_SITE_URL being correct). Every helper is
// null-safe: no API key, an SDK error, or an unexpected response all yield null
// so the caller can degrade gracefully instead of throwing during render.

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

function firstText(message: Anthropic.Message): string | null {
  const block = message.content[0];
  return block && block.type === "text" ? block.text.trim() : null;
}

export async function generateListingDescription(input: {
  building_name: string | null;
  zone: string | null;
  bts_station: string | null;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  floor: number | null;
  listing_type: string;
  type: string;
}): Promise<string | null> {
  const c = getClient();
  if (!c) return null;

  const bedLabel = input.bedrooms === 0 ? "studio" : `${input.bedrooms}-bedroom`;
  const prompt = `Write a concise, professional 3–4 sentence description for a real estate listing in Bangkok, Thailand.

Property details:
- Building: ${input.building_name || "Residential condominium"}
- Type: ${input.type === "house" ? "House/Villa" : "Condominium"}
- Location: ${input.zone || "Bangkok"}${input.bts_station ? `, near ${input.bts_station} BTS station` : ""}
- Unit: ${bedLabel}, ${input.bathrooms} bathroom${input.bathrooms > 1 ? "s" : ""}${input.size_sqm ? `, ${input.size_sqm} sqm` : ""}${input.floor ? `, floor ${input.floor}` : ""}
- Available for: ${input.listing_type === "rent" ? "rent" : "purchase"}

Include mention of:
1. The building and its key facilities (pool, gym, concierge, etc.) — use your knowledge of this Bangkok building if you know it
2. The unit's highlights (views, layout, finishes)
3. The neighbourhood's lifestyle appeal (nearby BTS, restaurants, malls, parks)

Write in elegant, aspirational English. Do not invent specific prices or unit numbers. Output only the description text, no headers.`;

  try {
    const message = await c.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    return firstText(message);
  } catch {
    return null;
  }
}

export async function lookupNearestStation(input: {
  building_name: string | null;
  zone: string | null;
}): Promise<string | null> {
  const c = getClient();
  if (!c) return null;

  try {
    const message = await c.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: `What is the nearest BTS or MRT station to "${input.building_name}"${input.zone ? ` in ${input.zone}, Bangkok` : " in Bangkok"}? Reply with ONLY the station name (e.g. "Thong Lo", "Asok", "Phrom Phong"). If unknown, reply "unknown".`,
      }],
    });
    const raw = firstText(message);
    return raw && raw.toLowerCase() !== "unknown" ? raw : null;
  } catch {
    return null;
  }
}
