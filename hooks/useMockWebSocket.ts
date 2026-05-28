"use client";

import { useEffect } from "react";
import { generateReading } from "@/lib/mock-data";
import type { RoomName, SensorReading } from "@/lib/types";
import { useMonitoringStore } from "@/store/monitoring-store";

const MODEL2_API_URL = process.env.NEXT_PUBLIC_MODEL2_API_URL ?? "http://localhost:8000";
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

export function useMockWebSocket() {
  const applyReading = useMonitoringStore((state) => state.applyReading);

  useEffect(() => {
    let active = true;

    async function tick() {
      const currentIndex = useMonitoringStore.getState().streamIndex;
      const liveReading = await fetchLiveReading();
      if (!active) return;
      applyReading(liveReading ?? generateReading(currentIndex, new Date()));
    }

    void tick();
    const timer = window.setInterval(() => {
      void tick();
    }, 3200);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [applyReading]);
}
