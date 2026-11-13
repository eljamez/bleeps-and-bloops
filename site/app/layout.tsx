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
  title: {
    default: "Bleeps and Bloops",
    template: "%s · Bleeps and Bloops",
  },
  description:
    "Bleeps runs the crew and gets the work done, on the Orca agent harness. Bloops merges pull requests and studies each run. Start a new project or add it to one you have.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bleeps and Bloops",
    description:
      "Bleeps runs the crew and gets the work done, on the Orca agent harness. Bloops merges pull requests and studies each run.",
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
