import Link from "next/link";
import { Fragment } from "react";

type Item = { name: string; href?: string };

/** Trilha "Você está em": links em Tecido, item atual em Marca. */
export function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Você está em" className="text-sm text-tecido">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.name}-${i}`}>
              {i > 0 && (
                <li aria-hidden className="text-escala">
                  /
                </li>
              )}
              <li aria-current={last ? "page" : undefined} className={last ? "font-medium text-marca" : undefined}>
                {item.href && !last ? (
                  <Link href={item.href} className="transition-colors hover:text-marca">
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
