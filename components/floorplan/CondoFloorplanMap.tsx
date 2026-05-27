"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Bath, BedDouble, ChefHat, DoorOpen, Sofa, Trees, Waves } from "lucide-react";
import { NearFallMarker } from "@/components/floorplan/NearFallMarker";
import { WalkingTrailLayer } from "@/components/floorplan/WalkingTrailLayer";
import { baselinePath, rooms } from "@/data/floorplan";
import { RoomName } from "@/lib/types";
import { cn, formatClock, riskColor } from "@/lib/utils";
import { useMonitoringStore } from "@/store/monitoring-store";

const roomIcons: Record<RoomName, typeof BedDouble> = {
  Bedroom: BedDouble,
  Bathroom: Bath,
  Kitchen: ChefHat,
  "Living Room": Sofa,
  Hallway: DoorOpen,
  Balcony: Trees,
};

export function CondoFloorplanMap({
  className,
  detailed,
  compact,
  playbackIndex,
}: {
  className?: string;
  detailed?: boolean;
  compact?: boolean;
  playbackIndex?: number;
}) {
  const {
    readings,
    livePosition,
    roomRisks,
    nightMode,
  } = useMonitoringStore();
  const [hoveredRoom, setHoveredRoom] = useState<RoomName | null>(null);
  const activeReading =
    typeof playbackIndex === "number"
      ? readings[Math.min(playbackIndex, readings.length - 1)] ?? livePosition
      : livePosition;
  const recentReadings = useMemo(() => readings.slice(compact ? -10 : -18), [compact, readings]);
  const trail = useMemo(
    () =>
      recentReadings.length > 3
        ? recentReadings.map((reading) => ({
            x: reading.x,
            y: reading.y,
            at: formatClock(reading.timestamp),
            risk: reading.fall_risk,
          }))
        : baselinePath,
    [recentReadings],
  );
  const nearFalls = readings.filter((reading) => reading.near_fall).slice(compact ? -3 : -5);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/50 p-2 map-grid",
        nightMode && "bg-indigo-950/50",
        className,
      )}
    >
      <svg
        viewBox="0 0 724 488"
        className="h-full min-h-[inherit] w-full"
        role="img"
        aria-label="Realistic condominium indoor floorplan monitoring map"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity=".28" />
          </filter>
          <pattern id="wood" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 8 H24 M0 16 H24" stroke="rgba(148,163,184,.08)" />
            <path d="M12 0 V24" stroke="rgba(148,163,184,.035)" />
          </pattern>
          <pattern id="tile" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="rgba(226,232,240,.10)" />
          </pattern>
          <pattern id="balcony-lines" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 14 L14 0" stroke="rgba(125,211,252,.12)" />
          </pattern>
        </defs>

        <rect x="20" y="24" width="684" height="432" rx="18" fill="#07161c" filter="url(#soft-shadow)" />
        <rect x="42" y="44" width="518" height="386" rx="4" fill="url(#wood)" />
        <rect x="560" y="88" width="122" height="320" rx="3" fill="url(#balcony-lines)" />

        {rooms.map((room) => {
          const Icon = roomIcons[room.name];
          const risk = roomRisks.find((item) => item.room === room.name)?.risk ?? 35;
          const active = hoveredRoom === room.name || activeReading.room === room.name;

          return (
            <motion.g
              key={room.name}
              onMouseEnter={() => setHoveredRoom(room.name)}
              onMouseLeave={() => setHoveredRoom(null)}
              initial={false}
              animate={{ opacity: active ? 1 : 0.88 }}
            >
              <motion.path
                d={room.d}
                fill={
                  room.name === "Bathroom"
                    ? "url(#tile)"
                    : room.name === "Balcony"
                      ? "rgba(8, 47, 73, .42)"
                      : "rgba(15, 37, 47, .82)"
                }
                stroke={active ? riskColor(risk) : "rgba(226,232,240,.22)"}
                strokeWidth={active ? 2.4 : 1.2}
                animate={{
                  filter: active ? "drop-shadow(0 0 14px rgba(34,211,238,.38))" : "none",
                }}
              />
              <motion.path
                d={room.d}
                fill={riskColor(risk)}
                initial={false}
                animate={{
                  opacity: active ? roomHeatOpacity(risk) + 0.1 : roomHeatOpacity(risk),
                }}
                style={{ mixBlendMode: "screen" }}
              />
              <foreignObject x={room.label.x} y={room.label.y - 18} width="168" height="40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                  <Icon className="h-4 w-4 text-cyan-200" />
                  <span>{room.name}</span>
                </div>
              </foreignObject>
              {detailed && (
                <text x={room.label.x} y={room.label.y + 18} className="fill-slate-400 text-[10px]">
                  risk {Math.round(risk)}% - density{" "}
                  {roomRisks.find((item) => item.room === room.name)?.activity ?? 30}%
                </text>
              )}
            </motion.g>
          );
        })}

        <ArchitecturalDetails />
        <WalkingTrailLayer points={trail} compact={compact} />

        {nearFalls.map((reading) => (
          <NearFallMarker key={reading.timestamp} reading={reading} />
        ))}

        <motion.g
          animate={{ x: activeReading.x, y: activeReading.y }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <motion.circle
            r="18"
            fill="rgba(34,211,238,.18)"
            animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0.08, 0.35] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <circle r="7" fill="#67e8f9" stroke="#082f49" strokeWidth="3" />
          <text x="14" y="-14" className="fill-cyan-100 text-[11px] font-semibold">
            live
          </text>
        </motion.g>

        <RiskLegend />
      </svg>

      {hoveredRoom && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm shadow-glow backdrop-blur">
          <span className="font-medium">{hoveredRoom}</span>
          <span className="ml-2 text-slate-400">
            {roomRisks.find((room) => room.room === hoveredRoom)?.risk}% fall risk
          </span>
        </div>
      )}
    </div>
  );
}

function roomHeatOpacity(risk: number) {
  if (risk >= 82) return 0.5;
  if (risk >= 62) return 0.4;
  if (risk >= 42) return 0.3;
  return 0.2;
}

function ArchitecturalDetails() {
  return (
    <g>
      <path d="M42 44 H560 V88 H682 V408 H560 V430 H42 Z" fill="none" stroke="#dbeafe" strokeOpacity=".62" strokeWidth="8" />
      <path d="M298 44 V210 H330 V430" stroke="#dbeafe" strokeOpacity=".58" strokeWidth="7" />
      <path d="M42 256 H188 M188 256 H330 M330 256 H560" stroke="#dbeafe" strokeOpacity=".58" strokeWidth="7" />
      <path d="M188 256 V430" stroke="#dbeafe" strokeOpacity=".58" strokeWidth="7" />
      <path d="M560 128 H682 M560 196 H682 M560 264 H682 M560 332 H682" stroke="#7dd3fc" strokeOpacity=".18" strokeWidth="2" />

      <path d="M188 292 A42 42 0 0 0 230 250" fill="none" stroke="#e0f2fe" strokeOpacity=".38" strokeWidth="2" />
      <path d="M330 304 A48 48 0 0 1 282 256" fill="none" stroke="#e0f2fe" strokeOpacity=".38" strokeWidth="2" />
      <path d="M560 254 A52 52 0 0 0 508 202" fill="none" stroke="#e0f2fe" strokeOpacity=".38" strokeWidth="2" />
      <path d="M298 210 A48 48 0 0 1 250 258" fill="none" stroke="#e0f2fe" strokeOpacity=".38" strokeWidth="2" />

      <rect x="66" y="74" width="108" height="76" rx="10" fill="#1e293b" stroke="#94a3b8" strokeOpacity=".28" />
      <rect x="76" y="84" width="88" height="28" rx="6" fill="#334155" />
      <rect x="214" y="74" width="58" height="132" rx="7" fill="#172033" stroke="#94a3b8" strokeOpacity=".22" />
      <rect x="68" y="330" width="72" height="48" rx="24" fill="#0f2e38" stroke="#bae6fd" strokeOpacity=".22" />
      <rect x="68" y="276" width="92" height="34" rx="8" fill="#12313a" stroke="#bae6fd" strokeOpacity=".22" />
      <circle cx="152" cy="396" r="18" fill="#0f2e38" stroke="#bae6fd" strokeOpacity=".24" />
      <rect x="356" y="286" width="164" height="28" rx="5" fill="#20313b" stroke="#94a3b8" strokeOpacity=".2" />
      <rect x="508" y="314" width="30" height="92" rx="5" fill="#20313b" stroke="#94a3b8" strokeOpacity=".2" />
      <circle cx="400" cy="302" r="10" fill="#0f172a" stroke="#94a3b8" strokeOpacity=".28" />
      <rect x="374" y="110" width="92" height="54" rx="14" fill="#1e293b" stroke="#94a3b8" strokeOpacity=".22" />
      <rect x="470" y="134" width="58" height="86" rx="14" fill="#1e293b" stroke="#94a3b8" strokeOpacity=".22" />
      <rect x="394" y="210" width="70" height="32" rx="8" fill="#253244" stroke="#94a3b8" strokeOpacity=".18" />
      <foreignObject x="610" y="372" width="44" height="34">
        <div className="text-cyan-200/70"><Waves className="h-6 w-6" /></div>
      </foreignObject>
    </g>
  );
}

function RiskLegend() {
  return (
    <foreignObject x="466" y="32" width="220" height="44">
      <div className="rounded-lg border border-white/10 bg-slate-950/65 p-2 text-[10px] text-slate-300 backdrop-blur">
        <div className="mb-1 font-semibold text-slate-100">Room risk heatmap</div>
        <div className="grid grid-cols-4 gap-1">
          <span className="rounded bg-emerald-400/30 px-1">safe</span>
          <span className="rounded bg-yellow-300/30 px-1">moderate</span>
          <span className="rounded bg-orange-400/30 px-1">elevated</span>
          <span className="rounded bg-rose-500/30 px-1">high</span>
        </div>
      </div>
    </foreignObject>
  );
}
