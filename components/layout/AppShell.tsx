"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BrainCircuit,
  Home,
  Map,
  PlayCircle,
  Router,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { CaregiverNotificationDrawer } from "@/components/CaregiverNotificationDrawer";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { useMockWebSocket } from "@/hooks/useMockWebSocket";
import { useMonitoringStore } from "@/store/monitoring-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/floorplan", label: "Floorplan", icon: Map },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/caregiver", label: "Caregiver", icon: UserRound },
  { href: "/devices", label: "Devices", icon: Router },
  { href: "/playback", label: "Playback", icon: PlayCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  useMockWebSocket();
  const pathname = usePathname();
  const { metrics, livePosition, alerts, openNotifications } = useMonitoringStore();
  const pageTitle = nav.find((item) => item.href === pathname)?.label ?? "Dashboard";
  const critical = alerts.some(
    (alert) => !alert.acknowledged && ["high", "emergency"].includes(alert.severity),
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/75 p-4 backdrop-blur-2xl lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300 text-slate-950 shadow-glow">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold leading-tight">AegisCare Home</div>
            <div className="text-xs text-slate-400">Ambient fall intelligence</div>
          </div>
        </Link>

        <nav className="mt-7 space-y-1">
          {nav.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-cyan-300/14 text-cyan-100"
                    : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="active-nav-dot"
                    className="ml-auto h-2 w-2 rounded-full bg-cyan-300"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <Activity className="h-4 w-4" />
            Edge AI pipeline
          </div>
          <div className="mt-3 space-y-2 text-xs text-slate-400">
            <div>Sensor stream to feature extraction</div>
            <div>Gait analysis to risk prediction</div>
            <div>Caregiver alert routing active</div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
          <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                AI elderly wellness monitoring
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 md:block">
                Resident: <span className="text-slate-50">Somchai K.</span> ·{" "}
                {livePosition.room}
              </div>
              <div className="hidden rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 sm:block">
                Risk: <span className={critical ? "text-rose-200" : "text-emerald-200"}>{metrics.riskScore}%</span>
              </div>
              <LiveMonitoringBadge />
              <button
                onClick={openNotifications}
                className="relative rounded-lg border border-white/10 bg-white/[0.045] p-2.5 text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                aria-label="Open caregiver notifications"
              >
                <Bell className="h-4 w-4" />
                {critical && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-400" />}
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 lg:px-6">{children}</div>
      </main>

      <CaregiverNotificationDrawer floating />
    </div>
  );
}
