import "server-only";
import nodemailer from "nodemailer";

/**
 * Transporte SMTP compartilhado por leads (lib/leads.ts) e currículos
 * (lib/careers.ts). Devolve null quando o SMTP não está configurado, para
 * que cada chamador decida entre registrar no console (dev) ou falhar (produção).
 */
export function smtpTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === "true",
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

/** Remetente padrão: LEAD_FROM, depois o usuário SMTP, depois o destinatário. */
export function defaultSender(fallback: string): string {
  return process.env.LEAD_FROM ?? process.env.SMTP_USER ?? fallback;
}
