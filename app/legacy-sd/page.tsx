import type { Metadata } from "next";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { CheckIcon, GraduationIcon, HeadsetIcon, SparkIcon, UsersIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Legacy SD: mentoria para donos de centros de radiologia",
  description:
    "Programa gratuito de educação continuada e mentoria da Scientific Dental para donos de centros de radiologia odontológica: canal no WhatsApp, aulas e grupo de estudo.",
  path: "/legacy-sd",
});

/** Copy adaptada da landing atual (sd-hit.com/legacysd) e da página Morita BR do site antigo. */
export default function LegacySdPage() {
  const site = getSite();
  const whatsappHref = whatsappLink(whatsappMessages.legacy);
  const offers = [
    { icon: WhatsAppIcon, title: "Canal no WhatsApp", text: "Conteúdo exclusivo e aulas gratuitas para donos de centros de radiologia odontológica." },
    { icon: GraduationIcon, title: "Grupo de estudo continuado", text: "Evolução consistente em produção de diagnóstico com tecnologia de alta resolução." },
    { icon: SparkIcon, title: "Mentoria", text: "Estratégia de crescimento e faturamento do centro, com a equipe comercial e de aplicação da Scientific Dental." },
    { icon: HeadsetIcon, title: "Pós-venda", text: "Compromisso de minimizar o tempo de equipamento parado." },
  ];
  const audience = [
    "Estabelecer um padrão superior de diagnóstico no próprio mercado",
    "Migrar para a liderança em tecnologia de alta resolução",
    "Trabalhar com equipamentos premium de referência mundial",
    "Construir um legado profissional como pioneiro",
  ];
  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        eyebrow="Programa gratuito da Scientific Dental"
        title="Legacy SD"
        lead="Apoiamos os radiologistas mais visionários do mercado a transformar o cenário do diagnóstico no Brasil, com um nível superior de precisão, eficiência e segurança."
        actions={
          <>
            <Button href={whatsappHref} variant="whatsapp" size="lg" target="_blank">
              <WhatsAppIcon size={18} />
              Entrar no canal do WhatsApp
            </Button>
            <a href={site.legacy.url} className="link text-sm" target="_blank" rel="noopener">
              Página atual do programa
            </a>
          </>
        }
        aside={
          <div className="surface-marca on-dark relative overflow-hidden rounded-2xl p-7 sm:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-radiopaco/[0.07] blur-2xl" />
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-radiopaco text-marca">
              <UsersIcon size={22} />
            </span>
            <p className="mt-5 text-xl font-medium text-radiopaco">
              Grandes mudanças acontecem quando um grupo de pessoas com a mesma visão de futuro e espírito de
              protagonismo se une.
            </p>
            <p className="mt-3 text-sm text-escala">
              O Legacy SD é o convite para quem quer ser, no próprio mercado, a mudança que deseja ver.
            </p>
          </div>
        }
      />
      {/* VERIFICAR: link direto do canal; decidir se o Legacy migra de sd-hit.com para este domínio */}

      <Section id="o-que-e" eyebrow="O programa" title="O que o Legacy SD oferece" tone="osso">
        <ul className="grid gap-5 sm:grid-cols-2">
          {offers.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={cn("card reveal flex items-start gap-4 p-6", i % 2 === 1 && "reveal-delay-1")}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                <Icon size={21} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-tecido">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="para-quem" eyebrow="Público" title="Para quem é" lead="Donos e gestores de centros de radiologia odontológica que querem:">
        <div className="grid gap-8 lg:grid-cols-12">
          <ul className="card reveal divide-y divide-escala px-6 lg:col-span-7">
            {audience.map((a) => (
              <li key={a} className="flex items-start gap-3 py-4 text-base">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sucesso/15 text-sucesso">
                  <CheckIcon size={14} />
                </span>
                {a}
              </li>
            ))}
          </ul>
          <div className="reveal reveal-delay-1 lg:col-span-5">
            <p className="text-sm text-tecido">
              Equipe: gerentes regionais nos três territórios, customer success, gerência de imagem, direção de
              serviços e coordenação de assistência.
              {/* VERIFICAR: nomes e cargos da equipe para exibir com foto */}
            </p>
            <Button href={whatsappHref} variant="secondary" size="lg" target="_blank" className="mt-6">
              <WhatsAppIcon size={18} className="text-sucesso" />
              Entrar no canal
              <ButtonArrow />
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
