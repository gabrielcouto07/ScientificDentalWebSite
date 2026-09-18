import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Eyebrow } from "./Section";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Trilha "Você está em" acima do eyebrow */
  breadcrumb?: ReactNode;
  /** Ações abaixo do lead (botões, links) */
  actions?: ReactNode;
  /** Coluna direita (cartão, lista, imagem) */
  aside?: ReactNode;
  compact?: boolean;
  className?: string;
};

/**
 * Cabeçalho padrão das páginas internas: mesmo fundo do hero da home
 * (gradiente leve + grade de pontos), eyebrow, título grande e lead.
 * Assim toda página abre com a mesma "assinatura" visual.
 */
export function PageHero({ eyebrow, title, lead, breadcrumb, actions, aside, compact = false, className }: Props) {
  return (
    <section className={cn("surface-hero relative overflow-hidden border-b border-escala", className)}>
      <div aria-hidden className="grid-dots pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" />
      <Container
        className={cn(
          "relative grid gap-10 lg:grid-cols-12 lg:items-end",
          compact ? "py-10 sm:py-14" : "py-14 sm:py-16 lg:py-20",
        )}
      >
        <div className={cn("animate-rise", aside ? "lg:col-span-7" : "lg:col-span-9")}>
          {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={cn("text-4xl sm:text-5xl", eyebrow && "mt-4")}>{title}</h1>
          {lead && <p className="prose-measure mt-5 text-lg text-tecido sm:text-xl">{lead}</p>}
          {actions && <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>}
        </div>
        {aside && (
          <div className="animate-rise lg:col-span-5" style={{ animationDelay: "120ms" }}>
            {aside}
          </div>
        )}
      </Container>
    </section>
  );
}
