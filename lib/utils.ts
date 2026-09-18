/** Junta classes ignorando valores falsos. Evita uma dependência só para isso. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Formata datas ISO (AAAA-MM-DD) no padrão brasileiro curto: 22 fev 2024. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00-03:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(d)
    .replace(/\./g, "")
    .replace(" de ", " ");
}

/** Anos completos desde um ano de referência, calculados em tempo de build. */
export function yearsSince(year: number, now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - year);
}

/** Converte "+553121121900" em "tel:+553121121900". */
export function telHref(e164: string): string {
  return `tel:${e164}`;
}

/** Slug seguro para âncoras e ids. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
