import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { BRANDS, brandKeyOf } from "@/lib/brands";
import type { ContentImage, Product } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Só o que o cartão precisa. Mantém pequeno o payload enviado ao filtro do
 * catálogo (componente de cliente) em vez de mandar specs, FOVs e seções.
 */
export type ProductCardData = Pick<Product, "slug" | "name" | "tagline" | "brand" | "category"> & { image: ContentImage };

export function toCardData(p: Product): ProductCardData {
  return { slug: p.slug, name: p.name, tagline: p.tagline, brand: p.brand, category: p.category, image: p.image };
}

/**
 * Cartão de produto para hub, categoria e relacionados. Foto em fundo Osso,
 * texto abaixo, seta que aparece no hover.
 *
 * O filete de 2 px antes do nome do fabricante é a única cor de parceiro no
 * cartão: identifica a prateleira (Morita, Carestream, marca própria) sem virar
 * decoração. O texto fica em Tecido: laranja como texto reprova AA.
 *
 * A foto é um <ViewTransition> com o mesmo nome da foto do hero do produto,
 * então ao clicar ela "vira" a imagem grande em vez de sumir e reaparecer.
 * O prefetch padrão fica ligado: o morph só forma par quando o destino já
 * está em cache, e as 23 páginas são estáticas e pequenas.
 */
export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: ProductCardData;
  className?: string;
  /** Primeiro item visível da lista: carrega sem lazy para ser um bom LCP */
  priority?: boolean;
}) {
  const brand = BRANDS[brandKeyOf(product.brand)];
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className={cn("card card-hover group flex flex-col p-3", className)}
    >
      <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-osso">
          <Picture
            image={product.image}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 ease-out-soft group-hover:scale-[1.04] sm:p-5"
          />
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="flex items-center gap-2 text-xs font-medium text-tecido">
          <span aria-hidden className={cn("inline-block h-3 w-0.5 rounded-full", brand.accent)} />
          {brand.label}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-tecido">{product.tagline}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-marca opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          Ver produto
          <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
