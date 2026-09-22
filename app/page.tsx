import type { Metadata } from "next";
import { CategoryPlate } from "@/components/home/CategoryPlate";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/home/Hero";
import { LatestContent } from "@/components/home/LatestContent";
import { LegacyTeaser } from "@/components/home/LegacyTeaser";
import { MoritaNotice } from "@/components/home/MoritaNotice";
import { SupportSection } from "@/components/home/SupportSection";
import { TrustBand } from "@/components/home/TrustBand";
import { getCategories, getLatestArticles, getProducts, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Scientific Dental | Venda e assistência técnica oficial J. Morita e Carestream no Brasil",
  description:
    "Distribuidora indicada pela J. Morita para vendas e assistência técnica no Brasil. Tomógrafos CBCT Veraview X800, panorâmicos, endodontia, filmes Carestream e suporte com técnicos próprios.",
  path: "/",
  image: { url: "/images/products/veraview-x800-perspectiva.jpg", width: 1400, height: 1050, alt: "Veraview X800" },
});

/**
 * Ordem da home: afirmação (hero) → prova (comunicado Morita + marcas) →
 * oferta (catálogo) → diferencial (suporte) → credenciais (números) →
 * conversão suave (Legacy) → conteúdo → pedido final.
 */
export default function HomePage() {
  const site = getSite();
  const categories = getCategories();
  const products = getProducts();
  const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const whatsappHref = whatsappLink(whatsappMessages.default);

  return (
    <main id="conteudo" className="flex-1">
      <Hero whatsappHref={whatsappHref} />
      <MoritaNotice notice={site.moritaNotice} brands={site.brands} />
      <CategoryPlate
        categories={categories}
        productsBySlug={productsBySlug}
        images={{
          "imagem-3d": {
            src: "/images/products/veraview-x800-perspectiva.jpg",
            alt: "Veraview X800 em perspectiva",
          },
        }}
      />
      <SupportSection site={site} />
      <TrustBand site={site} />
      <LegacyTeaser site={site} whatsappHref={whatsappLink(whatsappMessages.legacy)} />
      <LatestContent articles={getLatestArticles(3)} />
      <CtaBand site={site} whatsappHref={whatsappHref} />
    </main>
  );
}
