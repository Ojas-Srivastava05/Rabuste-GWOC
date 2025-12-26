import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";

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
          href="https://fonts.googleapis.com/css2?family=Staatliches&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ 
          backgroundColor: '#000000', 
          margin: 0, 
          padding: 0,
          fontFamily: "'Work Sans', sans-serif",
          paddingTop: '80px',
        }}
      >
          <LoadingScreen />
          <ScrollToTop />
          {children}
      </body>
    </html>
  );
}
