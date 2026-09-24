import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { MobileCtaBar } from "@/components/product/MobileCtaBar";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductPage } from "@/components/product/ProductPage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import {
  getCategories,
  getCategory,
  getProducts,
  getProductsByCategory,
  getRelatedProducts,
  getSite,
  resolveProductRoute,
} from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { quoteWhatsappLink, whatsappMessages } from "@/lib/whatsapp";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return [...getCategories().map((c) => ({ slug: c.slug })), ...getProducts().map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveProductRoute(slug);
  if (!route) return {};
  if (route.kind === "category") {
    const c = route.category;
    return pageMetadata({
      title: `${c.name} | Produtos`,
      description: `${c.description} Venda e assistência técnica pela Scientific Dental, distribuidora oficial no Brasil.`,
      path: `/produtos/${c.slug}`,
    });
  }
  const p = route.product;
  return pageMetadata({
    title: `${p.name}${p.brand ? ` ${p.brand}` : ""}: ${p.tagline}`,
    description: p.summary.length > 155 ? `${p.summary.slice(0, 152).trimEnd()}…` : p.summary,
    path: `/produtos/${p.slug}`,
    image: { url: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt },
  });
}

/**
 * /produtos/[slug] atende categoria e produto na mesma rota, porque a IA
 * pede /produtos/imagem-3d e /produtos/veraview-x800 no mesmo nível.
 */
export default async function ProdutoOuCategoriaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = resolveProductRoute(slug);
  if (!route) notFound();
  const site = getSite();

  if (route.kind === "category") {
    const category = route.category;
    const products = getProductsByCategory(category.slug);
    const categories = getCategories();
    return (
      <main id="conteudo" className="flex-1">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Produtos", path: "/produtos" },
            { name: category.name, path: `/produtos/${category.slug}` },
          ])}
        />
        <PageHero
          compact
          breadcrumb={<Breadcrumb items={[{ name: "Produtos", href: "/produtos" }, { name: category.name }]} />}
          eyebrow="Categoria"
          title={category.name}
          lead={category.description}
          actions={
            <nav aria-label="Categorias" className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0">
              {categories.map((c) => {
                const active = c.slug === category.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/produtos/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                      active
                        ? "border-marca bg-marca text-radiopaco"
                        : "border-escala bg-radiopaco text-marca shadow-soft hover:border-marca hover:bg-marca-tint",
                    )}
                  >
                    {c.shortName}
                  </Link>
                );
              })}
            </nav>
          }
        />
        <Container className="py-12 sm:py-16">
          <p className="font-mono text-xs text-tecido">
            {products.length} {products.length === 1 ? "item" : "itens"}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.slug}
                product={p}
                priority={i < 2}
                className={cn("reveal", i % 4 === 1 && "reveal-delay-1", i % 4 >= 2 && "reveal-delay-2")}
              />
            ))}
          </div>
          <div className="card reveal mt-10 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xl font-semibold text-marca">Orçamento para {category.name.toLowerCase()}</p>
              <p className="mt-1 text-sm text-tecido">Preço sob consulta. Assistência técnica oficial no Brasil.</p>
            </div>
            <Button href={`/orcamento?categoria=${category.slug}`} size="lg">
              Solicitar orçamento
              <ButtonArrow />
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  const product = route.product;
  const category = getCategory(product.category);
  if (!category) notFound();
  const related = getRelatedProducts(product, 3);
  const whatsappHref = quoteWhatsappLink(whatsappMessages.product(product.name));

  return (
    <main id="conteudo" className="has-cta-bar flex-1 pb-20 sm:pb-0">
      <JsonLd
        data={[
          productJsonLd(product, category.name),
          breadcrumbJsonLd([
            { name: "Produtos", path: "/produtos" },
            { name: category.name, path: `/produtos/${category.slug}` },
            { name: product.name, path: `/produtos/${product.slug}` },
          ]),
        ]}
      />
      <ProductPage product={product} category={category} related={related} site={site} whatsappHref={whatsappHref} />
      <MobileCtaBar />
    </main>
  );
}
