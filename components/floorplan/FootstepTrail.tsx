"use client";

import { motion } from "framer-motion";
import {
  FootstepPoint,
  MovementPathPoint,
  useWalkingTrailAnimation,
} from "@/hooks/useWalkingTrailAnimation";

interface FootstepTrailProps {
  path: MovementPathPoint[];
  compact?: boolean;
  followLivePath?: boolean;
}

export function FootstepTrail({ path, compact, followLivePath }: FootstepTrailProps) {
  const steps = useWalkingTrailAnimation(path, {
    stepIntervalMs: compact ? 680 : 620,
    maxVisibleSteps: compact ? 14 : 18,
    strideLength: compact ? 22 : 20,
    stepOffset: compact ? 5.8 : 6.2,
    footprintLifetimeMs: compact ? 5400 : 6200,
    resetOnPathChange: !followLivePath,
  });

  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <filter id="footstep-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.04 0 0 0 0 0.55 0 0 0 0 0.70 0 0 0 .62 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {steps.map((step, index) => (
        <FootprintMarker
          key={step.id}
          step={step}
          ageRatio={steps.length <= 1 ? 1 : (index + 1) / steps.length}
        />
      ))}
    </g>
  );
}

function FootprintMarker({
  step,
  ageRatio,
}: {
  step: FootstepPoint;
  ageRatio: number;
}) {
  const isLeft = step.side === "left";
  const opacity = 0.26 + ageRatio * 0.68;

  return (
    <g
      data-footstep-marker="true"
      data-footstep-side={step.side}
      transform={`translate(${step.x} ${step.y}) rotate(${step.angle + 90})`}
      filter="url(#footstep-soft-glow)"
    >
      <motion.g
        initial={{ opacity: 0, scale: 0.42 }}
        animate={{
          opacity: [0, opacity, opacity, opacity * 0.72, 0],
          scale: [0.72, 1, 1, 0.98, 0.94],
        }}
        transition={{
          opacity: { duration: 5.4, times: [0, 0.08, 0.78, 0.9, 1], ease: "linear" },
          scale: { duration: 5.4, times: [0, 0.08, 0.78, 0.9, 1], ease: "linear" },
        }}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
      <motion.ellipse
        cx="0"
        cy="0"
        rx="11"
        ry="14"
        fill="#0ea5e9"
        opacity="0.24"
      />
      <g transform={`translate(${isLeft ? -1.4 : 1.4} 0) scale(${isLeft ? -1 : 1} 1)`}>
        <path
          d="M-4 8 C-8 4 -8 -5 -4 -10 C-1 -14 5 -13 7 -8 C9 -2 8 5 3 9 C1 11 -2 11 -4 8 Z"
          fill="#020617"
          opacity="0.74"
        />
        <circle cx="-7" cy="-13" r="1.7" fill="#020617" opacity="0.58" />
        <circle cx="-3.4" cy="-15.2" r="1.9" fill="#020617" opacity="0.62" />
        <circle cx="0.7" cy="-15.8" r="2" fill="#020617" opacity="0.65" />
        <circle cx="4.9" cy="-14.6" r="1.85" fill="#020617" opacity="0.62" />
        <circle cx="8.2" cy="-12.2" r="1.55" fill="#020617" opacity="0.55" />
      </g>
      </motion.g>
    </g>
  );
}

export const sampleMovementPath: MovementPathPoint[] = [
  { x: 148, y: 166 },
  { x: 226, y: 218 },
  { x: 282, y: 254 },
  { x: 286, y: 322 },
  { x: 204, y: 322 },
  { x: 128, y: 366 },
  { x: 204, y: 322 },
  { x: 286, y: 330 },
  { x: 386, y: 344 },
  { x: 484, y: 344 },
  { x: 548, y: 250 },
  { x: 606, y: 268 },
  { x: 650, y: 320 },
];
