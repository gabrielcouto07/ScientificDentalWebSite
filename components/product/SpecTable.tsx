import type { SpecGroup } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Tabela de especificações como etiqueta de instrumento: rótulo em Sans,
 * valor numérico em Mono. Um cartão por grupo; duas colunas no desktop.
 */
export function SpecTable({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {groups.map((g, gi) => (
        <section
          key={g.title}
          aria-labelledby={`spec-${slug(g.title)}`}
          className={cn("card reveal p-5 sm:p-6", gi % 2 === 1 && "reveal-delay-1")}
        >
          <h3 id={`spec-${slug(g.title)}`} className="flex items-center gap-2.5 text-base font-semibold">
            <span aria-hidden className="inline-block h-0.5 w-5 rounded-full bg-marcador" />
            {g.title}
          </h3>
          <dl className="mt-4 divide-y divide-escala">
            {g.items.map((item) => (
              <div key={item.label} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sm text-tecido">{item.label}</dt>
                <dd className={cn("text-sm text-radiolucido sm:text-base", item.mono && "font-mono")}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}
