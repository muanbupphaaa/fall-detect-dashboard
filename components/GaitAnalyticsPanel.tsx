"use client";

import { Activity, Footprints, Gauge, RotateCcw, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorReading } from "@/lib/types";

export function GaitAnalyticsPanel({
  latest,
  expanded,
}: {
  latest?: SensorReading;
  expanded?: boolean;
}) {
  const values = [
    { label: "Gait speed", value: `${latest?.gait_speed.toFixed(2) ?? "0.82"} m/s`, icon: Footprints },
    { label: "Sway", value: `${latest?.sway.toFixed(2) ?? "3.10"} deg`, icon: Waves },
    { label: "Cadence", value: `${Math.round(latest?.cadence ?? 92)} spm`, icon: Activity },
    { label: "Turn velocity", value: `${latest?.turning_velocity.toFixed(1) ?? "68.0"} deg/s`, icon: RotateCcw },
    { label: "Instability", value: `${Math.round(latest?.instability_score ?? 44)}%`, icon: Gauge },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gait Analytics Panel</CardTitle>
        <p className="text-sm text-slate-400">
          Feature extraction from IMU acceleration, gyroscope drift, cadence, sway, and room context.
        </p>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-3 ${expanded ? "md:grid-cols-5" : "md:grid-cols-3 xl:grid-cols-5"}`}>
          {values.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <item.icon className="h-5 w-5 text-cyan-300" />
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
