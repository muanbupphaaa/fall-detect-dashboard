"use client";

import { Activity, BatteryMedium, RadioTower, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";

export function SensorStatus() {
  const current = useMonitoringStore((state) => state.currentReading);
  const sensors = [
    { label: "Bedroom mmWave", value: "Online", icon: Wifi },
    { label: "Bathroom IMU node", value: current.room === "Bathroom" ? "Streaming" : "Ready", icon: RadioTower },
    { label: "Edge hub", value: "28 ms", icon: Activity },
    { label: "Wearable battery", value: "82%", icon: BatteryMedium }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device status</CardTitle>
        <CardDescription>Ambient monitoring nodes and wearable telemetry</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div key={sensor.label} className="flex items-center justify-between rounded-lg border bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{sensor.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{sensor.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
