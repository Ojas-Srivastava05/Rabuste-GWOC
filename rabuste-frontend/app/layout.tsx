import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import BrewAIPreloader from "@/components/BrewAIPreloader";
import BackendWarmer from "@/components/BackendWarmer";
import { UserProvider } from "@/contexts/UserContext";

export const metadata: Metadata = {
  title: "Rabuste - Unapologetically Bold | 2X Caffeine Robusta Coffee",
  description: "Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful. Experience the superiority of Robusta.",
  keywords: "robusta coffee, high caffeine, bold coffee, premium coffee, strong coffee, 2x caffeine, intense coffee, powerful brew",
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
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <UserProvider>
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