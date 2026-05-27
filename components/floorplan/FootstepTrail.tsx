"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AnimatedFootstep,
  FootstepPathPoint,
  useWalkingTrailAnimation,
} from "@/hooks/useWalkingTrailAnimation";

export const sampleMovementPath: FootstepPathPoint[] = [
  { x: 174, y: 154 },
  { x: 226, y: 188 },
  { x: 252, y: 214 },
  { x: 280, y: 238 },
  { x: 286, y: 292 },
  { x: 220, y: 304 },
  { x: 166, y: 344 },
  { x: 206, y: 316 },
  { x: 286, y: 300 },
  { x: 322, y: 338 },
  { x: 358, y: 334 },
  { x: 430, y: 340 },
  { x: 514, y: 354 },
  { x: 536, y: 232 },
  { x: 466, y: 198 },
  { x: 384, y: 222 },
  { x: 536, y: 236 },
  { x: 570, y: 258 },
  { x: 620, y: 304 },
  { x: 570, y: 258 },
  { x: 524, y: 232 },
  { x: 356, y: 236 },
  { x: 286, y: 292 },
  { x: 252, y: 214 },
];

export function FootstepTrail({
  path = sampleMovementPath,
  enabled = true,
  compact,
}: {
  path?: FootstepPathPoint[];
  enabled?: boolean;
  compact?: boolean;
}) {
  const footsteps = useWalkingTrailAnimation({
    path,
    enabled,
    intervalMs: compact ? 680 : 560,
    maxVisible: compact ? 7 : 9,
    lifetimeMs: compact ? 4600 : 5600,
  });

  return (
    <g aria-label="animated walking footprint trail">
      <defs>
        <filter id="footstep-glow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.06 0 0 0 0 0.13 0 0 0 0 0.22 0 0 0 .48 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <AnimatePresence initial={false}>
        {footsteps.map((footstep) => (
          <FootprintMarker key={footstep.id} footstep={footstep} />
        ))}
      </AnimatePresence>
    </g>
  );
}

function FootprintMarker({ footstep }: { footstep: AnimatedFootstep }) {
  return (
    <g transform={`translate(${footstep.x} ${footstep.y}) rotate(${footstep.angle})`}>
      <motion.g
        initial={{ opacity: 0, scale: 0.62 }}
        animate={{
          opacity: [0, footstep.opacity, footstep.opacity * 0.9, 0],
          scale: [0.62, footstep.scale, footstep.scale, footstep.scale * 0.72],
        }}
        exit={{ opacity: 0, scale: 0.58 }}
        transition={{ duration: 4.8, ease: "easeOut", times: [0, 0.12, 0.72, 1] }}
        style={{ transformOrigin: "0px 0px" }}
        filter="url(#footstep-glow)"
      >
        <BlockFootprint mirrored={footstep.side === "right"} />
      </motion.g>
    </g>
  );
}

function BlockFootprint({ mirrored }: { mirrored?: boolean }) {
  return (
    <g transform={mirrored ? "scale(-1 1)" : undefined}>
      <path d="M-13 6H2V2H9V-4H5V-8H-6V-5H-11V-1H-15V6H-13Z" fill="#020617" />
      <rect x="-15" y="6" width="13" height="4.5" fill="#020617" />
      <path
        d="M-13 6H2V2H9V-4H5V-8H-6V-5H-11V-1H-15V6H-13Z"
        fill="none"
        stroke="rgba(255,255,255,.18)"
        strokeWidth=".6"
      />
    </g>
  );
}
