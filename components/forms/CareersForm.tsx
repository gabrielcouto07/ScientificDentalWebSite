"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitApplication, type CareersState } from "@/app/actions/careers";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { CheckIcon, CloseIcon, FileIcon, MailIcon, UploadIcon } from "@/components/ui/Icons";
import { CV_ACCEPT, CV_MAX_BYTES } from "@/lib/careers-schema";
import { cn } from "@/lib/utils";
import { ConsentField, Honeypot, TextArea, TextField } from "./Field";

const initial: CareersState = { status: "idle" };

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

/** Mesmo critério do servidor, para avisar antes do envio. O servidor confere de novo pelos bytes. */
function precheck(file: File): string | null {
  if (!/\.(pdf|docx?)$/i.test(file.name)) return "Envie o currículo em PDF, DOC ou DOCX";
  if (file.size > CV_MAX_BYTES) return "O arquivo passa de 4 MB. Exporte um PDF mais leve.";
  return null;
}

/**
 * Candidatura espontânea: contato, apresentação opcional e o CV.
 * O arquivo vai na própria server action e chega ao RH como anexo.
 */
export function CareersForm({ hrEmail, className }: { hrEmail: string; className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, action, pending] = useActionState(async (previous: CareersState, formData: FormData) => {
    const result = await submitApplication(previous, formData);
    // Arquivo recusado pelo servidor: libera a área de envio para escolher outro.
    if (result.status === "error" && result.fieldErrors?.cv) {
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
    return result;
  }, initial);

  const fieldValue = (name: string) => ({
    value: values[name] ?? "",
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((previous) => ({ ...previous, [name]: event.target.value })),
  });

  useEffect(() => {
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  // Erro local (escolha do arquivo) tem precedência; o do servidor some quando a pessoa troca o arquivo.
  const cvError = fileError ?? (file ? undefined : errors.cv);

  function pick(files: FileList | null) {
    const next = files?.[0] ?? null;
    if (!next) return;
    const problem = precheck(next);
    setFileError(problem);
    setFile(problem ? null : next);
    if (problem && fileRef.current) fileRef.current.value = "";
  }

  function clearFile() {
    setFile(null);
    setFileError(null);
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.focus();
    }
  }

  if (state.status === "success") {
    return (
      <div className={cn("card p-6 sm:p-8", className)} role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sucesso/15 text-sucesso">
          <CheckIcon size={24} />
        </span>
        <p className="mt-5 text-xl font-semibold text-marca">Currículo enviado</p>
        <p className="mt-2 text-tecido">
          Protocolo <span className="font-mono text-marca">{state.id}</span>. Seu currículo chegou ao RH da Scientific
          Dental. Quando surgir uma oportunidade compatível com o seu perfil, a equipe entra em contato pelo telefone ou
          e-mail informados.
        </p>
        <a href={`mailto:${hrEmail}`} className="link mt-5 inline-flex items-center gap-2 text-sm text-marca">
          <MailIcon size={16} />
          Precisa complementar? Escreva para {hrEmail}
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onReset={(event) => event.preventDefault()}
      action={action}
      className={cn("card p-6 sm:p-8", className)}
      noValidate
    >
      <Honeypot id="careers-website" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField id="careers-name" name="name" {...fieldValue("name")} label="Nome completo" autoComplete="name" error={errors.name} />
        </div>
        <TextField id="careers-email" name="email" {...fieldValue("email")} label="E-mail" type="email" autoComplete="email" error={errors.email} />
        <TextField
          id="careers-phone"
          name="phone"
          {...fieldValue("phone")}
          label="Telefone ou WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(31) 99999-9999"
          error={errors.phone}
        />
        <TextField
          id="careers-city"
          name="city"
          {...fieldValue("city")}
          label="Cidade e estado"
          optional
          placeholder="Belo Horizonte, MG"
          autoComplete="address-level2"
          error={errors.city}
        />
        <TextField
          id="careers-linkedin"
          name="linkedin"
          {...fieldValue("linkedin")}
          label="LinkedIn"
          optional
          type="url"
          inputMode="url"
          placeholder="linkedin.com/in/seu-perfil"
          error={errors.linkedin}
        />
        <div className="sm:col-span-2">
          <TextArea
            id="careers-message"
            name="message"
            {...fieldValue("message")}
            label="Conte um pouco sobre você"
            hint="Experiência, área em que gostaria de atuar, disponibilidade."
            optional
            maxLength={1500}
            error={errors.message}
          />
        </div>

        {/* Currículo: a área inteira é o rótulo do input; aceita clique, teclado e arrastar e soltar */}
        <div className="sm:col-span-2">
          <p id={`${hintId}-label`} className="block text-sm font-medium text-marca">
            Currículo
          </p>
          <p id={`${hintId}-hint`} className="mt-1 text-xs text-tecido">
            PDF, DOC ou DOCX, até 4 MB.
          </p>
          <label
            htmlFor="careers-cv"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const dropped = event.dataTransfer.files;
              if (fileRef.current && dropped.length > 0) fileRef.current.files = dropped;
              pick(dropped);
            }}
            className={cn(
              "mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-5 py-7 text-center transition-[border-color,background-color] duration-150",
              "has-[:focus-visible]:border-marca has-[:focus-visible]:shadow-focus",
              dragging ? "border-marca bg-marca-tint" : cvError ? "border-marcador bg-marcador-tint/40" : "border-escala bg-osso hover:border-tecido",
              file && "hidden",
            )}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-radiopaco text-marca shadow-soft">
              <UploadIcon size={20} />
            </span>
            <span className="text-sm text-tecido">
              <span className="font-medium text-marca underline decoration-escala underline-offset-[0.2em]">Escolha o arquivo</span> ou
              arraste para cá
            </span>
            <input
              ref={fileRef}
              id="careers-cv"
              name="cv"
              type="file"
              accept={CV_ACCEPT}
              required
              className="sr-only"
              aria-labelledby={`${hintId}-label`}
              aria-describedby={[`${hintId}-hint`, cvError ? "careers-cv-error" : null].filter(Boolean).join(" ")}
              aria-invalid={cvError ? true : undefined}
              onChange={(event) => pick(event.target.files)}
            />
          </label>

          {file && (
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-marca/30 bg-marca-tint p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-radiopaco text-marca">
                <FileIcon size={19} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-marca">{file.name}</span>
                <span className="font-mono text-xs text-tecido">{formatSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-tecido transition-colors hover:bg-radiopaco hover:text-marcador"
                aria-label={`Remover ${file.name}`}
              >
                <CloseIcon size={18} />
              </button>
            </div>
          )}

          {cvError && (
            <p id="careers-cv-error" role="alert" className="mt-1.5 text-sm text-marcador">
              {cvError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ConsentField
          id="careers-consent"
          purpose="avaliar meu perfil em processos seletivos e guardar meu currículo no banco de talentos"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          error={errors.consent}
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-4 rounded-md bg-marcador-tint px-3.5 py-2.5 text-sm text-marcador-hover">
          {state.message}
        </p>
      )}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
          {pending ? "Enviando currículo…" : "Enviar currículo"}
          {!pending && <ButtonArrow />}
        </Button>
        <a href={`mailto:${hrEmail}`} className="link inline-flex items-center gap-2 text-sm">
          <MailIcon size={16} />
          Ou envie por e-mail
        </a>
      </div>
    </form>
  );
}
