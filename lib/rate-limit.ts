import "server-only";
import { createHash } from "node:crypto";

const LIMIT = 5;
const WINDOW_SECONDS = 10 * 60;

type Bucket = { count: number; expiresAt: number };
const localBuckets = new Map<string, Bucket>();

function keyFor(ip: string): string {
  const digest = createHash("sha256").update(ip).digest("hex");
  return `rate-limit:lead:${digest}`;
}

function consumeLocal(key: string): boolean {
  const now = Date.now();
  const current = localBuckets.get(key);
  if (!current || current.expiresAt <= now) {
    localBuckets.set(key, { count: 1, expiresAt: now + WINDOW_SECONDS * 1000 });
    return true;
  }
  current.count += 1;
  if (localBuckets.size > 1_000) {
    for (const [bucketKey, bucket] of localBuckets) {
      if (bucket.expiresAt <= now) localBuckets.delete(bucketKey);
    }
  }
  return current.count <= LIMIT;
}

/**
 * Limite distribuído para formulários. Em produção, a proteção é persistida
 * no Redis REST (compatível com Upstash/Vercel KV) e falha fechada: se o
 * serviço não estiver configurado ou responder com erro, nenhum lead é
 * entregue ao SMTP/CRM. O Map local existe apenas para desenvolvimento.
 */
export async function consumeLeadRateLimit(ip: string): Promise<boolean> {
  const key = keyFor(ip);
  const url = process.env.LEAD_RATE_LIMIT_REDIS_URL;
  const token = process.env.LEAD_RATE_LIMIT_REDIS_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Rate limit de leads não configurado em produção");
    }
    return consumeLocal(key);
  }

  const script =
    'local n=redis.call("INCR",KEYS[1]); if n==1 then redis.call("EXPIRE",KEYS[1],ARGV[1]) end; return n';
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", script, "1", key, String(WINDOW_SECONDS)]),
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
  });
  if (!response.ok) throw new Error(`Rate limit respondeu ${response.status}`);
  const payload = (await response.json()) as { result?: number; error?: string };
  if (payload.error || typeof payload.result !== "number") {
    throw new Error(payload.error ?? "Resposta inválida do rate limit");
  }
  return payload.result <= LIMIT;
}
