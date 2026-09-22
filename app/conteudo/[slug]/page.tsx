import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLE_TYPE_LABEL, ArticleCard } from "@/components/content/ArticleCard";
import { JsonLd } from "@/components/site/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CalendarIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { getArticle, getArticles } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.excerpt, path: `/conteudo/${a.slug}` });
}

/**
 * Fase 1: título, resumo e metadados. O texto completo é migrado do WordPress
 * na fase 2 (MDX em /content/articles), sem mudar a URL.
 */
export default async function ArtigoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const others = getArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);
  return (
    <main id="conteudo" className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Conteúdo", path: "/conteudo" },
          { name: a.title, path: `/conteudo/${a.slug}` },
        ])}
      />
      <PageHero
        breadcrumb={<Breadcrumb items={[{ name: "Conteúdo", href: "/conteudo" }, { name: ARTICLE_TYPE_LABEL[a.type] }]} />}
        eyebrow={`${ARTICLE_TYPE_LABEL[a.type]}${a.lang === "en" ? " · texto em inglês" : ""}`}
        title={a.title}
        lead={a.excerpt}
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm text-tecido">
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon size={15} />
                <time dateTime={a.date}>{formatDate(a.date)}</time>
              </span>
              {a.source && <span>{a.source}</span>}
            </p>
            <div className="card mt-6 p-6 text-tecido sm:p-8">
              <p className="font-medium text-marca">Sobre este registro</p>
              <p className="mt-2 text-sm">
                {a.archiveNote} <a href="/contato" className="link">Solicitar material completo</a>
              </p>
            </div>
            <div className="mt-10 flex flex-col items-start gap-3 border-t border-escala pt-8 sm:flex-row sm:items-center">
              <Button href="/orcamento" size="lg">
                Solicitar orçamento
                <ButtonArrow />
              </Button>
              <Button href="/conteudo" variant="secondary" size="lg">
                Voltar ao conteúdo
              </Button>
            </div>
          </article>
          {others.length > 0 && (
            <aside className="lg:col-span-4">
              <h2 className="text-base font-semibold">Leia também</h2>
              <ul className="mt-4 grid gap-4">
                {others.map((o) => (
                  <li key={o.slug}>
                    <ArticleCard article={o} className="p-5" />
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </Container>
    </main>
  );
}
