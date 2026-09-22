import type { Metadata } from "next";
import type { Product, SiteConfig } from "./content";
import siteConfig from "@/content/site.json";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
const OPEN_GRAPH_LOCALE = siteConfig.locale.replace("-", "_");

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Metadata padrão por página: título, descrição, canonical, Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: OPEN_GRAPH_LOCALE,
      siteName: siteConfig.name,
      images: image ? [image] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export function organizationJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    description: site.description,
    foundingDate: String(site.dentalSinceYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    telephone: site.phones.main.tel,
    email: site.emails.contact,
    sameAs: Object.values(site.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phones.main.tel,
        contactType: "sales",
        areaServed: "BR",
        availableLanguage: ["pt-BR"],
      },
      {
        "@type": "ContactPoint",
        telephone: site.phones.support.tel,
        email: site.emails.support,
        contactType: "technical support",
        areaServed: "BR",
        availableLanguage: ["pt-BR"],
      },
    ],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(product: Product, categoryName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: [absoluteUrl(product.image.src), ...product.gallery.map((g) => absoluteUrl(g.src))],
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    model: product.model,
    category: categoryName,
    url: absoluteUrl(`/produtos/${product.slug}`),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "BRL" },
      seller: { "@id": `${SITE_URL}/#organization` },
      // Preço sob consulta: sem "price" para não declarar valor inexistente
    },
  };
}
