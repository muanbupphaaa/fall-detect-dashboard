"use client";

import { Activity, BarChart3, Gauge, RotateCcw } from "lucide-react";
import { GaitAnalyticsPanel } from "@/components/GaitAnalyticsPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { MobilityTrendChart } from "@/components/charts/MobilityTrendChart";
import { RoomUsageChart } from "@/components/charts/RoomUsageChart";
import { StabilityChart } from "@/components/charts/StabilityChart";
import { AnalyticsGrid } from "@/components/charts/AnalyticsGrid";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function AnalyticsPage() {
  const { metrics, trendData, roomUsageData, hourlyActivityData, gaitData, readings } =
    useMonitoringStore();

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        <RiskScoreCard label="Daily Walks" value={metrics.walkCount} icon={Activity} max={90} detail="Route segments" tone="care" />
        <RiskScoreCard label="Heat Intensity" value={metrics.heatIntensity} icon={BarChart3} detail="Weighted density" tone="warning" />
        <RiskScoreCard label="Stability" value={metrics.stabilityScore} icon={Gauge} detail="Lower sway is better" tone="safe" />
        <RiskScoreCard label="Turn Control" value={metrics.turningScore} icon={RotateCcw} detail="Turning recovery" tone="risk" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <MobilityTrendChart data={trendData} />
        <StabilityChart data={trendData} />
        <RoomUsageChart data={roomUsageData} />
      </section>

      <AnalyticsGrid
        hourlyActivityData={hourlyActivityData}
        gaitData={gaitData}
        trendData={trendData}
        roomUsageData={roomUsageData}
      />

      <GaitAnalyticsPanel latest={readings[readings.length - 1]} expanded />
    </div>
  );
}
