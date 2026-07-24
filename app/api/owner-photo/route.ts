import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, clientIp } from "@/lib/api";

const BUCKET = "listing-photos";
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "avif"]);

// Sniff real image magic bytes — `file.type` and the extension are both
// trivially spoofable, so a claimed image could actually be an HTML/JS/SVG
// payload used to abuse the public bucket as free file hosting.
function sniffImage(buf: Uint8Array): boolean {
  const b = buf;
  if (b.length < 12) return false;
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return true;
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return true;
  // GIF
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return true;
  // WEBP: "RIFF"...."WEBP"
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return true;
  // HEIC/HEIF/AVIF: ISO-BMFF "ftyp" box at bytes 4-7
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return true;
  return false;
}

// Public endpoint: owners upload photos for a property they're submitting.
// Uses the service role key so no anon storage policy is needed. One file
// per request keeps payloads under the serverless body limit.
export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Upload not configured" }, { status: 500 });
  }

  // One photo per request; 40 per 10 minutes per IP covers a full submission
  if (!rateLimit(`photo:${clientIp(req)}`, 40, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  // Verify the bytes are actually an image — MIME type and extension are both
  // spoofable, so this is the real gate against non-image payloads.
  if (!sniffImage(new Uint8Array(arrayBuffer.slice(0, 12)))) {
    return NextResponse.json({ error: "File is not a valid image" }, { status: 400 });
  }

  const service = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = ALLOWED_EXT.has(rawExt) ? rawExt : "jpg";
  const path = `owner-submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await service.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = service.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
