import { permanentRedirect } from "next/navigation";
import { getProduct } from "@/lib/content";

/**
 * Rede de segurança: qualquer URL antiga em /sd/ que não esteja no mapa
 * explícito (content/redirects.json) vai para a home com 308 permanente.
 */
export default async function OldSitePath({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest = [] } = await params;
  if (rest[0] === "produto") {
    const slug = rest[1];
    permanentRedirect(slug && getProduct(slug) ? `/produtos/${slug}` : "/produtos");
  }
  permanentRedirect("/");
}
