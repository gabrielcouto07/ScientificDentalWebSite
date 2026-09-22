import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { CatalogExplorer, type CatalogCategory } from "@/components/product/CatalogExplorer";
import { toCardData } from "@/components/product/ProductCard";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getCategories, getProducts } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Produtos: tomógrafos, panorâmicos, endodontia e insumos",
  description:
    "Catálogo J. Morita e Carestream da Scientific Dental: Veraview X800, Veraviewepocs 3D, Tri Auto ZX2, impressoras DryView, filmes e proteção radiológica. Preço sob consulta.",
  path: "/produtos",
});

/**
 * Hub de produtos. A página continua estática: o servidor manda o catálogo
 * inteiro (uma seção por categoria) e o filtro por fabricante e categoria roda
 * no cliente, sem nova requisição. Só os campos que o cartão usa vão para o
 * cliente; specs, FOVs e seções ficam no servidor.
 */
export default function ProdutosPage() {
  const categories: CatalogCategory[] = getCategories().map(({ slug, name, shortName, description }) => ({
    slug,
    name,
    shortName,
    description,
  }));
  const products = getProducts().map(toCardData);

  return (
    <main id="conteudo" className="flex-1">
      <JsonLd data={breadcrumbJsonLd([{ name: "Produtos", path: "/produtos" }])} />
      <PageHero
        compact
        eyebrow="Catálogo"
        title="Produtos"
        lead="Equipamentos J. Morita e Carestream e os insumos que um centro de radiologia usa todo dia. Todo item é vendido e atendido pela Scientific Dental."
      />
      <CatalogExplorer products={products} categories={categories} />
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
