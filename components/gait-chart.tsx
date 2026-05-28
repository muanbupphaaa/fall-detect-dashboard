"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";
import { formatTime } from "@/lib/utils";

export function GaitChart() {
  const readings = useMonitoringStore((state) => state.readings);
  const data = readings.slice(-20).map((reading) => ({
    time: formatTime(new Date(reading.timestamp)),
    sway: Math.round(reading.sway * 100),
    cadence: reading.cadence,
    speed: Math.round(reading.gait_speed * 100)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI gait signal stream</CardTitle>
        <CardDescription>Mock IMU-derived cadence, sway amplitude, and walking speed</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="cadence" stroke="#0891b2" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sway" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
