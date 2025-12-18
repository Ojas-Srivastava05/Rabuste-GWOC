import type { Metadata } from "next";
import "./globals.css";
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ backgroundColor: '#0a0a0a', margin: 0, padding: 0 }}
      >   
          <div
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              zIndex: 1000,
              pointerEvents: "auto"
            }}
          >
          </div>
          {children}
       
      </body>
    </html>
  );
}
