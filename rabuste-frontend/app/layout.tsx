import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Rabuste Coffee - Premium Robusta Coffee Takeaway",
  description: "Experience the bold richness of premium Robusta coffee. Artisanal blends, specialty brews, and authentic coffee crafted with passion.",
  keywords: "coffee, robusta, cafe, specialty coffee, artisanal coffee, coffee shop, takeaway coffee",
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
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Lora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ 
          backgroundColor: '#0A0A0A', 
          margin: 0, 
          padding: 0,
          fontFamily: "'Lora', serif",
          paddingTop: '80px',
        }}
      >
          <ScrollToTop />
          {children}
      </body>
    </html>
  );
}
