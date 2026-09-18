import type { Metadata } from "next";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon, HeadsetIcon, MapPinIcon, ShieldCheckIcon, SparkIcon, UsersIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn, yearsSince } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "A Scientific: distribuidora oficial J. Morita e Carestream",
  description:
    "Desde 2005 no segmento odontológico, a Scientific Dental é a empresa indicada pela J. Morita no Brasil e reconhecida pela Carestream Health como maior distribuidor da América Latina.",
  path: "/a-scientific",
});

/** Copy baseada no site atual (páginas A Scientific, Missão, Visão, Valores, parcerias). Fase 2 amplia. */
export default function AScientificPage() {
  const site = getSite();
  const groupYears = yearsSince(site.foundedYear); /* VERIFICAR: ano de fundação do grupo (site diz "46 anos" desde 2023) */
  const dentalYears = yearsSince(site.dentalSinceYear);

  const stats = [
    { value: String(groupYears), unit: "anos", label: "de Scientific no mercado" },
    { value: String(dentalYears), unit: "anos", label: "no segmento odontológico" },
    { value: "1º", unit: "", label: "distribuidor Carestream da América Latina" },
  ];

  const facts = [
    { icon: MapPinIcon, title: "Presença nacional", text: "Filiais e equipe regional atendendo centros de radiologia em todos os estados." },
    { icon: ShieldCheckIcon, title: "Indicada pela J. Morita", text: "Contato oficial no Brasil para vendas e assistência técnica de raios X e endodontia." },
    { icon: HeadsetIcon, title: "Pós-venda próprio", text: `${site.team.technicians} técnicos treinados pela fabricante e ${site.team.radiologists} radiologistas de aplicação.` },
  ];

  const values = [
    { icon: SparkIcon, title: "Missão", text: "Atender todas as demandas de uma clínica de radiologia odontológica." },
    { icon: ShieldCheckIcon, title: "Visão", text: "Entregar a melhor tecnologia de imagem pelo melhor preço, a todos os radiologistas do mercado." },
    { icon: UsersIcon, title: "Valores", text: "Proximidade e respeito ao cliente. Valor agregado a produtos e serviços. Renovação constante. Transparência." },
  ];

  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        eyebrow="Institucional"
        title="A Scientific"
        lead={`Em ${site.dentalSinceYear}, a Scientific, grupo líder de mercado há ${groupYears} anos, entrou no segmento odontológico ao adquirir a maior empresa de equipamentos e filmes dentais do Brasil.`}
        aside={
          <ul className="card grid divide-y divide-escala sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <li key={s.label} className="p-5">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-medium text-marca">{s.value}</span>
                  {s.unit && <span className="text-sm font-medium text-marca">{s.unit}</span>}
                </p>
                <p className="mt-1 text-xs leading-snug text-tecido">{s.label}</p>
              </li>
            ))}
          </ul>
        }
      />

      <Section id="trajetoria" eyebrow="Trajetória" title="Do filme dental ao CBCT de alta resolução">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal prose-measure space-y-4 text-base sm:text-lg lg:col-span-7">
            <p>
              A Scientific Dental atende centros de radiologia odontológica em todos os estados, por meio de filiais e
              equipe regional, e é reconhecida pela Carestream Health como o maior distribuidor da marca odontológica
              na América Latina.
            </p>
            <p>
              Com o encerramento da J. Morita Brasil, a fabricante japonesa passou a indicar a Scientific Dental para
              vendas e assistência técnica de raios X e endodontia no país.
            </p>
          </div>
          <ul className="reveal reveal-delay-1 grid gap-3 lg:col-span-5">
            {facts.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block font-semibold text-marca">{title}</span>
                  <span className="mt-0.5 block text-sm text-tecido">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="missao" tone="osso" eyebrow="Princípios" title="Missão, visão e valores">
        <dl className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className={cn("card reveal p-6", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-marca text-radiopaco">
                <Icon size={21} />
              </span>
              <dt className="mt-5 text-xl font-semibold text-marca">{title}</dt>
              <dd className="mt-2 text-tecido">{text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="marcas" eyebrow="Marcas representadas" title="J. Morita e Carestream" lead="Duas fabricantes de referência mundial, um único ponto de venda e assistência no Brasil.">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="card reveal flex flex-col p-6 sm:p-8">
            <p className="text-xs font-medium text-tecido">Kyoto, Japão · desde 1916</p>
            <h3 className="mt-2 text-2xl font-semibold text-marca sm:text-3xl">J. Morita</h3>
            <p className="mt-4 text-tecido">
              Fundada em 1916, a J. Morita Corporation desenvolve produtos com o máximo de qualidade e precisão que a
              engenharia permite. Há décadas lidera a inovação em diagnóstico odontológico por imagem e é reconhecida
              mundialmente pela tecnologia de geração de imagem cone beam mais avançada do mercado.
            </p>
            <p className="mt-3 text-tecido">
              A J. Morita Brasil encerrou suas operações. A página oficial da fabricante lista a Scientific Dental
              como contato no Brasil para vendas e assistência técnica de raios X e endodontia.
            </p>
            <a
              href={site.moritaNotice.sourceUrl}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-marca underline decoration-escala underline-offset-[0.2em] hover:decoration-marca"
              target="_blank"
              rel="noopener"
            >
              Ver o comunicado na página da Morita
              <ArrowUpRightIcon size={15} />
            </a>
          </article>
          <article className="card reveal reveal-delay-1 flex flex-col p-6 sm:p-8">
            <p className="text-xs font-medium text-tecido">Carestream Health</p>
            <h3 className="mt-2 text-2xl font-semibold text-marca sm:text-3xl">Carestream</h3>
            <p className="mt-4 text-tecido">
              A Carestream é reconhecida internacionalmente por sistemas de imagem e radiologia digital. A Scientific
              Dental distribui filmes intraorais, filme dry e impressoras a laser DryView da Carestream Health, e é
              considerada pela fabricante o maior distribuidor da marca odontológica na América Latina.
              {/* VERIFICAR: quais linhas Carestream (Health x Dental) estão em comercialização */}
            </p>
            <Button href="/produtos/insumos-e-impressao" variant="secondary" className="mt-auto self-start pt-0">
              Ver insumos e impressão
              <ButtonArrow />
            </Button>
          </article>
        </div>
      </Section>

      <Container className="pb-16 sm:pb-20">
        <div className="card reveal flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xl font-semibold text-marca">Quer conhecer a equipe da sua região?</p>
            <p className="mt-1 text-sm text-tecido">Gerentes regionais nos três territórios e sede técnica em Belo Horizonte.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contato" variant="secondary" size="lg">
              Falar com a equipe
            </Button>
            <Button href="/orcamento" size="lg">
              Solicitar orçamento
              <ButtonArrow />
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
