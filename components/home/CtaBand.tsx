import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ClockIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import type { SiteConfig } from "@/lib/content";

/**
 * Fecho da página: o pedido, o telefone e o horário, antes do rodapé.
 * Superfície clara com borda, para não repetir o escuro do rodapé logo abaixo.
 */
export function CtaBand({ site, whatsappHref }: { site: SiteConfig; whatsappHref: string }) {
  return (
    <section aria-labelledby="cta-title" className="bg-radiopaco">
      <Container className="py-16 sm:py-20">
        <div className="reveal relative overflow-hidden rounded-2xl border border-escala bg-osso">
          <div aria-hidden className="grid-dots pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:p-14">
            <div className="lg:col-span-7">
              <h2 id="cta-title" className="text-3xl sm:text-4xl">
                Pronto para elevar o padrão de diagnóstico do seu centro?
              </h2>
              <p className="mt-4 max-w-xl text-lg text-tecido">
                Conte o que você precisa. Um especialista da Scientific Dental monta a proposta com preço, prazo,
                instalação e assistência técnica.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Button href="/orcamento" size="lg">
                  Solicitar orçamento
                  <ButtonArrow />
                </Button>
                <Button href={whatsappHref} variant="secondary" size="lg" target="_blank">
                  <WhatsAppIcon size={18} className="text-sucesso" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <ul className="grid gap-3 text-sm lg:col-span-5">
              <li className="card flex items-center gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <PhoneIcon size={18} />
                </span>
                <span className="flex flex-col">
                  <a href={`tel:${site.phones.main.tel}`} className="font-mono text-base text-marca hover:underline">
                    {site.phones.main.display}
                  </a>
                  <span className="text-xs text-tecido">Comercial</span>
                </span>
              </li>
              <li className="card flex items-center gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <PhoneIcon size={18} />
                </span>
                <span className="flex flex-col">
                  <a href={`tel:${site.phones.support.tel}`} className="font-mono text-base text-marca hover:underline">
                    {site.phones.support.display}
                  </a>
                  <span className="text-xs text-tecido">Assistência técnica</span>
                </span>
              </li>
              <li className="card flex items-center gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marca-tint text-marca">
                  <ClockIcon size={18} />
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-base text-marca">{site.hours[0].time}</span>
                  <span className="text-xs text-tecido">
                    {site.hours[0].days.toLowerCase()}; {site.hours[1].days.toLowerCase()} {site.hours[1].time}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
