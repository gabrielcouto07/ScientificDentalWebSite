"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "./Icons";

/**
 * Copia um contato (e-mail, telefone) para a área de transferência.
 * Útil no desktop, onde mailto: e tel: nem sempre abrem um aplicativo.
 */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Sem permissão de clipboard (HTTP, iframe): o valor segue visível para copiar à mão.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-tecido transition-colors hover:bg-marca-tint hover:text-marca",
        copied && "text-sucesso hover:text-sucesso",
        className,
      )}
      aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
      title={copied ? "Copiado" : "Copiar"}
    >
      {copied ? <CheckIcon size={17} /> : <CopyIcon size={17} />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copiado" : ""}
      </span>
    </button>
  );
}
