import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stealthy Note — Say it in confidence",
  description:
    "A private, anonymous inbox for honest messages from the people in your life.",
  verification: {
    google: "AoaeHK9zvWlwoVddrUwAZTdUnhvLSaVI-noEC53DjQY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
