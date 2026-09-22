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

/** Slug seguro para âncoras e ids. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
