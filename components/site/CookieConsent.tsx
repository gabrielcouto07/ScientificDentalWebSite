"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

const KEY = "sd-consent-v1";
type Consent = "all" | "essential";

/**
 * Pequena "store" externa em cima do localStorage, para ler o consentimento
 * sem setState dentro de effect (regra react-hooks/set-state-in-effect) e sem
 * divergência entre servidor e cliente: no servidor o snapshot é "loading".
 */
let memoryConsent: Consent | null = null;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return memoryConsent;
  }
}

function getServerSnapshot(): "loading" {
  return "loading";
}

export function writeCookieConsent(value: Consent) {
  memoryConsent = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* armazenamento bloqueado: segue sem persistir */
  }
  listeners.forEach((l) => l());
}

export function revokeCookieConsent() {
  memoryConsent = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* armazenamento bloqueado: a store já fica sem consentimento persistido */
  }
  listeners.forEach((listener) => listener());
  // Recarrega para descarregar imediatamente qualquer script não essencial já injetado.
  window.location.reload();
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="text-escala transition-colors hover:text-radiopaco" onClick={revokeCookieConsent}>
      Gerenciar cookies
    </button>
  );
}

/**
 * LGPD: nenhum script não essencial carrega antes do consentimento.
 * Fase 1 não tem analytics; quando houver, basta definir NEXT_PUBLIC_GTM_ID
 * e o container só entra depois de "Aceitar todos".
 */
export function CookieConsent({ gtmId }: { gtmId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      {consent === "all" && gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {consent === null && (
        <div
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
          className="animate-rise fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl border border-escala bg-radiopaco/95 p-5 shadow-lift backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:left-auto sm:right-6 sm:p-6"
        >
          <p id="consent-title" className="text-sm font-semibold text-marca">
            Cookies e privacidade
          </p>
          <p id="consent-desc" className="mt-1.5 text-sm text-tecido">
            Usamos apenas cookies essenciais por padrão. Cookies de medição de audiência só entram se você
            aceitar. Detalhes na{" "}
            <Link href="/privacidade" className="link text-marca">
              política de privacidade
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => writeCookieConsent("essential")}>
              Somente essenciais
            </Button>
            <Button variant="contrast" onClick={() => writeCookieConsent("all")}>
              Aceitar todos
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
