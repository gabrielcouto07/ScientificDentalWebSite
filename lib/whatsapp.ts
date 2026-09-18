import site from "@/content/site.json";

/**
 * Monta um deep link wa.me com mensagem pré-preenchida.
 * Cada página passa o próprio contexto (produto, seção) para que o
 * atendimento já saiba de onde a pessoa veio.
 */
export function whatsappLink(message: string, number: string = site.whatsapp.e164): string {
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${text}`;
}

export const whatsappMessages = {
  default: "Olá, vim pelo site da Scientific Dental e gostaria de falar com um especialista.",
  product: (name: string) =>
    `Olá, vim pelo site da Scientific Dental e gostaria de um orçamento do ${name}.`,
  quote: (step?: string) =>
    `Olá, estava preenchendo o pedido de orçamento no site${step ? ` (etapa: ${step})` : ""} e prefiro continuar por aqui.`,
  support: "Olá, preciso de assistência técnica para um equipamento. Vim pelo site da Scientific Dental.",
  legacy: "Olá, quero saber mais sobre o Legacy SD.",
};
