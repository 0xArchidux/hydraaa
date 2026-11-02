import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PHONE_RE = /^(\+?48)?[1-9]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowe dane." }, { status: 400 });
  }

  // Honeypot – boty wypełniają ukryte pole; udajemy sukces i nic nie wysyłamy.
  if (clean(body.website, 100)) return NextResponse.json({ ok: true });

  const services = Array.isArray(body.services)
    ? body.services.map((s) => clean(s, 40)).filter(Boolean).slice(0, 6)
    : [];
  const lead = {
    services,
    object: clean(body.object, 40),
    area: Number(body.area) || null,
    name: clean(body.name, 80),
    phone: clean(body.phone, 30),
    email: clean(body.email, 120),
    city: clean(body.city, 80),
    note: clean(body.note, 600),
    consent: body.consent === true,
    receivedAt: new Date().toISOString(),
    source: "hydra-instal-landing",
  };

  const invalid =
    services.length === 0 ||
    !lead.object ||
    lead.name.length < 2 ||
    !PHONE_RE.test(lead.phone.replace(/[\s-]/g, "")) ||
    (lead.email !== "" && !EMAIL_RE.test(lead.email)) ||
    !lead.city ||
    !lead.consent;

  if (invalid) {
    return NextResponse.json({ ok: false, error: "Uzupełnij wymagane pola." }, { status: 422 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } catch (err) {
      console.error("[lead] webhook error", err);
      return NextResponse.json({ ok: false, error: "Nie udało się zapisać zgłoszenia." }, { status: 502 });
    }
  } else {
    // Tryb deweloperski: bez webhooka lead trafia tylko do logów serwera.
    console.log("[lead]", lead);
  }

  return NextResponse.json({ ok: true });
}
