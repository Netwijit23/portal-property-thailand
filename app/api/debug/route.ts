import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  // Test without eq filter
  const { data: all } = await supabase.from("listings").select("id,title,status").order("created_at", { ascending: false }).limit(6);
  // Test with eq filter
  const { data: filtered } = await supabase.from("listings").select("id,title,status").eq("status", "available").limit(6);
  return NextResponse.json({ without_filter: all?.length, with_filter: filtered?.length, samples: all?.slice(0,2) });
}
