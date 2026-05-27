"use client";

import { motion } from "framer-motion";
import { PathPoint } from "@/lib/types";
import { riskColor } from "@/lib/utils";

function toPath(points: PathPoint[]) {
  if (points.length < 2) return "";
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cx = (prev.x + point.x) / 2;
    const cy = (prev.y + point.y) / 2 - (index % 2 === 0 ? 28 : -22);
    return `${path} Q ${cx} ${cy} ${point.x} ${point.y}`;
  }, "");
}

export function WalkingTrailLayer({
  points,
  compact,
}: {
  points: PathPoint[];
  compact?: boolean;
}) {
  const path = toPath(points);

  return (
    <g>
      <defs>
        <filter id="path-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="rgba(34, 211, 238, .18)"
        strokeLinecap="round"
        strokeWidth="18"
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#trail-gradient)"
        strokeLinecap="round"
        strokeWidth="5"
        filter="url(#path-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="trail-gradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="46%" stopColor="#facc15" />
          <stop offset="72%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      {points.map((point, index) => {
        const showLabel = compact
          ? index === 0 || index === Math.floor(points.length / 2) || index === points.length - 1
          : index % 2 === 0;

        return (
          <g key={`${point.at}-${index}`}>
            <circle cx={point.x} cy={point.y} r={compact ? "3.5" : "4"} fill={riskColor(point.risk)} />
            {showLabel && (
              <text x={point.x + 9} y={point.y - 8} className="fill-slate-300 text-[10px]">
                {point.at}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
