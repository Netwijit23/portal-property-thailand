import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, clientIp, str, escapeHtml } from "@/lib/api";

export async function POST(req: NextRequest) {
  // 5 lead emails per 10 minutes per IP — a real user never needs more
  if (!rateLimit(`lead:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  // Validate + cap every field; all are re-escaped before hitting the email HTML
  const listing_id = str(b.listing_id, 50);
  const listing_title = str(b.listing_title, 200);
  const listing_price = str(b.listing_price, 100);
  const client_name = str(b.client_name, 200);
  const client_email = str(b.client_email, 200);
  const client_phone = str(b.client_phone, 50);
  const client_line = str(b.client_line, 100);
  const preferred_contact = str(b.preferred_contact, 50);
  const timeline = str(b.timeline, 200);
  const budget_notes = str(b.budget_notes, 500);
  const notes = str(b.notes, 2000);

  if (!client_name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    // Email not configured — still return success so the lead saves to Supabase
    return NextResponse.json({ ok: true, warning: "Email not configured" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;color:#0A0A0A">
      <h2 style="color:#B8935A;border-bottom:2px solid #B8935A;padding-bottom:8px">New Lead — Portal Property Thailand</h2>

      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Listing</td>
            <td style="padding:8px 0;font-weight:600">${escapeHtml(listing_title || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Listing ID</td>
            <td style="padding:8px 0">${escapeHtml(listing_id || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Price</td>
            <td style="padding:8px 0;color:#B8935A;font-weight:600">${escapeHtml(listing_price || "—")}</td></tr>
      </table>

      <hr style="border:none;border-top:1px solid #E8E4DC;margin:20px 0">

      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Name</td>
            <td style="padding:8px 0;font-weight:600">${escapeHtml(client_name)}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Phone</td>
            <td style="padding:8px 0">${escapeHtml(client_phone || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td>
            <td style="padding:8px 0">${escapeHtml(client_email || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">LINE ID</td>
            <td style="padding:8px 0">${escapeHtml(client_line || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Preferred contact</td>
            <td style="padding:8px 0">${escapeHtml(preferred_contact || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Move-in timeline</td>
            <td style="padding:8px 0">${escapeHtml(timeline || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Budget</td>
            <td style="padding:8px 0">${escapeHtml(budget_notes || "—")}</td></tr>
      </table>

      ${notes ? `<div style="margin-top:16px;background:#F5F2EC;border-radius:8px;padding:12px">
        <p style="color:#8A8680;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">Notes</p>
        <p style="margin:0">${escapeHtml(notes)}</p>
      </div>` : ""}

      <p style="margin-top:24px;font-size:12px;color:#8A8680">
        Sent automatically by <strong>Portal Property Thailand</strong> · portalpropertythailand.com
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Portal Property Thailand" <${user}>`,
    to: "Portalproperty.th@gmail.com",
    // Strip line breaks so user input can't inject email headers
    subject: `New Lead: ${client_name.replace(/[\r\n]+/g, " ")} — ${(listing_title || "Property Enquiry").replace(/[\r\n]+/g, " ")}`,
    html,
  });

  return NextResponse.json({ ok: true });
}
