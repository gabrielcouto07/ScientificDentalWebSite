import { permanentRedirect } from "next/navigation";

/**
 * Rede de segurança: qualquer URL antiga em /sd/ que não esteja no mapa
 * explícito (content/redirects.json) vai para a home com 308 permanente.
 */
export default function OldSitePath() {
  permanentRedirect("/");
}
