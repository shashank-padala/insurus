import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insurus - Protect Your Home. Earn Rewards.",
  description: "Complete monthly safety checks, submit photo proof, and earn blockchain-verified rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
