import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Momentum OS — AI Personal Operating System",
  description: "Understand yesterday, optimize today, improve tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
