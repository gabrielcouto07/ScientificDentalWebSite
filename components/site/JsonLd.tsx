/** Injeta JSON-LD. `data` já vem montado por lib/seo.ts. */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapa "<" para evitar fechamento prematuro da tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
