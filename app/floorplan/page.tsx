"use client";

import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function FloorplanMonitoringPage() {
  const { alerts, insights, heatPoints, livePosition, nightMode, toggleNightMode } =
    useMonitoringStore();

  return (
    <div className="grid gap-5 xl:grid-cols-[1.55fr_.75fr]">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Floorplan Monitoring</CardTitle>
            <p className="mt-1 text-sm text-slate-300">
              SVG condo map with live path playback, risk heatmap, and near-fall markers.
            </p>
          </div>
          <button
            onClick={toggleNightMode}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
          >
            {nightMode ? "Day view" : "Night view"}
          </button>
        </CardHeader>
        <CardContent>
          <CondoFloorplanMap className="min-h-[690px]" detailed />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Indoor Coordinates</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Room" value={livePosition.room} />
            <Metric label="Risk" value={`${Math.round(livePosition.fall_risk)}%`} />
            <Metric label="X" value={livePosition.x.toFixed(0)} />
            <Metric label="Y" value={livePosition.y.toFixed(0)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Risk Zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {heatPoints.slice(0, 6).map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] p-3"
              >
                <div>
                  <div className="font-medium">{point.room}</div>
                  <div className="text-xs text-slate-400">{point.id.replace("-", " ")}</div>
                </div>
                <Badge variant={point.intensity > 80 ? "danger" : "warning"}>
                  {Math.round(point.intensity)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <RealtimeAlertPanel alerts={alerts.slice(0, 4)} />
        {insights.slice(0, 2).map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
