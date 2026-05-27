"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function HistoricalPlaybackPage() {
  const { readings, playbackIndex, setPlaybackIndex } = useMonitoringStore();
  const [playing, setPlaying] = useState(false);
  const max = Math.max(0, readings.length - 1);
  const active = readings[playbackIndex] ?? readings[readings.length - 1];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setPlaybackIndex(playbackIndex >= max ? 0 : playbackIndex + 1);
    }, 650);
    return () => window.clearInterval(timer);
  }, [playing, playbackIndex, max, setPlaybackIndex]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Historical Movement Playback</CardTitle>
            <p className="mt-1 text-sm text-slate-300">
              Replay movement history with room risk and gait instability overlays.
            </p>
          </div>
          <Badge variant={active?.near_fall ? "danger" : "soft"}>
            {active?.timestamp ?? "live"}
          </Badge>
        </CardHeader>
        <CardContent>
          <CondoFloorplanMap className="min-h-[650px]" playbackIndex={playbackIndex} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Playback Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-2">
            <button
              onClick={() => setPlaying((value) => !value)}
              className="flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => setPlaybackIndex(0)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm"
              aria-label="Reset playback"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={max}
            value={playbackIndex}
            onChange={(event) => setPlaybackIndex(Number(event.target.value))}
            className="w-full accent-cyan-300"
          />

          {active && (
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Room" value={active.room} />
              <Metric label="Risk" value={`${Math.round(active.fall_risk)}%`} />
              <Metric label="Gait speed" value={`${active.gait_speed.toFixed(2)} m/s`} />
              <Metric label="Sway" value={`${active.sway.toFixed(2)} deg`} />
              <Metric label="Cadence" value={`${Math.round(active.cadence)} spm`} />
              <Metric label="Turn velocity" value={`${active.turning_velocity.toFixed(1)} deg/s`} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
