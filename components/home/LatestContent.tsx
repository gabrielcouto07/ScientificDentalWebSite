import Link from "next/link";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import type { Article } from "@/lib/content";
import { cn } from "@/lib/utils";

export function LatestContent({ articles }: { articles: Article[] }) {
  return (
    <Section
      id="conteudo"
      tone="osso"
      eyebrow="Conteúdo"
      title="Casos clínicos e artigos"
      lead="Para quem produz diagnóstico por imagem: o que ajuda a decidir e a laudar melhor."
      aside={
        <Link href="/conteudo" className="inline-flex items-center gap-1.5 text-sm font-medium text-marca hover:underline">
          Todos os artigos e casos
          <ArrowRightIcon size={16} />
        </Link>
      }
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {articles.map((a, i) => (
          <li key={a.slug} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
