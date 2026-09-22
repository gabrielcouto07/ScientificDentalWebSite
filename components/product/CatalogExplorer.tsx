"use client";

import Link from "next/link";
import { useDeferredValue, useSyncExternalStore, ViewTransition, type ReactNode } from "react";
import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";
import { BRAND_ORDER, BRANDS, brandKeyOf, isBrandKey, type BrandKey } from "@/lib/brands";
import { cn } from "@/lib/utils";

export type CatalogCategory = { slug: string; name: string; shortName: string; description: string };

type Props = { products: ProductCardData[]; categories: CatalogCategory[] };
type BrandFilter = BrandKey | "all";

/**
 * Catálogo com filtro por fabricante e categoria, sem ida ao servidor.
 *
 * A URL é a única fonte de verdade (?marca=morita&categoria=imagem-3d): o
 * link é compartilhável e voltar/avançar funcionam. window.location.search é
 * lida como store externa com snapshot vazio no servidor, então o HTML
 * estático traz o catálogo inteiro para buscadores e para quem está sem JS.
 * useDeferredValue transforma a troca de filtro numa transição, o que faz o
 * <ViewTransition> animar a saída da grade antiga e a entrada da nova.
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}
const getSearch = () => window.location.search;
const getServerSearch = () => "";

function readFilters(search: string, categories: CatalogCategory[]) {
  const q = new URLSearchParams(search);
  const marca = q.get("marca");
  const categoria = q.get("categoria");
  return {
    brand: (isBrandKey(marca) ? marca : "all") as BrandFilter,
    category: categoria && categories.some((c) => c.slug === categoria) ? categoria : "all",
  };
}

function writeFilters(brand: BrandFilter, category: string) {
  const q = new URLSearchParams();
  if (brand !== "all") q.set("marca", brand);
  if (category !== "all") q.set("categoria", category);
  const qs = q.toString();
  // Preserva history.state: o roteador do Next guarda o próprio estado ali.
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  listeners.forEach((l) => l());
}

export function CatalogExplorer({ products, categories }: Props) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const deferred = useDeferredValue(search);
  const pending = search !== deferred;
  const { brand, category } = readFilters(deferred, categories);
  const filtering = brand !== "all" || category !== "all";

  const matches = (p: ProductCardData, b: BrandFilter, c: string) =>
    (b === "all" || brandKeyOf(p.brand) === b) && (c === "all" || p.category === c);

  // Contagens cruzadas: cada chip mostra quantos itens sobram se ele for escolhido
  const brandCounts = Object.fromEntries(
    BRAND_ORDER.map((k) => [k, products.filter((p) => matches(p, k, category)).length]),
  ) as Record<BrandKey, number>;
  const categoryCounts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => matches(p, brand, c.slug)).length]),
  ) as Record<string, number>;

  const visible = products.filter((p) => matches(p, brand, category));
  const sections = categories
    .filter((c) => category === "all" || c.slug === category)
    .map((c) => ({ ...c, items: visible.filter((p) => p.category === c.slug) }))
    .filter((s) => s.items.length > 0);

  const clear = () => writeFilters("all", "all");

  return (
    <>
      <div className="glass sticky top-16 z-30 border-b border-escala/80">
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <ChipGroup label="Fabricante">
              <Chip active={brand === "all"} onClick={() => writeFilters("all", category)}>
                Todos
              </Chip>
              {BRAND_ORDER.map((k) => (
                <Chip
                  key={k}
                  active={brand === k}
                  count={brandCounts[k]}
                  tick={BRANDS[k].accent}
                  onClick={() => writeFilters(brand === k ? "all" : k, category)}
                >
                  {BRANDS[k].short}
                </Chip>
              ))}
            </ChipGroup>
            <ChipGroup label="Categoria">
              <Chip active={category === "all"} onClick={() => writeFilters(brand, "all")}>
                Todas
              </Chip>
              {categories.map((c) => (
                <Chip
                  key={c.slug}
                  active={category === c.slug}
                  count={categoryCounts[c.slug]}
                  onClick={() => writeFilters(brand, category === c.slug ? "all" : c.slug)}
                >
                  {c.shortName}
                </Chip>
              ))}
            </ChipGroup>
          </div>
          <p className="flex shrink-0 items-center gap-4 font-mono text-xs text-tecido" aria-live="polite">
            <span>
              {visible.length} {visible.length === 1 ? "item" : "itens"}
            </span>
            {filtering && (
              <button type="button" onClick={clear} className="link inline-flex items-center gap-1 font-sans text-marca">
                <CloseIcon size={14} />
                Limpar filtros
              </button>
            )}
          </p>
        </Container>
      </div>

      <div aria-busy={pending} className={cn("transition-opacity duration-150", pending && "opacity-70")}>
        <ViewTransition key={`${brand}:${category}`} enter="catalog-in" exit="catalog-out" default="none">
          <div>
            {sections.length === 0 ? (
              <Container className="py-16 sm:py-20">
                <div className="card mx-auto max-w-lg p-8 text-center">
                  <p className="text-lg font-semibold text-marca">Nenhum item com esses filtros</p>
                  <p className="mt-2 text-sm text-tecido">Combine outro fabricante ou categoria, ou limpe os filtros.</p>
                  <Button variant="secondary" onClick={clear} className="mt-6">
                    Limpar filtros
                  </Button>
                </div>
              </Container>
            ) : (
              sections.map((c, ci) => (
                <section
                  key={c.slug}
                  id={c.slug}
                  aria-labelledby={`${c.slug}-title`}
                  className={cn("scroll-mt-36", ci % 2 === 1 && "bg-osso")}
                >
                  <Container className="py-14 sm:py-16">
                    <div className={cn(!filtering && "reveal", "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between")}>
                      <div className="max-w-2xl">
                        <h2 id={`${c.slug}-title`} className="text-2xl sm:text-3xl">
                          <Link href={`/produtos/${c.slug}`} className="inline-flex items-center gap-2 hover:underline">
                            {c.name}
                            <ArrowRightIcon size={22} className="text-marca" />
                          </Link>
                        </h2>
                        <p className="mt-2 text-tecido">{c.description}</p>
                      </div>
                      <p className="font-mono text-xs text-tecido">
                        {c.items.length} {c.items.length === 1 ? "item" : "itens"}
                      </p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {c.items.map((p, i) => (
                        <ProductCard
                          key={p.slug}
                          product={p}
                          priority={!filtering && ci === 0 && i < 2}
                          className={cn(
                            !filtering && "reveal",
                            !filtering && i % 4 === 1 && "reveal-delay-1",
                            !filtering && i % 4 >= 2 && "reveal-delay-2",
                          )}
                        />
                      ))}
                    </div>
                  </Container>
                </section>
              ))
            )}
          </div>
        </ViewTransition>
      </div>
    </>
  );
}

function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar -mx-4 flex items-center gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <span className="mr-1 shrink-0 text-xs font-medium text-tecido">{label}</span>
      {children}
    </div>
  );
}

/**
 * Chip de filtro. Ativo = preenchido em Marca (a cor da interface). O tick
 * colorido do fabricante identifica a prateleira e some no estado ativo,
 * para o laranja nunca encostar em texto branco.
 */
function Chip({
  active,
  count,
  tick,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  tick?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={count === 0 && !active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium",
        "transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out-soft active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-40",
        active
          ? "border-marca bg-marca text-radiopaco shadow-soft"
          : "border-escala bg-radiopaco text-marca hover:border-marca hover:bg-marca-tint",
      )}
    >
      {tick && <span aria-hidden className={cn("inline-block h-3 w-0.5 rounded-full", active ? "bg-radiopaco/80" : tick)} />}
      {children}
      {count !== undefined && (
        <span className={cn("font-mono text-xs", active ? "text-radiopaco/70" : "text-tecido")}>{count}</span>
      )}
    </button>
  );
}
