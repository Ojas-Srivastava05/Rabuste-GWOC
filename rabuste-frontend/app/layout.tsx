import type { Metadata } from "next";
import "./globals.css";
import DotGridBackground from "@/components/DotGridBackground";
import ClickSpark from '@/components/ClickSpark';
import Image from "next/image";

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
        className="antialiased"
        style={{ backgroundColor: '#0a0a0a', margin: 0, padding: 0 }}
      >
        <ClickSpark
          sparkColor="#FF7400"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <DotGridBackground />
          <div
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              zIndex: 1000,
              pointerEvents: "auto"
            }}
          >
            <Image
              src="/logo.svg"
              alt="Rabuste Coffee Logo"
              width={60}
              height={60}
              priority
            />
          </div>
          {children}
        </ClickSpark>
      </body>
    </html>
  );
}
