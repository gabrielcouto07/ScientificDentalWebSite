# Plano de design — site Scientific Dental (fase 1, etapa 1)

Status: **confirmado em 17/09/2026** com as decisões: hospedagem Vercel (301 portáveis para IIS),
acento Marcador `#D6302B` sem manual de marca, WhatsApp `(31) 2112-1938`, catálogo atual (23 produtos).
Data do plano: 17/09/2026.

Tudo o que está marcado `<!-- VERIFICAR -->` foi inferido e precisa de confirmação do cliente.

---

## 0. O que foi verificado no site atual antes de desenhar

| Achado | Evidência | Consequência |
|---|---|---|
| Página oficial da J. Morita diz "J. Morita Brasil não está mais em operação" e lista **só a Scientific Dental** (vendas e assistência de raios X e endodontia) | morita.com/america/en/in-focus/morita-in-brazil/suporte-ao-produto/ | Vira a afirmação central do hero, **com a fonte citada** |
| Site atual é WordPress + WooCommerce, tema genérico "business-capital" | meta generator, CSS do tema | Confirma o diagnóstico do brief |
| O vermelho do site é **#F44336**, o Material Red padrão do tema (78 ocorrências no CSS). O logo em uso é 100 % branco; a faixa de parceiros usa o logo em cinza. Nenhum ativo colorido da marca foi encontrado (site, Legacy SD, Instagram bloqueado) | amostragem pixel a pixel do PNG do logo; grep do CSS | Não existe "hex do logo" para amostrar. A proposta abaixo mantém a família do vermelho, corrigida para contraste AA. Pedir manual de marca ao cliente |
| Fontes atuais: Poppins + Roboto (tema). Legacy SD: Lato + Montserrat | CSS | Nenhuma é decisão de marca; livres para escolher |
| **Certificado TLS venceu em 05/08/2026** (GlobalSign AlphaSSL) | `openssl s_client` | Renovar agora, independente do rebuild. Navegadores bloqueiam o site sem "avançar mesmo assim" |
| Hospedagem: **Microsoft IIS 10**; a raiz redireciona para `/sd/` | headers HTTP | Define onde vivem os 301 (web.config e/ou next.config) |
| Os PDFs de catálogo/manual apontam para **megacriar.com.br** (domínio da agência), fora do ar. Cópia existe no servidor do cliente | links da página do X800; curl | Hospedar PDFs no novo site, nunca em domínio de terceiros |
| Sem favicon/site icon | ausência de `<link rel=icon>` | Criar favicon + ícones no scaffold |
| Título do site diz "há 46 anos" desde 2023 (copyright 2023). Instagram diz "Há 20 anos elevando o diagnóstico odontológico" (dental desde 2005) | title, bio | Anos devem ser **calculados a partir do ano de fundação**, nunca escritos à mão. Duas tenures distintas: Scientific (grupo) e Scientific Dental (2005) |
| Telefones: (31) 2112-1900 e 2112-1913 (comercial), **2112-1903 e suporte@ (suporte)**, WhatsApp wa.me/553121121938. Legacy SD usa (31) 99264-0883 e 97122-9418 | páginas Contato e sd-hit.com | Header usa 2112-1900 + WhatsApp 2112-1938 `<!-- VERIFICAR qual WhatsApp é o comercial -->` |
| Horário: seg–qui 08:00–18:00, sex 08:00–17:30 | rodapé | Footer e Contato |
| Estrutura regional: Sul; MG/RJ/NE; SP/CO/ES/NO, com gerentes nomeados; "8 técnicos nacionais, 3 radiologistas" | sd-hit.com | Base do mapa de cobertura em Suporte `<!-- VERIFICAR -->` |
| Catálogo antigo: 23 produtos (2 equipamentos: Veraview X800, Veraviewepocs 3D; 2 endo: Tri Auto ZX2, Root ZX mini; 2 impressoras DryView 5700/5950; 17 insumos/acessórios). Legacy SD cita ainda **3D Accuitomo 170** | wp-sitemap | Lista para confirmar quais seguem ativos |
| Página "Impressora 5700" tem a descrição do Tri Auto ZX2 (erro de conteúdo) | texto da página | Não migrar copy do site atual às cegas |
| Os 3 casos clínicos estão em inglês (material Morita) | home | Traduzir ou marcar idioma |

---

## 1. Paleta — 6 valores nomeados

A lógica é a de uma radiografia: **radiopaco é claro, radiolúcido é escuro**. O texto vive no claro; a imagem radiográfica vive no escuro, como um filme no negatoscópio. O vermelho é o marcador de medição do software de visualização: aparece onde há uma medida ou a única ação primária da tela, e em nenhum outro lugar.

| Token | Nome | Hex | Uso | Contraste verificado |
|---|---|---|---|---|
| `--radiopaco` | Radiopaco | `#FFFFFF` | Fundo da página, superfícies de texto | base |
| `--osso` | Osso | `#EDF0F2` | Seções alternadas, zebra de tabela, fundo de campo | base |
| `--escala` | Escala | `#C9CFD5` | Filetes, réguas, marcas de tick; texto secundário **sobre painel escuro** (12,1:1) | decorativo no claro |
| `--tecido` | Tecido | `#5B6470` | Texto secundário, bordas de campos de formulário | 6,00:1 no branco; 5,24:1 no Osso; 3,0+ como borda |
| `--radiolucido` | Radiolúcido | `#121417` | Texto principal; fundo dos painéis de imagem ("viewer") | 18,45:1 no branco |
| `--marcador` | Marcador | `#D6302B` | **Só**: botão primário (texto branco), linha de medição, estado de erro | 4,86:1 branco sobre ele e ele sobre branco |

Regras do Marcador, porque o contraste manda:
- Nunca como texto sobre Osso (4,25:1, falha AA). Sobre Osso ele só existe como preenchimento de botão com texto branco.
- Sobre painel escuro (3,79:1) só como **linha** de medição (gráfico, mínimo 3:1), nunca como texto.
- Por que `#D6302B` e não o `#F44336` atual: mesma família de matiz que o cliente já viu por anos, escurecido até texto branco passar AA. O atual dá 3,68:1 e falha em qualquer botão.
- Links são Radiolúcido sublinhados, não vermelhos. Assim o vermelho volta a significar algo.

Anel de foco (teclado): 2 px Radiolúcido com 2 px de offset branco no claro; 2 px branco no escuro. Nenhuma cor extra.

## 2. Tipografia — duas famílias, papéis fixos

| Família | Papel | Pesos | Por quê |
|---|---|---|---|
| **IBM Plex Sans** | Títulos, corpo, UI, navegação, formulários | 400, 500, 600 | Desenhada para documentação técnica; algarismos tabulares; legível em 13–17 px em Android médio; latin cobre pt-BR |
| **IBM Plex Mono** | **Somente grandezas reais**: FOV, voxel, kV, mm, prazos de SLA, datas, protocolo, CEP | 400, 500 | A "etiqueta de instrumento". Irmã da Sans, então uma só voz |

Regra dura: Mono nunca em rótulo decorativo, nunca em caixa alta espaçada, nunca em título. Se não é um número com unidade ou um identificador, não é Mono.

Escala (px), corpo 17 px, entrelinha 1,6; títulos 1,15:
`13 legenda · 15 pequeno · 17 corpo · 20 lead · 24 h4 · 30 h3 · 38 h2 · 48 h1 · 56 hero desktop`
Medida máxima do corpo: `34rem` (≈ 68 caracteres em Plex 17 px). Tudo alinhado à esquerda.
Carregamento: `next/font/google`, `display: swap`, subset latin, variáveis CSS `--font-sans` / `--font-mono`.

## 3. Conceito de layout — "prancha de leitura"

- Grid: 4 colunas em 375 px (gutter 16), 12 colunas a partir de 1024 (gutter 24–32), contêiner 1200 px.
- **Régua**: todo início de seção tem um filete Escala de 1 px com pequenas marcas de tick alinhadas às colunas do grid (CSS puro). É o único ornamento do site e vem do mundo da calibração.
- **Painel viewer**: bloco Radiolúcido que recebe qualquer radiografia, com barra de escala em mm e legenda Mono. Texto nunca vai por cima da imagem; vai ao lado ou abaixo, em superfície clara.
- Sem sombras. Sem raio maior que 2 px. Separação por filete e por ritmo de espaço, não por cartão.
- Foto de produto sempre em fundo branco (asset de imprensa Morita), nunca em painel escuro; radiografia sempre em painel escuro. Os dois nunca se misturam.

### 3.1 Home — mobile (375 px)

```
┌────────────────────────────────┐
│ [SCIENTIFIC Dental]  (31) 2112 │ 56 px, fixo, condensa ao rolar
│                       -1900  ≡ │
├────────────────────────────────┤
│ Venda e assistência técnica    │ h1 38 px, Plex Sans 600
│ oficial Morita e Carestream    │
│ no Brasil                      │
│                                │
│ A J. Morita encerrou a operação│ lead 20 px, esquerda, ≤68 ch
│ própria no país e indica a     │
│ Scientific Dental para venda e │
│ suporte de raios X e endo.     │
│                                │
│ [ Solicitar orçamento ]        │ Marcador, texto branco (1 por tela)
│ Falar com um especialista  (WA)│ link Radiolúcido + ícone WhatsApp
├────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ painel viewer, Radiolúcido, 4:3
│▓                              ▓│
│▓   [corte CBCT real, X800]    ▓│ radiografia é a protagonista
│▓                              ▓│
│▓          ├── 10 mm ──┤       ▓│ barra de escala desenha 1x (600 ms)
│▓ Ø40 × H40   voxel 80 µm      ▓│ legenda Mono, Escala sobre escuro
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
├────────────────────────────────┤
│ Fonte: J. Morita Corp.         │ faixa Osso, 15 px, com link para
│ "J. Morita Brasil não está mais│ a página oficial. Afirmação com
│ em operação. Entre em contato  │ fonte, não slogan.
│ com…" (ler na página da Morita)│
├─┬──────────────────────────────┤
│ │ Equipamentos e insumos        │ h2 30 px  (filete-régua acima)
│ ├──────────────────────────────┤
│ │ [foto X800 em branco]         │ tile grande: Imagem 3D (CBCT)
│ │ Imagem 3D (CBCT)              │
│ │ Veraview X800 · 3D Accuitomo  │ nomes reais, sem "ver mais"
│ │ 80 µm · 11 FOV                │ Mono, spec real
│ ├──────────────────────────────┤
│ │ Panorâmico     Veraviewepocs  │ tiles menores, filete entre eles
│ │ Intraoral      filmes, posic. │
│ │ Endodontia     Tri Auto ZX2   │
│ │ Insumos e impressão  DryView  │
├─┴──────────────────────────────┤
│ Quem atende seu equipamento    │ h2: seção Suporte com peso
│ Assistência técnica oficial    │ 3 compromissos em frases curtas,
│ Morita no Brasil. Técnicos     │ cada um com o número em Mono
│ próprios em N regiões.         │ <!-- VERIFICAR N, prazos -->
│ ┌────────────────────────────┐ │
│ │ [mapa BR, 3 territórios]   │ │ SVG leve, Escala/Tecido, sem pins
│ └────────────────────────────┘ │
│ Prazo de resposta   __ h       │ Mono para o número
│ Peças em estoque    BH         │
│ Suporte remoto      seg–sex    │
│ [ Abrir chamado técnico ]      │ primário desta tela
├────────────────────────────────┤
│ 46 anos de Scientific.         │ faixa de confiança: 4 frases, sem
│ 21 anos em odontologia.        │ contador animado; anos calculados
│ Maior distribuidor Morita e    │ <!-- VERIFICAR: Morita LatAm -->
│ Carestream da América Latina.  │
│ Assistência oficial. Cobertura │
│ nacional.                      │
├────────────────────────────────┤
│ Legacy SD                      │ painel Osso, foto real de turma
│ Mentoria e grupo de estudo para│ <!-- VERIFICAR foto -->
│ donos de centros de radiologia.│
│ Entrar no canal do WhatsApp    │ link secundário
├────────────────────────────────┤
│ Conteúdo recente               │ lista com filetes, não cartões
│ Caso clínico  Retenção do 17   │ tipo + título + data em Mono
│ Artigo  Tomógrafos de alta res.│ máximo 3
│ Caso clínico  Dens in dente    │
├────────────────────────────────┤
│ footer: endereço, horário,     │ marcas Morita/Carestream em cinza
│ suporte (2112-1903), LGPD      │
└────────────────────────────────┘
        [WA] botão flutuante, canto inferior direito, 48 px
```

### 3.2 Home — desktop (1280 px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [SCIENTIFIC Dental]  A Scientific  Produtos ▾  Suporte  Legacy SD  Conteúdo  Contato │
│                              ☏ (31) 2112-1900  WhatsApp   [Solicitar orçamento]      │ 72→56 px ao rolar
├──────────────────────────────────┬───────────────────────────────────────┤
│ Venda e assistência técnica      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ oficial Morita e Carestream      │▓                                     ▓│
│ no Brasil                        │▓   [corte CBCT real, X800]           ▓│
│                                  │▓                                     ▓│
│ A J. Morita encerrou a operação  │▓                ├──── 10 mm ────┤    ▓│
│ própria no país e indica a       │▓  Ø40 × H40   voxel 80 µm  2,5 pl/mm ▓│
│ Scientific Dental… (7 colunas)   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ [ Solicitar orçamento ]          │ (5 colunas)                           │
│ Falar com um especialista (WA)   │                                       │
├──────────────────────────────────┴───────────────────────────────────────┤
│ Fonte: J. Morita Corp. "J. Morita Brasil não está mais em operação…"  (ler na Morita) │
├─┬────────────────────────────────────────────────────────────────────────┤
│ │ Equipamentos e insumos                                                 │
│ ├─────────────────────────────┬──────────────────────┬───────────────────┤
│ │ [foto X800, 2 col × 2 lin]  │ Panorâmico           │ Intraoral         │
│ │ Imagem 3D (CBCT)            │ Veraviewepocs 3D     │ Filmes, posicion. │
│ │ Veraview X800               │ Reuleaux · 125 µm    │ <!-- VERIFICAR -->│
│ │ 3D Accuitomo 170            ├──────────────────────┼───────────────────┤
│ │ 80 µm · 11 FOV · pan+ceph   │ Endodontia           │ Insumos e impress.│
│ │                             │ Tri Auto ZX2, Root ZX│ DryView 5700/5950 │
├─┴─────────────────────────────┴──────────────────────┴───────────────────┤
│ Quem atende seu equipamento               │ [mapa do Brasil, 3 territórios]│
│ 3 compromissos + tabela Mono              │ gerente por região <!-- VERIF -->│
│ [ Abrir chamado técnico ]                 │                                 │
├───────────────────────────────────────────┴─────────────────────────────┤
│ 46 anos de Scientific │ 21 anos em odonto │ Maior distrib. LatAm │ Assist. oficial │  4 frases, filetes verticais
├─────────────────────────────────────────────────────────────────────────┤
│ Legacy SD (painel Osso, 2 colunas: texto | foto)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Conteúdo recente: 3 linhas                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ footer 4 colunas                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Mega-menu Produtos: 5 colunas (uma por categoria), cada uma com 2–4 modelos nomeados em texto puro. "Veraview X800" fica a um clique de qualquer página.

### 3.3 Página de produto — Veraview X800 (desktop; mobile empilha na mesma ordem)

```
Produtos / Imagem 3D (CBCT) / Veraview X800                         (breadcrumb, 15 px)
┌────────────────────────────────────────┬──────────────────────────────────┐
│ Morita                                 │                                  │
│ Veraview X800                          │   [foto de imprensa, fundo       │
│ Tomógrafo 3-em-1 (pan, ceph, CBCT)     │    branco, 4:5, next/image]      │
│ com voxel mínimo de 80 µm e feixe      │                                  │
│ horizontal para menos artefatos.       │   ▫ unidade  ▫ CBCT  ▫ pan       │ miniaturas
│                                        │                                  │
│ [ Solicitar orçamento ]                │                                  │
│ Baixar catálogo (PDF, 6 MB)            │                                  │
│ Assistência técnica oficial no Brasil  │                                  │
│ Preço sob consulta                     │                                  │
├────────────────────────────────────────┴──────────────────────────────────┤
│ Especificações  Campos de visão  Software  Imagens  Instalação  Assistência │ sub-nav fixa
├─┬─────────────────────────────────────────────────────────────────────────┤
│ │ Especificações                        (tabela 2 colunas, valores Mono)  │
│ │ Voxel mínimo            80 µm         │ Modos     Pan, CBCT, Ceph (opc.)│
│ │ Resolução (Ø40×H40)     2,5 pl/mm     │ Varredura 180° / 360°           │
│ │ Tensão (ceph)           100 kV        │ Tempo ceph 3,5 s                │
│ │ Configurações  F40 P/CP · R100 P/CP · F150 P/CP                        │
├─┼─────────────────────────────────────────────────────────────────────────┤
│ │ Campos de visão                              (o componente-assinatura)  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ │▓  ▯ ▯  ▭ ▭ ▭   ⌂ ⌂ ⌂   ▮ ▮ ▮                 ├──── 50 mm ────┤          ▓│ 11 FOV em SVG,
│ │▓ Ø40  Ø80      R100     Ø150                                          ▓│ na escala real,
│ │▓ ×40  ×40/50/80 ×40/50/80 ×50/75/140      toque/hover: indicação clínica▓│ rótulo Mono
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
├─┼─────────────────────────────────────────────────────────────────────────┤
│ │ Software e fluxo: i-Dixel, DICOM, reconstrução zoom 125→80 µm           │
│ │ Imagens clínicas: 3 painéis viewer com legenda e FOV usado               │
│ │ O que está incluído e instalação: footprint, sala <!-- VERIFICAR -->     │
│ │ Treinamento: <!-- VERIFICAR -->                                          │
│ │ Assistência e garantia: SLA, peças, remoto, contrato <!-- VERIFICAR -->  │ antes do formulário
├─┼─────────────────────────────────────────────────────────────────────────┤
│ │ Solicitar orçamento do Veraview X800   (form pré-preenchido, 3 campos + │
│ │ consentimento LGPD) | ou WhatsApp com mensagem pronta citando o X800    │
├─┼─────────────────────────────────────────────────────────────────────────┤
│ │ Relacionados: Veraviewepocs 3D, 3D Accuitomo 170, DryView 5950          │
└─┴─────────────────────────────────────────────────────────────────────────┘
Mobile: barra inferior fixa [Solicitar orçamento] + ícone WhatsApp substitui o botão flutuante.
```

## 4. Princípios específicos deste brief

1. **Radiopaco / radiolúcido.** Radiografia vive em painel escuro com barra de escala; texto vive em superfície clara. Nunca texto sobre foto. Resolve contraste e acaba com a "textura de fundo".
2. **Vermelho é marcador.** Aparece só onde há uma medida ou a única ação primária da tela. Links são escuros e sublinhados. Se há dois vermelhos numa tela, um está errado.
3. **Número é dado, não decoração.** Mono só para grandezas reais. Sem contadores animados, sem `01/02/03`, sem eyebrow em caixa alta. A tabela de especificações é conteúdo principal, desenhada como etiqueta de instrumento.
4. **Assistência antes do orçamento.** Em toda página de produto, "quem atende, em quanto tempo, onde" vem antes do formulário. Na home, Suporte tem uma tela inteira.
5. **Afirmação com fonte.** Toda alegação de posição (Morita, Carestream, anos) aparece com fonte ou é calculada. O que não tiver fonte fica `<!-- VERIFICAR -->` até o cliente confirmar.

## 5. Movimento — um momento

- A barra de escala do painel viewer do hero desenha uma vez ao carregar (600 ms, `ease-out`), junto com a legenda Mono. Só isso.
- Header condensa de 72 para 56 px ao rolar (transição de 150 ms).
- `prefers-reduced-motion: reduce` desliga o desenho e a transição; o estado final é renderizado direto.
- Nenhum fade-up por seção, nenhum hover-lift. Hover em link é sublinhado mais grosso; em botão é escurecer 6 %.

## 6. Autorrevisão: o que era genérico e o que mudou

| Primeira versão (serviria para qualquer site B2B de equipamento) | O que mudou e por quê |
|---|---|
| Hero dividido: título à esquerda, foto do produto à direita, dois botões | A imagem da direita virou um **painel viewer funcional**: radiografia real, barra de escala em mm, spec real em Mono. O título afirma o fato Morita, e a faixa logo abaixo **cita a fonte oficial**. Sites B2B alegam; este cita |
| Grid de 5 cartões iguais com ícone | **Prancha de catálogo**: um tile dominante para CBCT (é onde está a receita), quatro menores, filetes em vez de cartões, uma linha de spec real por categoria. Sem sombra, sem ícone genérico |
| Faixa de "números" (46+ anos, 1000+ clientes) com contador | Quatro **frases** com fonte; anos calculados de `foundedYear`; zero contador; nada que não se possa provar |
| Inter para tudo, um display serifado para títulos | **Plex Sans + Plex Mono**: algarismos tabulares e uma regra de uso que dá função à segunda fonte (só medidas). A diferença está na regra, não na fonte |
| Off-white quente + vermelho terracota | Era exatamente a tríade proibida. Radiografia não tem tom quente: **escala de cinza fria** real, branco puro, vermelho só como marcador |
| Suporte como 3 colunas de ícone + frase | **Mapa de cobertura** por território (dados reais do sd-hit) + tabela Mono de prazos + linha direta de suporte (2112-1903) + botão "Abrir chamado". Parece um compromisso porque tem números e nomes |
| Campos de visão como lista de texto | **SVG dos 11 FOV em escala real**, com o R100 Reuleaux desenhado de fato. É o argumento técnico do X800 tornado visível |

## 7. Arquitetura de conteúdo e redirecionamentos (resumo)

Categorias propostas (ajuste ao brief): `imagem-3d` · `panoramico` · `intraoral` · `endodontia` · `insumos-e-impressao` (as impressoras DryView entram aqui com o filme dry). `<!-- VERIFICAR -->`

Mapa de 301 (fonte única em `content/redirects.json`, gerado para `next.config` e para `web.config` caso o IIS continue na frente):

| De (`/sd/...`) | Para |
|---|---|
| `/sd/` | `/` |
| `/sd/a-scientific/`, `/sd/missao/`, `/sd/visao/`, `/sd/valores/` | `/a-scientific` (+ âncoras) |
| `/sd/parceria-j-morita-corporation/`, `/sd/parceria-carestream/` | `/a-scientific#morita`, `/a-scientific#carestream` |
| `/sd/morita-br/` | `/legacy-sd` (é o manifesto do Legacy) |
| `/sd/contato/` | `/contato` |
| `/sd/loja/`, `/sd/carrinho/`, `/sd/finalizar-compra/`, `/sd/minha-conta/` | `/produtos` |
| `/sd/produto/<slug>/` (23) | `/produtos/<slug>` |
| `/sd/categoria-produto/<cat>/` (12) | `/produtos/<categoria-nova>` |
| `/sd/case-*/`, 4 posts, `/sd/ultimas-novidades/`, `/sd/category/novidades/` | `/conteudo/<slug>`, `/conteudo` |
| `/sd/wp-content/uploads/**/*.pdf` conhecidos | `/downloads/<arquivo>.pdf` |
| `/sd/feed/`, `/sd/author/*`, `/sd/sample-page/` | `/` |
| `/sd/wp-json/*`, `/sd/xmlrpc.php` | `410 Gone` |

## 8. Perguntas em aberto (respostas mudam o que será construído)

1. **Catálogo ativo.** Dos 23 produtos antigos + 3D Accuitomo 170, quais seguem à venda? Há sensores intraorais (Carestream RVG ou outro) ou "Intraoral" é só filme e posicionador?
2. **Carestream: qual Carestream?** O site cita *Carestream Health* (filme, DryView). Vendem também equipamentos *Carestream Dental* (CS 8100, RVG)? Muda a categoria e a alegação.
3. **Fotografia.** Existe banco próprio? Caso contrário, precisamos dos assets de imprensa Morita/Carestream e de **radiografias reais feitas com X800** para o hero (com autorização).
4. **CRM.** Os formulários do Legacy SD apontam para `materiais.radiologia.digital` (padrão RD Station) e o sd-hit.com roda em Leadpages. É RD Station? Qual conta recebe o lead?
5. **Legacy SD** fica em `sd-hit.com` (Leadpages) ou migra para `/legacy-sd`?
6. **Preço**: "sob consulta" em tudo, ou algum insumo com preço?
7. **ANVISA**: números de registro por produto para exibir?
8. **Marca**: existe manual de identidade com o vermelho oficial e logo em cor? Sem isso, seguimos com Marcador `#D6302B` e o logo em Radiolúcido.
9. **Hospedagem**: o site novo vai para Vercel/Node (recomendado: server actions, imagem otimizada, CDN em SP) ou precisa ficar no IIS atual (exige export estático e formulário via endpoint externo)?
10. **Certificado**: renovar o TLS hoje, antes de qualquer coisa. Quem administra o DNS/hospedagem?
11. **WhatsApp comercial**: 2112-1938 (site) ou 99264-0883 / 97122-9418 (Legacy)?
12. **Filiais**: quais cidades têm base física? O site só mostra BH; o brief fala em "filiais"; o sd-hit mostra 3 territórios com gerentes.
13. **Anos**: ano de fundação da Scientific (grupo) para calcular "N anos" corretamente. Hoje o site diz 46 desde 2023.
14. **E-mail canônico**: `contato@scientificdental.com.br` (site) ou `.com` (página da Morita)?
15. **Casos clínicos em inglês**: traduzir, manter, ou substituir por casos brasileiros?


---

## 9. Revisão visual de 18/09/2026 — marca real, mais vida, mesma lógica

Feedback do cliente sobre a fase 1: textos saindo do lugar no header, site "sem vida, seco e nada
moderno", e pedido para usar as logos reais (pasta `SD/`, PDF e PNG). Esta seção **substitui** os
pontos 1 (paleta), 3 (layout) e 5 (movimento) acima onde houver conflito. O que não mudou:
radiopaco/radiolúcido, Mono só para grandezas, vermelho só como ação primária e linha de medição,
afirmação com fonte, `VERIFICAR` em tudo que foi inventado.

### 9.1 A marca entra na paleta

A logo oficial é um wordmark "SCIENTIFIC / Dental" em **azul-marinho `#262443`** (amostrado do PNG
"Azul": rgb 38, 36, 67). O `Preto.pdf` é vetorial (14 glifos como paths), então o SVG do site foi
extraído dele com PyMuPDF por `scripts/build-brand-assets.py`, e não redesenhado. O mesmo script
recorta os PNGs oficiais, gera o favicon (o "S" da logo em branco sobre quadrado Marca), o
`apple-icon.png` e a imagem Open Graph padrão (logo branca sobre Marca com a linha de medição).

| Token | Hex | Papel | Contraste verificado |
|---|---|---|---|
| `marca` | `#262443` | Títulos (h1–h4), superfícies escuras institucionais (rodapé, faixa de suporte, painel Legacy), botão secundário/contraste, ícones | 14,8:1 sobre branco |
| `marca-claro` | `#3A386A` | Hover de superfícies em Marca | 10,7:1 |
| `marca-tint` | `#EEEDF7` | Fundo de chips, caixas de ícone, seleção de texto | texto Marca sobre ele 12,8:1 |
| `marca-profundo` | `#17162B` | Fim dos gradientes das superfícies escuras | — |
| `osso` | `#F3F4F9` (era `#EDF0F2`) | Seções alternadas; ganhou um leve tom de Marca para não parecer cinza de impressora | — |
| `escala` | `#D5D8E3` | Bordas e réguas; texto secundário sobre Marca (9,5:1) | — |
| `tecido` | `#5C6070` | Texto secundário | 6,25:1 branco, 5,6:1 Osso |
| `marcador` / `marcador-hover` / `marcador-tint` | `#D6302B` / `#B9271F` / `#FDECEB` | Ação primária, linha de medição, erro (tint para o fundo da mensagem de erro) | 4,86:1 |
| `whatsapp` | `#25D366` | **Uma ocorrência**: o botão flutuante (ícone escuro `#0B3D2E`, 7,8:1) e o botão da página Legacy, onde a ação é literalmente abrir o WhatsApp | — |
| `sucesso` | `#1E8E5A` | Ícone do WhatsApp em linha, ponto "online" do hero, check de confirmação | 4,5:1 |

Regra que continua: **se há dois vermelhos numa tela, um está errado.** O que muda: o Radiolúcido
`#121417` fica só para o corpo de texto e para o painel viewer (a radiografia lê melhor em preto
neutro do que em azul). Títulos são Marca. Dois escuros com papéis distintos: viewer = filme no
negatoscópio; Marca = instituição.

### 9.2 Forma: cartões, cantos e sombras (revoga o "sem cartão, sem sombra")

- Raios: `xs 4 · sm 6 · md 10 · lg 14 · xl 20 · 2xl 28`. Botões `md`, cartões `lg`, painéis
  viewer/hero `xl`, blocos de destaque (Legacy, CTA final) `2xl`.
- Sombras tingidas de Marca, nunca cinza puro: `soft` (repouso), `lift` (hover, +3 px de elevação),
  `panel` (viewer do hero), `focus` (anel de 4 px em campos).
- Utilitários em `globals.css`: `card` (borda Escala + `soft`), `card-hover` (sobe 3 px, `lift`),
  `surface-marca` (Marca com gradiente radial sutil), `surface-hero` (branco com dois gradientes
  radiais leves, um Marca e um Marcador), `grid-dots` (grade de pontos que desvanece por máscara),
  `nav-link` (sublinhado Marcador que cresce da esquerda), `no-scrollbar`.
- A régua com ticks (`rule-ticks`) continua disponível, mas deixou de ser padrão nas seções: o ritmo
  agora vem do eyebrow (traço Marcador + rótulo) e da alternância branco/Osso/Marca.

### 9.3 Movimento (revoga a seção 5)

- **Hero**: cinco blocos entram com `rise` escalonado (60 ms entre eles); a barra de escala continua
  desenhando uma vez; o ponto verde do selo "indicada pela J. Morita" pulsa devagar.
- **Revelação ao rolar sem JavaScript**: classe `reveal` usa `animation-timeline: view()` dentro de
  `@supports`. Em navegador sem suporte o conteúdo aparece direto. `reveal-delay-1/2` escalonam
  cartões vizinhos. Cuidado ao tirar screenshot de página inteira: fora da viewport os elementos
  ficam em opacidade 0, então emule `prefers-reduced-motion: reduce`, que desliga tudo isso.
- **Hover**: cartões sobem 3 px; seta dos botões desliza 2 px; imagem de produto amplia 4 %; botão
  primário escurece e sobe 2 px; header ganha vidro (`backdrop-blur`) e sombra fina ao rolar.
- `prefers-reduced-motion` zera durações e desliga a revelação.

### 9.4 Header: por que os textos saíam do lugar e o que garante que não volte

Causa: seis itens de menu + telefone + WhatsApp + CTA não cabem em 1200 px e nada tinha
`whitespace-nowrap`, então "A Scientific", "Legacy SD" e o telefone quebravam em duas ou três
linhas. Correções: contêiner de 1280 px; `whitespace-nowrap` em todo item; o que não cabe some por
breakpoint em ordem fixa (telefone e rótulo "WhatsApp" só ≥ `xl`; CTA vira "Orçamento" entre `sm`
e `xl`; abaixo de `sm` o CTA fica no menu). Detalhe de Tailwind v4: `hidden` no `className` do
`Button` perde para o `inline-flex` da base do componente (mesma especificidade, ordem de geração);
por isso o CTA fica dentro de um `<div className="hidden sm:block">`.

Verificação: 13 rotas × 2 larguras (1440 e 390) sem overflow horizontal, mais 1024 e o hover do
mega-menu, o menu mobile e as 4 etapas do orçamento, tudo por Playwright (Chromium já instalado em
`%LOCALAPPDATA%/ms-playwright`; scripts no scratchpad da sessão).

### 9.5 Componentes novos e alterados

| Componente | O que faz |
|---|---|
| `ui/PageHero` | Cabeçalho padrão das páginas internas: mesmo fundo do hero da home, breadcrumb, eyebrow, h1, lead, ações e coluna lateral opcional |
| `ui/Breadcrumb` | Trilha "Você está em" |
| `ui/Section` | Ganhou `eyebrow`, `tone="marca"`, `center`, `compact`; `rule` agora é opt-in |
| `ui/Section#Eyebrow` | Traço Marcador + rótulo em sentence case (nunca caixa alta espaçada) |
| `ui/Button` | Tamanho `sm`, variantes `inverse-solid` e `whatsapp`, `ButtonArrow` |
| `ui/Viewer` | `elevated`, `captionAlign="end"` (deixa o canto livre para a ficha flutuante do hero), aspecto `5/4` |
| `content/ArticleCard` | Cartão de artigo/caso usado na home e em /conteudo |
| `home/CtaBand` | Fecho da home antes do rodapé |
| `site/Logo` | `<img>` do SVG oficial (`/brand/logo-marca.svg` ou `logo-branco.svg`), proporção 3,99:1 |
| `forms/*` | Campos com foco em anel Marca, cartão em volta do formulário, opções do orçamento como cartões selecionáveis |

### 9.6 O que ainda é proposta (não confirmado com o cliente)

- Wordmarks tipográficos "J. Morita" e "Carestream" na faixa de marcas: não temos os logos das
  fabricantes em vetor com autorização.
- Ficha flutuante "80 µm" e chip "11 campos de visão" no hero: dados reais do X800, mas a
  composição é decisão nossa.
- Números da faixa de confiança e do suporte seguem com os `VERIFICAR` da fase 1.
- Lighthouse não foi remedido após a revisão; a tabela do README é de 17/09. Remedir antes do
  deploy (a fonte 700 e as sombras são os únicos custos novos esperados).
