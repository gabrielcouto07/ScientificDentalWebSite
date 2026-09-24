import type { MetadataRoute } from "next";
import { getArticles, getCategories, getProducts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["/", 1, "weekly"],
    ["/produtos", 0.9, "weekly"],
    ["/suporte", 0.8, "monthly"],
    ["/orcamento", 0.8, "monthly"],
    ["/a-scientific", 0.6, "monthly"],
    ["/legacy-sd", 0.6, "monthly"],
    ["/conteudo", 0.5, "weekly"],
    ["/contato", 0.6, "monthly"],
    ["/trabalhe-conosco", 0.4, "monthly"],
    ["/privacidade", 0.2, "yearly"],
  ];
  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...getCategories().map((c) => ({
      url: absoluteUrl(`/produtos/${c.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getProducts().map((p) => ({
      url: absoluteUrl(`/produtos/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getArticles().map((a) => ({
      url: absoluteUrl(`/conteudo/${a.slug}`),
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
