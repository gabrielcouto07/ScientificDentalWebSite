import { Button } from "@/components/ui/Button";

/**
 * Barra fixa inferior no celular com a ação primária da página de produto.
 * O botão flutuante do WhatsApp sobe para não cobrir (ver WhatsAppButton).
 */
export function MobileCtaBar({ label = "Solicitar orçamento", href = "#orcamento" }: { label?: string; href?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-escala bg-radiopaco/95 p-3 pr-[5.5rem] shadow-[0_-8px_24px_-16px_rgb(38_36_67/0.3)] backdrop-blur-md sm:hidden">
      <Button href={href} size="lg" className="w-full">
        {label}
      </Button>
    </div>
  );
}
