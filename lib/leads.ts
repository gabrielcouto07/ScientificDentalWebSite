import "server-only";
import nodemailer from "nodemailer";
import type { LeadInput } from "./lead-schema";
export { leadSchema } from "./lead-schema";

/**
 * Entrega de leads. Ponto único de integração com o CRM.
 *
 * Hoje: e-mail (SMTP) + webhook genérico (RD Station, HubSpot, Zapier, n8n...).
 * Quando o cliente confirmar o CRM, a integração nativa entra aqui, e só aqui.
 * Nada é "hardcoded" para um fornecedor.
 *
 * Variáveis de ambiente (ver .env.example):
 *   LEAD_WEBHOOK_URL   POST JSON com o lead (opcional)
 *   LEAD_WEBHOOK_TOKEN Authorization: Bearer <token> (opcional)
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
 *   LEAD_TO            destinatário(s) do e-mail, separados por vírgula
 *   LEAD_FROM          remetente
 */

export type Lead = Omit<LeadInput, "consent" | "website"> & {
  id: string;
  receivedAt: string;
  consent: { accepted: true; at: string; policyVersion: string };
  userAgent?: string;
};

export const PRIVACY_POLICY_VERSION = "2026-09-17";

export function buildLead(input: LeadInput, meta: { userAgent?: string } = {}): Lead {
  const { consent: _c, website: _w, ...rest } = input;
  const now = new Date().toISOString();
  return {
    ...rest,
    id: `SD-${Date.now().toString(36).toUpperCase()}`,
    receivedAt: now,
    consent: { accepted: true, at: now, policyVersion: PRIVACY_POLICY_VERSION },
    userAgent: meta.userAgent,
  };
}

const KIND_LABEL: Record<Lead["kind"], string> = {
  orcamento: "Pedido de orçamento",
  contato: "Contato pelo site",
  suporte: "Chamado técnico",
  produto: "Orçamento de produto",
};

function renderText(lead: Lead): string {
  const lines = [
    `${KIND_LABEL[lead.kind]} · ${lead.id}`,
    `Recebido em: ${lead.receivedAt}`,
    "",
    `Nome: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefone/WhatsApp: ${lead.phone}`,
    lead.company ? `Empresa/clínica: ${lead.company}` : null,
    lead.city ? `Cidade/UF: ${lead.city}` : null,
    lead.product ? `Produto: ${lead.product}` : null,
    lead.equipment ? `Equipamento de interesse: ${lead.equipment}` : null,
    lead.operation ? `Tipo de operação: ${lead.operation}` : null,
    lead.timeline ? `Prazo estimado: ${lead.timeline}` : null,
    lead.message ? `\nMensagem:\n${lead.message}` : null,
    "",
    `Origem: ${lead.sourcePath || "-"}`,
    `Consentimento LGPD: aceito em ${lead.consent.at} (política ${lead.consent.policyVersion})`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

async function sendWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LEAD_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
  return true;
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, LEAD_TO, LEAD_FROM } = process.env;
  if (!SMTP_HOST || !LEAD_TO) return false;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === "true",
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: LEAD_FROM ?? SMTP_USER ?? LEAD_TO,
    to: LEAD_TO,
    replyTo: lead.email,
    subject: `[Site] ${KIND_LABEL[lead.kind]}${lead.product ? `: ${lead.product}` : ""} · ${lead.name}`,
    text: renderText(lead),
  });
  return true;
}

/**
 * Entrega o lead por todos os canais configurados. Se nenhum estiver
 * configurado (desenvolvimento), registra no console e considera entregue.
 */
export async function deliverLead(lead: Lead): Promise<{ delivered: boolean; channels: string[] }> {
  const channels: string[] = [];
  const results = await Promise.allSettled([sendWebhook(lead), sendEmail(lead)]);
  const [webhook, email] = results;
  if (webhook.status === "fulfilled" && webhook.value) channels.push("webhook");
  if (email.status === "fulfilled" && email.value) channels.push("email");
  for (const r of results) {
    if (r.status === "rejected") console.error("[leads] falha de entrega:", r.reason);
  }
  if (channels.length === 0) {
    const anyConfigured = Boolean(process.env.LEAD_WEBHOOK_URL || process.env.SMTP_HOST);
    if (anyConfigured || process.env.NODE_ENV === "production") return { delivered: false, channels };
    console.info("[leads] nenhum canal configurado; lead registrado no console:\n" + renderText(lead));
    channels.push("console");
  }
  return { delivered: true, channels };
}
