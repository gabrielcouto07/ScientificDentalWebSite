import { z } from "zod";
import options from "../content/forms.json" with { type: "json" };

export const quoteStepSchema = z.object({
  equipment: z.string().refine((v) => options.equipment.some((o) => o.value === v), "Escolha um equipamento para continuar."),
  operation: z.string().refine((v) => options.operation.some((o) => o.value === v), "Escolha o tipo de operação para continuar."),
  timeline: z.string().refine((v) => options.timeline.some((o) => o.value === v), "Escolha um prazo para continuar."),
});

export const leadSchema = z.object({
  kind: z.enum(["orcamento", "contato", "suporte", "produto"]),
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Use até 120 caracteres"),
  email: z.string().trim().email("E-mail inválido").max(160, "Use até 160 caracteres"),
  phone: z
    .string()
    .trim()
    .min(10, "Informe telefone com DDD")
    .max(20, "Use até 20 caracteres")
    .regex(/^[\d\s()+-]+$/, "Use apenas números, parênteses e traços")
    .refine((value) => /^(?:55)?[1-9]{2}\d{8,9}$/.test(value.replace(/\D/g, "")), "Informe um telefone válido com DDD"),
  company: z.string().trim().max(160, "Use até 160 caracteres").optional().or(z.literal("")),
  city: z.string().trim().max(120, "Use até 120 caracteres").optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Use até 2.000 caracteres").optional().or(z.literal("")),
  product: z.string().trim().max(160, "Use até 160 caracteres").optional().or(z.literal("")),
  operation: z.string().trim().max(80, "Use até 80 caracteres").optional().or(z.literal("")),
  timeline: z.string().trim().max(80, "Use até 80 caracteres").optional().or(z.literal("")),
  equipment: z.string().trim().max(400, "Use até 400 caracteres").optional().or(z.literal("")),
  consent: z.literal("on", { message: "É preciso aceitar a política de privacidade" }),
  sourcePath: z.string().max(300).optional().or(z.literal("")),
  /** honeypot: deve chegar vazio */
  website: z.string().max(200).optional(),
}).superRefine((data, context) => {
  if (data.kind !== "orcamento") return;
  for (const key of ["equipment", "operation", "timeline"] as const) {
    const result = quoteStepSchema.shape[key].safeParse(data[key]);
    if (!result.success) context.addIssue({ code: "custom", path: [key], message: result.error.issues[0].message });
  }
});

export type LeadInput = z.infer<typeof leadSchema>;
