"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export type HeaderCategory = {
  slug: string;
  name: string;
  shortName: string;
  description?: string;
  products: Array<{ slug: string; name: string }>;
};

type Props = {
  categories: HeaderCategory[];
  phone: { display: string; tel: string };
  whatsappHref: string;
};

const NAV = [
  { href: "/a-scientific", label: "A Scientific" },
  { href: "/suporte", label: "Suporte" },
  { href: "/legacy-sd", label: "Legacy SD" },
  { href: "/conteudo", label: "Conteúdo" },
  { href: "/contato", label: "Contato" },
];

/** Estado "rolou mais de 12 px" lido como store externa, sem setState em effect. */
function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}
const getCondensed = () => window.scrollY > 12;
const getCondensedServer = () => false;

/**
 * Uma barra só, fixa no topo. Logo oficial à esquerda, navegação ao centro,
 * contatos e o CTA à direita. Tudo em `whitespace-nowrap`: item de menu
 * nunca quebra em duas linhas. O que não cabe some por breakpoint, nesta
 * ordem: telefone (só ≥ xl), rótulo "WhatsApp" (só ≥ xl), CTA (só ≥ sm).
 *
 * A barra mantém 64 px para que a subnavegação sticky das páginas de produto
 * nunca se sobreponha ao header. Ao rolar, ganha fundo translúcido e sombra.
 */
export function Header({ categories, phone, whatsappHref }: Props) {
  const pathname = usePathname();
  const condensed = useSyncExternalStore(subscribeScroll, getCondensed, getCondensedServer);
  const [mobileOpenFor, setMobileOpenFor] = useState<string | null>(null);
  const [megaOpenFor, setMegaOpenFor] = useState<string | null>(null);
  const mobileOpen = mobileOpenFor === pathname;
  const megaOpen = megaOpenFor === pathname;
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const megaId = useId();
  const mobileId = useId();

  const closeAll = () => {
    setMobileOpenFor(null);
    setMegaOpenFor(null);
  };

  /** Fecha o mega-menu com um pequeno atraso: evita piscar ao cruzar a borda. */
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpenFor(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  // Escape fecha; clique fora fecha o mega-menu
  useEffect(() => {
    if (!megaOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAll();
        (mobileOpen ? mobileButtonRef : megaButtonRef).current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMegaOpenFor(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen, mobileOpen]);

  // Trava o fundo inclusive no iOS, preservando a posição da página.
  useEffect(() => {
    if (!mobileOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = "";
      style.top = "";
      style.width = "";
      style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  // Mantém o foco dentro do diálogo mobile enquanto ele cobre a página.
  useEffect(() => {
    if (!mobileOpen || !mobilePanelRef.current) return;
    const panel = mobilePanelRef.current;
    const selector = 'a[href], button:not([disabled]), summary, input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const visibleControls = () => Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter((element) => element.getClientRects().length > 0);
    visibleControls()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      const focusable = visibleControls();
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", trapFocus);
    return () => panel.removeEventListener("keydown", trapFocus);
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (media.matches) setMobileOpenFor(null); };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const produtosActive = pathname.startsWith("/produtos");

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200",
        condensed || megaOpen
          ? "border-escala bg-radiopaco/90 shadow-[0_1px_0_rgb(38_36_67/0.04),0_8px_24px_-16px_rgb(38_36_67/0.25)] backdrop-blur-md"
          : "border-transparent bg-radiopaco",
      )}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <Container
        className={cn(
          "flex items-center justify-between gap-3 transition-[height] duration-200 ease-out motion-reduce:transition-none lg:gap-4 xl:gap-6",
          "h-16",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center rounded-sm py-1" aria-label="Scientific Dental, página inicial">
          <Logo height={condensed ? 26 : 30} className="transition-[height,width] duration-200 sm:hidden" />
          <Logo height={condensed ? 28 : 32} className="hidden transition-[height,width] duration-200 sm:block" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center lg:flex">
          <NavLink href="/a-scientific" active={isActive("/a-scientific")}>
            A Scientific
          </NavLink>
          <button
            ref={megaButtonRef}
            type="button"
            data-open={megaOpen || produtosActive}
            className={cn(
              "nav-link inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-radiolucido transition-colors hover:text-marca xl:px-3",
              (megaOpen || produtosActive) && "text-marca",
            )}
            aria-expanded={megaOpen}
            aria-controls={megaId}
            onClick={() => setMegaOpenFor(megaOpen ? null : pathname)}
            onMouseEnter={() => {
              cancelClose();
              setMegaOpenFor(pathname);
            }}
          >
            Produtos
            <ChevronDownIcon size={16} className={cn("transition-transform duration-200", megaOpen && "rotate-180")} />
          </button>
          {NAV.slice(1).map((item) => (
            <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={`tel:${phone.tel}`}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm text-radiolucido transition-colors hover:bg-osso hover:text-marca xl:inline-flex"
          >
            <PhoneIcon size={17} className="text-marca" />
            <span className="font-mono">{phone.display}</span>
          </a>
          <a
            href={whatsappHref}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-sm text-radiolucido transition-colors hover:bg-osso hover:text-marca xl:px-3"
            rel="noopener"
            target="_blank"
            aria-label="Falar pelo WhatsApp"
          >
            <WhatsAppIcon size={19} className="text-sucesso" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>
          <a
            href={`tel:${phone.tel}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-radiolucido transition-colors hover:bg-osso hover:text-marca xl:hidden"
            aria-label={`Ligar para ${phone.display}`}
          >
            <PhoneIcon size={18} />
          </a>
          {/* Wrapper: `hidden` no próprio Button perde para o `inline-flex` da base */}
          <div className="hidden whitespace-nowrap sm:block">
            <Button href="/orcamento" variant="secondary" size="md" className="whitespace-nowrap">
              <span className="xl:hidden">Orçamento</span>
              <span className="hidden xl:inline">Solicitar orçamento</span>
            </Button>
          </div>
          <button
            ref={mobileButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-marca transition-colors hover:bg-osso lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpenFor(mobileOpen ? null : pathname)}
          >
            {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </Container>

      {/* Mega-menu Produtos (desktop) */}
      {megaOpen && <div
        id={megaId}
        className="absolute inset-x-0 top-full hidden border-b border-escala bg-radiopaco shadow-lift lg:block"
        onMouseEnter={cancelClose}
      >
        <Container className="py-8">
          <div className="grid grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div key={cat.slug} className="group rounded-lg p-4 transition-colors hover:bg-osso">
                <Link href={`/produtos/${cat.slug}`} className="text-sm font-semibold text-marca">
                  {cat.name}
                </Link>
                {cat.description && <p className="mt-1.5 text-xs leading-relaxed text-tecido">{cat.description}</p>}
                <ul className="mt-3 space-y-1.5 border-t border-escala pt-3">
                  {cat.products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/produtos/${p.slug}`} className="block py-0.5 text-sm text-tecido transition-colors hover:text-marca">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-escala pt-5 text-sm">
            <Link href="/produtos" className="inline-flex items-center gap-1.5 font-medium text-marca hover:underline">
              Todos os produtos
              <ArrowRightIcon size={16} />
            </Link>
            <span className="inline-flex items-center gap-2 text-tecido">
              <span className="inline-block h-2 w-2 rounded-full bg-sucesso" aria-hidden />
              Assistência técnica oficial J. Morita no Brasil
            </span>
          </div>
        </Container>
      </div>}

      {/* Menu mobile */}
      {mobileOpen && <div
        onClick={(event) => { if ((event.target as Element).closest("a[href]")) closeAll(); }}
        ref={mobilePanelRef}
        id={mobileId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-escala bg-radiopaco lg:hidden"
      >
        <Container className="flex min-h-full flex-col py-4">
          <button type="button" className="mb-2 flex items-center gap-2 self-end rounded-md p-3 text-marca" onClick={() => { closeAll(); mobileButtonRef.current?.focus(); }}>Fechar menu <CloseIcon size={20} /></button>
          <nav aria-label="Principal, celular" className="flex flex-col divide-y divide-escala">
            <Link href="/a-scientific" className="py-4 text-lg font-medium text-marca">
              A Scientific
            </Link>
            <details className="group py-4" open={produtosActive}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-marca marker:content-none">
                Produtos
                <ChevronDownIcon size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mt-3 space-y-4 pl-3">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/produtos/${cat.slug}`} className="text-base font-medium">
                      {cat.name}
                    </Link>
                    <ul className="mt-1.5 space-y-1.5">
                      {cat.products.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/produtos/${p.slug}`} className="block py-0.5 text-sm text-tecido">
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li>
                  <Link href="/produtos" className="link text-sm">
                    Todos os produtos
                  </Link>
                </li>
              </ul>
            </details>
            {NAV.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="py-4 text-lg font-medium text-marca">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t border-escala py-6">
            <Button href="/orcamento" size="lg" className="w-full">
              Solicitar orçamento
            </Button>
            <div className="grid gap-3 min-[400px]:grid-cols-2">
              <Button href={`tel:${phone.tel}`} variant="secondary" size="lg">
                <PhoneIcon size={18} />
                <span className="font-mono text-sm">{phone.display}</span>
              </Button>
              <Button href={whatsappHref} variant="secondary" size="lg" target="_blank">
                <WhatsAppIcon size={18} className="text-sucesso" />
                WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </div>}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "nav-link inline-flex h-10 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-radiolucido transition-colors hover:text-marca xl:px-3",
        active && "text-marca",
      )}
    >
      {children}
    </Link>
  );
}
