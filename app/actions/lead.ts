"use server";

import { headers } from "next/headers";
import { buildLead, deliverLead, leadSchema } from "@/lib/leads";
import { consumeLeadRateLimit, requestIp } from "@/lib/rate-limit";

export type LeadState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; id: string };

const VISIBLE_FIELDS = new Set(["name", "email", "phone", "company", "city", "message", "equipment", "operation", "timeline", "consent"]);

/**
 * Server action compartilhada por todos os formulários (orçamento, contato,
 * suporte, produto). Valida com zod, descarta bots pelo honeypot e entrega
 * via lib/leads.ts.
 */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, typeof v === "string" ? v : ""]),
  );

  // Bots receive no delivery and do not consume a real visitor's quota.
  if (raw.website?.trim()) return { status: "success", id: "SD-OK" };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Campos ocultos (kind, sourcePath, product) não têm onde exibir o erro: sem
    // isso, a pessoa veria "confira os campos destacados" sem nada destacado.
    const visible = Object.keys(fieldErrors).some((key) => VISIBLE_FIELDS.has(key));
    return {
      status: "error",
      message: visible ? "Confira os campos destacados." : "Não conseguimos enviar o formulário. Recarregue a página e tente de novo.",
      fieldErrors,
    };
  }

  const ip = await requestIp();
  const ua = (await headers()).get("user-agent") ?? undefined;
  const lead = buildLead(parsed.data, { userAgent: ua });

  try {
    if (!(await consumeLeadRateLimit(ip))) {
      return {
        status: "error",
        message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos ou fale conosco pelo WhatsApp.",
      };
    }
    const result = await deliverLead(lead);
    if (!result.delivered) {
      return {
        status: "error",
        message: "Não conseguimos registrar seu pedido agora. Tente de novo ou fale conosco pelo WhatsApp.",
      };
    }
    return { status: "success", id: lead.id };
  } catch (err) {
    console.error("[leads] erro inesperado", err);
    return {
      status: "error",
      message: "Não conseguimos registrar seu pedido agora. Tente de novo ou fale conosco pelo WhatsApp.",
    };
  }
}
