"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { ConsentField, Honeypot, TextArea, TextField } from "./Field";

type Props = {
  kind: "produto" | "contato" | "suporte";
  /** Produto pré-preenchido (página de produto) */
  product?: string;
  sourcePath: string;
  whatsappHref: string;
  submitLabel?: string;
  /** Mostra o campo de mensagem */
  withMessage?: boolean;
  messageLabel?: string;
  className?: string;
};

import copy from "@/content/forms.json";

const initial: LeadState = { status: "idle" };

/**
 * Formulário curto (3 campos + consentimento) usado em produto, contato e suporte.
 * Envia por server action; sucesso e erro aparecem no próprio lugar, dentro do
 * mesmo cartão, sem salto de layout.
 */
export function LeadForm({
  kind,
  product,
  sourcePath,
  whatsappHref,
  submitLabel = "Solicitar orçamento",
  withMessage = false,
  messageLabel = "Mensagem",
  className,
}: Props) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const fieldValue = (name: string) => ({ value: values[name] ?? "", onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((previous) => ({ ...previous, [name]: event.target.value })) });
  useEffect(() => {
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  if (state.status === "success") {
    return (
      <div className={cn("card p-6 sm:p-8", className)} role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sucesso/15 text-sucesso">
          <CheckIcon size={24} />
        </span>
        <p className="mt-5 text-xl font-semibold text-marca">Pedido registrado</p>
        <p className="mt-2 text-tecido">
          Protocolo <span className="font-mono text-marca">{state.id}</span>. {copy.success.lead}
        </p>
        <a href={whatsappHref} className="link mt-5 inline-flex items-center gap-2 text-marca" target="_blank" rel="noopener">
          <WhatsAppIcon size={18} className="text-sucesso" />
          Prefere adiantar pelo WhatsApp?
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className={cn("card p-6 sm:p-8", className)} noValidate>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {product && <input type="hidden" name="product" value={product} />}
      <Honeypot id={`${kind}-website`} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={`${kind}-name`} name="name" {...fieldValue("name")}  label="Nome" autoComplete="name" error={errors.name} />
        <TextField
          id={`${kind}-phone`}
          name="phone" {...fieldValue("phone")} 
          label="Telefone ou WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(31) 99999-9999"
          error={errors.phone}
        />
        <div className="sm:col-span-2">
          <TextField id={`${kind}-email`} name="email" {...fieldValue("email")}  label="E-mail" type="email" autoComplete="email" error={errors.email} />
        </div>
        {withMessage && (
          <div className="sm:col-span-2">
            <TextArea id={`${kind}-message`} name="message" {...fieldValue("message")}  label={messageLabel} optional error={errors.message} />
          </div>
        )}
      </div>
      <div className="mt-5">
        <ConsentField checked={consent} onChange={(event) => setConsent(event.target.checked)} id={`${kind}-consent`} error={errors.consent} />
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-4 rounded-md bg-marcador-tint px-3.5 py-2.5 text-sm text-marcador">
          {state.message}
        </p>
      )}
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
          {pending ? "Enviando…" : submitLabel}
          {!pending && <ButtonArrow />}
        </Button>
        <a href={whatsappHref} className="link inline-flex items-center gap-2 text-sm" target="_blank" rel="noopener">
          <WhatsAppIcon size={16} className="text-sucesso" />
          Ou fale pelo WhatsApp
        </a>
      </div>
    </form>
  );
}
