import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/site/CookieConsent";
import { Footer } from "@/components/site/Footer";
import { Header, type HeaderCategory } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getCategories, getProduct, getSite } from "@/lib/content";
import { organizationJsonLd, SITE_URL } from "@/lib/seo";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  // Mono só aparece em medidas e legendas: fora do caminho crítico do LCP,
  // deixa banda para HTML, CSS e a imagem do hero na primeira carga.
  preload: false,
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Scientific Dental | Venda e assistência técnica oficial J. Morita e Carestream",
    template: "%s | Scientific Dental",
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name },
  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Cor da marca (logo oficial): pinta a barra do navegador no celular
  themeColor: "#262443",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();
  const headerCategories: HeaderCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    description: c.description,
    products: c.flagship
      .map((slug) => getProduct(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({ slug: p.slug, name: p.name })),
  }));

  return (
    <html lang="pt-BR" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a href="#conteudo" className="sr-only-focusable">
          Pular para o conteúdo
        </a>
        <Header
          categories={headerCategories}
          phone={site.phones.main}
          whatsappHref={whatsappLink(whatsappMessages.default)}
        />
        {children}
        <Footer site={site} categories={categories} />
        <WhatsAppButton href={whatsappLink(whatsappMessages.default)} />
        <CookieConsent gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        <JsonLd data={organizationJsonLd(site)} />
      </body>
    </html>
  );
}
