import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "radiopaco" | "osso" | "marca";

type Props = {
  id?: string;
  /** Rótulo curto acima do título (ex.: "Catálogo", "Assistência técnica") */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Ação à direita do título (um link ou botão secundário) */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Fundo: branco, Osso ou Marca (escuro) */
  tone?: Tone;
  /** Régua com ticks no topo. Desligue quando a seção anterior já fecha com uma. */
  rule?: boolean;
  headingLevel?: "h1" | "h2";
  /** Título centralizado (para seções de destaque) */
  center?: boolean;
  /** Espaçamento vertical reduzido */
  compact?: boolean;
};

const tones: Record<Tone, string> = {
  radiopaco: "bg-radiopaco",
  osso: "bg-osso",
  marca: "surface-marca on-dark",
};

/**
 * Seção padrão: eyebrow + título à esquerda, ação opcional à direita,
 * conteúdo abaixo. Em tom Marca, títulos e eyebrow trocam para branco.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  aside,
  children,
  className,
  tone = "radiopaco",
  rule = false,
  headingLevel = "h2",
  center = false,
  compact = false,
}: Props) {
  const Heading = headingLevel;
  const dark = tone === "marca";
  return (
    <section id={id} className={cn(tones[tone], className)} aria-labelledby={title && id ? `${id}-title` : undefined}>
      <Container>
        <div className={cn(rule && "rule-ticks", compact ? "py-12 sm:py-14" : "py-16 sm:py-20 lg:py-24")}>
          {(title || aside || eyebrow) && (
            <div
              className={cn(
                "reveal mb-10 flex flex-col gap-5 sm:mb-12",
                center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
              )}
            >
              <div className={cn("max-w-2xl", center && "flex flex-col items-center")}>
                {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
                {title && (
                  <Heading
                    id={id ? `${id}-title` : undefined}
                    className={cn("text-3xl sm:text-4xl", eyebrow && "mt-4", dark && "text-radiopaco")}
                  >
                    {title}
                  </Heading>
                )}
                {lead && (
                  <p className={cn("mt-4 text-lg", dark ? "text-escala" : "text-tecido", center && "prose-measure")}>
                    {lead}
                  </p>
                )}
              </div>
              {aside && <div className="shrink-0">{aside}</div>}
            </div>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}

/** Rótulo curto com o traço de medição em Marcador. Sentence case, nunca caixa alta espaçada. */
export function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 text-sm font-medium", dark ? "text-escala" : "text-marca", className)}>
      <span aria-hidden className="inline-block h-0.5 w-6 rounded-full bg-marcador" />
      {children}
    </p>
  );
}
