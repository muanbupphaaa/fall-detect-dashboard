"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type FootstepSide = "left" | "right";

export interface MovementPathPoint {
  x: number;
  y: number;
}

export interface FootstepPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  side: FootstepSide;
  timestamp: number;
}

type PendingFootstepPoint = Omit<FootstepPoint, "timestamp">;

interface WalkingTrailOptions {
  stepIntervalMs?: number;
  maxVisibleSteps?: number;
  strideLength?: number;
  stepOffset?: number;
  footprintLifetimeMs?: number;
  resetOnPathChange?: boolean;
}

const DEFAULT_OPTIONS: Required<WalkingTrailOptions> = {
  stepIntervalMs: 560,
  maxVisibleSteps: 6,
  strideLength: 24,
  stepOffset: 5.5,
  footprintLifetimeMs: 3400,
  resetOnPathChange: true,
};

export function useWalkingTrailAnimation(
  path: MovementPathPoint[],
  options: WalkingTrailOptions = {},
) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const frames = useMemo(
    () => buildFootstepFrames(path, settings.strideLength, settings.stepOffset),
    [path, settings.strideLength, settings.stepOffset],
  );
  const cursorRef = useRef(0);
  const stepIdRef = useRef(0);
  const sideRef = useRef<FootstepSide>("left");
  const latestPointKeyRef = useRef("");
  const lastAngleRef = useRef(0);
  const pendingStepsRef = useRef<PendingFootstepPoint[]>([]);
  const [steps, setSteps] = useState<FootstepPoint[]>([]);

  useEffect(() => {
    if (!settings.resetOnPathChange) return;

    cursorRef.current = 0;
    pendingStepsRef.current = [];
    setSteps([]);
  }, [frames, settings.resetOnPathChange]);

  useEffect(() => {
    if (settings.resetOnPathChange || path.length < 1) return;

    const latest = path[path.length - 1];
    const previous = path[path.length - 2] ?? latest;
    const pointKey = `${Math.round(latest.x)}:${Math.round(latest.y)}`;
    if (pointKey === latestPointKeyRef.current) return;

    const dx = latest.x - previous.x;
    const dy = latest.y - previous.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 1 ? (Math.atan2(dy, dx) * 180) / Math.PI : lastAngleRef.current;
    const normalX = distance > 1 ? -dy / distance : 0;
    const normalY = distance > 1 ? dx / distance : 0;
    const segmentSteps = Math.max(1, Math.floor(distance / settings.strideLength));
    const newSteps: PendingFootstepPoint[] = [];

    latestPointKeyRef.current = pointKey;
    lastAngleRef.current = angle;

    for (let step = 1; step <= segmentSteps; step += 1) {
      const side = sideRef.current;
      const sideMultiplier = side === "left" ? -1 : 1;
      const progress = distance > 1 ? step / (segmentSteps + 1) : 1;
      const naturalDrift = Math.sin((stepIdRef.current + 1) * 0.72) * 1.1;
      const lateralOffset = sideMultiplier * settings.stepOffset + naturalDrift;

      stepIdRef.current += 1;
      newSteps.push({
        id: stepIdRef.current,
        x: previous.x + dx * progress + normalX * lateralOffset,
        y: previous.y + dy * progress + normalY * lateralOffset,
        angle,
        side,
      });
      sideRef.current = side === "left" ? "right" : "left";
    }

    pendingStepsRef.current = [...pendingStepsRef.current, ...newSteps].slice(
      -settings.maxVisibleSteps * 2,
    );
  }, [
    path,
    settings.maxVisibleSteps,
    settings.resetOnPathChange,
    settings.stepOffset,
    settings.strideLength,
  ]);

  useEffect(() => {
    if (settings.resetOnPathChange) return;

    const addQueuedStep = () => {
      const now = Date.now();
      const nextStep = pendingStepsRef.current.shift();

      setSteps((existing) => {
        const freshSteps = existing.filter(
          (step) => now - step.timestamp < settings.footprintLifetimeMs,
        );

        if (!nextStep) return freshSteps;

        return [...freshSteps, { ...nextStep, timestamp: now }].slice(-settings.maxVisibleSteps);
      });
    };

    const stepInterval = window.setInterval(addQueuedStep, settings.stepIntervalMs);
    const cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      setSteps((existing) =>
        existing.filter((step) => now - step.timestamp < settings.footprintLifetimeMs),
      );
    }, 420);

    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(cleanupInterval);
    };
  }, [
    settings.footprintLifetimeMs,
    settings.maxVisibleSteps,
    settings.resetOnPathChange,
    settings.stepIntervalMs,
  ]);

  useEffect(() => {
    if (!settings.resetOnPathChange) return;
    if (!frames.length) return;

    const addStep = () => {
      const frame = frames[cursorRef.current % frames.length];
      const now = Date.now();
      stepIdRef.current += 1;
      const nextStep: FootstepPoint = {
        ...frame,
        id: stepIdRef.current,
        timestamp: now,
      };

      setSteps((existing) =>
        [
          ...existing.filter((step) => now - step.timestamp < settings.footprintLifetimeMs),
          nextStep,
        ].slice(-settings.maxVisibleSteps),
      );
      cursorRef.current = (cursorRef.current + 1) % frames.length;
    };

    addStep();
    const stepInterval = window.setInterval(addStep, settings.stepIntervalMs);
    const cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      setSteps((existing) =>
        existing.filter((step) => now - step.timestamp < settings.footprintLifetimeMs),
      );
    }, 420);

    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(cleanupInterval);
    };
  }, [frames, settings.footprintLifetimeMs, settings.maxVisibleSteps, settings.stepIntervalMs]);

  return steps;
}

function buildFootstepFrames(
  path: MovementPathPoint[],
  strideLength: number,
  stepOffset: number,
): Array<Omit<FootstepPoint, "id" | "timestamp">> {
  if (path.length < 2) return [];

  const frames: Array<Omit<FootstepPoint, "id" | "timestamp">> = [];
  let side: FootstepSide = "left";

  for (let segmentIndex = 0; segmentIndex < path.length - 1; segmentIndex += 1) {
    const start = path[segmentIndex];
    const end = path[segmentIndex + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) continue;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const segmentSteps = Math.max(1, Math.floor(distance / strideLength));

    for (let step = 1; step <= segmentSteps; step += 1) {
      const progress = step / (segmentSteps + 1);
      const sideMultiplier = side === "left" ? -1 : 1;
      const naturalDrift = Math.sin((frames.length + 1) * 0.72) * 1.4;
      const lateralOffset = sideMultiplier * stepOffset + naturalDrift;

      frames.push({
        x: start.x + dx * progress + normalX * lateralOffset,
        y: start.y + dy * progress + normalY * lateralOffset,
        angle,
        side,
      });

      side = side === "left" ? "right" : "left";
    }
  }

  return frames;
}
