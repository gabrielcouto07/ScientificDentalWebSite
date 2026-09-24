import { z } from "zod";

/**
 * Candidatura espontânea (Trabalhe conosco). Sem vagas listadas: a pessoa
 * envia contato, uma apresentação curta opcional e o currículo.
 */
export const careersSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Use até 120 caracteres"),
  email: z.string().trim().email("E-mail inválido").max(160, "Use até 160 caracteres"),
  phone: z
    .string()
    .trim()
    .min(10, "Informe telefone com DDD")
    .max(20, "Use até 20 caracteres")
    .regex(/^[\d\s()+-]+$/, "Use apenas números, parênteses e traços")
    .refine((value) => /^(?:55)?[1-9]{2}\d{8,9}$/.test(value.replace(/\D/g, "")), "Informe um telefone válido com DDD"),
  city: z.string().trim().max(120, "Use até 120 caracteres").optional().or(z.literal("")),
  linkedin: z
    .string()
    .trim()
    .max(200, "Use até 200 caracteres")
    .refine((value) => value === "" || /^(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com\/\S+$/i.test(value), "Informe um link do LinkedIn")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(1500, "Use até 1.500 caracteres").optional().or(z.literal("")),
  consent: z.literal("on", { message: "É preciso aceitar a política de privacidade" }),
  /** honeypot: deve chegar vazio */
  website: z.string().max(200).optional(),
});

export type CareersInput = z.infer<typeof careersSchema>;

/**
 * 4 MB: a Vercel recusa corpos de requisição acima de 4,5 MB em funções,
 * e o formulário ainda leva os campos de texto junto com o arquivo.
 */
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const CV_TYPES = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] }, // ZIP
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
} as const;

export type CvKind = keyof typeof CV_TYPES;

/**
 * Confere extensão, tamanho e os primeiros bytes do arquivo. O tipo MIME
 * enviado pelo navegador não é confiável; a assinatura do arquivo é.
 */
export function checkCv(
  file: { name: string; size: number },
  head: Uint8Array,
): { ok: true; kind: CvKind; mime: string } | { ok: false; message: string } {
  if (file.size === 0) return { ok: false, message: "Anexe seu currículo" };
  if (file.size > CV_MAX_BYTES) return { ok: false, message: "O arquivo passa de 4 MB. Exporte um PDF mais leve." };
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  if (!Object.hasOwn(CV_TYPES, extension)) return { ok: false, message: "Envie o currículo em PDF, DOC ou DOCX" };
  const kind = extension as CvKind;
  const { magic, mime } = CV_TYPES[kind];
  if (!magic.every((byte, index) => head[index] === byte)) {
    return { ok: false, message: "O arquivo não parece ser um PDF ou documento do Word válido" };
  }
  return { ok: true, kind, mime };
}

/** Nome do anexo no e-mail do RH: "CV - Nome Sobrenome.pdf", sem caracteres problemáticos. */
export function cvFilename(name: string, kind: CvKind): string {
  const clean = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
  return `CV - ${clean || "candidato"}.${kind}`;
}
