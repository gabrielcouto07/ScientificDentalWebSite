"use client";

import Image from "next/image";
import { useId, useRef, useState, ViewTransition, type KeyboardEvent } from "react";
import { Picture } from "@/components/ui/Picture";
import type { ContentImage } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Foto de produto sempre em fundo branco. A imagem principal é um <picture>
 * estático (LCP da página); miniaturas ficam com next/image, carregadas depois.
 * Sem carrossel automático: miniaturas são botões com aria-pressed.
 *
 * O painel é um <ViewTransition> com o mesmo nome da foto do ProductCard
 * (`product-<slug>`): ao vir da lista, a foto do cartão cresce até aqui.
 */
export function ProductGallery({ images, name, slug }: { images: ContentImage[]; name: string; slug: string }) {
  const [index, setIndex] = useState(0);
  const panelId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <ViewTransition name={`product-${slug}`} share="morph" default="none">
        <div id={panelId} role={images.length > 1 ? "tabpanel" : undefined} aria-label={current.alt} className="card relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:aspect-square lg:aspect-[4/5]">
          <Picture
            key={current.src}
            image={current}
            priority={index === 0}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="animate-fade object-contain p-5 sm:p-8"
          />
        </div>
      </ViewTransition>
      {images.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label={`Fotos do ${name}`}>
          {images.map((img, i) => (
            <li key={img.src} role="presentation">
              <button
                ref={(element) => { buttons.current[i] = element; }}
                type="button"
                onClick={() => setIndex(i)}
                onKeyDown={(event) => moveWithKeyboard(event, i, images.length, setIndex, buttons.current)}
                role="tab"
                tabIndex={i === index ? 0 : -1}
                aria-selected={i === index}
                aria-controls={panelId}
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
      {current.caption && <p className="mt-2 text-xs text-tecido">{current.caption}</p>}
    </div>
  );
}

function moveWithKeyboard(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  length: number,
  select: (index: number) => void,
  buttons: Array<HTMLButtonElement | null>,
) {
  let next = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + length) % length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = length - 1;
  else return;
  event.preventDefault();
  select(next);
  buttons[next]?.focus();
}
