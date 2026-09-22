import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Botão flutuante no verde oficial do WhatsApp, com ícone escuro (7,8:1).
 * É a única ocorrência do verde na tela: o glifo + a cor tornam a ação
 * reconhecível em meio segundo. Um rótulo aparece no hover em telas largas.
 * Em páginas com barra de CTA inferior no celular, a classe `has-cta-bar`
 * no <main> empurra o botão para cima (ver globals via seletor irmão).
 */
export function WhatsAppButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="wa-float group fixed bottom-4 right-4 z-30 inline-flex h-14 items-center gap-0 rounded-full bg-whatsapp pl-0 pr-0 text-whatsapp-ink shadow-lift transition-[padding,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(38_36_67/0.12),0_22px_44px_-16px_rgb(38_36_67/0.4)] sm:bottom-6 sm:right-6 lg:hover:pl-5 lg:hover:pr-1"
      aria-label="Falar com um especialista pelo WhatsApp"
    >
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-52 group-hover:opacity-100 lg:inline-block">
        Falar com um especialista
      </span>
      <span className="flex h-14 w-14 items-center justify-center">
        <WhatsAppIcon size={28} />
      </span>
    </a>
  );
}
