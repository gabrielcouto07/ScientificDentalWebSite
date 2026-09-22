"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error("[app] erro de rota", error), [error]);
  return (
    <main id="conteudo" className="flex flex-1 items-center bg-osso px-4 py-20">
      <div className="mx-auto w-full max-w-xl rounded-xl border border-escala bg-radiopaco p-8 text-center shadow-soft">
        <p className="font-mono text-sm text-tecido">Erro inesperado</p>
        <h1 className="mt-3 text-3xl">Não foi possível abrir esta página</h1>
        <p className="mt-4 text-tecido">Tente novamente. Se o problema continuar, volte ao início ou fale com nossa equipe.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="h-11 rounded-md bg-marcador px-5 font-medium text-radiopaco">
            Tentar novamente
          </button>
          <Link href="/" className="inline-flex h-11 items-center justify-center rounded-md border border-marca/30 px-5 font-medium text-marca">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
