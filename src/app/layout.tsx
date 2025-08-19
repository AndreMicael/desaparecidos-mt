import type { Metadata } from "next";
import { Encode_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-encode-sans",
});

export const metadata: Metadata = {
  title: "Sistema de Pessoas Desaparecidas - Polícia Civil MT",
  description: "Sistema oficial da Polícia Civil do Estado de Mato Grosso para consulta e divulgação de informações sobre pessoas desaparecidas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${encodeSans.variable} font-sans`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
