import type { Metadata } from "next";
import { Outfit, Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

// Ultra-heavy condensed display font — used for the giant "RENOVA" heading
const bebasNeue = Bebas_Neue({
  variable: "--font-display-bold",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Rounded geometric — used for "Transformacija" secondary heading
const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Clean body text
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReNova — Kompletna Adaptacija Stanova i Poslovnih Prostora",
  description:
    "ReNova nudi kompletne usluge adaptacije stanova i poslovnih prostora u Sarajevu, Jahorini, Palama i okolini. Od ideje do useljenja — vrhunski materijali, jasni rokovi i garancija kvaliteta.",
  keywords: ["adaptacija", "renovacija", "Sarajevo", "stanovi", "poslovni prostori", "ReNova"],
  openGraph: {
    title: "ReNova — Ključ U Ruke",
    description: "Kompletne usluge adaptacije stanova i poslovnih prostora. Od ideje do useljenja.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${bebasNeue.variable} ${outfit.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#080A0F] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
