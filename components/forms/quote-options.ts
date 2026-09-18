/**
 * Opções do assistente de orçamento. Módulo sem "use client" de propósito:
 * é importado tanto pelo componente de cliente (QuoteWizard) quanto pela
 * página de servidor (que pré-calcula o mapa slug -> opção). Constantes
 * exportadas de um módulo "use client" chegam ao servidor como referência
 * vazia, não como valor.
 */
export type Option = { value: string; label: string; hint?: string };

export const EQUIPMENT_OPTIONS: Option[] = [
  { value: "Tomógrafo CBCT Veraview X800", label: "Tomógrafo CBCT", hint: "Veraview X800: panorâmica, ceph e CBCT com voxel de 80 µm" },
  { value: "Panorâmico com CBCT Veraviewepocs 3D", label: "Panorâmico com CBCT", hint: "Veraviewepocs 3D R100" },
  { value: "Endodontia (Tri Auto ZX2, Root ZX mini)", label: "Endodontia", hint: "Tri Auto ZX2, Root ZX mini" },
  { value: "Impressoras DryView e filmes", label: "Impressão e filmes", hint: "DryView 5700 e 5950, filme dry, filmes intraorais" },
  { value: "Proteção radiológica e acessórios", label: "Proteção e acessórios", hint: "Aventais, lençol de chumbo, barita, afastadores" },
  { value: "Ainda não sei, quero orientação", label: "Ainda não sei", hint: "Um especialista ajuda a dimensionar" },
];

export const OPERATION_OPTIONS: Option[] = [
  { value: "Centro de radiologia odontológica", label: "Centro de radiologia odontológica" },
  { value: "Clínica odontológica", label: "Clínica odontológica" },
  { value: "Hospital ou serviço de imagem", label: "Hospital ou serviço de imagem" },
  { value: "Consultório", label: "Consultório" },
  { value: "Outro", label: "Outro" },
];

export const TIMELINE_OPTIONS: Option[] = [
  { value: "Nos próximos 30 dias", label: "Nos próximos 30 dias" },
  { value: "Em até 3 meses", label: "Em até 3 meses" },
  { value: "Em até 6 meses", label: "Em até 6 meses" },
  { value: "Sem prazo definido", label: "Sem prazo definido, estou pesquisando" },
];

export const STEPS = ["Equipamento", "Operação", "Prazo", "Contato"] as const;

export type QuotePrefill = {
  /** slug do produto -> valor da opção da etapa 1 */
  products: Record<string, string>;
  /** slug da categoria -> valor da opção da etapa 1 */
  categories: Record<string, string>;
};
