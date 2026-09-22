import content from "@/content/forms.json";

export type Option = { value: string; label: string; hint?: string };
export const EQUIPMENT_OPTIONS: Option[] = content.equipment;
export const OPERATION_OPTIONS: Option[] = content.operation;
export const TIMELINE_OPTIONS: Option[] = content.timeline;
export const STEPS = content.steps;

export type QuotePrefill = {
  /** slug do produto -> valor da opção da etapa 1 */
  products: Record<string, string>;
  /** slug da categoria -> valor da opção da etapa 1 */
  categories: Record<string, string>;
};
