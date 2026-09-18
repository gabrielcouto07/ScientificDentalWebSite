import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import type { Category, Product } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  productsBySlug: Record<string, Product>;
  /** Imagem de destaque por categoria (por padrão, a do primeiro produto-âncora) */
  images?: Record<string, { src: string; alt: string }>;
};

/**
 * Prancha de catálogo: um cartão dominante para CBCT (é onde está a receita),
 * quatro menores. Cartões sobem no hover; a seta ganha fundo Marca.
 */
export function CategoryPlate({ categories, productsBySlug, images = {} }: Props) {
  const [first, ...rest] = categories;
  return (
    <Section
      id="produtos"
      eyebrow="Catálogo"
      title="Equipamentos e insumos"
      lead="Modelos reais, especificação real. Preço sob consulta, com proposta montada por um especialista."
      aside={
        <Link href="/produtos" className="inline-flex items-center gap-1.5 text-sm font-medium text-marca hover:underline">
          Ver todos os produtos
          <ArrowRightIcon size={16} />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Tile
          category={first}
          products={first.flagship.map((s) => productsBySlug[s]).filter(Boolean)}
          image={images[first.slug]}
          large
          className="reveal lg:col-span-6"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
          {rest.map((cat, i) => (
            <Tile
              key={cat.slug}
              category={cat}
              products={cat.flagship.map((s) => productsBySlug[s]).filter(Boolean)}
              image={images[cat.slug]}
              className={cn("reveal", i % 2 === 1 && "reveal-delay-1")}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Tile({
  category,
  products,
  image,
  large = false,
  className,
}: {
  category: Category;
  products: Product[];
  image?: { src: string; alt: string };
  large?: boolean;
  className?: string;
}) {
  const img = image ?? products[0]?.image;
  const specs = category.specLine.split("·").map((s) => s.trim());
  return (
    <Link
      href={`/produtos/${category.slug}`}
      className={cn("card card-hover group flex flex-col overflow-hidden p-3 focus-visible:outline-none", className)}
    >
      {img && (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-md bg-osso",
            large ? "aspect-[4/3] sm:aspect-[16/11]" : "aspect-[16/10]",
          )}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className={cn("object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]", large ? "p-6 sm:p-10" : "p-5")}
            quality={75}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-semibold", large ? "text-2xl sm:text-3xl" : "text-lg")}>{category.name}</h3>
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-escala text-marca transition-[background-color,color,border-color,transform] duration-200 group-hover:border-marca group-hover:bg-marca group-hover:text-radiopaco"
          >
            <ArrowRightIcon size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
        <p className={cn("mt-1.5 text-tecido", large ? "text-base" : "text-sm")}>{products.map((p) => p.name).join(", ")}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Especificação">
          {specs.map((s) => (
            <li key={s} className="rounded-full bg-marca-tint px-2.5 py-1 font-mono text-xs text-marca">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
