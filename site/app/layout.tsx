import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bleepsandbloops.com"),
  title: "Bleeps and Bloops",
  description:
    "James Hall’s agentic software factory. Bleeps does the work. Bloops are the shipped pull requests, features, and outputs that come out. Being built now.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bleeps and Bloops",
    description:
      "Bleeps does the work. Bloops are what come out. James Hall’s ticket-to-merge factory, being built now.",
    url: "https://bleepsandbloops.com",
    siteName: "Bleeps and Bloops",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
