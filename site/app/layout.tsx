import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible, Fraunces, Nunito } from "next/font/google";
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

const nunito = Nunito({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bleepsandbloops.com"),
  title: "Bleeps and Bloops",
  description:
    "James Hall’s agentic software factory. Bleeps runs the crew. Bloops merges and reflects. Being built now.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bleeps and Bloops",
    description:
      "Bleeps runs the crew. Bloops merges and reflects. James Hall’s ticket-to-merge factory, being built now.",
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
    <html lang="en" className={`${fraunces.variable} ${atkinson.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
