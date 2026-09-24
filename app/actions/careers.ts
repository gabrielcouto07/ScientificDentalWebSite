"use server";

import { buildApplication, deliverApplication } from "@/lib/careers";
import { careersSchema, checkCv, cvFilename, type CvKind } from "@/lib/careers-schema";
import { consumeLeadRateLimit, requestIp } from "@/lib/rate-limit";

export type CareersState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; id: string };

const FAILURE = "Não conseguimos enviar seu currículo agora. Tente de novo ou envie direto para o e-mail do RH.";

/**
 * Recebe a candidatura do Trabalhe conosco: valida os campos com zod,
 * confere o arquivo pelos primeiros bytes e envia ao RH com o CV anexado.
 */
export async function submitApplication(_prev: CareersState, formData: FormData): Promise<CareersState> {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };

  // Bots: sucesso silencioso, sem entrega e sem gastar a cota de quem é real.
  if (text("website")?.trim()) return { status: "success", id: "RH-OK" };

  const parsed = careersSchema.safeParse({
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    city: text("city") ?? "",
    linkedin: text("linkedin") ?? "",
    message: text("message") ?? "",
    consent: text("consent"),
  });

  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }

  const file = formData.get("cv");
  let cv: { kind: CvKind; mime: string; bytes: Buffer } | null = null;
  if (!(file instanceof File) || file.size === 0) {
    fieldErrors.cv = "Anexe seu currículo";
  } else {
    const bytes = Buffer.from(await file.arrayBuffer());
    const check = checkCv(file, bytes.subarray(0, 8));
    if (check.ok) cv = { kind: check.kind, mime: check.mime, bytes };
    else fieldErrors.cv = check.message;
  }

  if (!parsed.success || !cv) {
    return { status: "error", message: "Confira os campos destacados.", fieldErrors };
  }

  try {
    if (!(await consumeLeadRateLimit(await requestIp(), "careers"))) {
      return { status: "error", message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo." };
    }
    const application = buildApplication(parsed.data, {
      filename: cvFilename(parsed.data.name, cv.kind),
      kind: cv.kind,
      mime: cv.mime,
      size: cv.bytes.length,
      content: cv.bytes,
    });
    if (!(await deliverApplication(application))) return { status: "error", message: FAILURE };
    return { status: "success", id: application.id };
  } catch (err) {
    console.error("[careers] erro inesperado", err);
    return { status: "error", message: FAILURE };
  }
}
