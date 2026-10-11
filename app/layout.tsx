import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toaster from "@/components/common/Toaster";
import ConsentBanner from "@/components/common/ConsentBanner";
import SpotlightEnhancer from "@/components/common/SpotlightEnhancer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Free Online File Converter & Document Tools`,
    template: `%s`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.github }],
  creator: site.author.name,
  publisher: site.name,
  formatDetection: { telephone: false, address: false, email: false },
  // Explicit self-referencing canonical default; individual pages override it.
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom must stay available — capping it fails WCAG 1.4.4.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111316" },
  ],
};

/**
 * Runs before paint. Applies the stored theme (preventing a flash of the wrong
 * appearance) and establishes Consent Mode v2 defaults *before* the advertising
 * tag loads, so no personalised-advertising storage can be written until the
 * visitor has actually made a choice.
 */
const BOOT_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    var d = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (d) document.documentElement.classList.add('dark');
  } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  try {
    var raw = localStorage.getItem('ff:consent');
    if (raw) {
      var c = JSON.parse(raw);
      if (c && c.v === 1 && (c.ads === 'granted' || c.ads === 'denied')) {
        gtag('consent', 'update', {
          ad_storage: c.ads,
          ad_user_data: c.ads,
          ad_personalization: c.ads,
          analytics_storage: c.ads
        });
      }
    }
  } catch (e) {}
})();
`;

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7108347342452176";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* Warm up the ad origin without blocking render. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-xl focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <Toaster />
        <ConsentBanner />
        <SpotlightEnhancer />
        <Analytics />
        <SpeedInsights />
        {/* The publisher ID is read from the environment so it is configurable
            per deployment, falling back to the existing literal so nothing
            breaks if the variable is not yet set in Vercel. */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
