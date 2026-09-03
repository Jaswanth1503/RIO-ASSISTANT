import type { Metadata } from "next";
import "./globals.css";
import RioWidget from "@/components/chat/RioWidget";

export const metadata: Metadata = {
  title: "Annu Jaswanth | AI & Full Stack Developer (Represented by RIO)",
  description:
    "Official portfolio of Annu Jaswanth, featuring RIO—his production-grade AI Representative, sales consultant, and lead qualification agent.",
  keywords: [
    "Annu Jaswanth",
    "RIO AI",
    "AI Representative",
    "Full Stack Developer",
    "AI Agent",
    "Next.js 15",
    "Gemini 2.5",
    "Veera RMC",
    "PestRisk",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        {children}
        {/* Floating RIO Chat Widget */}
        <RioWidget />
      </body>
    </html>
  );
}
