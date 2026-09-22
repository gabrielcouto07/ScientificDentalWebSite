import { Container } from "@/components/ui/Container";
import type { SiteConfig } from "@/lib/content";
import { YearsSince } from "@/components/ui/CurrentTime";

/**
 * Quatro números grandes com a frase que os sustenta. Anos calculados do ano
 * de fundação, nunca escritos à mão. Sem contador animado: o número é um dado.
 */
export function TrustBand({ site }: { site: SiteConfig }) {
  const items = [
    {
      value: <YearsSince year={site.foundedYear} />,
      unit: "anos",
      title: "de Scientific",
      text: `Grupo no mercado desde ${site.foundedYear}; no segmento odontológico desde ${site.dentalSinceYear}.`,
    },
    {
      value: <YearsSince year={site.dentalSinceYear} />,
      unit: "anos",
      title: "em odontologia",
      text: "Da radiologia convencional ao CBCT de alta resolução, em centros de radiologia de todo o país.",
    },
    {
      value: "1º",
      unit: "",
      title: "distribuidor da América Latina",
      /* VERIFICAR: posição J. Morita; a posição Carestream consta no site atual como reconhecimento da Carestream Health */
      text: "Reconhecido pela Carestream Health como o maior distribuidor da marca odontológica na região.",
    },
    {
      value: String(site.team.technicians),
      unit: "técnicos",
      title: "próprios em campo",
      text: "Treinados pela fabricante, com peças originais e cobertura nacional em três territórios.",
    },
  ];
  return (
    <section aria-label="Por que a Scientific Dental" className="border-b border-escala bg-radiopaco">
      <Container className="py-14 sm:py-16">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-escala">
          {items.map((item, i) => (
            <li key={item.title} className={`reveal lg:px-8 lg:first:pl-0 lg:last:pr-0 ${i % 2 === 1 ? "reveal-delay-1" : ""}`}>
              <p className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-medium tracking-tight text-marca">{item.value}</span>
                {item.unit && <span className="text-lg font-medium text-marca">{item.unit}</span>}
              </p>
              <p className="mt-1 text-base font-semibold text-radiolucido">{item.title}</p>
              <p className="mt-2 text-sm text-tecido">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
