# Site Scientific Dental

Rebuild do site da Scientific Dental Medical Ltda. em Next.js. Este README é o guia para quem vai
mexer no projeto sem ter participado do começo. O raciocínio de design está em
[docs/DESIGN-PLAN.md](docs/DESIGN-PLAN.md); leia antes de mudar cor, fonte ou layout.
Para localizar qualquer texto ou entender a função de cada pasta e arquivo, consulte
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Rodar no computador

Precisa de Node 22.18 ou mais novo (os testes executam o schema TypeScript nativamente).

```bash
npm install
npm run dev        # abre em http://localhost:3000
npm run build      # gera a versão de produção (também valida tipos)
npm run start      # serve a versão de produção
npm run typecheck  # TypeScript sem emitir arquivos
npm run lint       # ESLint
npm test           # integridade das referências de conteúdo
npm run validate:content
```

Formulários funcionam sem configurar nada: em desenvolvimento o lead é impresso no terminal.
Para entregar de verdade, copie `.env.example` para `.env.local` e preencha o webhook e/ou SMTP.

### Se o navegador insistir em mostrar uma versão antiga

Vários projetos desta máquina já rodaram em `localhost:3000`, e o navegador trata essa porta como
uma origem só. Um deles (`ERP/ERP-front`) registra um service worker que guarda o JavaScript em
cache e continua entregando os arquivos dele para qualquer projeto que suba depois na mesma porta.
O sintoma é característico: a página nova aparece por um instante e o layout antigo volta, com erro
de hidratação no console.

Por isso `public/sw.js` deste projeto é um service worker de desligamento: ele toma o lugar do
antigo, apaga os caches, se remove e recarrega a aba. Basta abrir `localhost:3000` uma vez. Para
conferir, veja DevTools > Application > Service Workers: a lista deve ficar vazia.

## Como o projeto está organizado

```
app/                 rotas (App Router). Cada pasta é uma URL.
  page.tsx           home
  produtos/          hub, categorias e produtos (uma rota atende os dois)
  orcamento/         pedido de orçamento em 4 etapas
  suporte/ contato/ a-scientific/ legacy-sd/ conteudo/ privacidade/
  actions/lead.ts    server action que recebe todos os formulários
  sd/                rede de segurança para URLs do site antigo (/sd/...)
components/
  ui/                peças básicas: Button, Container, Section (+Eyebrow), PageHero, Breadcrumb, Viewer, Icons
  site/              Header, Footer, Logo (SVG oficial), WhatsApp, consentimento de cookies, JSON-LD
  home/              seções da home (Hero, MoritaNotice, CategoryPlate, Support, Trust, Legacy, LatestContent, CtaBand)
  content/           ArticleCard (artigos e casos)
  product/           template da página de produto (galeria, specs, FOV)
  forms/             campos, formulário curto e o assistente de orçamento
content/             TODO O CONTEÚDO EDITÁVEL (ver abaixo)
lib/
  content.ts         única porta de entrada para o conteúdo (trocar por CMS = mexer só aqui)
  leads.ts           entrega de leads: webhook + e-mail, sem fornecedor fixo
  seo.ts             metadata, canonical, JSON-LD
  whatsapp.ts        links wa.me com mensagem pronta por página
public/images/       fotos otimizadas (geradas por script, não edite à mão)
public/brand/        logo oficial em SVG (Marca e branca) e PNGs recortados (gerados por script)
public/downloads/    PDFs (catálogos)
scripts/             utilitários: otimizar imagens, gerar ativos de marca, gerar web.config para IIS
docs/DESIGN-PLAN.md  plano de design e decisões
```

## Editar conteúdo

Tudo que o cliente pode querer mudar está em `content/`, em JSON:

| Arquivo | O que tem |
|---|---|
| `forms.json` | opções do orçamento, mensagens de sucesso e textos de consentimento |
| `site.json` | endereço, telefones, WhatsApp, horário, anos de fundação, territórios |
| `categories.json` | as 5 categorias de produto e seus produtos-destaque |
| `products/*.json` | um arquivo por produto (23 hoje). O `veraview-x800.json` é o exemplo completo |
| `articles.json` | artigos e casos clínicos |
| `redirects.json` | URLs antigas em `/sd/...` e para onde vão |

O site é gerado estaticamente: depois de editar um JSON, rode `npm run build` (ou faça o deploy) para
o conteúdo aparecer. Se um JSON estiver inválido, o build falha e diz qual campo está errado.

### Adicionar um produto

1. Copie `content/products/fixador.json` (simples) ou `veraview-x800.json` (completo) com o novo `slug`.
2. Coloque a foto original em uma pasta e rode `node scripts/process-images.mjs <pasta>`, depois de
   adicionar a linha `"nome-do-arquivo.jpg": "products/<slug>"` no mapa dentro do script.
   O script gera o JPEG otimizado em `public/images/products/` e anota largura e altura em
   `public/images/manifest.json`.
3. Se for destaque, inclua o slug em `flagship` da categoria em `categories.json`.

### A convenção VERIFICAR

Tudo que foi escrito sem confirmação do cliente está marcado. Procure por `VERIFICAR` no código
(`{/* VERIFICAR: ... */}`) e nos JSON (campo `"verificar": [...]`). Antes de publicar, cada item
precisa ser confirmado ou corrigido. Nada marcado aparece para o visitante.

## Design: o que não mudar sem ler o plano

Revisão visual de 18/09/2026 (seção 9 do plano): a cor da logo oficial, azul-marinho `#262443`
(`marca`), virou a cor dos títulos, do rodapé e das superfícies escuras; cartões com cantos
suaves e sombras tingidas; revelação ao rolar sem JavaScript.

- Tokens em `app/globals.css` (`@theme`). O vermelho `Marcador` é só para a ação primária de cada
  tela, linhas de medição e erro. Verde do WhatsApp só no botão flutuante (e na página Legacy).
  Links são escuros e sublinhados.
- IBM Plex Sans para texto (700 só no h1); IBM Plex Mono só para grandezas com unidade (µm, kV,
  mm, prazos, datas, protocolo).
- Radiografia sempre em painel escuro (`Viewer`); foto de produto sempre em fundo branco/Osso.
- Movimento: hero entra escalonado, cartões sobem 3 px no hover, seções revelam ao rolar
  (`reveal`, via `animation-timeline: view()`). `prefers-reduced-motion` desliga tudo.
- Header: todo item de menu é `whitespace-nowrap`; o que não cabe some por breakpoint (ver 9.4).

### Marca e logo

Os arquivos oficiais estão na pasta `SD/` do cliente (PDF e PNG sem fundo, em azul, branco, cinza
e preto). Para regenerar os ativos do site a partir deles:

```bash
python scripts/build-brand-assets.py "C:/caminho/para/SD"
```

Gera `public/brand/logo-marca.svg`, `logo-branco.svg` (vetor extraído do `Preto.pdf`), os PNGs
recortados, `app/icon.svg` (favicon com o "S"), `app/apple-icon.png` e `app/opengraph-image.png`.
Precisa de Python com `pymupdf` e `Pillow`. O componente `components/site/Logo.tsx` usa os SVGs.

### Conferir layout em várias larguras

Os scripts de captura usados na revisão (Playwright em Python, Chromium já instalado em
`%LOCALAPPDATA%/ms-playwright`) tiram screenshot de cada rota em 1440 e 390 px, emulam
`prefers-reduced-motion` (para a revelação ao rolar não deixar seções em branco), pré-aceitam o
cookie e listam elementos que estourem a viewport. Regra prática: qualquer `overflow_x > 0` é bug.

## Formulários e LGPD

- Todos os formulários passam por `app/actions/lead.ts` e `lib/leads.ts`.
- Consentimento explícito com link para `/privacidade` em todo formulário; a versão da política
  fica registrada no lead (`PRIVACY_POLICY_VERSION`).
- Nenhum script de terceiros carrega antes do aceite de cookies (`CookieConsent`). Para ligar o
  Google Tag Manager, defina `NEXT_PUBLIC_GTM_ID`.
- Campo-armadilha (honeypot) contra bots; sem CAPTCHA por enquanto.
- Em produção, configure `LEAD_RATE_LIMIT_REDIS_URL` e `LEAD_RATE_LIMIT_REDIS_TOKEN`
  com um Redis REST compatível com Upstash/Vercel KV. Sem essas variáveis, a entrega falha de forma
  segura; com elas, cada IP pode enviar até 5 formulários a cada 10 minutos.
- O rodapé oferece “Gerenciar cookies”, que revoga a escolha salva e reabre o painel de consentimento.

## Performance: como medir

Alvo do brief: Lighthouse ≥ 90 em tudo no celular, LCP < 2,5 s em 4G. Medição de 17/09/2026
(**antes da revisão visual de 18/09**; remedir antes do deploy), build de produção local, mobile
com 4G simulado:

| Página | Perf | A11y | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | 94 | 100 | 100 | 100 | 2,9 s | 101 ms | 0 |
| Veraview X800 | 96 | 100 | 100 | 100 | 2,8 s | 79 ms | 0 |
| Produtos (hub) | 98 | 100 | 100 | 100 | 2,0 s | 94 ms | 0 |
| Orçamento | 97 | 100 | 100 | 100 | 1,9 s | 173 ms | 0 |
| Suporte | 98 | 100 | 100 | 100 | 2,3 s | 63 ms | 0 |
| Contato | 96 | 100 | 100 | 100 | 2,4 s | 80 ms | 0 |

Duas ressalvas de método, para não perder tempo com falso alarme:

- **Chrome comum em modo headless (ou janela oculta atrás de outra) registra a primeira pintura
  1 a 2 s tarde** porque só produz quadros quando algo muda na tela. Isso infla o LCP simulado.
  Use o `chrome-headless-shell` (`npx @puppeteer/browsers install chrome-headless-shell@stable`) e
  aponte `CHROME_PATH` para ele, ou meça no PageSpeed Insights com o site publicado.
- **Em localhost tudo chega em ~90 ms**, então o simulador do Lighthouse considera que o JS
  precisava terminar antes do LCP e estima 2,8 s para home e X800 mesmo com a imagem do hero
  carregando em 47 ms. Publicado na Vercel, a medição real tende a ficar abaixo disso.

Decisões que sustentam esses números: imagens críticas (hero, foto principal do produto, cards)
servidas como `<picture>` estático com AVIF/WebP pré-codificados no build, sem depender do
otimizador em tempo de requisição; fontes auto-hospedadas pelo `next/font`, Mono fora do
pré-carregamento; formulários só hidratam o que é interativo; sem scripts de terceiros antes do
consentimento.

## Deploy

**Vercel (atual).** Importe o repositório com o preset **Next.js** e mantenha Root Directory,
Build Command e Output Directory nos valores automáticos. Em Settings > Environment Variables:

- `NEXT_PUBLIC_SITE_URL`: domínio público final; pode ser omitida até o domínio ser definido, pois
  a aplicação usa `VERCEL_PROJECT_PRODUCTION_URL` automaticamente.
- Para o limite dos formulários, conecte Upstash Redis pelo Marketplace. A aplicação aceita as
  variáveis injetadas pela integração (`UPSTASH_REDIS_REST_*` ou `KV_REST_API_*`) e também os nomes
  próprios listados em `.env.example`.
- Configure pelo menos um canal de entrega: `LEAD_WEBHOOK_URL` ou as variáveis `SMTP_*`.

Depois de alterar variáveis, faça um redeploy. Os 301 do site antigo estão em `next.config.ts`,
lidos de `content/redirects.json`.

**Se voltar para IIS.** Rode `node scripts/generate-web-config.mjs` para gerar
`deploy/iis/web.config` com as mesmas regras. Nesse caso o site precisa de Node no servidor
(server actions) ou de um endpoint externo para os formulários.

## Pendências conhecidas (fase 1)

- Logos das fabricantes (J. Morita, Carestream) em vetor com autorização: hoje são wordmarks em texto.
- Remedir Lighthouse após a revisão visual de 18/09.
- Radiografias do hero e da seção clínica vieram de material J. Morita: trocar por exames de
  cliente com autorização.
- Textos completos de artigos e casos ainda não migrados; casos estão em inglês.
- Mapa real de cobertura depende da lista de filiais.
- Prazos de SLA, garantia e retenção de dados marcados com VERIFICAR.
- Certificado TLS do domínio atual vencido em 05/08/2026: renovar antes de apontar o DNS.

## Revisão final e testes no navegador

Resultados e limites da revisão: [docs/REVISAO-FINAL.md](docs/REVISAO-FINAL.md).
Confirmações factuais antes da publicação: [docs/PENDENCIAS-CLIENTE.md](docs/PENDENCIAS-CLIENTE.md).

Os scripts opcionais `scripts/qa-browser.py` e `scripts/qa-interactions.py` usam Python + Playwright,
instalados fora das dependências do site (`python -m pip install playwright`). Use Chromium instalado
pelo Playwright (`python -m playwright install chromium`). O primeiro verifica todas as rotas em cinco
larguras, links internos, âncoras, redirects e JSON-LD, com `npm run start -- --port 3001`.
O segundo usa `npm run dev` na porta 3000 **sem canais de entrega configurados**, envia apenas dados
fictícios ao console e confere a falha segura do servidor de produção sem configuração na porta 3001.
Reinicie o servidor dev antes de repetir a suíte: o limite de cinco envios em dez minutos também é testável localmente.
As capturas e o JSON de auditoria ficam em `%TEMP%/scientific-qa`.

Para incluir axe-core na suíte visual, coloque `axe.min.js` (4.11.0) em `%TEMP%/scientific-axe.min.js`.
Sem esse arquivo, o script mantém as verificações de navegação e layout; não executa a auditoria axe.

Produção exige Redis REST **e** pelo menos um canal real de entrega (webhook ou SMTP).
O fallback para console é exclusivo de desenvolvimento. Configure as variáveis de `.env.example`
e faça um envio de homologação ao canal real antes de divulgar o site. Nenhuma credencial está no repositório.
