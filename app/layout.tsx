import type { Metadata } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppShell } from "@/components/app-shell";
import { RealtimeProvider } from "@/components/realtime-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis Home AI | Elderly Fall Risk Monitoring",
  description: "AI-powered smart-home dashboard for elderly fall risk, gait instability, and caregiver alerts."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <RealtimeProvider>
            <AppShell>{children}</AppShell>
          </RealtimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
