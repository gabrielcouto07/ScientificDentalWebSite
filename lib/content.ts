import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import siteJson from "@/content/site.json";
import categoriesJson from "@/content/categories.json";
import articlesJson from "@/content/articles.json";

/**
 * Camada de conteúdo.
 *
 * Fase 1: arquivos JSON em /content. Todos os componentes falam só com estas
 * funções, então trocar por um CMS (Sanity, Payload) depois é reescrever este
 * arquivo, sem tocar em componente nenhum.
 *
 * Tudo passa por schemas zod: um JSON quebrado falha no build, não em produção.
 */

const variantSchema = z.object({ src: z.string(), w: z.number().int().positive() });

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  /** Opcionais no JSON: preenchidos a partir de public/images/manifest.json */
  width: z.number().int().positive().default(1200),
  height: z.number().int().positive().default(900),
  caption: z.string().optional(),
  /** Variantes estáticas pré-codificadas (geradas por scripts/process-images.mjs) */
  variants: z
    .object({
      avif: z.array(variantSchema).default([]),
      webp: z.array(variantSchema).default([]),
      jpg: z.array(variantSchema).default([]),
    })
    .optional(),
});

export type ImageVariants = NonNullable<z.infer<typeof imageSchema>["variants"]>;

const specSchema = z.object({
  label: z.string(),
  value: z.string(),
  /** Valores numéricos com unidade são renderizados em Plex Mono */
  mono: z.boolean().default(true),
});

const specGroupSchema = z.object({
  title: z.string(),
  items: z.array(specSchema),
});

const fovSchema = z.object({
  /** Diâmetro em mm; para o R100 (Reuleaux) usa 100 e shape "reuleaux" */
  diameter: z.number(),
  height: z.number(),
  shape: z.enum(["cylinder", "reuleaux"]).default("cylinder"),
  voxel: z.number(),
  modes: z.array(z.enum(["180", "360"])),
  models: z.array(z.string()),
  indication: z.string(),
});

const sectionSchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
  verificar: z.array(z.string()).default([]),
});

const downloadSchema = z.object({
  label: z.string(),
  href: z.string(),
  size: z.string().optional(),
  type: z.string().default("PDF"),
});

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  brand: z.string().nullable().default(null),
  model: z.string().optional(),
  category: z.string(),
  tagline: z.string(),
  summary: z.string(),
  image: imageSchema,
  gallery: z.array(imageSchema).default([]),
  clinicalImages: z.array(imageSchema).default([]),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  specGroups: z.array(specGroupSchema).default([]),
  fovs: z.array(fovSchema).default([]),
  sections: z.array(sectionSchema).default([]),
  downloads: z.array(downloadSchema).default([]),
  related: z.array(z.string()).default([]),
  anvisa: z.string().optional(),
  price: z.literal("sob-consulta").default("sob-consulta"),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  verificar: z.array(z.string()).default([]),
});

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  specLine: z.string(),
  order: z.number(),
  flagship: z.array(z.string()).default([]),
  oldSlugs: z.array(z.string()).default([]),
});

export const articleSchema = z.object({
  slug: z.string(),
  type: z.enum(["caso", "artigo"]),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  lang: z.enum(["pt-BR", "en"]).default("pt-BR"),
  source: z.string().optional(),
  oldPath: z.string().optional(),
  verificar: z.array(z.string()).default([]),
});

export const siteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  url: z.string().url(),
  locale: z.string(),
  description: z.string(),
  address: z.object({
    street: z.string(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    mapsUrl: z.string(),
  }),
  phones: z.record(z.string(), z.object({ display: z.string(), tel: z.string() })),
  whatsapp: z.object({ display: z.string(), e164: z.string() }),
  emails: z.record(z.string(), z.string()),
  hours: z.array(z.object({ days: z.string(), time: z.string() })),
  foundedYear: z.number(),
  dentalSinceYear: z.number(),
  social: z.record(z.string(), z.string()),
  brands: z.array(z.string()),
  moritaNotice: z.object({
    quote: z.string(),
    summary: z.string(),
    sourceLabel: z.string(),
    sourceUrl: z.string(),
  }),
  territories: z.array(z.object({ name: z.string(), states: z.array(z.string()) })),
  team: z.object({ technicians: z.number(), radiologists: z.number() }),
  legacy: z.object({ name: z.string(), url: z.string(), whatsappUrl: z.string() }),
  verificar: z.array(z.string()).default([]),
});

export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Article = z.infer<typeof articleSchema>;
export type SiteConfig = z.infer<typeof siteSchema>;
export type Fov = z.infer<typeof fovSchema>;
export type SpecGroup = z.infer<typeof specGroupSchema>;
export type ContentImage = z.infer<typeof imageSchema>;

const CONTENT_DIR = path.join(process.cwd(), "content");

type Manifest = Record<string, { width: number; height: number; variants?: ImageVariants }>;
let manifestCache: Manifest | null = null;

/** Dimensões geradas por scripts/process-images.mjs; evita digitar largura/altura nos JSON. */
function loadManifest(): Manifest {
  if (manifestCache) return manifestCache;
  try {
    manifestCache = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public", "images", "manifest.json"), "utf8"),
    ) as Manifest;
  } catch {
    manifestCache = {};
  }
  return manifestCache;
}

export function withDimensions<T extends { src: string; width: number; height: number; variants?: ImageVariants }>(
  img: T,
): T {
  const key = img.src.replace(/^\/images\//, "").replace(/\.[a-z]+$/i, "");
  const m = loadManifest()[key];
  return m ? { ...img, width: m.width, height: m.height, variants: m.variants ?? img.variants } : img;
}

let productCache: Product[] | null = null;

function loadProducts(): Product[] {
  if (productCache) return productCache;
  const dir = path.join(CONTENT_DIR, "products");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const products = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Produto inválido em content/products/${file}: ${parsed.error.message}`);
    }
    const p = parsed.data;
    return {
      ...p,
      image: withDimensions(p.image),
      gallery: p.gallery.map(withDimensions),
      clinicalImages: p.clinicalImages.map(withDimensions),
    };
  });
  products.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
  productCache = products;
  return products;
}

export function getSite(): SiteConfig {
  return siteSchema.parse(siteJson);
}

export function getCategories(): Category[] {
  return z.array(categorySchema).parse(categoriesJson).sort((a, b) => a.order - b.order);
}

export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return loadProducts();
}

export function getProduct(slug: string): Product | undefined {
  return loadProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return loadProducts().filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return loadProducts().filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const explicit = product.related
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => Boolean(p));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCategory = getProductsByCategory(product.category).filter(
    (p) => p.slug !== product.slug && !explicit.some((e) => e.slug === p.slug),
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

export function getArticles(): Article[] {
  return z
    .array(articleSchema)
    .parse(articlesJson)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getLatestArticles(limit = 3): Article[] {
  return getArticles().slice(0, limit);
}

/** Resolve "/produtos/[slug]": categoria tem prioridade sobre produto. */
export function resolveProductRoute(
  slug: string,
): { kind: "category"; category: Category } | { kind: "product"; product: Product } | null {
  const category = getCategory(slug);
  if (category) return { kind: "category", category };
  const product = getProduct(slug);
  if (product) return { kind: "product", product };
  return null;
}
