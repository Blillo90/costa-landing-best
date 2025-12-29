export const prerender = false;

import type { APIRoute } from "astro";
import { sql } from "@vercel/postgres";
import { z } from "zod";

const LeadSchema = z.object({
  intent: z.enum(["buy", "sell"]),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(40),

  preferredLang: z.string().optional(),
  propertyType: z.string().optional(),
  zone: z.string().optional(),
  estimatedPrice: z.string().optional(),
  budget: z.string().optional(),
  usage: z.string().optional(),
  message: z.string().optional(),

  consent: z.any().optional(),
  hp: z.string().optional(),
});

function toNumberOrNull(v?: string) {
  if (!v) return null;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return new Response(JSON.stringify({ ok: false }), { status: 415 });
  }

  const body = await request.json().catch(() => null);
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  const lead = parsed.data;

  if (lead.hp && lead.hp.trim().length) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  if (!lead.consent) {
    return new Response(JSON.stringify({ ok: false, error: "consent_required" }), { status: 400 });
  }

  const ua = request.headers.get("user-agent") || null;
  const ip = clientAddress || null;

  await sql`
    insert into leads (
      intent, name, email, phone,
      preferred_lang, property_type, zone,
      estimated_price, budget, usage, message,
      user_agent, ip
    ) values (
      ${lead.intent}, ${lead.name}, ${lead.email}, ${lead.phone},
      ${lead.preferredLang ?? null}, ${lead.propertyType ?? null}, ${lead.zone ?? null},
      ${toNumberOrNull(lead.estimatedPrice)}, ${toNumberOrNull(lead.budget)},
      ${lead.usage ?? null}, ${lead.message ?? null},
      ${ua}, ${ip}
    )
  `;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
