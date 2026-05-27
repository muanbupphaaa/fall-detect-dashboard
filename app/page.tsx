"use client";

import { AlertTriangle, Footprints, ShieldAlert } from "lucide-react";
import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { AIInsightCard } from "@/components/AIInsightCard";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { MobilityTrendChart } from "@/components/charts/MobilityTrendChart";
import { StabilityChart } from "@/components/charts/StabilityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function MainDashboardPage() {
  const {
    alerts,
    insights,
    metrics,
    roomRisks,
    trendData,
  } = useMonitoringStore();

  const topRooms = [...roomRisks].sort((a, b) => b.risk - a.risk).slice(0, 3);
  const primaryInsight = insights[0];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm text-slate-400">Today summary</div>
            <h2 className="mt-1 text-2xl font-semibold">
              {metrics.riskScore >= 70
                ? "Needs caregiver attention"
                : metrics.riskScore >= 50
                  ? "Moderate fall risk, monitor closely"
                  : "Stable, continue monitoring"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Focus areas are {topRooms.map((room) => room.room).join(", ")}.
              The map shows only the latest movement path and key risk zones.
            </p>
          </div>
          <LiveMonitoringBadge />
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Live Condo Map</CardTitle>
              <p className="mt-1 text-sm text-slate-300">
                Latest walking path, live location, and high-risk zones.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <CondoFloorplanMap className="min-h-[520px]" compact />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <RiskScoreCard
              label="Fall Risk"
              value={metrics.riskScore}
              icon={ShieldAlert}
              tone="risk"
              detail="Predictive 24h risk"
            />
            <RiskScoreCard
              label="Mobility"
              value={metrics.mobilityScore}
              icon={Footprints}
              tone="safe"
              detail="Adaptive gait score"
            />
            <RiskScoreCard
              label="Near-Falls"
              value={metrics.nearFallCount}
              icon={AlertTriangle}
              tone="warning"
              detail="Last 24 hours"
              max={10}
            />
          </div>

          <RealtimeAlertPanel alerts={alerts.slice(0, 3)} />

          <Card>
            <CardHeader>
              <CardTitle>Top Risk Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topRooms.map((room, index) => (
                <div
                  key={room.room}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "danger" : "soft"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{room.room}</span>
                    </div>
                    <span className="text-sm text-slate-300">{room.risk}% risk</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500"
                      style={{ width: `${room.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        {primaryInsight && <AIInsightCard insight={primaryInsight} />}
        <Card>
          <CardHeader>
            <CardTitle>What To Watch</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              Bathroom and hallway turns are the main risk points.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              Night walking has higher instability than daytime movement.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              Use Alerts and Analytics for detailed history.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <MobilityTrendChart data={trendData} />
        <StabilityChart data={trendData} />
      </section>
    </div>
  );
}
