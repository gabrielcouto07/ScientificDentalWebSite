/**
 * Otimiza fotos de produto e imagens clínicas para /public/images.
 *
 * Uso: node scripts/process-images.mjs <pasta-origem>
 *
 * Regras:
 * - lado maior limitado (produto 1400 px, clínica 1600 px), JPEG qualidade 82;
 * - PNG/WebP com transparência são achatados sobre branco (foto de produto
 *   sempre em fundo branco, ver docs/DESIGN-PLAN.md);
 * - imprime um manifesto com largura/altura para colar nos JSON de conteúdo.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Informe a pasta de origem.");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public", "images");
/** Larguras das variantes estáticas (px). Cobre celular 1x/2x e a coluna do hero no desktop. */
const VARIANT_WIDTHS = [480, 960];

/** origem -> destino relativo a public/images (sem extensão) */
const MAP = {
  // Imagem 3D e panorâmica (fotos de imprensa J. Morita)
  "160914_x800_photo_full_front-scaled.jpg": "products/veraview-x800",
  "160914_photo_front_page_pers-scaled.jpg": "products/veraview-x800-perspectiva",
  "160914_x800_photo_full_front_pan-scaled.jpg": "products/veraview-x800-pan",
  "morita-x800-h3.jpg": "products/veraview-x800-posicionamento",
  "180910_1-1_W-scaled.jpg": "products/veraviewepocs-3d",
  "180910_1-3-scaled.jpg": "products/veraviewepocs-3d-2",
  "180910_17-1-scaled.jpg": "products/veraviewepocs-3d-3",
  "180910_24-scaled.jpg": "products/veraviewepocs-3d-4",
  "180910_27-scaled.jpg": "products/veraviewepocs-3d-5",
  "180910_30-scaled.jpg": "products/veraviewepocs-3d-6",
  "180910_5-scaled.jpg": "products/veraviewepocs-3d-7",
  // Endodontia
  "170125_trzx2_br.jpg": "products/tri-auto-zx-2",
  "MO_rootzx_mini_white.jpg": "products/localizador-apical-root-zx-mini",
  // Insumos e impressão
  "DV5700.jpg": "products/impressora-5700",
  "5950_2-1.jpg": "products/impressora-5950",
  "Filme-Dry-125-folhas.jpg": "products/filme-dry-com-125-peliculas",
  "Revelador-.png": "products/revelador-475-ml-pronto-uso-para-consultorios",
  "Fixador.png": "products/fixador",
  // Intraoral
  "Filme-Oclusal-IO-41.jpg": "products/filme-oclusal-io-41-caixa-com-25-peliculas",
  "Filme-Periapical-E-Speed.jpg": "products/filme-periapical-e-speed-caixa-com-150-peliculas",
  "Filme-Periapical-Insight-IP-21.jpg": "products/filme-periapical-insight-ip-21",
  "Posicionador.webp": "products/posicionadores-autoclavaveis",
  // Proteção e acessórios
  "Afastador-Oclusal.webp": "products/afastador-oclusal-kit-com-p-m-g",
  "Afastador-Lateral-.webp": "products/afastador-lateral-em-formato-de-v",
  "Afastador-Frontal.jpg": "products/afastador-frontal-em-formato-de-c",
  "Avental-Panoramico_1.png": "products/avental-panoramico-em-borracha-plumbifera",
  "Periapical-com-Protetor.png": "products/avental-periapical-com-protetor-tireoide",
  "Suporte-de-parede-para-avental.webp": "products/suporte-para-avental-de-parede",
  "105019000_1.webp": "products/espelhos-para-foto-oclusal-cristal-em-vidro",
  "Barita.jpg": "products/barita",
  "Lencol-de-Chumbo.webp": "products/lencol-de-chumbo-1-mm-de-espessura",
  "Vidro-Pumblifero.jpg": "products/vidro-e-visor-plumbifero",
  // Radiografias extraídas dos PDFs J. Morita (catálogo pt-BR e brochura X800)
  // VERIFICAR: direitos de uso do material do fabricante; trocar por exames de cliente com autorização
  "pdf-hero-cbct.png": "hero/cbct-x800",
  "pdf-x800-r100.png": "clinical/x800-r100-arcada",
  "pdf-x800-150.png": "clinical/x800-150-craniofacial",
  "pdf-x800-axial-80um.png": "clinical/x800-axial-80um",
  "pdf-x800-pan.png": "clinical/x800-panoramica",
  "pdf-x800-ceph.png": "clinical/x800-cefalometrica",
  // Imagens clínicas (material J. Morita publicado no site antigo)
  "case-img-1-case1.1.jpg": "clinical/case1-1",
  "case-img-2-case1.2.jpg": "clinical/case1-2",
  "case-img-3-case1.3.jpg": "clinical/case1-3",
  "case-img-5-case2.1.jpg": "clinical/case2-1",
  "case-img-6-case2.2.jpg": "clinical/case2-2",
  "case-img-8-case3.1.jpg": "clinical/case3-1",
};

const manifest = {};
for (const [file, dest] of Object.entries(MAP)) {
  const input = path.join(src, file);
  if (!fs.existsSync(input)) {
    console.warn(`(ausente) ${file}`);
    continue;
  }
  const isClinical = dest.startsWith("clinical/");
  const max = isClinical ? 1600 : 1400;
  const outFile = path.join(OUT, `${dest}.jpg`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch (e) {
    console.warn(`(ilegível) ${file}: ${e.message}`);
    continue;
  }
  const pipeline = sharp(input, { failOn: "none" })
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true });
  try {
    await pipeline.toFile(outFile);
  } catch (e) {
    console.warn(`(falhou) ${file}: ${e.message}`);
    continue;
  }
  const out = await sharp(outFile).metadata();

  // Variantes pré-codificadas (AVIF, WebP, JPEG) em larguras fixas: os elementos
  // críticos para o LCP (hero, foto principal do produto) usam <picture> com estes
  // arquivos estáticos e não dependem do otimizador em tempo de requisição.
  const widths = VARIANT_WIDTHS.filter((w) => w < out.width);
  if (widths.length === 0 || widths[widths.length - 1] !== out.width) widths.push(out.width);
  const variants = { avif: [], webp: [], jpg: [] };
  for (const w of widths) {
    const base = sharp(outFile).resize({ width: w, withoutEnlargement: true });
    const avif = path.join(OUT, `${dest}-${w}.avif`);
    const webp = path.join(OUT, `${dest}-${w}.webp`);
    const jpg = path.join(OUT, `${dest}-${w}.jpg`);
    await base.clone().avif({ quality: 60, effort: 4 }).toFile(avif);
    await base.clone().webp({ quality: 72 }).toFile(webp);
    await base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(jpg);
    variants.avif.push({ src: `/images/${dest}-${w}.avif`, w });
    variants.webp.push({ src: `/images/${dest}-${w}.webp`, w });
    variants.jpg.push({ src: `/images/${dest}-${w}.jpg`, w });
  }

  manifest[dest] = { width: out.width, height: out.height, from: `${meta.width}x${meta.height}`, variants };
  console.log(
    `${dest}.jpg  ${out.width}x${out.height}  (${(fs.statSync(outFile).size / 1024) | 0} KB)  variantes: ${widths.join("/")}`,
  );
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nManifesto em public/images/manifest.json (${Object.keys(manifest).length} imagens).`);
