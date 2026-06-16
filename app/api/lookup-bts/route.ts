import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { building_name, zone } = await req.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ bts: null });

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 50,
    messages: [{
      role: "user",
      content: `What is the nearest BTS or MRT station to "${building_name}"${zone ? ` in ${zone}, Bangkok` : " in Bangkok"}? Reply with ONLY the station name (e.g. "Thong Lo", "Asok", "Phrom Phong"). If unknown, reply "unknown".`,
    }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text.trim() : null;
  const bts = raw && raw.toLowerCase() !== "unknown" ? raw : null;
  return NextResponse.json({ bts });
}
