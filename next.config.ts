import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

/**
 * Redirecionamentos 301 do site antigo (/sd/...).
 * Fonte única: content/redirects.json. O mesmo arquivo gera o web.config
 * para IIS (scripts/generate-web-config.mjs) caso a hospedagem mude.
 */
function loadRedirects() {
  const file = path.join(process.cwd(), "content", "redirects.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    redirects: Array<{ source: string; destination: string }>;
  };
  return data.redirects.flatMap(({ source, destination }) => [
    { source, destination, permanent: true },
    // WordPress servia tudo com barra final; cobrimos as duas formas.
    { source: `${source}/`, destination, permanent: true },
  ]);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [60, 75, 82],
  },
  async redirects() {
    return loadRedirects();
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS só faz sentido com certificado válido e renovação automática (Vercel provisiona).
          // Sem includeSubDomains nem preload de propósito: o host antigo (IIS) ainda responde
          // com certificado vencido, e preload é irreversível por meses.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
      {
        source: "/downloads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
