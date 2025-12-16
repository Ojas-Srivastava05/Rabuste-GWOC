import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DotGridBackground from "@/components/DotGridBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rabuste Coffee",
  description: "Premium specialty coffee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#0a0a0a', margin: 0, padding: 0 }}
      >
        <DotGridBackground />
        {children}
      </body>
    </html>
  );
}
