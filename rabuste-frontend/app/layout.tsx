import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import BrewAIPreloader from "@/components/BrewAIPreloader";
import BackendWarmer from "@/components/BackendWarmer";
import StructuredData from "@/components/StructuredData";
import PageViewTracker from "@/components/PageViewTracker";
import { UserProvider } from "@/contexts/UserContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Rabuste Coffee | Premium 2X Caffeine Coffee Online",
  description: "Buy premium Robusta coffee online with 2x the caffeine. Best Robusta coffee beans, ground coffee, and instant Robusta coffee. Free shipping on Robusta coffee orders. Experience bold, intense Robusta coffee flavor.",
  keywords: "rabuste coffee, robusta coffee, buy robusta coffee, robusta coffee beans, premium robusta coffee, robusta coffee online, best robusta coffee, robusta coffee india, strong robusta coffee, high caffeine robusta coffee, robusta coffee shop, robusta vs arabica, robusta coffee benefits, robusta coffee price, robusta coffee brands, organic robusta coffee",
  authors: [{ name: "Rabuste Coffee" }],
  creator: "Rabuste Coffee",
  publisher: "Rabuste Coffee",
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: (process.env.NEXT_PUBLIC_APP_URL as string) || 'http://localhost:3000',
    siteName: 'Rabuste Coffee - Premium Robusta Coffee',
    title: 'Rabuste Coffee | Premium 2X Caffeine Coffee Online',
    description: 'Buy premium Robusta coffee online with 2x the caffeine. Best Robusta coffee beans, ground coffee, and instant Robusta coffee. Free shipping on Robusta coffee orders.',
    images: [
      {
        url: `${(process.env.NEXT_PUBLIC_APP_URL as string) || 'http://localhost:3000'}/Rabuste%20logo.png`,
        width: 1200,
        height: 630,
        alt: 'Rabuste Coffee Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rabuste Coffee | Premium 2X Caffeine Coffee Online',
    description: 'Buy premium Robusta coffee online with 2x the caffeine. Best Robusta coffee beans, ground coffee, and instant Robusta coffee.',
    images: [`${(process.env.NEXT_PUBLIC_APP_URL as string) || 'http://localhost:3000'}/Rabuste%20logo.png`],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Required for Search Console verification */}
        {/* Must be in <head> section and unmodified for verification */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <link
              rel="dns-prefetch"
              href="https://www.googletagmanager.com"
            />
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                    'send_page_view': false
                  });
                `,
              }}
            />
          </>
        )}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
        <link
          rel="dns-prefetch"
          href="https://checkout.razorpay.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#FE7400" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Explicit viewport meta ensures consistent responsive behavior across browsers */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <StructuredData />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <UserProvider>
          <PageViewTracker />
          <BackendWarmer />
          <BrewAIPreloader />
          <LoadingScreen />
          <ScrollToTop />
          {children}
        </UserProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}