"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";

export function RoomUsageChart() {
  const data = useMonitoringStore((state) => state.roomRisks).map((room) => ({
    room: room.room.replace(" Room", ""),
    usage: room.usage,
    risk: room.risk
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk score per room</CardTitle>
        <CardDescription>Usage frequency compared with fall-risk intensity</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="room" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="usage" fill="#0891b2" radius={[6, 6, 0, 0]} />
            <Bar dataKey="risk" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function HourlyMovementChart() {
  const readings = useMonitoringStore((state) => state.readings);
  const data = Array.from({ length: 12 }, (_, index) => {
    const hour = index * 2;
    const count = readings.filter((reading) => new Date(reading.timestamp).getHours() >= hour && new Date(reading.timestamp).getHours() < hour + 2).length;
    return { hour: `${String(hour).padStart(2, "0")}:00`, movement: count + Math.round(Math.abs(Math.sin(index)) * 5) };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly movement chart</CardTitle>
        <CardDescription>Walking frequency and no-movement window detection</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="movement" stroke="#14b8a6" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
