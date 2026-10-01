import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Manrope } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

// Serif used only for the "Bridgeon Assets" wordmark, matching the brand logo.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-brand"
});

export const metadata: Metadata = {
  title: "Bridgeon Assets",
  description: "Exclusive insolvency assets from across Europe — search, compare, and connect with trusted sellers in one place."
};

export const viewport: Viewport = {
  themeColor: "#00183E"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} ${cormorant.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
