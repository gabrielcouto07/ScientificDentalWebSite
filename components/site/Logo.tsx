import { cn } from "@/lib/utils";

/**
 * Wordmark oficial da Scientific Dental, extraído do PDF vetorial do cliente
 * (scripts/build-brand-assets.py). Duas versões: Marca (azul-marinho) para
 * fundo claro e branca para fundo escuro. Proporção fixa 3,99:1.
 *
 * É um <img> e não SVG inline: o arquivo é cacheado uma vez e não infla o
 * HTML de cada página. O alt carrega o nome acessível do link do header.
 */
export function Logo({
  className,
  inverse = false,
  height = 30,
}: {
  className?: string;
  inverse?: boolean;
  /** Altura em px; a largura segue a proporção */
  height?: number;
}) {
  const width = Math.round(height * 3.99);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca; next/image não otimiza SVG
    <img
      src={inverse ? "/brand/logo-branco.svg" : "/brand/logo-marca.svg"}
      alt="Scientific Dental"
      width={width}
      height={height}
      decoding="async"
      className={cn("block h-auto w-auto select-none", className)}
      style={{ height, width }}
      draggable={false}
    />
  );
}
