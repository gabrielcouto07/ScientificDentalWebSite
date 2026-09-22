import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "contrast" | "inverse" | "inverse-solid" | "quiet" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-md max-w-full min-w-0 font-medium whitespace-normal text-center select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

/**
 * primary        = Marcador. Uma por tela. Texto branco: 4,86:1.
 * secondary      = contorno Marca sobre superfície clara.
 * contrast       = preenchido em Marca: ação forte que não é a primária (ex.: aceite de cookies).
 * inverse        = contorno branco, dentro de superfície escura.
 * inverse-solid  = branco preenchido com texto Marca, a primária dentro de superfície escura.
 * quiet          = parece link; ações terciárias.
 * whatsapp       = verde do WhatsApp com texto escuro (7,8:1); só onde a ação É abrir o WhatsApp.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-marcador text-radiopaco shadow-[0_1px_2px_rgb(214_48_43/0.25),0_8px_20px_-10px_rgb(214_48_43/0.6)] hover:bg-marcador-hover hover:shadow-[0_2px_4px_rgb(214_48_43/0.25),0_12px_28px_-10px_rgb(214_48_43/0.65)] hover:-translate-y-0.5",
  secondary: "border border-marca/30 bg-radiopaco text-marca hover:border-marca hover:bg-marca-tint",
  contrast: "bg-marca text-radiopaco hover:bg-marca-claro shadow-soft",
  inverse: "border border-radiopaco/35 text-radiopaco hover:border-radiopaco hover:bg-radiopaco/10",
  "inverse-solid": "bg-radiopaco text-marca shadow-soft hover:bg-osso hover:-translate-y-0.5",
  quiet: "text-marca underline decoration-escala underline-offset-[0.2em] hover:decoration-marca hover:decoration-2",
  whatsapp: "bg-whatsapp text-whatsapp-ink hover:brightness-95 hover:-translate-y-0.5 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 py-2 px-3.5 text-sm",
  md: "min-h-11 py-2.5 px-5 text-sm",
  lg: "min-h-13 py-3 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AnchorProps = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type NativeButtonProps = CommonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = "button", ...rest } = props as NativeButtonProps;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Seta que desliza 3 px para a direita quando o botão-pai recebe hover. */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      className={cn("shrink-0 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
