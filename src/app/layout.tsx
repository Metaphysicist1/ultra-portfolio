import type { Metadata } from "next";
import { Inter, Syncopate, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Edgar Abasov | AI Engineer",
  description:
    "AI Engineer & Data Scientist specializing in Multi-Agent Systems, RAG, and Cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syncopate.variable} ${spaceMono.variable} font-body antialiased bg-background`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <div className="fixed inset-0 z-[9999] pointer-events-none quantum-noise opacity-20" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
