import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScaleBarProps = {
  /** Rótulo da medida, por exemplo "10 mm" */
  label: string;
  /** Comprimento em px na tela */
  length?: number;
  /** Desenha uma vez ao carregar. Só o hero usa isso. */
  animate?: boolean;
  className?: string;
};

/**
 * Barra de escala como nos softwares de visualização: linha com dois ticks
 * nas pontas e a medida em Mono.
 */
export function ScaleBar({ label, length = 120, animate = false, className }: ScaleBarProps) {
  const h = 14;
  const total = length + 2 * h; // comprimento do traço para o dash
  return (
    <figure className={cn("inline-flex flex-col items-end gap-1", className)} aria-label={`Escala: ${label}`}>
      <svg
        width={length}
        height={h}
        viewBox={`0 0 ${length} ${h}`}
        aria-hidden
        focusable={false}
        className="overflow-visible drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)]"
      >
        <path
          d={`M0.5 0 V${h} M0.5 ${h / 2} H${length - 0.5} M${length - 0.5} 0 V${h}`}
          fill="none"
          stroke="var(--color-marcador)"
          strokeWidth={1.5}
          strokeLinecap="square"
          pathLength={total}
          strokeDasharray={animate ? total : undefined}
          style={animate ? ({ "--draw-length": total } as React.CSSProperties) : undefined}
          className={animate ? "animate-draw" : undefined}
        />
      </svg>
      <figcaption className="font-mono text-xs text-escala drop-shadow-[0_1px_2px_rgb(0_0_0/0.8)]">{label}</figcaption>
    </figure>
  );
}

type ViewerProps = {
  children: ReactNode;
  /** Legenda em Mono no rodapé do painel: valores reais, nunca decoração. */
  caption?: ReactNode;
  scale?: ScaleBarProps;
  className?: string;
  /** Proporção do painel; a imagem preenche com object-fit: contain */
  aspect?: "4/3" | "16/9" | "1/1" | "5/4" | "auto";
  /** Sombra de "monitor" em volta do painel */
  elevated?: boolean;
  /** Alinhamento da legenda; "end" deixa o canto inferior esquerdo livre para uma ficha flutuante */
  captionAlign?: "start" | "end";
};

/**
 * Painel viewer: onde a radiografia vive. Fundo Radiolúcido, texto Escala.
 * Texto nunca fica por cima da imagem; a legenda tem a própria faixa.
 */
export function Viewer({
  children,
  caption,
  scale,
  className,
  aspect = "4/3",
  elevated = false,
  captionAlign = "start",
}: ViewerProps) {
  const aspectClass =
    aspect === "4/3"
      ? "aspect-[4/3]"
      : aspect === "16/9"
        ? "aspect-video"
        : aspect === "1/1"
          ? "aspect-square"
          : aspect === "5/4"
            ? "aspect-[5/4]"
            : "";
  return (
    <div
      className={cn(
        "viewer overflow-hidden rounded-xl ring-1 ring-radiopaco/10",
        elevated && "shadow-panel",
        className,
      )}
    >
      <div className={cn("relative w-full", aspectClass)}>
        {children}
        {scale && (
          <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
            <ScaleBar {...scale} />
          </div>
        )}
      </div>
      {caption && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-radiopaco/10 bg-radiopaco/[0.03] px-4 py-3 font-mono text-xs text-escala sm:text-sm",
            captionAlign === "end" && "justify-end",
          )}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
