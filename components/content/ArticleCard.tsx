import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Article } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

export const ARTICLE_TYPE_LABEL: Record<Article["type"], string> = { caso: "Caso clínico", artigo: "Artigo" };

/** Cartão de artigo ou caso clínico: tipo, data, título, resumo e a chamada "Ler". */
export function ArticleCard({ article: a, className }: { article: Article; className?: string }) {
  return (
    <Link
      href={`/conteudo/${a.slug}`}
      className={cn("card card-hover group flex h-full flex-col p-6", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            a.type === "caso" ? "bg-marca-tint text-marca" : "bg-osso text-tecido",
          )}
        >
          {ARTICLE_TYPE_LABEL[a.type]}
        </span>
        <time dateTime={a.date} className="font-mono text-xs text-tecido">
          {formatDate(a.date)}
        </time>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-snug group-hover:underline group-hover:decoration-escala group-hover:underline-offset-4">
        {a.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-tecido">{a.excerpt}</p>
      <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-marca">
        Ler {a.lang === "en" && <span className="font-normal text-tecido">(em inglês)</span>}
        <ArrowRightIcon size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
