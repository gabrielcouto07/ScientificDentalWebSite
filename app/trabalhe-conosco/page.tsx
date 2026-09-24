import type { Metadata } from "next";
import { CareersForm } from "@/components/forms/CareersForm";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  BriefcaseIcon,
  ClockIcon,
  FileIcon,
  GraduationIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SparkIcon,
  UsersIcon,
} from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Trabalhe conosco",
  description:
    "Faça parte da Scientific Dental, distribuidora oficial J. Morita e Carestream no Brasil. Envie seu currículo pelo site ou fale com o RH.",
  path: "/trabalhe-conosco",
});

/**
 * Candidatura espontânea, sem vagas listadas. Dois caminhos equivalentes:
 * enviar o CV pelo formulário (chega ao RH como anexo) ou falar direto com o RH.
 */
export default function TrabalheConoscoPage() {
  const site = getSite();
  const hr = { email: site.emails.hr, phone: site.phones.hr };

  const reasons = [
    {
      icon: SparkIcon,
      title: "Tecnologia de ponta",
      text: "Tomógrafos CBCT, panorâmicos e endodontia J. Morita e Carestream, presentes em centros de radiologia de todo o país.",
    },
    {
      icon: GraduationIcon,
      title: "Aprendizado com a fabricante",
      text: "Equipe técnica treinada pela fabricante e contato próximo com radiologistas de aplicação.",
    },
    {
      icon: MapPinIcon,
      title: "Presença nacional",
      text: `No segmento odontológico desde ${site.dentalSinceYear}, com sede em ${site.address.city} e equipe regional em todo o Brasil.`,
    },
  ];

  /* VERIFICAR: fluxo e prazo de guarda do banco de talentos com o RH */
  const steps = [
    { title: "Envie seu currículo", text: "Pelo formulário abaixo ou por e-mail. Leva menos de dois minutos." },
    { title: "Banco de talentos", text: "O RH analisa o perfil e guarda o currículo para as próximas oportunidades." },
    { title: "Contato do RH", text: "Quando surgir uma vaga compatível, a equipe fala com você por telefone ou e-mail." },
  ];

  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        eyebrow="Carreiras"
        title="Trabalhe conosco"
        lead="Quer levar tecnologia de diagnóstico por imagem a clínicas e centros de radiologia de todo o Brasil? Envie seu currículo: ele vai direto para o RH da Scientific Dental."
        actions={
          <>
            <Button href="#curriculo" size="lg">
              Enviar currículo
              <ButtonArrow />
            </Button>
            <Button href="#rh" variant="secondary" size="lg">
              <UsersIcon size={18} />
              Falar com o RH
            </Button>
          </>
        }
        aside={<HrCard id="rh" email={hr.email} phone={hr.phone} hours={site.hours} />}
      />

      <Section id="por-que" eyebrow="Por que a Scientific" title="Um lugar para crescer junto com a radiologia">
        <ul className="grid gap-5 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={cn("card reveal p-6", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-marca-tint text-marca">
                <Icon size={21} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-tecido">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="como-funciona" tone="osso" eyebrow="Como funciona" title="Do currículo à conversa com o RH" compact>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className={cn("reveal relative flex gap-4", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-marca/30 bg-radiopaco font-mono text-sm text-marca">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-base font-semibold text-marca">{step.title}</span>
                <span className="mt-1 block text-sm text-tecido">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="curriculo"
        eyebrow="Currículo"
        title="Envie seu currículo"
        lead="Preencha seus dados e anexe o CV. Não há vagas listadas no site: o RH considera o seu perfil para as oportunidades que surgirem."
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <CareersForm hrEmail={hr.email} className="reveal lg:col-span-7" />
          <aside className="reveal reveal-delay-1 flex flex-col gap-3 lg:col-span-5">
            <p className="text-base font-semibold text-marca">Antes de enviar</p>
            <ul className="card divide-y divide-escala text-sm">
              {[
                { icon: FileIcon, text: "Prefira PDF: a formatação chega como você montou." },
                { icon: BriefcaseIcon, text: "Destaque experiência com equipamentos, vendas técnicas ou atendimento na área da saúde, se tiver." },
                { icon: PhoneIcon, text: "Confira telefone e e-mail: é por eles que o RH vai falar com você." },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 px-4 py-3.5">
                  <Icon size={17} className="mt-0.5 shrink-0 text-marca" />
                  <span className="text-tecido">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-tecido">
              Prefere e-mail? Envie o CV para{" "}
              <a href={`mailto:${hr.email}`} className="link break-all text-marca">
                {hr.email}
              </a>{" "}
              ou ligue para{" "}
              <a href={`tel:${hr.phone.tel}`} className="link font-mono text-marca">
                {hr.phone.display}
              </a>
              .
            </p>
          </aside>
        </div>
      </Section>
    </main>
  );
}

/** Cartão de contato do RH: e-mail e telefone com ação direta e botão de copiar. */
function HrCard({
  id,
  email,
  phone,
  hours,
}: {
  id: string;
  email: string;
  phone: { display: string; tel: string };
  hours: Array<{ days: string; time: string }>;
}) {
  return (
    <div id={id} className="card scroll-mt-24 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-escala bg-osso px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca text-radiopaco">
          <UsersIcon size={19} />
        </span>
        <span className="flex flex-col">
          <span className="text-base font-semibold text-marca">Recursos Humanos</span>
          <span className="text-xs text-tecido">Contato direto para candidaturas</span>
        </span>
      </div>
      <ul className="divide-y divide-escala">
        <li className="flex items-center gap-3 px-5 py-3.5">
          <MailIcon size={18} className="shrink-0 text-marca" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs text-tecido">E-mail</span>
            <a href={`mailto:${email}`} className="break-all text-sm font-medium text-marca hover:underline">
              {email}
            </a>
          </span>
          <CopyButton value={email} label="e-mail do RH" />
        </li>
        <li className="flex items-center gap-3 px-5 py-3.5">
          <PhoneIcon size={18} className="shrink-0 text-marca" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs text-tecido">Telefone</span>
            <a href={`tel:${phone.tel}`} className="font-mono text-sm text-marca hover:underline">
              {phone.display}
            </a>
          </span>
          <CopyButton value={phone.display} label="telefone do RH" />
        </li>
        <li className="flex items-start gap-3 px-5 py-3.5">
          <ClockIcon size={18} className="mt-0.5 shrink-0 text-marca" />
          <span className="flex flex-col text-sm">
            <span className="text-xs text-tecido">Horário</span>
            {hours.map((h) => (
              <span key={h.days} className="text-marca">
                {h.days}: <span className="font-mono">{h.time}</span>
              </span>
            ))}
          </span>
        </li>
      </ul>
      <div className="grid gap-2 border-t border-escala p-4 min-[400px]:grid-cols-2">
        <Button href={`mailto:${email}`} variant="contrast" size="md">
          <MailIcon size={17} />
          Enviar e-mail
        </Button>
        <Button href={`tel:${phone.tel}`} variant="secondary" size="md">
          <PhoneIcon size={17} />
          Ligar
        </Button>
      </div>
    </div>
  );
}
