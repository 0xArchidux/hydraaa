import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hydra Instal – hydraulika, klimatyzacja, pompy ciepła | Wrocław",
  description:
    "Kompleksowe instalacje: hydraulika, rekuperacja, klimatyzacja, pompy ciepła i instalacje gazowe. Wrocław i Dolny Śląsk. Uprawnienia SEP i F-gaz. Bezpłatna wycena.",
  openGraph: {
    title: "Hydra Instal – instalacje, które działają. Terminy, których dotrzymujemy.",
    description:
      "Hydraulika, rekuperacja, klimatyzacja, pompy ciepła i gaz. Wrocław i Dolny Śląsk.",
    locale: "pl_PL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E293B",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  taxID: SITE.nip,
  areaServed: ["Wrocław", "Dolny Śląsk"],
  address: { "@type": "PostalAddress", addressLocality: "Wrocław", addressCountry: "PL" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <noscript>
          <style>{`.split-pending{visibility:visible!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
