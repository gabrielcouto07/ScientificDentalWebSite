import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import copy from "@/content/forms.json";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-md border border-tecido bg-radiopaco px-3.5 text-base text-radiolucido shadow-[inset_0_1px_2px_rgb(38_36_67/0.04)] " +
  "placeholder:text-tecido transition-[border-color,box-shadow] duration-150 " +
  "hover:border-tecido focus:border-marca focus:shadow-focus focus-visible:outline-2 focus-visible:outline-marca " +
  "aria-[invalid=true]:border-marcador aria-[invalid=true]:focus:shadow-[0_0_0_4px_rgb(214_48_43/0.16)]";

type Wrap = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Rótulo sempre visível acima do campo; erro em Marcador, ligado por aria-describedby. */
export function FieldWrap({ id, label, hint, error, optional, children }: Wrap) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-marca">
        {label}
        {optional && <span className="ml-1 font-normal text-tecido">(opcional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-tecido">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-marcador">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

type InputProps = Omit<Wrap, "children"> & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ id, label, hint, error, optional, className, ...props }: InputProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        {...props}
        id={id}
        name={props.name ?? id}
        className={cn(control, "h-12", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
      />
    </FieldWrap>
  );
}

type TextareaProps = Omit<Wrap, "children"> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ id, label, hint, error, optional, className, ...props }: TextareaProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        {...props}
        id={id}
        name={props.name ?? id}
        className={cn(control, "min-h-28 py-3", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
      />
    </FieldWrap>
  );
}

type SelectProps = Omit<Wrap, "children"> &
  SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }>; placeholder?: string };

export function SelectField({ id, label, hint, error, optional, options, placeholder, className, ...props }: SelectProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        {...props}
        id={id}
        name={props.name ?? id}
        className={cn(control, "h-12", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
        defaultValue={props.defaultValue ?? ""}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

/** Consentimento LGPD explícito, com link para a política. Obrigatório em todo formulário. */
export function ConsentField({ error, id = "consent", ...props }: { error?: string; id?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-md bg-osso p-3.5">
        <input
          {...props}
          id={id}
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded-xs accent-marca"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="text-sm text-tecido">
          Autorizo a Scientific Dental a usar estes dados para responder ao meu pedido, conforme a{" "}
          <a href="/privacidade" className="link text-marca" target="_blank" rel="noopener">
            política de privacidade
          </a>
          {copy.consentSuffix}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-marcador">
          {error}
        </p>
      )}
    </div>
  );
}

/** Campo-armadilha para bots. Invisível e fora da ordem de tabulação. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
      <label htmlFor={id}>Deixe em branco</label>
      <input id={id} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
