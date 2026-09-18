import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import type { Product } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Cartão de produto para hub, categoria e relacionados. Foto em fundo Osso,
 * texto abaixo, seta que aparece no hover. Imagem estática pré-codificada
 * (Picture) e sem prefetch automático: em listas com 20+ itens, o prefetch
 * por viewport do next/link custa CPU e rede à toa.
 */
export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  /** Primeiro item visível da lista: carrega sem lazy para ser um bom LCP */
  priority?: boolean;
}) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      prefetch={false}
      className={cn("card card-hover group flex flex-col p-3 focus-visible:outline-none", className)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-osso">
        <Picture
          image={product.image}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:p-5"
        />
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="text-xs font-medium text-tecido">{product.brand ?? "Scientific Dental"}</p>
        <h3 className="mt-1 text-base font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-tecido">{product.tagline}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-marca opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          Ver produto
          <ArrowRightIcon size={15} />
        </span>
      </div>
    </Link>
  );
}
