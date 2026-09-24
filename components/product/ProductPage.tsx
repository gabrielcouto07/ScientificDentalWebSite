import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon, DownloadIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Viewer } from "@/components/ui/Viewer";
import { BRANDS, brandKeyOf } from "@/lib/brands";
import type { Category, Product, SiteConfig } from "@/lib/content";
import { cn, slugify } from "@/lib/utils";
import { FovDiagram } from "./FovDiagram";
import { ProductCard } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";
import { SpecTable } from "./SpecTable";

type Props = {
  product: Product;
  category: Category;
  related: Product[];
  site: SiteConfig;
  whatsappHref: string;
};

/**
 * Template de página de produto. Ordem fixa: hero, specs, FOV, seções
 * (software, imagens, instalação, treinamento, assistência), downloads,
 * orçamento pré-preenchido, relacionados. Assistência sempre antes do formulário.
 */
export function ProductPage({ product, category, related, site, whatsappHref }: Props) {
  const gallery = [product.image, ...product.gallery];
  const sections = product.sections;
  const hasFov = product.fovs.length > 0;
  const hasClinical = product.clinicalImages.length > 0;
  const hasSpecs = product.specGroups.length > 0;

  const nav = [
    hasSpecs && { id: "especificacoes", label: "Especificações" },
    hasFov && { id: "campos-de-visao", label: "Campos de visão" },
    ...sections.map((s) => ({ id: slugify(s.title), label: shortTitle(s.title) })),
    hasClinical && { id: "imagens", label: "Imagens" },
    product.downloads.length > 0 && { id: "downloads", label: "Downloads" },
    { id: "orcamento", label: "Orçamento" },
  ].filter((x): x is { id: string; label: string } => Boolean(x));

  return (
    <>
      {/* Hero do produto */}
      <section className="surface-hero relative overflow-hidden border-b border-escala">
        <div aria-hidden className="grid-dots pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" />
        <Container className="relative grid gap-10 py-8 lg:grid-cols-12 lg:gap-12 lg:py-14">
          <div className="animate-rise order-2 lg:order-1 lg:col-span-7">
            <Breadcrumb
              items={[
                { name: "Produtos", href: "/produtos" },
                { name: category.name, href: `/produtos/${category.slug}` },
                { name: product.name },
              ]}
            />
            {/* Traço do eyebrow na cor do fabricante: indicador de procedência, o único uso da cor de parceiro na página */}
            <div className="mt-6">
              {product.brand && <Eyebrow accent={BRANDS[brandKeyOf(product.brand)].accent}>{product.brand}</Eyebrow>}
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="prose-measure mt-4 text-lg text-tecido sm:text-xl">{product.tagline}</p>
            <p className="prose-measure mt-5 text-base">{product.summary}</p>

            {product.highlights.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {product.highlights.map((h) => (
                  <div key={h.label} className="card p-3.5 sm:p-4">
                    <dt className="text-xs text-tecido">{h.label}</dt>
                    <dd className="mt-1 font-mono text-lg text-marca sm:text-xl">{h.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="#orcamento" size="lg">
                Solicitar orçamento
                <ButtonArrow />
              </Button>
              {product.downloads[0] && (
                <Button href={product.downloads[0].href} variant="secondary" size="lg" download>
                  <DownloadIcon size={18} />
                  Baixar catálogo
                  <span className="font-mono text-xs text-tecido">
                    {product.downloads[0].type}
                    {product.downloads[0].size ? `, ${product.downloads[0].size}` : ""}
                  </span>
                </Button>
              )}
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-tecido">
              <li className="inline-flex items-center gap-1.5">
                <CheckIcon size={15} className="text-sucesso" />
                Assistência técnica oficial no Brasil
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckIcon size={15} className="text-sucesso" />
                Preço sob consulta
              </li>
              {product.anvisa && (
                <li className="inline-flex items-center gap-1.5 font-mono">
                  <CheckIcon size={15} className="text-sucesso" />
                  ANVISA {product.anvisa}
                </li>
              )}
            </ul>
          </div>
          <div className="animate-rise order-1 lg:order-2 lg:col-span-5" style={{ animationDelay: "120ms" }}>
            <ProductGallery images={gallery} name={product.name} slug={product.slug} />
          </div>
        </Container>
      </section>

      {/* Sub-navegação por âncoras */}
      <nav
        aria-label="Seções desta página"
        className="sticky top-16 z-30 border-b border-escala bg-radiopaco/90 backdrop-blur-md"
      >
        <Container>
          <ul className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 py-2.5 sm:mx-0 sm:px-0">
            {nav.map((n) => (
              <li key={n.id} className="shrink-0">
                <a
                  href={`#${n.id}`}
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-full border border-transparent px-3.5 text-sm text-tecido transition-colors hover:border-escala hover:bg-osso hover:text-marca"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {hasSpecs && (
        <Section id="especificacoes" eyebrow="Ficha técnica" title="Especificações" tone="osso">
          <SpecTable groups={product.specGroups} />
        </Section>
      )}

      {hasFov && (
        <Section
          id="campos-de-visao"
          eyebrow="Em escala real"
          title="Campos de visão"
          lead={`${product.fovs.length} FOV, de Ø${Math.min(...product.fovs.map((f) => f.diameter))} a Ø${Math.max(...product.fovs.map((f) => f.diameter))} mm, escolhidos pela pergunta clínica, não pelo equipamento.`}
        >
          <div className="reveal">
            <FovDiagram fovs={product.fovs} productName={product.name} />
          </div>
        </Section>
      )}

      {sections.map((s, i) => (
        <Section key={s.title} id={slugify(s.title)} title={s.title} tone={i % 2 === (hasFov ? 0 : 1) ? "osso" : "radiopaco"}>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="reveal prose-measure space-y-4 text-base lg:col-span-7">
              {s.paragraphs.map((p, paragraphIndex) => (
                <p key={`${paragraphIndex}-${p}`}>{p}</p>
              ))}
            </div>
            {s.bullets.length > 0 && (
              <ul className="card reveal reveal-delay-1 divide-y divide-escala px-5 lg:col-span-5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 py-3 text-sm">
                    <CheckIcon size={16} className="mt-0.5 shrink-0 text-marca" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </Section>
      ))}

      {hasClinical && (
        <Section id="imagens" tone="marca" eyebrow="Exames reais" title="Imagens clínicas" lead="Exames feitos com o equipamento, em painel de visualização.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.clinicalImages.map((img, i) => (
              <div key={img.src} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
                <Viewer aspect="4/3" caption={<span>{img.caption}</span>} className="ring-radiopaco/15">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    quality={82}
                    className="object-contain"
                  />
                </Viewer>
              </div>
            ))}
          </div>
        </Section>
      )}

      {product.downloads.length > 0 && (
        <Section id="downloads" eyebrow="Documentos" title="Downloads" compact>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.downloads.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  className="card card-hover flex items-center gap-4 p-4"
                  download
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                    <DownloadIcon size={20} />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium text-marca">{d.label}</span>
                    <span className="font-mono text-xs text-tecido">
                      {d.type}
                      {d.size ? ` · ${d.size}` : ""}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="orcamento"
        tone="osso"
        eyebrow="Orçamento"
        title={`Solicitar orçamento do ${product.name}`}
        lead="Três campos. Um especialista da Scientific Dental retorna com proposta e condições."
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <LeadForm
            kind="produto"
            product={product.name}
            sourcePath={`/produtos/${product.slug}`}
            whatsappHref={whatsappHref}
            className="reveal lg:col-span-7"
          />
          <aside className="reveal reveal-delay-1 flex flex-col gap-3 lg:col-span-5">
            <p className="text-base font-semibold text-marca">Prefere falar agora?</p>
            <a href={`tel:${site.phones.quote.tel}`} className="card card-hover flex items-center gap-4 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                <PhoneIcon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="font-mono text-base text-marca">{site.phones.quote.display}</span>
                <span className="text-xs text-tecido">Orçamentos por telefone</span>
              </span>
            </a>
            <a
              href={whatsappHref}
              className="card card-hover flex items-center gap-4 p-4"
              target="_blank"
              rel="noopener"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sucesso/10 text-sucesso">
                <WhatsAppIcon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="font-mono text-base text-marca">{site.whatsappQuote.display}</span>
                <span className="text-xs text-tecido">WhatsApp de orçamentos, com o {product.name} já no assunto</span>
              </span>
            </a>
            <p className="mt-2 text-sm text-tecido">
              Horário: {site.hours.map((h) => `${h.days.toLowerCase()} ${h.time}`).join("; ")}.
            </p>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section id="relacionados" eyebrow="Veja também" title="Relacionados">
          <div className={cn("grid gap-4 sm:grid-cols-2", related.length >= 3 && "lg:grid-cols-3")}>
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function shortTitle(t: string) {
  return t.replace(/ e fluxo de trabalho$/, "").replace(/^O que está incluído e /, "").replace(/^Assistência técnica e garantia$/, "Assistência");
}
