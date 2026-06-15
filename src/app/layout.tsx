import type { Metadata } from "next";
import { Outfit, Inter, Bebas_Neue } from "next/font/google";
import Script from "next/script";
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

/* ─── Production domain ─── */
const SITE_URL = "https://www.renovabih.com";

/* ─── JSON-LD LocalBusiness structured data ─── */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "ReNova",
  description:
    "Kompletna adaptacija stanova i poslovnih prostora u Sarajevu, Palama, Jahorini i Istočnom Sarajevu. Usluge ključ u ruke — molerski radovi, keramika, električne instalacije.",
  url: SITE_URL,
  telephone: "+38766057780",
  email: "info@renovabih.com",
  logo: `${SITE_URL}/brand-logo.jpeg`,
  image: `${SITE_URL}/hero-image.png`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dobrovoljnih davalaca krvi 21",
    addressLocality: "Pale",
    addressRegion: "Republika Srpska",
    postalCode: "71420",
    addressCountry: "BA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.8184,
    longitude: 18.5693,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Sarajevo" },
    { "@type": "City", name: "Pale" },
    { "@type": "City", name: "Jahorina" },
    { "@type": "City", name: "Istočno Sarajevo" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usluge Adaptacije",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Kompletna Adaptacija Stanova (Ključ u Ruke)",
          description:
            "Cjelovita adaptacija od rušenja do finišnih radova. Sarajevo, Pale, Jahorina.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Molerski Radovi",
          description:
            "Profesionalno bojanje, gletanje i dekorativne teksture za stanove i poslovne prostore.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Keramika i Podne Obloge",
          description:
            "Ugradnja keramike, gresa, parketa i vinila — precizno i trajno.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Elektroinstalacije i Rasvjeta",
          description:
            "Kompletne elektroinstalaterske usluge po EU standardima.",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [],
};

/* ─── JSON-LD FAQ structured data ─── */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Koliko košta adaptacija stana u Sarajevu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cijena adaptacije stana u Sarajevu ovisi o veličini prostora i obimu radova. Kompletna adaptacija ključ u ruke za stan od 60 m² kreće se od 25.000 KM naviše. Nudimo besplatnu procjenu na +387 66 057 780.",
      },
    },
    {
      "@type": "Question",
      name: "Da li radite adaptacije u Palama, Jahorini i Istočnom Sarajevu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da — izvodimo radove u Sarajevu, Palama, Jahorini i Istočnom Sarajevu. Naša baza je u Palama, što nam omogućava brz odaziv na cijelom tom području.",
      },
    },
    {
      "@type": "Question",
      name: "Šta uključuje paket ključ u ruke?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paket ključ u ruke pokriva sve faze adaptacije: demolaciju, građevinske radove, elektroinstalacije, vodovodne instalacije, gletanje i bojanje zidova, keramiku, podne obloge, montažu vrata i finalno čišćenje.",
      },
    },
    {
      "@type": "Question",
      name: "Koliko traje kompletna adaptacija stana?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Adaptacija stana od 50–80 m² traje 6–10 sedmica. Svaki projekat dobija precizan terminski plan i držimo se dogovorenih rokova.",
      },
    },
    {
      "@type": "Question",
      name: "Da li dajete garanciju na izvedene radove?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da — ReNova daje pisanu garanciju na sve izvedene radove. U slučaju reklamacije, naš tim dolazi bez odlaganja i rješava problem bez dodatnih troškova za klijenta.",
      },
    },
    {
      "@type": "Question",
      name: "Radite li i poslovne prostore i kancelarije?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apsolutno. ReNova adaptira poslovne prostore, kancelarije, restorane i maloprodajne objekte u Sarajevu i okolini, uključujući i radove vikendom kako ne bismo ometali poslovanje.",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ─── Title ─── */
  title: {
    default:
      "ReNova — Adaptacija Stanova Sarajevo, Pale, Jahorina | Ključ u Ruke",
    template: "%s | ReNova Adaptacije",
  },

  /* ─── Meta description ─── */
  description:
    "ReNova izvodi kompletnu adaptaciju stanova i poslovnih prostora u Sarajevu, Palama, Jahorini i Istočnom Sarajevu. Ključ u ruke rješenje — molerski radovi, keramika, elektrika. Besplatna procjena: +387 66 057 780.",

  /* ─── Keywords ─── */
  keywords: [
    "adaptacija stanova Sarajevo",
    "renovacija stanova Pale",
    "ključ u ruke Jahorina",
    "adaptacija stanova Istočno Sarajevo",
    "molerski radovi Sarajevo",
    "keramika i podovi Sarajevo",
    "elektroinstalacije Pale",
    "adaptacija poslovnih prostora BiH",
    "ReNova Pale",
    "renovabih",
  ],

  /* ─── Canonical ─── */
  alternates: {
    canonical: SITE_URL,
  },

  /* ─── Geo meta tags ─── */
  other: {
    "geo.region": "BA-SRP",
    "geo.placename": "Pale, Bosnia and Herzegovina",
    "geo.position": "43.8184;18.5693",
    ICBM: "43.8184, 18.5693",
  },

  /* ─── Open Graph ─── */
  openGraph: {
    title:
      "ReNova — Kompletna Adaptacija Stanova Sarajevo, Pale & Jahorina",
    description:
      "Adaptacija stanova i poslovnih prostora po sistemu ključ u ruke. Sarajevo, Pale, Jahorina, Istočno Sarajevo. 500+ završenih projekata. Besplatna procjena!",
    type: "website",
    url: SITE_URL,
    siteName: "ReNova",
    locale: "bs_BA",
    images: [
      {
        url: `${SITE_URL}/hero-image.png`,
        width: 1200,
        height: 630,
        alt: "ReNova — Renoviran stan u Sarajevu, kompletna adaptacija ključ u ruke",
      },
    ],
  },

  /* ─── Twitter / X card ─── */
  twitter: {
    card: "summary_large_image",
    title:
      "ReNova — Adaptacija Stanova Sarajevo & Pale | Ključ u Ruke",
    description:
      "Kompletne renovacije u Sarajevu, Palama i Jahorini. Molerski radovi, keramika, elektrika. Besplatna procjena!",
    images: [`${SITE_URL}/hero-image.png`],
  },

  /* ─── Robots ─── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
      <head>
        {/* Preconnect to Google Fonts for faster LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* LocalBusiness JSON-LD */}
        <Script
          id="local-business-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* FAQ JSON-LD */}
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#080A0F] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
