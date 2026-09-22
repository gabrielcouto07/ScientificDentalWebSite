# Revisão final — 22/09/2026

## Baseline

- `npm install`: concluído; auditoria sem vulnerabilidades.
- `npm run dev -- --port 3000`: servidor iniciado sem `.env`.
- `npm run typecheck`, `npm run lint`, `npm run build`: aprovados antes de qualquer correção; 52 páginas geradas.
- As alterações que já estavam na árvore foram preservadas no commit de baseline `f5e819f`; os commits seguintes isolam esta revisão.

## Problemas identificados na leitura

- Telefone validava comprimento de texto, permitindo pontuação sem número suficiente.
- Campos das três primeiras etapas do orçamento eram opcionais no servidor.
- Honeypot rejeitava o preenchimento no schema antes de chegar ao descarte silencioso.
- Produção podia tratar ausência de canal de entrega como sucesso no console.
- Botões longos e controles do assistente precisavam de verificação a 360 px.
- Existiam promessas de SLA e retenção sem confirmação do cliente.

## Correções e acabamento

- Validação zod compartilhada entre servidor e assistente: telefone com DDD e dígitos reais, escolhas obrigatórias e mensagens por campo. Os formulários mantêm dados e consentimento após falha e levam o foco ao erro.
- O botão Continuar não dispara envio ao mudar para a última etapa. Voltar preserva escolhas e contato.
- Honeypot descartado antes da entrega; SMTP tem timeout; produção sem canal real não retorna sucesso de console.
- Campos com bordas/placeholder de maior contraste, cartões com foco visível, botões que acomodam texto em 360 px e painel Legacy sem recorte. Todos os tokens `@theme`, logos e imagens foram preservados.
- Menu mobile com fechamento interno, Escape, foco contido, links da página atual e fechamento ao ampliar a tela. Galeria por teclado e regiões de FOV roláveis com foco.
- WhatsApp flutuante contextual por produto, suporte, orçamento e Legacy. Filtros do catálogo preservam navegação voltar/avançar.
- Consentimento continua funcionando quando localStorage está bloqueado.
- Texto ajustado fica em JSON. Removidas promessas de SLA dos retornos e a retenção inventada do consentimento. Horário de sexta-feira é respeitado no suporte.
- Artigos preservam seus resumos e URLs e oferecem contato para solicitar o material completo. Não foi inventado corpo clínico nem feita tradução sem fonte.
- JSON-LD não afirma estoque disponível para produtos sob consulta. Marcadores editoriais internos não são mais enviados como atributos HTML.

## Validação final

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | Aprovado |
| `npm run lint` | Aprovado, sem erros nem avisos |
| `npm run build` | Aprovado, 52 páginas geradas |
| `npm test` | 4 testes aprovados |
| `npm run validate:content` | 23 produtos, 5 categorias, 7 artigos, 42 redirects e 44 imagens |
| Navegador: 44 rotas × 5 larguras | 220 verificações; sem overflow nem texto recortado |
| Larguras | 360, 768, 1024, 1440 e 1920 px |
| Links internos coletados | 865 combinações de origem/destino verificadas, incluindo âncoras e downloads |
| Acessibilidade automatizada | axe-core 4.11.0, WCAG A/AA em home, produtos, orçamento, suporte e X800, a 360 e 1440 px: nenhuma violação detectada |
| Fluxos no navegador | Contato, suporte, produto e orçamento com validação, preservação de dados e sucesso em desenvolvimento |
| Falha de entrega | Produção sem configuração mostra erro e mantém os dados |
| Cookies e teclado | Essenciais, aceite, revogação, armazenamento bloqueado, menu, galeria e filtros aprovados |

O terminal de desenvolvimento confirmou os quatro tipos de lead, com protocolo, origem e consentimento, sem `.env` e sem envio a terceiros. Os dados de teste usam `qa@example.invalid`. O limite local de cinco envios por dez minutos foi observado; reiniciar o dev limpa esse limite para repetir a suíte.

Rotas conferidas: home e páginas institucionais; catálogo com cinco categorias; as 23 páginas de produto pelo template compartilhado; sete resumos de artigos; orçamento, contato, suporte e privacidade. Todas renderizam com um h1. JSON-LD foi parseado em cada rota; sitemap e robots retornam 200; páginas desconhecidas retornam 404; endpoints antigos wp-json/xmlrpc retornam 410. As 42 regras explícitas foram testadas com e sem barra final; os 23 produtos antigos apontam para o produto correspondente. Next usa 308 para redirecionamento permanente.

## Pendências e limites

[Checklist do cliente](PENDENCIAS-CLIENTE.md): 110 entradas factuais rastreadas, agrupadas por empresa, produto, conteúdo e página, além de quatro decisões operacionais. Muitas são a mesma confirmação aplicada a produtos diferentes. WhatsApp comercial foi resolvido com a aprovação já registrada no plano; números, ANVISA, direitos das imagens, contratos e afirmações não confirmadas continuam marcados.

Antes da publicação pública: configurar Redis REST e webhook/SMTP, homologar recebimento real, obter as confirmações factuais e aprovar a minuta de privacidade. Os sete artigos ainda dependem dos textos integrais do cliente; hoje as páginas exibem os resumos disponíveis. A auditoria automatizada de acessibilidade é amostral e não equivale a certificação completa. Lighthouse não foi remedido; não se atribui uma nota nova. A estrutura de imagens locais, variantes AVIF/WebP, fontes locais geradas pelo Next e geração estática foi preservada.

Não foram acrescentadas funcionalidades extras nem dependências ao site. Os scripts de imagens e marca não foram executados. O design não foi redesenhado.

## Execução local

Servidor de desenvolvimento mantido em **http://localhost:3000**, confirmado com HTTP 200. Para iniciar novamente: `npm run dev` na pasta `ScientificDentalWebSite`.

