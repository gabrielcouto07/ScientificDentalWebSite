/**
 * Fabricantes representados. Módulo sem "server-only" de propósito: é lido pelo
 * servidor (páginas, cartões) e pelo cliente (filtro do catálogo).
 *
 * Regra de cor: a cor do fabricante é dado, não cromo. Ela só aparece no filete
 * do cartão de produto, no chip de filtro e no traço do eyebrow da página do
 * produto, porque nesses lugares "quem fabricou" é a informação que o elemento
 * comunica. Nunca em botão, link, título ou fundo de seção. Nunca texto branco
 * sobre o laranja Carestream (2,6:1, reprova AA). Ver docs/DESIGN-PLAN.md.
 */
export type BrandKey = "morita" | "carestream" | "scientific";

export type Brand = {
  key: BrandKey;
  /** Valor exato de product.brand no JSON; null = item de marca própria ou insumo sem fabricante declarado */
  match: string | null;
  label: string;
  short: string;
  /** Classe Tailwind do filete identificador. Literal de propósito: o Tailwind precisa ver a classe no fonte. */
  accent: string;
};

export const BRANDS: Record<BrandKey, Brand> = {
  morita: { key: "morita", match: "J. Morita", label: "J. Morita", short: "Morita", accent: "bg-marca-morita" },
  carestream: { key: "carestream", match: "Carestream", label: "Carestream", short: "Carestream", accent: "bg-marca-carestream" },
  scientific: { key: "scientific", match: null, label: "Scientific Dental", short: "Scientific", accent: "bg-marca" },
};

/** Ordem de exibição nos filtros: as duas fabricantes primeiro, marca própria por último. */
export const BRAND_ORDER: BrandKey[] = ["morita", "carestream", "scientific"];

export function brandKeyOf(brand: string | null | undefined): BrandKey {
  return BRAND_ORDER.find((k) => BRANDS[k].match === (brand ?? null)) ?? "scientific";
}

export function isBrandKey(value: string | null | undefined): value is BrandKey {
  return value === "morita" || value === "carestream" || value === "scientific";
}
