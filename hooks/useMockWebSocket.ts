"use client";

import { useEffect } from "react";
import { generateReading } from "@/lib/mock-data";
import type { RoomName, SensorReading } from "@/lib/types";
import { useMonitoringStore } from "@/store/monitoring-store";

const MODEL2_API_URL = process.env.NEXT_PUBLIC_MODEL2_API_URL ?? "http://localhost:8000";
const FALL_ALERT_DELAY_MS = 30_000;
const LIVE_TICK_MS = 3_200;
const validRooms: RoomName[] = ["Bedroom", "Bathroom", "Kitchen", "Living Room", "Hallway", "Balcony"];

type ApiReading = Partial<SensorReading> & {
  model2_alert?: boolean;
  fall_detected?: boolean;
};

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeApiReading(reading: ApiReading): SensorReading | null {
  if (typeof reading.fall_risk !== "number") return null;

  const room = validRooms.includes(reading.room as RoomName)
    ? (reading.room as RoomName)
    : "Hallway";
  const timestamp = reading.timestamp || new Date().toISOString();
  const nearFall = Boolean(reading.near_fall ?? reading.model2_alert);
  const fallDetected = Boolean(reading.fall_detected);
  const alertEventKey =
    fallDetected || nearFall
      ? `api:${fallDetected ? "fall" : "near"}:${timestamp}:${room}:${Math.round(reading.fall_risk)}`
      : undefined;

  return {
    timestamp,
    room,
    x: numberOr(reading.x, 286),
    y: numberOr(reading.y, 292),
    gait_speed: numberOr(reading.gait_speed, 1.05),
    sway: numberOr(reading.sway, 1.4),
    cadence: numberOr(reading.cadence, 106),
    turning_velocity: numberOr(reading.turning_velocity, 92),
    instability_score: numberOr(reading.instability_score, reading.fall_risk),
    fall_risk: reading.fall_risk,
    fall_detected: fallDetected,
    near_fall: nearFall,
    alert_event_key: reading.alert_event_key ?? alertEventKey,
    ax: numberOr(reading.ax, 0),
    ay: numberOr(reading.ay, 0),
    az: numberOr(reading.az, 1),
    gx: numberOr(reading.gx, 0),
    gy: numberOr(reading.gy, 0),
    gz: numberOr(reading.gz, 0),
  };
}

async function fetchLiveReading(): Promise<SensorReading | null> {
  try {
    const response = await fetch(`${MODEL2_API_URL}/dashboard/latest`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return normalizeApiReading((await response.json()) as ApiReading);
  } catch {
    return null;
  }
}

function buildNormalWalkingReading(index: number, now = new Date()): SensorReading {
  const reading = generateReading(index, now);

  return {
    ...reading,
    gait_speed: Math.max(0.96, reading.gait_speed),
    sway: Math.min(2.2, reading.sway),
    cadence: Math.max(102, reading.cadence),
    turning_velocity: Math.max(88, reading.turning_velocity),
    instability_score: Math.min(24, reading.instability_score),
    fall_risk: Math.min(18, reading.fall_risk),
    fall_detected: false,
    near_fall: false,
    alert_event_key: undefined,
    ax: 0.16 + (index % 3) * 0.03,
    ay: 0.03 + (index % 2) * 0.02,
    az: 0.98,
    gx: 2.2 + (index % 4) * 0.35,
    gy: 0.8,
    gz: 1.4,
  };
}

function buildFallAlertReading(): SensorReading {
  const { livePosition } = useMonitoringStore.getState();
  const timestamp = new Date().toISOString();

  return {
    ...livePosition,
    timestamp,
    gait_speed: 0,
    sway: 8.8,
    cadence: 0,
    turning_velocity: 18,
    instability_score: 98,
    fall_risk: 98,
    fall_detected: true,
    near_fall: true,
    alert_event_key: `demo-fall-${timestamp}`,
    ax: 2.4,
    ay: 1.8,
    az: 0.42,
    gx: 82,
    gy: 64,
    gz: 110,
  };
}

export function useMockWebSocket() {
  const applyReading = useMonitoringStore((state) => state.applyReading);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    function normalTick() {
      const currentIndex = useMonitoringStore.getState().streamIndex;
      applyReading(buildNormalWalkingReading(currentIndex, new Date()));
    }

    async function tick() {
      const currentIndex = useMonitoringStore.getState().streamIndex;
      const liveReading = await fetchLiveReading();
      if (!active) return;
      applyReading(liveReading ?? generateReading(currentIndex, new Date()));
    }

    normalTick();
    timer = window.setInterval(normalTick, LIVE_TICK_MS);

    const fallTimer = window.setTimeout(() => {
      if (!active) return;
      if (timer) window.clearInterval(timer);
      applyReading(buildFallAlertReading());
      timer = window.setInterval(() => {
        void tick();
      }, LIVE_TICK_MS);
    }, FALL_ALERT_DELAY_MS);

    return () => {
      active = false;
      window.clearTimeout(fallTimer);
      if (timer) window.clearInterval(timer);
    };
  }, [applyReading]);
}
