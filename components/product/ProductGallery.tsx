"use client";

import Image from "next/image";
import { useState } from "react";
import { Picture } from "@/components/ui/Picture";
import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Foto de produto sempre em fundo branco. A imagem principal é um <picture>
 * estático (LCP da página); miniaturas ficam com next/image, carregadas depois.
 * Sem carrossel automático: miniaturas são botões com aria-pressed.
 */
export function ProductGallery({ images, name }: { images: ContentImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="card relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:aspect-square lg:aspect-[4/5]">
        <Picture
          key={current.src}
          image={current}
          priority={index === 0}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="animate-fade object-contain p-5 sm:p-8"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label={`Fotos do ${name}`}>
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                aria-label={img.caption ?? img.alt}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-md border bg-radiopaco transition-[border-color,box-shadow] sm:h-20 sm:w-20",
                  i === index ? "border-marca shadow-focus" : "border-escala hover:border-tecido",
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" quality={60} className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {current.caption && <p className="mt-2 font-mono text-xs text-tecido">{current.caption}</p>}
    </div>
  );
}
