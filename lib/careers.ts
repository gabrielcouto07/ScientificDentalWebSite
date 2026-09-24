import "server-only";
import site from "@/content/site.json";
import type { CareersInput, CvKind } from "./careers-schema";
import { PRIVACY_POLICY_VERSION, protocolId } from "./leads";
import { defaultSender, smtpTransport } from "./mailer";

/**
 * Entrega de currículos ao RH. Só por e-mail, com o arquivo anexado:
 * currículo não vai para o webhook do CRM comercial.
 *
 * Variáveis de ambiente (ver .env.example):
 *   CAREERS_TO   destinatário(s), separados por vírgula. Padrão: e-mail do RH em content/site.json
 *   SMTP_*, LEAD_FROM  o mesmo SMTP dos leads
 */

export type Application = Omit<CareersInput, "consent" | "website"> & {
  id: string;
  receivedAt: string;
  consent: { accepted: true; at: string; policyVersion: string };
  cv: { filename: string; kind: CvKind; mime: string; size: number; content: Buffer };
};

export function buildApplication(input: CareersInput, cv: Application["cv"]): Application {
  const { consent: _c, website: _w, ...rest } = input;
  const now = new Date().toISOString();
  return {
    ...rest,
    id: protocolId("RH"),
    receivedAt: now,
    consent: { accepted: true, at: now, policyVersion: PRIVACY_POLICY_VERSION },
    cv,
  };
}

function renderText(app: Application): string {
  const kb = Math.max(1, Math.round(app.cv.size / 1024));
  return [
    `Currículo recebido pelo site · ${app.id}`,
    `Recebido em: ${app.receivedAt}`,
    "",
    `Nome: ${app.name}`,
    `E-mail: ${app.email}`,
    `Telefone/WhatsApp: ${app.phone}`,
    app.city ? `Cidade/UF: ${app.city}` : null,
    app.linkedin ? `LinkedIn: ${app.linkedin}` : null,
    app.message ? `\nApresentação:\n${app.message}` : null,
    "",
    `Anexo: ${app.cv.filename} (${kb} KB)`,
    `Consentimento LGPD: aceito em ${app.consent.at} (política ${app.consent.policyVersion})`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Envia a candidatura. Sem SMTP em desenvolvimento, registra no console e
 * considera entregue; em produção, falha para que a pessoa saiba que não chegou.
 */
export async function deliverApplication(app: Application): Promise<boolean> {
  const to = process.env.CAREERS_TO || site.emails.hr;
  const transport = smtpTransport();
  if (!transport) {
    if (process.env.NODE_ENV === "production") {
      console.error("[careers] SMTP não configurado; currículo não entregue");
      return false;
    }
    console.info("[careers] SMTP não configurado; candidatura registrada no console:\n" + renderText(app));
    return true;
  }
  try {
    await transport.sendMail({
      from: defaultSender(to),
      to,
      replyTo: app.email,
      subject: `[Site] Currículo · ${app.name}`,
      text: renderText(app),
      attachments: [{ filename: app.cv.filename, content: app.cv.content, contentType: app.cv.mime }],
    });
    return true;
  } catch (err) {
    console.error("[careers] falha de entrega:", err);
    return false;
  }
}
