import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

export function validateContent(root = process.cwd()) {
  const fromRoot = (...parts) => path.join(root, ...parts);
  const errors = [];
  const categories = readJson(fromRoot("content", "categories.json"));
  const articles = readJson(fromRoot("content", "articles.json"));
  const redirects = readJson(fromRoot("content", "redirects.json")).redirects;
  const manifest = readJson(fromRoot("public", "images", "manifest.json"));
  const productDir = fromRoot("content", "products");
  const products = fs
    .readdirSync(productDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ file, ...readJson(path.join(productDir, file)) }));

  function checkDuplicates(values, label) {
    const seen = new Set();
    for (const value of values) {
      if (seen.has(value)) errors.push(`${label} duplicado: ${value}`);
      seen.add(value);
    }
  }

  checkDuplicates(categories.map(({ slug }) => slug), "slug de categoria");
  checkDuplicates(products.map(({ slug }) => slug), "slug de produto");
  checkDuplicates(articles.map(({ slug }) => slug), "slug de artigo");
  checkDuplicates([...categories, ...products].map(({ slug }) => slug), "rota de produto/categoria");
  checkDuplicates(redirects.map(({ source }) => source), "origem de redirect");

  const categorySlugs = new Set(categories.map(({ slug }) => slug));
  const productSlugs = new Set(products.map(({ slug }) => slug));
  const checkPublicFile = (owner, url) => {
    if (!url?.startsWith("/")) return;
    if (!fs.existsSync(fromRoot("public", url.slice(1)))) errors.push(`${owner}: arquivo ausente ${url}`);
  };

  for (const product of products) {
    if (product.file !== `${product.slug}.json`) errors.push(`arquivo/slug divergente: ${product.file} -> ${product.slug}`);
    if (!categorySlugs.has(product.category)) errors.push(`${product.slug}: categoria ausente ${product.category}`);
    for (const related of product.related ?? []) {
      if (!productSlugs.has(related)) errors.push(`${product.slug}: produto relacionado ausente ${related}`);
    }
    for (const image of [product.image, ...(product.gallery ?? []), ...(product.clinicalImages ?? [])]) {
      checkPublicFile(product.slug, image.src);
      if (!image.alt?.trim()) errors.push(`${product.slug}: imagem sem texto alternativo ${image.src}`);
      for (const variant of Object.values(image.variants ?? {}).flat()) checkPublicFile(product.slug, variant.src);
    }
    for (const download of product.downloads ?? []) checkPublicFile(product.slug, download.href);
  }

  for (const category of categories) {
    for (const flagship of category.flagship ?? []) {
      if (!productSlugs.has(flagship)) errors.push(`${category.slug}: produto de destaque ausente ${flagship}`);
    }
  }
  for (const [key, image] of Object.entries(manifest)) {
    checkPublicFile(`manifesto ${key}`, `/images/${key}.jpg`);
    for (const variant of Object.values(image.variants ?? {}).flat()) checkPublicFile(`manifesto ${key}`, variant.src);
  }

  return { errors, counts: { products: products.length, categories: categories.length, articles: articles.length, redirects: redirects.length, images: Object.keys(manifest).length } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateContent();
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else {
    const { products, categories, articles, redirects, images } = result.counts;
    console.log(`Conteúdo válido: ${products} produtos, ${categories} categorias, ${articles} artigos, ${redirects} redirects e ${images} imagens.`);
  }
}
