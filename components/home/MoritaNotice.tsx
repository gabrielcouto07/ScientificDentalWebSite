import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon, QuoteIcon } from "@/components/ui/Icons";
import type { SiteConfig } from "@/lib/content";

/**
 * O sinal de confiança mais forte da empresa, com a fonte citada, ao lado
 * das duas marcas representadas. Afirmação com fonte, não slogan.
 */
export function MoritaNotice({ notice, brands }: { notice: SiteConfig["moritaNotice"]; brands: string[] }) {
  return (
    <section aria-label="Comunicado oficial da J. Morita e marcas representadas" className="border-y border-escala bg-osso">
      <Container className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-8 lg:py-12">
        <figure className="reveal card flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-7 lg:col-span-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marca-tint text-marca">
            <QuoteIcon size={20} />
          </span>
          <div className="flex-1">
            <blockquote className="text-xl font-medium text-marca sm:text-2xl">
              <p>“{notice.quote}”</p>
            </blockquote>
            <figcaption className="mt-3 text-sm text-tecido">
              <span className="font-medium text-radiolucido">{notice.sourceLabel}</span>. {notice.summary}
            </figcaption>
            <a
              href={notice.sourceUrl}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-marca underline decoration-escala underline-offset-[0.2em] transition-colors hover:decoration-marca"
              target="_blank"
              rel="noopener"
            >
              Ler na página da Morita
              <ArrowUpRightIcon size={15} />
            </a>
          </div>
        </figure>

        <div className="reveal reveal-delay-1 grid grid-cols-2 gap-4 lg:col-span-4">
          <BrandTile name={brands[0] ?? "J. Morita"} detail="Kyoto, desde 1916" role="Raios X, CBCT e endodontia" />
          <BrandTile name={brands[1] ?? "Carestream"} detail="Carestream Health" role="Filmes e impressoras DryView" />
        </div>
      </Container>
    </section>
  );
}

/**
 * Marca representada como wordmark tipográfico: não recebemos os logos das
 * fabricantes em vetor. VERIFICAR: substituir por logos oficiais com autorização.
 */
function BrandTile({ name, detail, role }: { name: string; detail: string; role: string }) {
  return (
    <div className="card flex flex-col justify-between p-5">
      <div>
        <p className="text-xs font-medium text-tecido">Distribuidor oficial</p>
        <p className="mt-2 text-xl font-semibold tracking-tight text-marca sm:text-2xl">{name}</p>
        <p className="mt-0.5 text-xs text-tecido">{detail}</p>
      </div>
      <p className="mt-5 border-t border-escala pt-3 text-xs leading-snug text-tecido">{role}</p>
    </div>
  );
}
