import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { ClockIcon, HeadsetIcon, MailIcon, PackageIcon, PhoneIcon, ShieldCheckIcon, UsersIcon, WrenchIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Suporte e assistência técnica",
  description:
    "Assistência técnica oficial J. Morita no Brasil: como abrir um chamado, prazos de resposta, peças originais, suporte remoto e contratos de manutenção para centros de radiologia.",
  path: "/suporte",
});

/**
 * Fase 1: estrutura e compromissos. Mapa real e SLA contratual entram na fase 2,
 * quando o cliente confirmar os números marcados com VERIFICAR.
 */
export default function SuportePage() {
  const site = getSite();
  const whatsappHref = whatsappLink(whatsappMessages.support);

  const steps = [
    { title: "Descreva o problema", text: "Equipamento, número de série, mensagem de erro e desde quando ocorre. Uma foto da tela ajuda." },
    { title: "Diagnóstico remoto", text: "Um técnico entra em contato, orienta os primeiros testes e acessa o software remotamente quando é o caso." },
    { title: "Visita com a peça provável", text: "Se a solução exige presença, o técnico vai com a peça indicada pelo diagnóstico, para resolver em uma visita." },
  ];

  /* VERIFICAR: todos os prazos e condições abaixo são propostas para validação da coordenação de assistência */
  const commitments = [
    { icon: ClockIcon, label: "Primeira resposta ao chamado", value: "até 1 dia útil" },
    { icon: HeadsetIcon, label: "Diagnóstico remoto", value: `seg a sex, ${site.hours[0].time}` },
    { icon: UsersIcon, label: "Técnicos em campo", value: `${site.team.technicians} em ${site.territories.length} regiões` },
    { icon: PackageIcon, label: "Peças originais J. Morita", value: "estoque em Belo Horizonte" },
    { icon: ShieldCheckIcon, label: "Radiologistas de aplicação", value: String(site.team.radiologists) },
  ];

  const contracts = [
    { icon: ShieldCheckIcon, title: "Garantia de fábrica", text: "Administrada pela Scientific Dental, com peças originais e mão de obra da fabricante." },
    { icon: WrenchIcon, title: "Manutenção preventiva", text: "Visitas programadas, calibração e testes de constância para manter a qualidade da imagem e o licenciamento em dia." },
    { icon: ClockIcon, title: "Contrato com prioridade", text: "Para centros que não podem parar: tempo de resposta contratual, peças reservadas e suporte remoto estendido." },
  ];

  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        eyebrow="Assistência técnica"
        title="Quem atende o seu equipamento"
        lead="A Scientific Dental é a empresa indicada pela J. Morita para assistência técnica de raios X e endodontia no Brasil. Técnicos próprios treinados pela fabricante, peças originais e suporte remoto em horário comercial."
        actions={
          <>
            <Button href="#chamado" size="lg">
              Abrir chamado técnico
              <ButtonArrow />
            </Button>
            <a href={`tel:${site.phones.support.tel}`} className="inline-flex items-center gap-2 text-sm text-tecido hover:text-marca">
              <PhoneIcon size={16} />
              Urgente? Ligue <span className="font-mono text-marca">{site.phones.support.display}</span>
            </a>
          </>
        }
        aside={
          <ul className="card divide-y divide-escala">
            {commitments.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-4 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <Icon size={17} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-sm text-tecido">{label}</span>
                  <span className="font-mono text-sm text-marca sm:text-right">{value}</span>
                </div>
              </li>
            ))}
          </ul>
        }
      />

      <Section id="como-abrir" eyebrow="Passo a passo" title="Como abrir um chamado" tone="osso">
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className={cn("card reveal relative p-6", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marca font-mono text-base text-radiopaco">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-tecido">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="cobertura"
        eyebrow="Território"
        title="Cobertura nacional"
        lead="Gerente regional e técnicos por território, com sede técnica em Belo Horizonte."
      >
        {/* VERIFICAR: territórios de sd-hit.com; bases físicas a confirmar para um mapa real */}
        <ul className="grid gap-5 sm:grid-cols-3">
          {site.territories.map((t, i) => (
            <li key={t.name} className={cn("card reveal flex flex-col p-6", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="font-mono text-xs text-tecido">Território {String(i + 1).padStart(2, "0")}</span>
              <span className="mt-2 text-lg font-semibold leading-snug text-marca">{t.name}</span>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Estados atendidos">
                {t.states.map((s) => (
                  <li key={s} className="rounded-sm bg-marca-tint px-1.5 py-0.5 font-mono text-xs text-marca">
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-5 text-xs text-tecido">Gerente regional dedicado</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contratos" eyebrow="Pós-venda" title="Garantia e contratos" tone="osso">
        <ul className="grid gap-5 md:grid-cols-3">
          {contracts.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={cn("card reveal p-6", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-marca-tint text-marca">
                <Icon size={21} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-tecido">{text}</p>
            </li>
          ))}
        </ul>
        {/* VERIFICAR: nomes e condições dos contratos oferecidos */}
      </Section>

      <Section id="chamado" eyebrow="Chamado" title="Abrir chamado técnico" lead="Conte o que está acontecendo. Um técnico responde em até 1 dia útil.">
        <div className="grid gap-8 lg:grid-cols-12">
          <LeadForm
            kind="suporte"
            sourcePath="/suporte"
            whatsappHref={whatsappHref}
            submitLabel="Abrir chamado"
            withMessage
            messageLabel="Equipamento, número de série e descrição do problema"
            className="reveal lg:col-span-7"
          />
          <aside className="reveal reveal-delay-1 flex flex-col gap-3 lg:col-span-5">
            <p className="text-base font-semibold text-marca">Canais diretos</p>
            <a href={`tel:${site.phones.support.tel}`} className="card card-hover flex items-center gap-4 p-4 focus-visible:outline-none">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                <PhoneIcon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="font-mono text-base text-marca">{site.phones.support.display}</span>
                <span className="text-xs text-tecido">Telefone da assistência</span>
              </span>
            </a>
            <a href={`mailto:${site.emails.support}`} className="card card-hover flex items-center gap-4 p-4 focus-visible:outline-none">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                <MailIcon size={18} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-base font-medium text-marca">{site.emails.support}</span>
                <span className="text-xs text-tecido">E-mail para chamados</span>
              </span>
            </a>
            <p className="mt-2 text-sm text-tecido">
              Horário: {site.hours.map((h) => `${h.days.toLowerCase()} ${h.time}`).join("; ")}.
            </p>
          </aside>
        </div>
      </Section>
    </main>
  );
}
