import type { Fov } from "@/lib/content";

/**
 * Os campos de visão desenhados em escala real, em vista lateral: a largura
 * é o diâmetro, a altura é a altura do volume. FOVs de mesmo diâmetro ficam
 * aninhados com a base alinhada. Barra de escala de 50 mm em Marcador
 * (linha de medição, o único uso do vermelho num painel escuro).
 *
 * Sem JavaScript: hover só por CSS, e a tabela abaixo carrega toda a informação.
 */
const S = 1.3; // px por mm
const PAD_X = 28;
const TOP = 46;
const BASE = TOP + 140 * S; // linha de base para o maior H (140 mm)
const GAP = 44;
const LABEL_H = 34;

export function FovDiagram({
  fovs,
  productName,
}: {
  fovs: Fov[];
  productName: string;
}) {
  const groups = groupByDiameter(fovs);
  // Posiciona cada grupo da esquerda para a direita (laço simples: sem mutação em callback)
  const placed: Array<(typeof groups)[number] & { x: number; w: number }> = [];
  let cursor = PAD_X;
  for (const g of groups) {
    const w = g.diameter * S;
    placed.push({ ...g, x: cursor, w });
    cursor += w + GAP;
  }
  const width = cursor - GAP + PAD_X;
  const height = BASE + LABEL_H;
  const scaleLen = 50 * S;

  return (
    <figure>
      <div className="viewer overflow-x-auto rounded-xl shadow-panel">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="mx-auto block min-w-[560px] max-w-full"
          role="img"
          aria-labelledby="fov-title fov-desc"
        >
          {/* <title>/<desc> recebem UMA string: vários nós de texto aqui quebram a hidratação */}
          <title id="fov-title">{`Campos de visão do ${productName} em escala`}</title>
          <desc id="fov-desc">
            {`${fovs.length} campos de visão, de Ø${Math.min(...fovs.map((f) => f.diameter))} a Ø${Math.max(
              ...fovs.map((f) => f.diameter),
            )} mm de diâmetro e de ${Math.min(...fovs.map((f) => f.height))} a ${Math.max(
              ...fovs.map((f) => f.height),
            )} mm de altura.`}
          </desc>
          {/* linha de base */}
          <line
            x1={PAD_X - 12}
            x2={width - PAD_X + 12}
            y1={BASE + 0.5}
            y2={BASE + 0.5}
            stroke="var(--color-tecido)"
            strokeWidth={1}
          />

          {placed.map((g) => (
            <g key={g.diameter + g.shape}>
              {/* rótulo do diâmetro */}
              <text
                x={g.x + g.w / 2}
                y={TOP - 22}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={12}
                fill="var(--color-radiopaco)"
              >
                {g.shape === "reuleaux" ? `R ${g.diameter}` : `Ø ${g.diameter}`}
              </text>
              {g.shape === "reuleaux" && (
                <>
                  <ReuleauxIcon cx={g.x + g.w / 2} cy={TOP - 6} r={7} />
                  <text
                    x={g.x + g.w / 2 + 12}
                    y={TOP - 2}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-escala)"
                  >
                    arcada
                  </text>
                </>
              )}
              {[...g.heights]
                .sort((a, b) => b.height - a.height)
                .map((h, i, arr) => {
                  const hh = h.height * S;
                  const y = BASE - hh;
                  const isInner = i > 0;
                  return (
                    <g key={h.height} className="fov-item">
                      <title>
                        {`${g.shape === "reuleaux" ? "R" : "Ø"}${g.diameter} × H${h.height} mm, voxel ${h.voxel} µm. ${h.indication}`}
                      </title>
                      <rect
                        x={g.x + 0.5}
                        y={y + 0.5}
                        width={g.w - 1}
                        height={hh - 1}
                        fill={
                          isInner ? "transparent" : "rgba(255,255,255,0.05)"
                        }
                        stroke="var(--color-escala)"
                        strokeWidth={1}
                        strokeDasharray={
                          g.shape === "reuleaux" ? "4 3" : undefined
                        }
                        rx={1}
                      />
                      {/* rótulo da altura na borda superior direita */}
                      <text
                        x={g.x + g.w + 5}
                        y={y + 4}
                        fontFamily="var(--font-mono)"
                        fontSize={10}
                        fill="var(--color-escala)"
                      >
                        {`H ${h.height}`}
                      </text>
                      {arr.length - 1 === i && (
                        <text
                          x={g.x + g.w / 2}
                          y={BASE + 18}
                          textAnchor="middle"
                          fontFamily="var(--font-mono)"
                          fontSize={10}
                          fill="var(--color-escala)"
                        >
                          {`${g.heights.map((v) => v.height).join(" / ")} mm`}
                        </text>
                      )}
                    </g>
                  );
                })}
            </g>
          ))}

          {/* barra de escala 50 mm */}
          <g transform={`translate(${width - PAD_X - scaleLen}, ${TOP - 6})`}>
            <path
              d={`M0 -6 V6 M0 0 H${scaleLen} M${scaleLen} -6 V6`}
              stroke="var(--color-marcador)"
              strokeWidth={1.5}
              fill="none"
            />
            <text
              x={scaleLen / 2}
              y={-11}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fill="var(--color-escala)"
            >
              50 mm
            </text>
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 text-xs text-tecido">
        Vista lateral em escala: largura é o diâmetro, altura é a altura do
        volume. O R100 (tracejado) tem secção em formato de arcada, equivalente
        a Ø100.
      </figcaption>

      {/* Contêiner rolável: 5 colunas em Mono não cabem em 390 px sem quebrar a página */}
      <div className="no-scrollbar mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">
            Campos de visão, voxel, modos de varredura, modelos e indicação
          </caption>
          <thead>
            <tr className="border-y border-escala text-left text-xs text-tecido">
              <th scope="col" className="py-2 pr-4 font-medium">
                FOV (mm)
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Voxel
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Varredura
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Modelos
              </th>
              <th scope="col" className="py-2 font-medium">
                Indicação típica
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-escala">
            {fovs.map((f) => (
              <tr key={`${f.shape}${f.diameter}x${f.height}`}>
                <td className="py-2.5 pr-4 font-mono whitespace-nowrap">
                  {f.shape === "reuleaux" ? "R" : "Ø"} {f.diameter} × H{" "}
                  {f.height}
                </td>
                <td className="py-2.5 pr-4 font-mono whitespace-nowrap">
                  {f.voxel} µm
                </td>
                <td className="py-2.5 pr-4 font-mono whitespace-nowrap">
                  {f.modes.map((m) => `${m}°`).join(" / ")}
                </td>
                <td className="py-2.5 pr-4 font-mono whitespace-nowrap">
                  {f.models.join(", ")}
                </td>
                <td className="py-2.5 text-tecido">{f.indication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-tecido">
        Indicações são sugestões de uso; a escolha do FOV é do radiologista.
        {/* VERIFICAR: indicações por FOV validadas pelos radiologistas da equipe */}
      </p>
    </figure>
  );
}

function ReuleauxIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // Triângulo de Reuleaux: três arcos com raio igual ao lado do triângulo equilátero
  const a = r * 1.5;
  const p = [0, 1, 2].map((i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    return [
      cx + (a / Math.sqrt(3)) * Math.cos(ang),
      cy + (a / Math.sqrt(3)) * Math.sin(ang),
    ];
  });
  const d = `M${p[0][0]} ${p[0][1]} A${a} ${a} 0 0 1 ${p[1][0]} ${p[1][1]} A${a} ${a} 0 0 1 ${p[2][0]} ${p[2][1]} A${a} ${a} 0 0 1 ${p[0][0]} ${p[0][1]} Z`;
  return (
    <path d={d} fill="none" stroke="var(--color-escala)" strokeWidth={1} />
  );
}

function groupByDiameter(fovs: Fov[]) {
  const map = new Map<
    string,
    { diameter: number; shape: Fov["shape"]; heights: Fov[] }
  >();
  for (const f of fovs) {
    const key = `${f.shape}-${f.diameter}`;
    if (!map.has(key))
      map.set(key, { diameter: f.diameter, shape: f.shape, heights: [] });
    map.get(key)!.heights.push(f);
  }
  return Array.from(map.values()).sort((a, b) => a.diameter - b.diameter);
}
