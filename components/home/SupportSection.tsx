import { Button, ButtonArrow } from "@/components/ui/Button";
import { ClockIcon, HeadsetIcon, PackageIcon, PhoneIcon, UsersIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import type { SiteConfig } from "@/lib/content";

/**
 * Suporte ganha uma tela inteira em superfície Marca porque é o diferencial:
 * tomógrafo parado é receita perdida. Números em Mono; tudo o que não foi
 * confirmado está marcado.
 */
export function SupportSection({ site }: { site: SiteConfig }) {
  const stateCount = site.territories.flatMap((territory) => territory.states).filter((state) => state !== "DF").length;
  const commitments = [
    /* VERIFICAR: prazos e números abaixo são propostas; confirmar com a coordenação de assistência */
    { icon: ClockIcon, label: "Primeira resposta ao chamado", value: "até 1 dia útil" },
    { icon: HeadsetIcon, label: "Diagnóstico remoto", value: site.hours[0] ? `seg a sex, ${site.hours[0].time}` : "horário a confirmar" },
    { icon: UsersIcon, label: "Técnicos em campo", value: `${site.team.technicians} em ${site.territories.length} regiões` },
    { icon: PackageIcon, label: "Peças originais", value: "estoque em Belo Horizonte" },
  ];

  return (
    <Section
      id="suporte"
      tone="marca"
      eyebrow="Assistência técnica"
      title="Quem atende o seu equipamento"
      lead="Assistência técnica oficial J. Morita no Brasil, com técnicos próprios treinados pela fabricante e peças originais."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="reveal lg:col-span-5">
          <ul className="divide-y divide-radiopaco/10 rounded-xl border border-radiopaco/10 bg-radiopaco/[0.04]">
            {commitments.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-radiopaco/10 text-radiopaco">
                  <Icon size={19} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-sm text-escala">{label}</span>
                  <span className="font-mono text-sm text-radiopaco sm:text-right">{value}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href="/suporte" variant="inverse-solid" size="lg">
              Abrir chamado técnico
              <ButtonArrow />
            </Button>
            <a
              href={`tel:${site.phones.support.tel}`}
              className="inline-flex items-center gap-2 text-sm text-escala transition-colors hover:text-radiopaco"
            >
              <PhoneIcon size={16} />
              Suporte direto <span className="font-mono text-radiopaco">{site.phones.support.display}</span>
            </a>
          </div>
        </div>

        <div className="reveal reveal-delay-1 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-semibold text-radiopaco">Cobertura por região</h3>
            <p className="font-mono text-xs text-escala">
              {stateCount} estados + DF
            </p>
          </div>
          {/* VERIFICAR: territórios e siglas vêm de sd-hit.com; um mapa real entra quando o cliente enviar a lista de bases */}
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {site.territories.map((t, i) => (
              <li
                key={t.name}
                className="flex flex-col rounded-xl border border-radiopaco/10 bg-radiopaco/[0.04] p-5 transition-colors hover:bg-radiopaco/[0.08]"
              >
                <span className="font-mono text-xs text-escala">Território {String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 text-base font-semibold leading-snug text-radiopaco">{t.name}</span>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Estados atendidos">
                  {t.states.map((s) => (
                    <li key={s} className="rounded-sm bg-radiopaco/10 px-1.5 py-0.5 font-mono text-xs text-radiopaco">
                      {s}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-5 text-xs text-escala">Gerente regional dedicado</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-escala">
            {site.team.radiologists} radiologistas na equipe de aplicação e sede técnica em Belo Horizonte.
          </p>
        </div>
      </div>
    </Section>
  );
}
