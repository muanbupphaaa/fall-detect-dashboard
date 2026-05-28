"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";
import { formatTime } from "@/lib/utils";

export function StabilityTrendChart() {
  const readings = useMonitoringStore((state) => state.readings);
  const data = readings.slice(-18).map((reading) => ({
    time: formatTime(new Date(reading.timestamp)),
    stability: Math.max(0, 100 - reading.fall_risk),
    risk: reading.fall_risk
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stability trend over time</CardTitle>
        <CardDescription>Continuous gait stability compared with inferred fall risk</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="stability" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
            <Area type="monotone" dataKey="stability" stroke="#14b8a6" fill="url(#stability)" strokeWidth={2} />
            <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="url(#risk)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
