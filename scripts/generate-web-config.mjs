/**
 * Gera deploy/iis/web.config a partir de content/redirects.json.
 *
 * Só é necessário se o site voltar a ser servido pelo IIS (hospedagem atual).
 * Na Vercel, o next.config.ts já aplica os mesmos 301.
 *
 * Uso: node scripts/generate-web-config.mjs
 */
import fs from "node:fs";
import path from "node:path";

const { redirects } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "redirects.json"), "utf8"));

const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "/sd/produto/:slug" -> regex "^sd/produto/([^/]+)/?$" e destino "/produtos/{R:1}" */
function toRule({ source, destination }, i) {
  const params = [];
  const pattern = source
    .replace(/^\//, "")
    .replace(/[.]/g, "\\.")
    .replace(/:([a-zA-Z]+)/g, (_, name) => {
      params.push(name);
      return "([^/]+)";
    });
  const dest = destination.replace(/:([a-zA-Z]+)/g, (_, name) => `{R:${params.indexOf(name) + 1}}`);
  return `      <rule name="sd-${String(i + 1).padStart(3, "0")}" stopProcessing="true">
        <match url="^${escapeXml(pattern)}/?$" ignoreCase="true" />
        <action type="Redirect" url="${escapeXml(dest)}" redirectType="Permanent" appendQueryString="false" />
      </rule>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Gerado por scripts/generate-web-config.mjs a partir de content/redirects.json. Não edite à mão. -->
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
${redirects.map(toRule).join("\n")}
      <rule name="sd-wp-json-gone" stopProcessing="true">
        <match url="^sd/(wp-json|xmlrpc\\.php)" ignoreCase="true" />
        <action type="CustomResponse" statusCode="410" statusReason="Gone" statusDescription="Gone" />
      </rule>
      <rule name="sd-catch-all" stopProcessing="true">
        <match url="^sd(/.*)?$" ignoreCase="true" />
        <action type="Redirect" url="/" redirectType="Permanent" appendQueryString="false" />
      </rule>
      </rules>
    </rewrite>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
`;

const out = path.join(process.cwd(), "deploy", "iis", "web.config");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, xml);
console.log(`web.config gerado em ${path.relative(process.cwd(), out)} com ${redirects.length} regras + 410 + catch-all.`);
