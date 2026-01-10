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

export const metadata: Metadata = {
  title: "Rabuste - Unapologetically Bold | 2X Caffeine Robusta Coffee",
  description: "Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful. Experience the superiority of Robusta. Order premium coffee online, explore our art gallery, and join exclusive workshops.",
  keywords: "robusta coffee, high caffeine, bold coffee, premium coffee, strong coffee, 2x caffeine, intense coffee, powerful brew, coffee shop, art gallery, coffee workshops, online coffee order",
  authors: [{ name: "Rabuste" }],
  creator: "Rabuste",
  publisher: "Rabuste",
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
    siteName: 'Rabuste',
    title: 'Rabuste - Unapologetically Bold | 2X Caffeine Robusta Coffee',
    description: 'Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful.',
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
    title: 'Rabuste - Unapologetically Bold | 2X Caffeine Robusta Coffee',
    description: 'Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#B87333" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
      </body>
    </html>
  );
}