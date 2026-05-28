"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { WalkingPathMap } from "@/components/walking-path-map";
import { RoomUsageChart } from "@/components/analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMonitoringStore } from "@/store/monitoring-store";
import { formatTime } from "@/lib/utils";

export default function FloorplanPage() {
  const readings = useMonitoringStore((state) => state.readings);
  const playbackIndex = useMonitoringStore((state) => state.playbackIndex);
  const setPlaybackIndex = useMonitoringStore((state) => state.setPlaybackIndex);
  const active = readings[playbackIndex];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <WalkingPathMap />
        <Card>
          <CardHeader>
            <CardTitle>Historical playback</CardTitle>
            <CardDescription>Replay room transitions and risk hotspots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg bg-secondary/60 p-4">
              <p className="text-sm text-muted-foreground">Selected moment</p>
              <p className="mt-1 text-2xl font-semibold">{formatTime(new Date(active.timestamp))}</p>
              <p className="text-sm text-muted-foreground">{active.room} · risk {active.fall_risk}</p>
            </div>
            <input
              aria-label="Playback timeline"
              className="w-full accent-teal-600"
              type="range"
              min={0}
              max={readings.length - 1}
              value={playbackIndex}
              onChange={(event) => setPlaybackIndex(Number(event.target.value))}
            />
            <div className="flex gap-2">
              <Button size="icon" variant="outline" aria-label="Pause playback"><Pause className="h-4 w-4" /></Button>
              <Button size="icon" aria-label="Play playback"><Play className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2 text-sm">
              <p>Most frequent corridor: Bedroom to Hallway to Living Room</p>
              <p>Highest hazard cluster: Bathroom doorway and nighttime turns</p>
              <p>Prediction rule: sway + reduced speed + room hazard bias</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <RoomUsageChart />
    </motion.div>
  );
}
