"use client";

import { BatteryCharging, Cpu, Router, Smartphone, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const devices = [
  { name: "Wearable IMU band", icon: Smartphone, battery: 86, latency: "18 ms", status: "streaming" },
  { name: "Bathroom mmWave sensor", icon: Wifi, battery: 100, latency: "24 ms", status: "online" },
  { name: "Hallway edge gateway", icon: Router, battery: 100, latency: "12 ms", status: "online" },
  { name: "Edge AI fall model", icon: Cpu, battery: 100, latency: "31 ms", status: "inference active" },
];

export default function DeviceStatusPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {devices.map((device) => (
          <Card key={device.name}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <device.icon className="h-5 w-5 text-cyan-300" />
                <Badge variant="safe">{device.status}</Badge>
              </div>
              <div className="mt-5 font-semibold">{device.name}</div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span className="flex items-center gap-1"><BatteryCharging className="h-4 w-4" /> {device.battery}%</span>
                <span>{device.latency}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Edge AI Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            {["IMU stream", "Feature extraction", "Gait model", "Risk predictor", "Caregiver alert"].map((step, index) => (
              <div key={step} className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">Stage {index + 1}</div>
                <div className="mt-2 font-semibold">{step}</div>
                <p className="mt-2 text-sm text-slate-400">
                  {index === 0 && "Sensor fusion from wearable and ambient home sensors."}
                  {index === 1 && "Cadence, sway, acceleration variance, and turn features."}
                  {index === 2 && "Abnormal gait and fatigue pattern classification."}
                  {index === 3 && "Room-aware risk scoring with nighttime weighting."}
                  {index === 4 && "Severity triage for family and care teams."}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
