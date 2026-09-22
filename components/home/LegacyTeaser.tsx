import { Button, ButtonArrow } from "@/components/ui/Button";
import { CheckIcon, GraduationIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Section, Eyebrow } from "@/components/ui/Section";
import type { SiteConfig } from "@/lib/content";

/**
 * Conversão suave para quem ainda não vai comprar: o programa de educação
 * continuada para donos de centros de radiologia. Um único painel escuro
 * arredondado, para destacar sem virar mais uma seção igual.
 */
export function LegacyTeaser({ site, whatsappHref }: { site: SiteConfig; whatsappHref: string }) {
  const offers = [
    "Canal no WhatsApp com conteúdo exclusivo e aulas gratuitas",
    "Grupo de estudo continuado em diagnóstico de alta resolução",
    "Mentoria de crescimento e faturamento do centro de radiologia",
  ];
  return (
    <Section id="legacy-sd" compact>
      <div className="reveal surface-marca on-dark relative overflow-hidden rounded-2xl">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-radiopaco/[0.06] blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-marcador/20 blur-3xl" />
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
          <div className="lg:col-span-7">
            <Eyebrow dark>Programa gratuito</Eyebrow>
            <h2 className="mt-4 text-3xl text-radiopaco sm:text-4xl">{site.legacy.name}</h2>
            <p className="mt-4 max-w-xl text-lg text-escala">
              Educação continuada e mentoria para radiologistas que querem estabelecer um novo padrão de diagnóstico
              no próprio mercado.
            </p>
            <ul className="mt-7 space-y-3">
              {offers.map((o) => (
                <li key={o} className="flex items-start gap-3 text-base text-radiopaco/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-radiopaco/10">
                    <CheckIcon size={14} />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-radiopaco/10 bg-radiopaco/[0.06] p-6 backdrop-blur-sm sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-radiopaco text-marca">
                <GraduationIcon size={22} />
              </span>
              <p className="mt-5 text-base text-radiopaco">
                Gratuito para donos e gestores de centros de radiologia odontológica. A entrada é pelo canal do
                WhatsApp.
                {/* VERIFICAR: link direto do canal e foto real de turma para esta seção */}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href={whatsappHref} variant="inverse-solid" size="lg" target="_blank" className="h-auto min-h-13 w-full whitespace-normal py-3 text-center">
                  <WhatsAppIcon size={18} className="shrink-0 text-sucesso" />
                  Entrar no canal do WhatsApp
                </Button>
                <Button href="/legacy-sd" variant="inverse" size="lg" className="w-full">
                  Conhecer o Legacy SD
                  <ButtonArrow />
                </Button>
              </div>
              <p className="mt-5 text-xs text-escala">Hoje o programa vive em {new URL(site.legacy.url).hostname}.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
