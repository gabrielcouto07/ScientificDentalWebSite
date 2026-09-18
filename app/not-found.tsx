import type { Metadata } from "next";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="conteudo" className="surface-hero relative flex-1 overflow-hidden">
      <div aria-hidden className="grid-dots pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative py-24 sm:py-32">
        <div className="animate-rise mx-auto max-w-2xl text-center">
          <p className="font-mono text-7xl font-medium tracking-tight text-marca-tint sm:text-8xl" aria-hidden>
            404
          </p>
          <p className="font-mono text-sm text-tecido">Erro 404</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Esta página não existe</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-tecido">
            O endereço pode ter mudado com o novo site. Os produtos estão em Produtos e o atendimento em Contato.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/produtos" size="lg">
              Ir para Produtos
              <ButtonArrow />
            </Button>
            <Button href="/contato" variant="secondary" size="lg">
              Ir para Contato
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
