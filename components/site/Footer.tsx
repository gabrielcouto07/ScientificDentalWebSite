import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import type { Category, SiteConfig } from "@/lib/content";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { Logo } from "./Logo";

type Props = { site: SiteConfig; categories: Category[] };

/**
 * Rodapé em superfície Marca com a logo branca oficial. Quatro colunas no
 * desktop; no celular vira uma coluna com os contatos primeiro.
 */
export function Footer({ site, categories }: Props) {
  const year = new Date().getFullYear();
  const whatsappHref = whatsappLink(whatsappMessages.default);
  return (
    <footer className="surface-marca on-dark" aria-labelledby="footer-title">
      <Container className="pt-16 pb-8 sm:pt-20">
        <h2 id="footer-title" className="sr-only">
          Rodapé
        </h2>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo inverse height={34} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-escala">
              Venda e assistência técnica oficial J. Morita e Carestream no Brasil. No segmento odontológico desde{" "}
              {site.dentalSinceYear}, com sede técnica em Belo Horizonte e equipe em todo o país.
            </p>
            <address className="mt-8 flex items-start gap-3 text-sm not-italic text-escala">
              <MapPinIcon size={18} className="mt-0.5 shrink-0 text-radiopaco/70" />
              <span>
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city}/{site.address.state}
                <span className="block font-mono text-xs text-radiopaco/60">CEP {site.address.postalCode}</span>
                <a
                  href={site.address.mapsUrl}
                  className="mt-2 inline-flex items-center gap-1 text-radiopaco underline decoration-radiopaco/30 underline-offset-[0.2em] hover:decoration-radiopaco"
                  rel="noopener"
                  target="_blank"
                >
                  Como chegar
                  <ArrowUpRightIcon size={14} />
                </a>
              </span>
            </address>
            <dl className="mt-6 space-y-1 text-sm text-escala">
              {site.hours.map((h) => (
                <div key={h.days} className="flex gap-3">
                  <dt className="w-36 text-radiopaco/60">{h.days}</dt>
                  <dd className="font-mono">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label="Produtos" className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-semibold text-radiopaco">Produtos</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <FooterLink href={`/produtos/${c.slug}`}>{c.name}</FooterLink>
                </li>
              ))}
              <li className="pt-2">
                <FooterLink href="/orcamento" strong>
                  Solicitar orçamento
                </FooterLink>
              </li>
            </ul>
          </nav>

          <nav aria-label="Institucional" className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-radiopaco">A empresa</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <FooterLink href="/a-scientific">A Scientific</FooterLink>
              </li>
              <li>
                <FooterLink href="/suporte">Suporte técnico</FooterLink>
              </li>
              <li>
                <FooterLink href="/legacy-sd">Legacy SD</FooterLink>
              </li>
              <li>
                <FooterLink href="/conteudo">Conteúdo e casos clínicos</FooterLink>
              </li>
              <li>
                <FooterLink href="/contato">Contato</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacidade">Política de privacidade</FooterLink>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  className="inline-flex items-center gap-1 text-escala transition-colors hover:text-radiopaco"
                  rel="noopener"
                  target="_blank"
                >
                  Instagram
                  <ArrowUpRightIcon size={14} />
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-radiopaco">Comercial e suporte</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <ContactRow icon={<PhoneIcon size={18} />} label="Comercial">
                <a href={`tel:${site.phones.main.tel}`} className="font-mono text-radiopaco hover:underline">
                  {site.phones.main.display}
                </a>
              </ContactRow>
              <ContactRow icon={<WhatsAppIcon size={18} />} label="WhatsApp">
                <a href={whatsappHref} className="font-mono text-radiopaco hover:underline" rel="noopener" target="_blank">
                  {site.whatsapp.display}
                </a>
              </ContactRow>
              <ContactRow icon={<PhoneIcon size={18} />} label="Assistência técnica">
                <a href={`tel:${site.phones.support.tel}`} className="font-mono text-radiopaco hover:underline">
                  {site.phones.support.display}
                </a>
              </ContactRow>
              <ContactRow icon={<MailIcon size={18} />} label="Chamados técnicos">
                <a href={`mailto:${site.emails.support}`} className="break-all text-radiopaco hover:underline">
                  {site.emails.support}
                </a>
              </ContactRow>
            </ul>
            <Link
              href="/suporte"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-radiopaco/30 px-4 text-sm font-medium text-radiopaco transition-colors hover:border-radiopaco hover:bg-radiopaco/10"
            >
              Abrir chamado técnico
              <ArrowUpRightIcon size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-radiopaco/15 pt-6 text-xs text-radiopaco/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Distribuidor autorizado J. Morita e Carestream.
            {/* VERIFICAR: CNPJ e razão social completa para o rodapé */}
          </p>
          <p className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-radiopaco">
              Privacidade e LGPD
            </Link>
            <span aria-hidden>·</span>
            <span>Belo Horizonte, MG</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterLink({ href, children, strong = false }: { href: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <Link
      href={href}
      className={
        strong
          ? "font-medium text-radiopaco underline decoration-radiopaco/30 underline-offset-[0.2em] hover:decoration-radiopaco"
          : "text-escala transition-colors hover:text-radiopaco"
      }
    >
      {children}
    </Link>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-radiopaco/10 text-radiopaco">
        {icon}
      </span>
      <span className="flex flex-col">
        {children}
        <span className="text-xs text-radiopaco/60">{label}</span>
      </span>
    </li>
  );
}
