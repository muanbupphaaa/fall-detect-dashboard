"use client";

import { motion } from "framer-motion";
import { Cpu, DatabaseZap, Radio, ShieldCheck } from "lucide-react";
import { SensorStatus } from "@/components/sensor-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function DevicesPage() {
  const current = useMonitoringStore((state) => state.currentReading);
  const inference = useMonitoringStore((state) => state.inference);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <SensorStatus />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live IMU packet</CardTitle>
            <CardDescription>Simulated accelerometer and gyroscope stream</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["ax", current.ax],
              ["ay", current.ay],
              ["az", current.az],
              ["gx", current.gx],
              ["gy", current.gy],
              ["gz", current.gz]
            ].map(([key, value]) => (
              <div key={key} className="rounded-lg border bg-background p-4">
                <p className="text-xs uppercase text-muted-foreground">{key}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mock AI backend layer</CardTitle>
            <CardDescription>Deploy-ready local inference simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Sensor stream", value: "2.6s interval", icon: Radio },
              { label: "Feature extraction", value: "gait variability, sway, cadence", icon: DatabaseZap },
              { label: "AI inference", value: inference.state, icon: Cpu },
              { label: "Privacy mode", value: "No camera dependency", icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <Badge>{item.value}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
