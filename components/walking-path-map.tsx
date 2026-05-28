"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";
import type { Room } from "@/lib/types";

const rooms: Array<{ name: Room; x: number; y: number; w: number; h: number }> = [
  { name: "Bedroom", x: 8, y: 8, w: 34, h: 38 },
  { name: "Bathroom", x: 8, y: 52, w: 24, h: 36 },
  { name: "Hallway", x: 36, y: 48, w: 22, h: 40 },
  { name: "Kitchen", x: 62, y: 8, w: 30, h: 32 },
  { name: "Living Room", x: 48, y: 46, w: 44, h: 42 }
];

const points: Record<Room, { x: number; y: number }> = {
  Bedroom: { x: 25, y: 27 },
  Bathroom: { x: 20, y: 70 },
  Kitchen: { x: 77, y: 24 },
  "Living Room": { x: 70, y: 67 },
  Hallway: { x: 47, y: 67 }
};

function riskColor(risk: number) {
  if (risk > 72) return "rgba(239,68,68,0.64)";
  if (risk > 48) return "rgba(245,158,11,0.58)";
  return "rgba(16,185,129,0.52)";
}

export function WalkingPathMap({ compact = false }: { compact?: boolean }) {
  const readings = useMonitoringStore((state) => state.readings);
  const current = useMonitoringStore((state) => state.currentReading);
  const roomRisks = useMonitoringStore((state) => state.roomRisks);
  const latestPath = readings.slice(-9).map((reading) => points[reading.room]);
  const pathD = latestPath.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <Card className={compact ? "h-full" : ""}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Interactive condo floorplan</CardTitle>
          <CardDescription>Heat intensity, walking path frequency, and near-fall locations</CardDescription>
        </div>
        <Badge variant={current.fall_risk > 76 ? "high" : current.fall_risk > 52 ? "medium" : "low"}>{current.room}</Badge>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-lg border bg-secondary/30 p-3 health-grid">
          <svg viewBox="0 0 100 96" className="aspect-[1.38/1] w-full">
            <defs>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
            </defs>
            {rooms.map((room) => {
              const risk = roomRisks.find((item) => item.room === room.name)?.risk ?? 20;
              const point = points[room.name];
              return (
                <g key={room.name}>
                  <rect x={room.x} y={room.y} width={room.w} height={room.h} rx="2" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.7" />
                  <circle cx={point.x} cy={point.y} r={risk / 6 + 5} fill={riskColor(risk)} filter="url(#softGlow)" />
                  <text x={room.x + 3} y={room.y + 7} className="fill-foreground text-[3.4px] font-semibold">
                    {room.name}
                  </text>
                  <text x={room.x + 3} y={room.y + 13} className="fill-muted-foreground text-[2.8px]">
                    Risk {risk}
                  </text>
                </g>
              );
            })}
            <path d="M 25 27 C 38 35, 40 55, 47 67 S 63 72, 70 67 S 70 38, 77 24" fill="none" stroke="rgba(20,184,166,0.36)" strokeWidth="5" strokeLinecap="round" />
            <motion.path d={pathD} fill="none" stroke="rgb(20,184,166)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }} />
            {readings.filter((reading) => reading.near_fall).slice(-5).map((reading, index) => {
              const point = points[reading.room];
              return <circle key={`${reading.timestamp}-${index}`} cx={point.x + index * 0.9} cy={point.y - index * 0.6} r="2.2" fill="rgb(239,68,68)" stroke="white" strokeWidth="0.7" />;
            })}
            <motion.circle cx={points[current.room].x} cy={points[current.room].y} r="2.3" fill="rgb(8,145,178)" animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          </svg>
        </div>
        {!compact && (
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-md bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">Green safe gait corridor</div>
            <div className="rounded-md bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">Yellow medium risk turns</div>
            <div className="rounded-md bg-red-500/10 p-3 text-red-700 dark:text-red-300">Red near-fall clusters</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
