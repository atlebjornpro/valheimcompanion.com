import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Axe } from "lucide-react";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Search from "../components/Search";
import MobileNav from "../components/MobileNav";
import Breadcrumbs from "../components/Breadcrumbs";
import AnalyticsConsent, { AnalyticsPreferencesButton } from "../components/AnalyticsConsent";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "../config/metadata";
import { routes } from "../config/routes";
import { site } from "../config/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1731, height: 909, alt: "Valheim Companion — 1.0, Deep North, and server guides" }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DEFAULT_DESCRIPTION, images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: DEFAULT_DESCRIPTION, publisher: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    ],
  };

  return <html lang={site.language} className="dark">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/*
        Always starts denied here, even for the row (rest-of-world) region that
        AnalyticsConsent later flips to granted. Reading the region on the
        server (e.g. via cookies()) would force this whole site out of static
        rendering and into per-request SSR, which isn't worth it for a value
        that AnalyticsConsent already resolves client-side within milliseconds
        of hydration, well before the actual GA config/page_view call fires.
      */}
      <Script id="google-consent-defaults" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);`}
      </Script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#3a3124] bg-[#11120f]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center gap-5 p-4 text-sm">
          <Link href={routes.home} className="flex items-center gap-2 font-black tracking-tight text-[#f2e8d0]">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#aa7a3d]/60 bg-[#2b2117]"><Axe className="h-4 w-4 text-[#e1ad5a]" /></span>
            {SITE_NAME}
          </Link>
          <Link href={routes.valheimOne} className="hidden text-[#aaa18f] hover:text-[#f0bd68] sm:block">1.0</Link>
          <Link href={routes.deepNorth} className="hidden text-[#aaa18f] hover:text-[#f0bd68] sm:block">Deep North</Link>
          <Link href={routes.world} className="hidden text-[#aaa18f] hover:text-[#f0bd68] sm:block">World</Link>
          <Link href={routes.servers} className="hidden text-[#aaa18f] hover:text-[#f0bd68] sm:block">Servers</Link>
          <div className="ml-auto"><Search /></div>
        </nav>
      </header>
      <div className="mx-auto flex max-w-7xl pb-16 md:pb-0"><Sidebar /><main className="min-w-0 flex-1 p-5 sm:p-8"><Breadcrumbs />{children}</main></div>
      <footer className="border-t border-[#332b21] bg-[#0d0e0c]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-xs text-[#827a6c] sm:flex-row sm:items-center sm:justify-between">
          <div><strong className="text-[#d5cbb7]">{SITE_NAME}</strong><span className="ml-2">Independent community project. Not affiliated with Iron Gate.</span></div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href={routes.about} className="hover:text-[#e1ad5a]">About</Link>
            <Link href={routes.dataSources} className="hover:text-[#e1ad5a]">Sources</Link>
            <Link href={routes.editorialPolicy} className="hover:text-[#e1ad5a]">Editorial</Link>
            <Link href={routes.contact} className="hover:text-[#e1ad5a]">Contact</Link>
            <Link href={routes.privacy} className="hover:text-[#e1ad5a]">Privacy</Link>
            <Link href={routes.terms} className="hover:text-[#e1ad5a]">Terms</Link>
            <AnalyticsPreferencesButton />
          </div>
        </div>
      </footer>
      <AnalyticsConsent />
      <Analytics />
      <MobileNav />
    </body>
  </html>;
}
