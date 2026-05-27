"use client";

import { HeartPulse, Home, Phone, ShieldCheck } from "lucide-react";
import { AIInsightCard } from "@/components/AIInsightCard";
import { CaregiverNotificationDrawer } from "@/components/CaregiverNotificationDrawer";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function CaregiverPage() {
  const { alerts, insights, metrics, roomRisks } = useMonitoringStore();

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        <RiskScoreCard label="Resident Status" value={92} icon={HeartPulse} detail="Stable, monitored" tone="safe" />
        <RiskScoreCard label="Care Response" value={86} icon={Phone} detail="Family + aide online" tone="care" />
        <RiskScoreCard label="Home Safety" value={metrics.stabilityScore} icon={Home} detail="Condo risk posture" tone="warning" />
        <RiskScoreCard label="Edge AI Uptime" value={99} icon={ShieldCheck} detail="On-device inference" tone="safe" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Care Circle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Daughter - primary caregiver", "Building concierge", "Home health aide", "Telehealth nurse"].map((person, index) => (
                <div key={person} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <span>{person}</span>
                  <span className={index < 2 ? "text-emerald-300" : "text-slate-400"}>
                    {index < 2 ? "available" : "standby"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <RealtimeAlertPanel alerts={alerts.slice(0, 4)} />
        </div>

        <div className="space-y-4">
          <CaregiverNotificationDrawer />
          <div className="grid gap-4 md:grid-cols-2">
            {insights.slice(0, 4).map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Room Safety Notes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {roomRisks.map((room) => (
                <div key={room.room} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="font-medium">{room.room}</div>
                  <p className="mt-1 text-sm text-slate-400">
                    {room.risk > 70
                      ? "Review lighting, wet surfaces, and turn clearance."
                      : "Normal activity with ambient monitoring active."}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
