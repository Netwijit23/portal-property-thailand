import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { clientIp, escapeHtml, rateLimit, str } from "@/lib/api";
import { displayName, type SharedListing } from "@/lib/sharedListing";

const MAX_PICKS = 50;

// Records which units a tenant would like to VIEW. The link token is the
// credential: it's validated here, then the write goes through the service role
// — there is deliberately no anon-callable write function in the database.
export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // 10 submissions per 10 minutes per IP — a real tenant needs a handful at most
  if (!rateLimit(`proposal:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests — please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  const token = str(b.token, 64);
  const note = str(b.note, 500);
  const ids = Array.isArray(b.itemIds)
    ? Array.from(new Set(b.itemIds.filter((n): n is number => typeof n === "number" && Number.isInteger(n) && n > 0)))
    : null;
  if (!token || !/^[a-f0-9]{32}$/i.test(token) || !ids || ids.length === 0 || ids.length > MAX_PICKS) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const db = createServiceClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: proposal } = await db
    .from("proposals")
    .select("id, agent_id, title, client_name, valid_until, submitted_at, tenant_note")
    .eq("token", token)
    .maybeSingle();
  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });

  const todayBangkok = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  if (proposal.valid_until && String(proposal.valid_until).slice(0, 10) < todayBangkok) {
    return NextResponse.json({ error: "This proposal has expired — please contact your agent." }, { status: 410 });
  }

  // Every picked unit must belong to THIS proposal (never trust ids alone).
  const { data: items } = await db
    .from("proposal_items")
    .select("id, selected, monthly_price, position, listings(id, title, title_en, project)")
    .eq("proposal_id", proposal.id)
    .order("position", { ascending: true });
  const all = items ?? [];
  const valid = new Set(all.map((i) => i.id as number));
  if (ids.some((id) => !valid.has(id))) {
    return NextResponse.json({ error: "One of those options isn't part of this proposal" }, { status: 400 });
  }

  const wanted = new Set(ids);
  const current = new Set(all.filter((i) => i.selected).map((i) => i.id as number));
  const sameSelection = wanted.size === current.size && ids.every((id) => current.has(id));
  // Same picks + same note = nothing new to record or tell the agent.
  if (sameSelection && (proposal.tenant_note ?? "") === (note ?? "")) {
    return NextResponse.json({ ok: true });
  }

  const now = new Date().toISOString();
  const toSelect = ids.filter((id) => !current.has(id));
  const toUnselect = Array.from(current).filter((id) => !wanted.has(id));
  if (toSelect.length) {
    const { error } = await db.from("proposal_items").update({ selected: true, selected_at: now }).in("id", toSelect).eq("proposal_id", proposal.id);
    if (error) return NextResponse.json({ error: "Couldn't save your picks — please try again." }, { status: 500 });
  }
  if (toUnselect.length) {
    const { error } = await db.from("proposal_items").update({ selected: false, selected_at: null }).in("id", toUnselect).eq("proposal_id", proposal.id);
    if (error) return NextResponse.json({ error: "Couldn't save your picks — please try again." }, { status: 500 });
  }
  const { error: proposalError } = await db
    .from("proposals")
    .update({ submitted_at: now, tenant_note: note, updated_at: now })
    .eq("id", proposal.id);
  if (proposalError) return NextResponse.json({ error: "Couldn't save your picks — please try again." }, { status: 500 });

  // ── Tell the agent (best-effort: the picks are already saved) ──────────────
  const picked = all
    .filter((i) => wanted.has(i.id as number))
    .map((i) => {
      const l = (Array.isArray(i.listings) ? i.listings[0] : i.listings) as Partial<SharedListing> | null;
      return { name: l ? displayName(l as SharedListing) : "a unit", price: i.monthly_price as number | null };
    });
  const who = proposal.client_name?.trim() || "Your tenant";
  const n = picked.length;
  const first = !proposal.submitted_at;
  const headline = first
    ? `${who} picked ${n} unit${n === 1 ? "" : "s"} to view`
    : `${who} updated their picks (${n} unit${n === 1 ? "" : "s"})`;
  const namesShort = picked.slice(0, 5).map((p) => p.name).join(", ") + (n > 5 ? ` +${n - 5} more` : "");

  try {
    const recipients = proposal.agent_id
      ? (await db.from("agents").select("id, email, name").eq("id", proposal.agent_id)).data ?? []
      : (await db.from("agents").select("id, email, name").eq("role", "admin")).data ?? [];

    if (recipients.length) {
      await db.from("notifications").insert(
        recipients.map((r) => ({
          recipient_agent_id: r.id,
          type: "proposal_choice",
          title: headline,
          body: note ? `${namesShort} — “${note}”` : namesShort,
          related_type: "proposal",
          related_id: String(proposal.id),
          metadata: { proposalId: proposal.id, itemIds: ids },
        })),
      );
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;
    const emails = recipients.map((r) => r.email).filter((e): e is string => !!e);
    if (user && pass && emails.length) {
      const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
      const adminUrl = `https://admin.portalpropertythailand.com/proposals/${proposal.id}`;
      const rows = picked
        .map((p) => `<tr><td style="padding:8px 0;font-size:14px;color:#0A0A0A;border-bottom:1px solid #F0ECE4">${escapeHtml(p.name)}</td><td style="padding:8px 0;font-size:14px;color:#B8935A;text-align:right;border-bottom:1px solid #F0ECE4;white-space:nowrap">${p.price ? `฿${Number(p.price).toLocaleString("en-US")}/mo` : ""}</td></tr>`)
        .join("");
      const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#F7F5F1;padding:24px">
  <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;border-collapse:separate;overflow:hidden">
    <tr><td style="background:#0A0A0A;padding:20px 24px">
      <span style="color:#B8935A;font-size:11px;letter-spacing:2.5px;text-transform:uppercase">Proposal update</span>
    </td></tr>
    <tr><td style="padding:24px">
      <p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#0A0A0A">${escapeHtml(headline)}</p>
      <p style="margin:0 0 16px;font-size:14px;color:#8A8680">${escapeHtml(proposal.title)}</p>
      <table role="presentation" width="100%" style="border-collapse:collapse">${rows}</table>
      ${note ? `<div style="margin-top:16px;background:#F7F5F1;border-radius:10px;padding:14px 16px;font-size:14px;color:#3A3835;white-space:pre-line">&ldquo;${escapeHtml(note)}&rdquo;</div>` : ""}
      <p style="margin:24px 0 0"><a href="${adminUrl}" style="display:inline-block;background:#B8935A;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:999px">Open proposal &amp; create viewing list</a></p>
    </td></tr>
  </table>
</div>`;
      await transporter.sendMail({
        from: `"Portal Property Thailand" <${user}>`,
        to: emails.join(", "),
        // Strip line breaks so tenant-supplied text can't inject email headers
        subject: headline.replace(/[\r\n]+/g, " "),
        html,
      });
    }
  } catch (err) {
    console.error("proposal-choice: notifying the agent failed", err);
  }

  return NextResponse.json({ ok: true });
}
