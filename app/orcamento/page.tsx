import copy from "@/content/forms.json";
import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteWizard } from "@/components/forms/QuoteWizard";
import { EQUIPMENT_OPTIONS, type QuotePrefill } from "@/components/forms/quote-options";
import { Container } from "@/components/ui/Container";
import { ClockIcon, HeadsetIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Section";
import { getCategories, getProducts, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { quoteWhatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Solicitar orçamento",
  description:
    "Peça um orçamento de tomógrafo CBCT, panorâmico, endodontia, impressoras ou insumos J. Morita e Carestream. Quatro etapas curtas e retorno de um especialista.",
  path: "/orcamento",
});

const CATEGORY_TO_OPTION: Record<string, number> = {
  "imagem-3d": 0,
  endodontia: 2,
  intraoral: 3,
  "insumos-e-impressao": 3,
  "protecao-e-acessorios": 4,
};

/**
 * Mapa slug -> opção da etapa 1, calculado no build. A leitura de ?produto= e
 * ?categoria= acontece no cliente (useSearchParams), o que mantém a página
 * estática e com bfcache.
 */
function buildPrefill(): QuotePrefill {
  const products: Record<string, string> = {};
  for (const p of getProducts()) {
    if (p.slug === "veraview-x800") products[p.slug] = EQUIPMENT_OPTIONS[0].value;
    else if (p.slug === "veraviewepocs-3d") products[p.slug] = EQUIPMENT_OPTIONS[1].value;
    else if (CATEGORY_TO_OPTION[p.category] !== undefined) products[p.slug] = EQUIPMENT_OPTIONS[CATEGORY_TO_OPTION[p.category]].value;
  }
  const categories: Record<string, string> = {};
  for (const c of getCategories()) {
    if (CATEGORY_TO_OPTION[c.slug] !== undefined) categories[c.slug] = EQUIPMENT_OPTIONS[CATEGORY_TO_OPTION[c.slug]].value;
  }
  return { products, categories };
}

export default function OrcamentoPage() {
  const site = getSite();
  const whatsappBase = quoteWhatsappLink(whatsappMessages.quote());

  /** Os dois primeiros são canais diretos com a pessoa responsável por orçamentos. */
  const facts: Array<{ icon: typeof PhoneIcon; label: string; value: string; href?: string; external?: boolean }> = [
    { icon: PhoneIcon, label: "Orçamentos por telefone", value: site.phones.quote.display, href: `tel:${site.phones.quote.tel}` },
    { icon: WhatsAppIcon, label: "WhatsApp de orçamentos", value: site.whatsappQuote.display, href: whatsappBase, external: true },
    { icon: ClockIcon, label: "Retorno", value: copy.returnLabel },
    { icon: HeadsetIcon, label: "Horário", value: site.hours.map((h) => `${h.days.toLowerCase()} ${h.time}`).join("; ") },
  ];

  return (
    <main id="conteudo" className="surface-hero relative flex-1 overflow-hidden">
      <div aria-hidden className="grid-dots pointer-events-none absolute inset-x-0 top-0 h-[40rem] opacity-60" />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="animate-rise lg:col-span-4">
            <Eyebrow>Orçamento</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl">Solicitar orçamento</h1>
            <p className="prose-measure mt-5 text-lg text-tecido">
              Quatro etapas curtas. No fim, um especialista da Scientific Dental monta a proposta com preço, prazo
              de entrega, instalação e assistência técnica.
            </p>
            {/* No celular, só os canais diretos aparecem acima do formulário */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {facts.map(({ icon: Icon, label, value, href, external }) => {
                const body = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                      <Icon size={17} />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs text-tecido">{label}</span>
                      <span className={href ? "font-mono text-sm text-marca" : "text-sm text-marca"}>{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label} className={href ? undefined : "hidden sm:block"}>
                    {href ? (
                      <a
                        href={href}
                        className="card card-hover flex items-center gap-3 p-3.5"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="card flex items-center gap-3 p-3.5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="animate-rise lg:col-span-8" style={{ animationDelay: "120ms" }}>
            {/* O fallback reserva a altura da etapa 1 para não haver salto de layout (CLS) */}
            <Suspense fallback={<div className="card min-h-[36rem]" aria-hidden />}>
              <QuoteWizard prefill={buildPrefill()} whatsappBase={whatsappBase} />
            </Suspense>
          </div>
        </div>
      </Container>
    </main>
  );
}
