import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { ArrowUpRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, UsersIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { quoteWhatsappLink, whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description:
    "Fale com a Scientific Dental em Belo Horizonte: telefone (31) 2112-1900, WhatsApp, e-mail e endereço. Atendimento comercial e assistência técnica em todo o Brasil.",
  path: "/contato",
});

export default function ContatoPage() {
  const site = getSite();
  const whatsappHref = whatsappLink(whatsappMessages.default);
  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        compact
        eyebrow="Contato"
        title="Fale com a Scientific Dental"
        lead="Comercial, assistência técnica e WhatsApp em horário comercial. Sede administrativa e técnica em Belo Horizonte, equipe regional em todo o país."
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="reveal flex flex-col gap-3 lg:col-span-5">
            <Channel icon={<PhoneIcon size={18} />} label="Comercial">
              <a href={`tel:${site.phones.main.tel}`} className="font-mono text-base text-marca hover:underline">
                {site.phones.main.display}
              </a>{" "}
              <span className="text-tecido">e</span>{" "}
              <a href={`tel:${site.phones.sales.tel}`} className="font-mono text-base text-marca hover:underline">
                {site.phones.sales.display}
              </a>
            </Channel>
            <Channel icon={<PhoneIcon size={18} />} label="Orçamentos">
              <a href={`tel:${site.phones.quote.tel}`} className="font-mono text-base text-marca hover:underline">
                {site.phones.quote.display}
              </a>{" "}
              <span className="text-tecido">ou</span>{" "}
              <a
                href={quoteWhatsappLink(whatsappMessages.quoteRequest)}
                className="inline-flex items-center gap-1.5 font-mono text-base text-marca hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={15} className="text-sucesso" />
                {site.whatsappQuote.display}
              </a>
            </Channel>
            <Channel icon={<PhoneIcon size={18} />} label="Assistência técnica">
              <a href={`tel:${site.phones.support.tel}`} className="font-mono text-base text-marca hover:underline">
                {site.phones.support.display}
              </a>
            </Channel>
            <Channel icon={<WhatsAppIcon size={18} />} label="WhatsApp" tone="sucesso">
              <a href={whatsappHref} className="font-mono text-base text-marca hover:underline" target="_blank" rel="noopener">
                {site.whatsapp.display}
              </a>
            </Channel>
            <Channel icon={<MailIcon size={18} />} label="E-mail">
              <a href={`mailto:${site.emails.contact}`} className="break-all text-marca hover:underline">
                {site.emails.contact}
              </a>
              <span className="mt-1 block text-sm">
                <a href={`mailto:${site.emails.support}`} className="break-all text-marca hover:underline">
                  {site.emails.support}
                </a>{" "}
                <span className="text-tecido">(chamados técnicos)</span>
              </span>
            </Channel>
            <Channel icon={<UsersIcon size={18} />} label="Trabalhe conosco (RH)">
              <a href={`mailto:${site.emails.hr}`} className="break-all text-marca hover:underline">
                {site.emails.hr}
              </a>
              <span className="mt-1 block text-sm">
                <a href={`tel:${site.phones.hr.tel}`} className="font-mono text-marca hover:underline">
                  {site.phones.hr.display}
                </a>{" "}
                <span className="text-tecido">·</span>{" "}
                <Link href="/trabalhe-conosco" className="font-medium text-marca hover:underline">
                  Enviar currículo pelo site
                </Link>
              </span>
            </Channel>
            <Channel icon={<MapPinIcon size={18} />} label="Endereço">
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city}/{site.address.state}
                <span className="block font-mono text-xs text-tecido">CEP {site.address.postalCode}</span>
                <a
                  href={site.address.mapsUrl}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-marca hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  Abrir no mapa
                  <ArrowUpRightIcon size={14} />
                </a>
              </address>
            </Channel>
            <Channel icon={<ClockIcon size={18} />} label="Horário de atendimento">
              <dl className="text-sm">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex gap-3">
                    <dt className="w-36 text-tecido">{h.days}</dt>
                    <dd className="font-mono text-marca">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Channel>
            <p className="mt-2 text-xs text-tecido">
              Filiais e equipe regional em todo o país; a sede administrativa e técnica fica em Belo Horizonte.
              {/* VERIFICAR: endereços das filiais para listar aqui */}
            </p>
          </div>
          <div className="reveal reveal-delay-1 lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl">Envie uma mensagem</h2>
            <p className="mt-2 text-tecido">A equipe responde pelo telefone ou e-mail informados.</p>
            <LeadForm
              kind="contato"
              sourcePath="/contato"
              whatsappHref={whatsappHref}
              submitLabel="Enviar mensagem"
              withMessage
              messageLabel="Como podemos ajudar?"
              className="mt-6"
            />
          </div>
        </div>
      </Container>
    </main>
  );
}

function Channel({
  icon,
  label,
  children,
  tone = "marca",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  tone?: "marca" | "sucesso";
}) {
  return (
    <div className="card flex items-start gap-4 p-4 sm:p-5">
      <span
        className={
          tone === "sucesso"
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sucesso/10 text-sucesso"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca"
        }
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-tecido">{label}</p>
        <div className="mt-1 text-base">{children}</div>
      </div>
    </div>
  );
}
