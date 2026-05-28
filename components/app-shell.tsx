"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, Brain, Gauge, HeartPulse, Home, LayoutDashboard, Map, Menu, Smartphone, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useMonitoringStore } from "@/store/monitoring-store";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: Activity },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/floorplan", label: "Floorplan", icon: Map },
  { href: "/caregiver", label: "Caregiver", icon: Users },
  { href: "/devices", label: "Devices", icon: Smartphone }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inference = useMonitoringStore((state) => state.inference);
  const alerts = useMonitoringStore((state) => state.alerts);
  const unread = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card/88 backdrop-blur xl:block">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center gap-3 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Aegis Home AI</p>
              <p className="text-xs text-muted-foreground">Predictive elderly wellness</p>
            </div>
          </div>
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto p-4">
            <div className="rounded-lg border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Brain className="h-4 w-4 text-primary" />
                Edge AI pipeline
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
                <span className="rounded-md bg-secondary p-2">Sensor</span>
                <span className="rounded-md bg-secondary p-2">Features</span>
                <span className="rounded-md bg-secondary p-2">Risk</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/86 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Button className="xl:hidden" variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Condo 12A · Bangkok</p>
              <h1 className="text-lg font-semibold md:text-xl">Elderly Fall Risk Monitoring</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm md:flex">
              <motion.span
                className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
              Live inference · {Math.round(inference.features.confidence)}%
            </div>
            <Link href="/alerts" className="relative">
              <Button variant="outline" size="icon" aria-label="Open alerts">
                <Bell className="h-4 w-4" />
              </Button>
              {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{unread}</span>}
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-6 border-t bg-card/94 backdrop-blur xl:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground", active && "text-primary")}>
              <Icon className="h-4 w-4" />
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
