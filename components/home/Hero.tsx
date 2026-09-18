import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PackageIcon, ShieldCheckIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Viewer } from "@/components/ui/Viewer";
import { withDimensions } from "@/lib/content";

/**
 * Imagem do hero: radiografia real, nunca foto de banco. Servida como
 * <picture> estático (AVIF/WebP/JPEG pré-codificados) para o LCP não depender
 * do otimizador de imagens em tempo de requisição.
 *
 * VERIFICAR: imagem de material J. Morita (catálogo do X800). Substituir por
 * exame feito em X800 de um cliente, com autorização, assim que o cliente enviar.
 */
const HERO_IMAGE = withDimensions({
  src: "/images/hero/cbct-x800.jpg",
  alt: "Corte tomográfico CBCT de alta resolução obtido com o Veraview X800, mostrando raízes e osso alveolar em detalhe",
  width: 581,
  height: 581,
});

const TRUST = [
  { icon: ShieldCheckIcon, text: "Técnicos próprios treinados pela fabricante" },
  { icon: PackageIcon, text: "Peças originais em estoque no Brasil" },
  { icon: TruckIcon, text: "Cobertura nacional em três territórios" },
];

/**
 * Hero em duas colunas: afirmação central à esquerda, painel viewer com a
 * radiografia à direita. O fundo tem um gradiente leve e uma grade de pontos
 * que desvanece; os blocos entram com uma animação curta e escalonada.
 */
export function Hero({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section aria-labelledby="hero-title" className="surface-hero relative overflow-hidden">
      <div aria-hidden className="grid-dots pointer-events-none absolute inset-x-0 top-0 h-[38rem] opacity-70" />
      <Container className="relative grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-28">
        <div className="lg:col-span-6">
          <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-escala bg-radiopaco/80 py-1.5 pl-2 pr-4 text-sm font-medium text-marca shadow-soft backdrop-blur">
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-sucesso/15">
              <span className="animate-pulse-dot h-2 w-2 rounded-full bg-sucesso" aria-hidden />
            </span>
            Empresa indicada pela J. Morita no Brasil
          </p>
          <h1
            id="hero-title"
            className="animate-rise mt-6 text-[2.5rem] leading-[1.05] sm:text-5xl 2xl:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            Venda e assistência técnica{" "}
            <span className="relative inline-block whitespace-nowrap">
              oficial
              <svg
                aria-hidden
                focusable={false}
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full overflow-visible sm:-bottom-1.5"
              >
                <path
                  d="M1 0V8M1 4H99M99 0V8"
                  fill="none"
                  stroke="var(--color-marcador)"
                  strokeWidth={1.75}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="square"
                />
              </svg>
            </span>{" "}
            J. Morita e Carestream no Brasil
          </h1>
          <p className="animate-rise prose-measure mt-6 text-lg text-tecido sm:text-xl" style={{ animationDelay: "120ms" }}>
            A J. Morita encerrou a operação própria no país e indica a Scientific Dental para venda, peças e suporte
            de raios X e endodontia. Tomógrafos com voxel de 80 µm, técnicos próprios e cobertura nacional para
            centros de radiologia.
          </p>
          <div className="animate-rise mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "180ms" }}>
            <Button href="/orcamento" size="lg">
              Solicitar orçamento
              <ButtonArrow />
            </Button>
            <Button href={whatsappHref} variant="secondary" size="lg" target="_blank">
              <WhatsAppIcon size={18} className="text-sucesso" />
              Falar com um especialista
            </Button>
          </div>
          <ul className="animate-rise mt-10 grid gap-3 text-sm text-tecido sm:grid-cols-3 sm:gap-6" style={{ animationDelay: "240ms" }}>
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <Icon size={15} />
                </span>
                <span className="leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6 lg:pl-6">
          <div className="animate-rise relative" style={{ animationDelay: "160ms" }}>
            <Viewer
              aspect="5/4"
              elevated
              captionAlign="end"
              scale={{ label: "10 mm", length: 96, animate: true }}
              caption={
                <>
                  <span className="text-radiopaco">Veraview X800</span>
                  <span>Ø40 × H40</span>
                  <span>voxel 80 µm</span>
                  <span>2,5 pl/mm</span>
                </>
              }
            >
              <Picture
                image={HERO_IMAGE}
                priority
                fill
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
                className="object-cover"
              />
            </Viewer>
            {/* Ficha flutuante: dado real, fora da área da imagem */}
            <div className="card absolute -bottom-7 -left-8 hidden w-56 p-4 xl:block">
              <p className="font-mono text-3xl font-medium text-marca">80 µm</p>
              <p className="mt-1 text-xs leading-snug text-tecido">
                Voxel mínimo do Veraview X800, o menor da categoria para diagnóstico endodôntico.
              </p>
            </div>
            <div className="card absolute -top-5 right-4 hidden items-center gap-2 px-3.5 py-2.5 lg:flex">
              <span className="h-2 w-2 rounded-full bg-marcador" aria-hidden />
              <span className="text-xs font-medium text-marca">11 campos de visão</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
