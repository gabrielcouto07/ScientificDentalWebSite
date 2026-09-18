/** A API do WordPress antigo não existe mais: 410 Gone, para os buscadores esquecerem. */
export function GET() {
  return new Response("Gone", { status: 410 });
}
export const POST = GET;
