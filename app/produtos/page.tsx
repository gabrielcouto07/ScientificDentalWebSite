import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { getCategories, getProductsByCategory } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Produtos: tomógrafos, panorâmicos, endodontia e insumos",
  description:
    "Catálogo J. Morita e Carestream da Scientific Dental: Veraview X800, Veraviewepocs 3D, Tri Auto ZX2, impressoras DryView, filmes e proteção radiológica. Preço sob consulta.",
  path: "/produtos",
});

/** Hub de produtos: uma seção por categoria, navegação por âncoras. */
export default function ProdutosPage() {
  const categories = getCategories();
  return (
    <main id="conteudo" className="flex-1">
      <JsonLd data={breadcrumbJsonLd([{ name: "Produtos", path: "/produtos" }])} />
      <PageHero
        eyebrow="Catálogo"
        title="Produtos"
        lead="Equipamentos J. Morita e Carestream e os insumos que um centro de radiologia usa todo dia. Todo item é vendido e atendido pela Scientific Dental."
        actions={
          <nav aria-label="Categorias" className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0">
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-escala bg-radiopaco px-4 text-sm font-medium text-marca shadow-soft transition-colors hover:border-marca hover:bg-marca-tint"
              >
                {c.shortName}
              </a>
            ))}
          </nav>
        }
      />
      {categories.map((c, ci) => {
        const products = getProductsByCategory(c.slug);
        return (
          <section
            key={c.slug}
            id={c.slug}
            aria-labelledby={`${c.slug}-title`}
            className={cn("scroll-mt-24", ci % 2 === 1 && "bg-osso")}
          >
            <Container className="py-14 sm:py-16">
              <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                  {products.length} {products.length === 1 ? "item" : "itens"}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    priority={ci === 0 && i < 2}
                    className={cn("reveal", i % 4 === 1 && "reveal-delay-1", i % 4 >= 2 && "reveal-delay-2")}
                  />
                ))}
              </div>
            </Container>
          </section>
        );
      })}
      <Container className="py-14 sm:py-16">
        <div className="card reveal flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xl font-semibold text-marca">Não achou o que procura?</p>
            <p className="mt-1 text-sm text-tecido">Preço sob consulta. Um especialista monta a proposta com você.</p>
          </div>
          <Button href="/orcamento" size="lg">
            Solicitar orçamento
            <ButtonArrow />
          </Button>
        </div>
      </Container>
    </main>
  );
}
