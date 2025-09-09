import type { Metadata } from "next";
import { Encode_Sans } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { SkipToContent } from "@/components/SkipToContent";

// Lazy loading dos componentes do layout
const Header = dynamic(() => import("@/components/Header").then(mod => ({ default: mod.Header })), {
  ssr: true
});

const Footer = dynamic(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })), {
  ssr: true
});

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-encode-sans",
});

export const metadata: Metadata = {
  title: "Sistema de Pessoas Desaparecidas - Polícia Civil MT",
  description: "Sistema oficial da Polícia Civil do Estado de Mato Grosso para consulta e divulgação de informações sobre pessoas desaparecidas.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${encodeSans.variable} font-sans`}>
        <SkipToContent />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
