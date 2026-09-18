/** xmlrpc.php do WordPress antigo: 410 Gone. Também corta tentativas de abuso. */
export function GET() {
  return new Response("Gone", { status: 410 });
}
export const POST = GET;
