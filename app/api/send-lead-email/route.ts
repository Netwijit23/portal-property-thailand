import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    listing_id,
    listing_title,
    listing_price,
    client_name,
    client_email,
    client_phone,
    client_line,
    preferred_contact,
    timeline,
    budget_notes,
    notes,
  } = body;

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
            <td style="padding:8px 0;font-weight:600">${listing_title || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Listing ID</td>
            <td style="padding:8px 0">${listing_id || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Price</td>
            <td style="padding:8px 0;color:#B8935A;font-weight:600">${listing_price || "—"}</td></tr>
      </table>

      <hr style="border:none;border-top:1px solid #E8E4DC;margin:20px 0">

      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Name</td>
            <td style="padding:8px 0;font-weight:600">${client_name || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Phone</td>
            <td style="padding:8px 0">${client_phone || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td>
            <td style="padding:8px 0">${client_email || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">LINE ID</td>
            <td style="padding:8px 0">${client_line || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Preferred contact</td>
            <td style="padding:8px 0">${preferred_contact || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Move-in timeline</td>
            <td style="padding:8px 0">${timeline || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#8A8680;font-size:12px;text-transform:uppercase;letter-spacing:1px">Budget</td>
            <td style="padding:8px 0">${budget_notes || "—"}</td></tr>
      </table>

      ${notes ? `<div style="margin-top:16px;background:#F5F2EC;border-radius:8px;padding:12px">
        <p style="color:#8A8680;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">Notes</p>
        <p style="margin:0">${notes}</p>
      </div>` : ""}

      <p style="margin-top:24px;font-size:12px;color:#8A8680">
        Sent automatically by <strong>Portal Property Thailand</strong> · portalpropertyth.com
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Portal Property Thailand" <${user}>`,
    to: "Anawin.portal@gmail.com",
    subject: `New Lead: ${client_name} — ${listing_title || "Property Enquiry"}`,
    html,
  });

  return NextResponse.json({ ok: true });
}
