"use client";

import { motion } from "framer-motion";
import { HeatPoint } from "@/lib/types";
import { riskColor } from "@/lib/utils";

export function HeatmapOverlay({ points }: { points: HeatPoint[] }) {
  return (
    <g>
      <defs>
        {points.map((point) => (
          <radialGradient key={point.id} id={`heat-${point.id}`}>
            <stop offset="0%" stopColor={riskColor(point.intensity)} stopOpacity="0.62" />
            <stop offset="58%" stopColor={riskColor(point.intensity)} stopOpacity="0.18" />
            <stop offset="100%" stopColor={riskColor(point.intensity)} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {points.map((point, index) => (
        <motion.circle
          key={point.id}
          cx={point.x}
          cy={point.y}
          r={point.radius}
          fill={`url(#heat-${point.id})`}
          initial={{ opacity: 0.35, scale: 0.92 }}
          animate={{
            opacity: [0.44, 0.72, 0.44],
            scale: [0.96, 1.05, 0.96],
          }}
          transition={{
            duration: 3 + index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${point.x}px ${point.y}px` }}
        />
      ))}
    </g>
  );
}
