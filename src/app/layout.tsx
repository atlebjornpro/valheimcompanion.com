import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Flame } from "lucide-react";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Search from "../components/Search";
import MobileNav from "../components/MobileNav";
import Breadcrumbs from "../components/Breadcrumbs";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "../config/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const GA_MEASUREMENT_ID = "G-2ZM9CMG4MY";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  description: DEFAULT_DESCRIPTION,
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}/favicon.ico`,
                },
              ],
            }),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <header className="border-b border-slate-800 bg-[#10131e]/95 backdrop-blur">
          <nav className="max-w-6xl mx-auto p-4 flex gap-4 text-sm items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-100">
              <Flame className="h-4 w-4 text-[#607dff]" />
              Enshrouded Companion
            </Link>
            <Link href="/world/regions" className="hidden text-slate-400 hover:text-[#8da0ff] sm:block">World</Link>
            <Link href="/tools/resources" className="hidden text-slate-400 hover:text-[#8da0ff] sm:block">Resources</Link>
            <div className="ml-auto">
              <Search />
            </div>
          </nav>
        </header>

        <div className="max-w-6xl mx-auto flex pb-16 md:pb-0">
          <Sidebar />
          <main className="flex-1 p-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
        <footer className="border-t border-slate-800 bg-[#0d1018]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div><strong className="text-slate-300">Enshrouded Companion</strong><span className="ml-2">Community guide. Not affiliated with Keen Games.</span></div>
            <div className="flex flex-wrap gap-x-4 gap-y-2"><Link href="/about" className="hover:text-[#8da0ff]">About</Link><Link href="/editorial-policy" className="hover:text-[#8da0ff]">Editorial Policy</Link><Link href="/data-sources" className="hover:text-[#8da0ff]">Sources</Link><Link href="/contact" className="hover:text-[#8da0ff]">Contact</Link><Link href="/privacy" className="hover:text-[#8da0ff]">Privacy & Affiliate Disclosure</Link></div>
          </div>
        </footer>
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
