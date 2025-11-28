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
  title: {
    default: "Insurus - Protect Your Home. Earn Rewards.",
    template: "%s | Insurus",
  },
  description: "Complete monthly safety checks, submit photo proof, and earn blockchain-verified rewards. Protect2Earn platform powered by AI verification and VeChain blockchain.",
  keywords: ["home safety", "Protect2Earn", "blockchain rewards", "VeChain", "AI verification", "home maintenance", "safety tasks", "insurance discounts"],
  authors: [{ name: "Insurus" }],
  creator: "Insurus",
  publisher: "Insurus",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://insurus.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://insurus.vercel.app",
    siteName: "Insurus",
    title: "Insurus - Protect Your Home. Earn Rewards.",
    description: "Complete monthly safety checks, submit photo proof, and earn blockchain-verified rewards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurus - Protect Your Home. Earn Rewards.",
    description: "Complete monthly safety checks, submit photo proof, and earn blockchain-verified rewards.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
