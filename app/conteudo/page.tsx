import type { Metadata } from "next";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Conteúdo e casos clínicos",
  description: "Artigos sobre radiologia odontológica de alta resolução e casos clínicos com equipamentos J. Morita.",
  path: "/conteudo",
});

export default function ConteudoPage() {
  const articles = getArticles();
  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        compact
        eyebrow="Conteúdo"
        title="Casos clínicos e artigos"
        lead="Para quem produz diagnóstico por imagem. Sem novidades de blog: só o que ajuda a decidir e a laudar melhor."
      />
      <Container className="py-12 sm:py-16">
        <p className="font-mono text-xs text-tecido">
          {articles.length} {articles.length === 1 ? "publicação" : "publicações"}
        </p>
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <li key={a.slug} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
