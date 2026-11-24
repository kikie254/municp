import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { site } from "@/lib/site";

const inter = localFont({
  src: [
    { path: "../public/fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const manrope = localFont({
  src: [
    { path: "../public/fonts/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/manrope-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/manrope-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Iten-Tambach Municipality | County Government of Elgeyo Marakwet",
    template: "%s | Iten-Tambach Municipality",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Iten-Tambach Municipality",
    "Elgeyo Marakwet County",
    "Iten Municipality",
    "municipal services",
    "public participation Kenya",
    "municipal documents",
  ],
  authors: [{ name: "Iten-Tambach Municipality" }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: site.url,
    siteName: site.name,
    title: "Iten-Tambach Municipality | County Government of Elgeyo Marakwet",
    description: site.description,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Iten-Tambach Municipality, County Government of Elgeyo Marakwet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iten-Tambach Municipality",
    description: site.description,
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/elgeyo-marakwet-crest.png", apple: "/brand/elgeyo-marakwet-crest.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
