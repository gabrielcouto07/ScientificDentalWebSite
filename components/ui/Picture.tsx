import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  image: ContentImage;
  /** Atributo sizes, igual ao do next/image */
  sizes: string;
  className?: string;
  /** Elemento crítico para o LCP: eager + fetchpriority=high */
  priority?: boolean;
  /** Preenche o pai posicionado (equivalente ao `fill` do next/image) */
  fill?: boolean;
};

/**
 * <picture> com variantes AVIF/WebP/JPEG pré-codificadas no build
 * (scripts/process-images.mjs). Usado onde o tempo de resposta importa mais
 * que a flexibilidade: hero da home e foto principal do produto. O resto do
 * site segue com next/image.
 */
export function Picture({ image, sizes, className, priority = false, fill = false }: Props) {
  const v = image.variants;
  const set = (list?: Array<{ src: string; w: number }>) =>
    list && list.length ? list.map((x) => `${x.src} ${x.w}w`).join(", ") : undefined;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- variantes AVIF/WebP pré-codificadas no build; o LCP não deve depender do otimizador
    <img
      src={image.src}
      srcSet={set(v?.jpg)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      // sync: o elemento LCP entra no primeiro quadro disponível, sem esperar um quadro extra pela decodificação
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
    />
  );

  if (!v || (!v.avif.length && !v.webp.length)) return img;

  return (
    <picture className={fill ? "contents" : undefined}>
      {v.avif.length > 0 && <source type="image/avif" srcSet={set(v.avif)} sizes={sizes} />}
      {v.webp.length > 0 && <source type="image/webp" srcSet={set(v.webp)} sizes={sizes} />}
      {img}
    </picture>
  );
}
