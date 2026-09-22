"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#f3f4f9", color: "#121417", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ maxWidth: 560, padding: 32, textAlign: "center", background: "#fff", border: "1px solid #d5d8e3", borderRadius: 14 }}>
            <p style={{ margin: 0, color: "#5c6070" }}>Scientific Dental</p>
            <h1 style={{ color: "#262443" }}>O site encontrou um problema</h1>
            <p>Você pode tentar carregar novamente ou retornar à página inicial.</p>
            <button onClick={reset} style={{ margin: 8, padding: "12px 18px", border: 0, borderRadius: 10, color: "#fff", background: "#d6302b", cursor: "pointer" }}>
              Tentar novamente
            </button>
            {/* Recarregamento completo é intencional: o root layout pode ser a origem da falha. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ display: "inline-block", margin: 8, padding: "11px 18px", border: "1px solid #262443", borderRadius: 10, color: "#262443" }}>
              Voltar ao início
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
