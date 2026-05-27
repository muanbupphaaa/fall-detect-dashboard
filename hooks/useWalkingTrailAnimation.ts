"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type FootstepSide = "left" | "right";

export type FootstepPathPoint = {
  x: number;
  y: number;
};

export type AnimatedFootstep = {
  id: string;
  x: number;
  y: number;
  angle: number;
  side: FootstepSide;
  timestamp: number;
  opacity: number;
  scale: number;
};

export function useWalkingTrailAnimation({
  path,
  enabled = true,
  intervalMs = 620,
  maxVisible = 8,
  lifetimeMs = 5200,
}: {
  path: FootstepPathPoint[];
  enabled?: boolean;
  intervalMs?: number;
  maxVisible?: number;
  lifetimeMs?: number;
}) {
  const [footsteps, setFootsteps] = useState<AnimatedFootstep[]>([]);
  const indexRef = useRef(0);
  const pathRef = useRef(path);

  const usablePath = useMemo(
    () => path.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)),
    [path],
  );

  useEffect(() => {
    pathRef.current = usablePath;
  }, [usablePath]);

  useEffect(() => {
    if (!enabled || usablePath.length < 2) {
      setFootsteps([]);
      return;
    }

    const addFootstep = () => {
      const route = pathRef.current;
      if (route.length < 2) return;

      const routeIndex = indexRef.current % route.length;
      const current = route[routeIndex];
      const next = route[(routeIndex + 1) % route.length];
      const angle = (Math.atan2(next.y - current.y, next.x - current.x) * 180) / Math.PI + 90;
      const side: FootstepSide = indexRef.current % 2 === 0 ? "left" : "right";
      const offset = side === "left" ? -5.5 : 5.5;
      const sideAngle = ((angle - 90) * Math.PI) / 180 + Math.PI / 2;
      const now = Date.now();

      indexRef.current += 1;

      setFootsteps((previous) => {
        const fresh = previous.filter((footstep) => now - footstep.timestamp < lifetimeMs);
        const nextFootsteps = [
          ...fresh,
          {
            id: `${now}-${indexRef.current}`,
            x: current.x + Math.cos(sideAngle) * offset,
            y: current.y + Math.sin(sideAngle) * offset,
            angle: angle + (side === "left" ? -7 : 7),
            side,
            timestamp: now,
            opacity: 0.74,
            scale: 0.76,
          },
        ];

        return nextFootsteps.slice(-maxVisible);
      });
    };

    addFootstep();
    const interval = window.setInterval(addFootstep, intervalMs);

    return () => window.clearInterval(interval);
  }, [enabled, intervalMs, lifetimeMs, maxVisible, usablePath]);

  return footsteps;
}
