"use client";

import { Activity, Brain, Footprints, ShieldAlert } from "lucide-react";
import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { AIInsightCard } from "@/components/AIInsightCard";
import { GaitAnalyticsPanel } from "@/components/GaitAnalyticsPanel";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { MobilityTrendChart } from "@/components/charts/MobilityTrendChart";
import { RoomUsageChart } from "@/components/charts/RoomUsageChart";
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
    readings,
    trendData,
    roomUsageData,
  } = useMonitoringStore();

  const topRooms = [...roomRisks].sort((a, b) => b.risk - a.risk).slice(0, 4);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.45fr_.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Condo Ambient Fall-Risk Map</CardTitle>
              <p className="mt-1 text-sm text-slate-300">
                Live indoor trajectory, risk zones, gait instability, and room density.
              </p>
            </div>
            <LiveMonitoringBadge />
          </CardHeader>
          <CardContent>
            <CondoFloorplanMap className="min-h-[560px]" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              icon={Activity}
              tone="warning"
              detail="Last 24 hours"
              max={10}
            />
            <RiskScoreCard
              label="AI Confidence"
              value={metrics.aiConfidence}
              icon={Brain}
              tone="care"
              detail="Sensor fusion model"
            />
          </div>

          <RealtimeAlertPanel alerts={alerts.slice(0, 5)} />

          <Card>
            <CardHeader>
              <CardTitle>Room Risk Ranking</CardTitle>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          {insights.slice(0, 3).map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        <GaitAnalyticsPanel latest={readings[readings.length - 1]} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <MobilityTrendChart data={trendData} />
        <StabilityChart data={trendData} />
        <RoomUsageChart data={roomUsageData} />
      </section>
    </div>
  );
}
