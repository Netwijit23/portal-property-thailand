import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, clientIp, str, escapeHtml } from "@/lib/api";

// ── Parse the freeform `notes` blob into structured sections ────────────────
// Every enquiry form builds notes as either:
//   "── SECTION TITLE ──\nKey: value\nKey: value\n── Next section ──\n..."
// or, for the two older flat forms, one untitled block of "Key: value" lines.
// Rather than dump that raw text into the email, split it back into cards so
// each field renders as its own row — and any field nobody filled in simply
// doesn't appear, instead of showing "—".
interface Section { title: string | null; rows: { label: string; value: string }[]; text: string[] }

function parseNotes(notes: string): Section[] {
  const lines = notes.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections: Section[] = [{ title: null, rows: [], text: [] }];
  let current = sections[0];

  for (const line of lines) {
    const header = line.match(/^──+\s*(.+?)\s*──+$/);
    if (header) {
      current = { title: header[1], rows: [], text: [] };
      sections.push(current);
      continue;
    }
    if (line.startsWith("Source:")) continue; // internal tracking, not useful to a human reader
    const kv = line.match(/^([A-Za-z][A-Za-z0-9 /_-]{0,40}):\s+(.+)$/);
    if (kv) current.rows.push({ label: kv[1], value: kv[2] });
    else current.text.push(line);
  }
  return sections.filter((s) => s.title || s.rows.length || s.text.length);
}

// ── Apple-style building blocks (table-based, inline-styled — safe across
// Gmail/Outlook/Apple Mail) ──────────────────────────────────────────────────
const GOLD = "#B8935A";
const INK = "#0A0A0A";
const GRAY = "#8A8680";
const HAIRLINE = "#E8E4DC";
const CARD_BG = "#F7F5F1";

function row(label: string, value: string, accent = false): string {
  return `
    <tr>
      <td style="padding:10px 16px;font-size:12px;color:${GRAY};white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 16px;font-size:14px;font-weight:${accent ? 600 : 500};color:${accent ? GOLD : INK};text-align:right">${escapeHtml(value)}</td>
    </tr>`;
}

function card(rowsHtml: string): string {
  if (!rowsHtml) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:14px;margin:0 0 20px;border-collapse:separate">
      ${rowsHtml}
    </table>`;
}

function sectionCard(section: Section): string {
  const rows = section.rows.map((r) => row(r.label, r.value)).join("");
  const textBlock = section.text.length
    ? `<div style="padding:${rows ? "4px" : "14px"} 16px 14px;font-size:14px;color:${INK};line-height:1.5">${section.text.map(escapeHtml).join("<br>")}</div>`
    : "";
  if (!rows && !textBlock) return "";
  const header = section.title
    ? `<p style="font-size:11px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${GRAY};margin:0 0 8px 4px">${escapeHtml(section.title)}</p>`
    : "";
  return `${header}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:14px;margin:0 0 20px;border-collapse:separate">${rows}</table>${textBlock ? `<div style="margin:-16px 0 20px">${textBlock}</div>` : ""}`;
}

function pillButton(label: string, href: string, primary: boolean): string {
  return `
    <td style="padding:0 6px 0 0">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;
        ${primary ? `background:${INK};color:#FFFFFF` : `background:transparent;color:${INK};border:1px solid ${HAIRLINE}`}">
        ${escapeHtml(label)}
      </a>
    </td>`;
}

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

  const listing_id = str(b.listing_id, 50);
  const listing_title = str(b.listing_title, 200);
  const listing_price = str(b.listing_price, 100);
  const client_name = str(b.client_name, 200);
  const client_email = str(b.client_email, 200);
  const client_phone = str(b.client_phone, 50);
  const client_line = str(b.client_line, 100);
  const notes = str(b.notes, 2000);

  // Internal-only: the admin app re-sends this same card to an agent once a
  // lead is assigned to them. Overriding the recipient requires the shared
  // secret — without it, `to`/`banner` are silently ignored so the public
  // enquiry endpoint always just emails the team inbox as before.
  const internalAuthed = Boolean(
    process.env.LEAD_EMAIL_INTERNAL_SECRET &&
    req.headers.get("x-internal-secret") === process.env.LEAD_EMAIL_INTERNAL_SECRET,
  );
  const toOverride = internalAuthed ? str(b.to, 200) : null;
  const banner = internalAuthed ? str(b.banner, 100) : null;
  if (b.to && !internalAuthed) {
    return NextResponse.json({ error: "Unauthorized recipient override" }, { status: 401 });
  }

  if (!client_name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (toOverride && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toOverride)) {
    return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
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

  const sections = notes ? parseNotes(notes) : [];
  const [primarySection, ...restSections] = sections;
  const hasProperty = Boolean(listing_id && (listing_price || listing_title));
  // The first section's title (e.g. "CLIENT ENQUIRY (Renter / Buyer)") reads
  // as the enquiry's category — shown once as a small gold badge, not
  // repeated as a card header. When there's no such title, fall back to the
  // listing name only if it isn't already shown in the Property card below.
  const kindLabel = primarySection?.title
    ?? (!hasProperty && listing_title ? listing_title.split(" — ")[0] : "Property Enquiry");
  const timestamp = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  const contactRows = [
    client_phone ? row("Phone", client_phone) : "",
    client_email ? row("Email", client_email) : "",
    client_line ? row("LINE ID", client_line) : "",
  ].join("");

  const propertyCard = hasProperty ? card([
    listing_title ? row("Property", listing_title) : "",
    listing_price ? row("Price", listing_price, true) : "",
  ].join("")) : "";

  const primaryExtra = primarySection
    ? sectionCard({ title: null, rows: primarySection.rows, text: primarySection.text })
    : "";
  const otherSections = restSections.map(sectionCard).join("");

  const buttons = [
    client_phone ? pillButton("Call", `tel:${client_phone}`, true) : "",
    client_email ? pillButton("Email", `mailto:${client_email}`, !client_phone) : "",
  ].filter(Boolean).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New Lead</title>
</head>
<body style="margin:0;padding:0;background:#F4F2ED;-webkit-text-size-adjust:100%">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F2ED">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:20px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif">
          ${banner ? `<tr><td style="padding:16px 28px 0"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${GOLD}18;color:${GOLD};font-size:11px;font-weight:700">${escapeHtml(banner)}</span></td></tr>` : ""}
          <tr>
            <td style="padding:${banner ? "12px" : "28px"} 28px 0">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:${GOLD};text-transform:uppercase">Portal Property Thailand</p>
              <p style="margin:2px 0 20px;font-size:11px;color:${GRAY}">${escapeHtml(timestamp)}</p>

              <h1 style="margin:0 0 4px;font-size:24px;font-weight:700;color:${INK};letter-spacing:-0.3px">${escapeHtml(client_name)}</h1>
              ${kindLabel ? `<p style="margin:0 0 20px;font-size:13px;font-weight:600;color:${GOLD}">${escapeHtml(kindLabel)}</p>` : `<div style="margin-bottom:16px"></div>`}

              ${buttons ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>${buttons}</tr></table>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px">
              ${propertyCard}
              ${card(contactRows)}
              ${primaryExtra}
              ${otherSections}
            </td>
          </tr>
          <tr>
            <td style="padding:4px 28px 28px">
              <div style="height:1px;background:${HAIRLINE};margin-bottom:20px"></div>
              <a href="https://admin.portalpropertythailand.com/leads" style="display:block;text-align:center;padding:12px;border-radius:12px;background:${INK};color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none">Open in Admin →</a>
              <p style="margin:16px 0 0;font-size:11px;color:${GRAY};text-align:center">Sent automatically · portalpropertythailand.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Portal Property Thailand" <${user}>`,
      to: toOverride || "Portalproperty.th@gmail.com",
      // Strip line breaks so user input can't inject email headers
      subject: `${banner ? `${banner}: ` : "New Lead: "}${client_name.replace(/[\r\n]+/g, " ")} — ${(kindLabel || listing_title || "Property Enquiry").replace(/[\r\n]+/g, " ")}`,
      html,
    });
  } catch (err) {
    // A Gmail/auth hiccup must not surface as a 500 — the caller has already
    // saved the lead to Supabase, so we don't want the user to see an error.
    // Report the failure so it's observable without breaking the flow.
    console.error("send-lead-email: sendMail failed", err);
    return NextResponse.json({ ok: true, warning: "email failed" });
  }

  return NextResponse.json({ ok: true });
}
