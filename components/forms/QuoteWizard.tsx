"use client";

import { quoteStepSchema } from "@/lib/lead-schema";
import copy from "@/content/forms.json";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { ConsentField, Honeypot, TextField } from "./Field";
import {
  EQUIPMENT_OPTIONS,
  OPERATION_OPTIONS,
  STEPS,
  TIMELINE_OPTIONS,
  type Option,
  type QuotePrefill,
} from "./quote-options";

type Props = {
  prefill: QuotePrefill;
  whatsappBase: string;
};

const initial: LeadState = { status: "idle" };
const FIELD_STEP: Record<string, number> = {
  equipment: 0,
  operation: 1,
  timeline: 2,
  city: 2,
  name: 3,
  phone: 3,
  email: 3,
  company: 3,
  consent: 3,
};

/**
 * Orçamento em 4 etapas curtas, no máximo 3 campos por etapa.
 * Um único <form>: as etapas fora de foco ficam com `hidden`, então os
 * valores continuam no DOM e vão juntos na submissão final.
 * ?produto=slug ou ?categoria=slug pré-preenche a etapa 1.
 */
export function QuoteWizard({ prefill, whatsappBase }: Props) {
  const searchParams = useSearchParams();
  const produto = searchParams.get("produto");
  const categoria = searchParams.get("categoria");
  const initialEquipment =
    (produto && prefill.products[produto]) || (categoria && prefill.categories[categoria]) || "";
  const sourcePath = `/orcamento${produto ? `?produto=${produto}` : categoria ? `?categoria=${categoria}` : ""}`;

  const [step, setStep] = useState(0);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [operation, setOperation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const fieldValue = (name: string) => ({
    value: values[name] ?? "",
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((previous) => ({ ...previous, [name]: event.target.value })),
  });
  const [state, action, pending] = useActionState(async (previous: LeadState, formData: FormData) => {
    const result = await submitLead(previous, formData);
    if (result.status === "error" && result.fieldErrors) {
      const target = Math.min(...Object.keys(result.fieldErrors).map((field) => FIELD_STEP[field] ?? 3));
      if (Number.isFinite(target)) setStep(target);
    }
    return result;
  }, initial);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [step]);

  useEffect(() => {
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [aria-describedby$="-error"]')?.focus();
  }, [state]);

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  function next() {
    const key = (["equipment", "operation", "timeline"] as const)[step];
    const parsed = quoteStepSchema.shape[key].safeParse({ equipment, operation, timeline }[key]);
    if (!parsed.success) {
      setStepError(parsed.error.issues[0].message);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  const whatsappHref = `${whatsappBase}${encodeURIComponent(
    ` Etapa: ${STEPS[step]}.${equipment ? ` Interesse: ${equipment}.` : ""}`,
  )}`;

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="card p-6 sm:p-8 lg:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sucesso/15 text-sucesso">
          <CheckIcon size={24} />
        </span>
        <p className="mt-5 font-mono text-sm text-tecido">Protocolo {state.id}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl">Pedido de orçamento registrado</h2>
        <p className="mt-4 max-w-xl text-tecido">
          {copy.success.quote} <span className="font-medium text-marca">{equipment}</span>.
        </p>
        <a href={whatsappHref} className="link mt-6 inline-flex items-center gap-2 text-marca" target="_blank" rel="noopener">
          <WhatsAppIcon size={18} className="text-sucesso" />
          Adiantar a conversa pelo WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} onReset={(event) => event.preventDefault()} action={action} onSubmit={(event) => { if (step < 3) { event.preventDefault(); next(); } }} noValidate className="card min-h-[36rem] p-6 sm:p-8 lg:p-10">
      <input type="hidden" name="kind" value="orcamento" />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <Honeypot id="quote-website" />

      {/* Progresso */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-tecido" aria-live="polite">
            Etapa <span className="font-mono text-marca">{step + 1}</span> de{" "}
            <span className="font-mono">{STEPS.length}</span>
          </p>
          <p className="text-sm font-medium text-marca">{STEPS[step]}</p>
        </div>
        <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                i < step ? "bg-marca" : i === step ? "bg-marcador" : "bg-escala",
              )}
            />
          ))}
        </ol>
      </div>

      {/* Etapa 1: equipamento */}
      <fieldset hidden={step !== 0} className="min-w-0">
        <legend className="sr-only">Equipamento</legend>
        <h2 ref={step === 0 ? headingRef : undefined} tabIndex={-1} className="text-2xl outline-none sm:text-3xl">
          O que você quer orçar?
        </h2>
        <RadioList error={(step === 0 ? stepError : null) ?? errors.equipment} name="equipment" options={EQUIPMENT_OPTIONS} value={equipment} onChange={setEquipment} columns />
      </fieldset>

      {/* Etapa 2: operação */}
      <fieldset hidden={step !== 1} className="min-w-0">
        <legend className="sr-only">Tipo de operação</legend>
        <h2 ref={step === 1 ? headingRef : undefined} tabIndex={-1} className="text-2xl outline-none sm:text-3xl">
          Onde o equipamento vai operar?
        </h2>
        <RadioList error={(step === 1 ? stepError : null) ?? errors.operation} name="operation" options={OPERATION_OPTIONS} value={operation} onChange={setOperation} />
      </fieldset>

      {/* Etapa 3: prazo */}
      <fieldset hidden={step !== 2} className="min-w-0">
        <legend className="sr-only">Prazo</legend>
        <h2 ref={step === 2 ? headingRef : undefined} tabIndex={-1} className="text-2xl outline-none sm:text-3xl">
          Qual é o prazo estimado?
        </h2>
        <RadioList error={(step === 2 ? stepError : null) ?? errors.timeline} name="timeline" options={TIMELINE_OPTIONS} value={timeline} onChange={setTimeline} />
        <div className="mt-6">
          <TextField
            id="city"
            name="city" {...fieldValue("city")}
            label="Cidade e estado"
            optional
            placeholder="Belo Horizonte, MG"
            autoComplete="address-level2"
            error={errors.city}
          />
        </div>
      </fieldset>

      {/* Etapa 4: contato */}
      <fieldset hidden={step !== 3} className="min-w-0">
        <legend className="sr-only">Contato</legend>
        <h2 ref={step === 3 ? headingRef : undefined} tabIndex={-1} className="text-2xl outline-none sm:text-3xl">
          Para quem enviamos a proposta?
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField id="name" name="name" {...fieldValue("name")} label="Nome" autoComplete="name" error={errors.name} />
          <TextField
            id="phone"
            name="phone" {...fieldValue("phone")}
            label="Telefone ou WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(31) 99999-9999"
            error={errors.phone}
          />
          <TextField id="email" name="email" {...fieldValue("email")} label="E-mail" type="email" autoComplete="email" error={errors.email} />
          <TextField id="company" name="company" {...fieldValue("company")} label="Empresa ou clínica" optional autoComplete="organization" error={errors.company} />
          <div className="sm:col-span-2">
            <ConsentField checked={consent} onChange={(event) => setConsent(event.target.checked)} error={errors.consent} />
          </div>
        </div>
      </fieldset>

      {(stepError || state.status === "error") && (
        <p role="alert" className="mt-5 rounded-md bg-marcador-tint px-3.5 py-2.5 text-sm text-marcador-hover">
          {stepError ?? (state.status === "error" ? state.message : "")}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-4 border-t border-escala pt-6 sm:flex-row sm:items-center sm:justify-between">
        <a href={whatsappHref} className="link inline-flex items-center gap-2 text-sm" target="_blank" rel="noopener">
          <WhatsAppIcon size={16} className="text-sucesso" />
          Prefiro continuar pelo WhatsApp
        </a>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {step > 0 && (
            <Button type="button" variant="quiet" onClick={back} disabled={pending}>
              Voltar
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button key="next" type="button" size="lg" onClick={(event) => { event.preventDefault(); next(); }}>
              Continuar
              <ButtonArrow />
            </Button>
          ) : (
            <Button key="submit" type="submit" size="lg" disabled={pending} aria-busy={pending}>
              {pending ? "Enviando…" : "Enviar pedido de orçamento"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

/**
 * Opções como cartões selecionáveis: o cartão inteiro é o rótulo do rádio,
 * e o estado marcado pinta borda e fundo via `:has(:checked)`.
 */
function RadioList({
  name,
  options,
  value,
  onChange,
  columns = false,
  error,
}: {
  name: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  columns?: boolean;
  error?: string | null;
}) {
  return (
    <div>
    <ul className={cn("mt-6 grid gap-3", columns && "sm:grid-cols-2")}>
      {options.map((o) => {
        const id = `${name}-${o.value.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
        const checked = value === o.value;
        return (
          <li key={o.value}>
            <label
              htmlFor={id}
              className={cn(
                "flex h-full cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color,box-shadow] duration-150",
                checked
                  ? "border-marca bg-marca-tint shadow-[inset_0_0_0_1px_var(--color-marca)]"
                  : "border-escala bg-radiopaco hover:border-tecido hover:bg-osso",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                aria-describedby={error ? `${name}-error` : undefined}
                onChange={() => onChange(o.value)}
                className="mt-1 h-4.5 w-4.5 shrink-0 accent-marca"
              />
              <span>
                <span className={cn("block text-base font-medium", checked && "text-marca")}>{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-sm text-tecido">{o.hint}</span>}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
    {error && <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-marcador">{error}</p>}
    </div>
  );
}
