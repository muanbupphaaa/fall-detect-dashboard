"use client";

import { create } from "zustand";
import { alertFrom, baseReadings, inferRisk, makeSensorTick, roomRisks } from "@/lib/ai-engine";
import type { AIInference, AlertItem, RoomRisk, SensorReading } from "@/lib/types";

interface MonitoringState {
  readings: SensorReading[];
  currentReading: SensorReading;
  inference: AIInference;
  alerts: AlertItem[];
  roomRisks: RoomRisk[];
  tick: number;
  playbackIndex: number;
  stream: () => void;
  acknowledgeAlert: (id: string) => void;
  setPlaybackIndex: (index: number) => void;
}

const initialReading = baseReadings[baseReadings.length - 1];
const initialInference = inferRisk(initialReading);

export const useMonitoringStore = create<MonitoringState>((set, get) => ({
  readings: baseReadings,
  currentReading: initialReading,
  inference: initialInference,
  alerts: baseReadings
    .map((reading) => alertFrom(reading, inferRisk(reading)))
    .filter((alert): alert is AlertItem => Boolean(alert))
    .reverse(),
  roomRisks: roomRisks(baseReadings),
  tick: 0,
  playbackIndex: baseReadings.length - 1,
  stream: () => {
    const nextTick = get().tick + 1;
    const reading = makeSensorTick(nextTick);
    const inference = inferRisk(reading);
    const alert = alertFrom(reading, inference);
    const readings = [...get().readings.slice(-47), reading];
    set({
      tick: nextTick,
      readings,
      currentReading: reading,
      inference,
      alerts: alert ? [alert, ...get().alerts].slice(0, 18) : get().alerts,
      roomRisks: roomRisks(readings),
      playbackIndex: readings.length - 1
    });
  },
  acknowledgeAlert: (id) =>
    set({
      alerts: get().alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    }),
  setPlaybackIndex: (index) => {
    const readings = get().readings;
    const safeIndex = Math.min(Math.max(index, 0), readings.length - 1);
    const currentReading = readings[safeIndex];
    set({ playbackIndex: safeIndex, currentReading, inference: inferRisk(currentReading) });
  }
}));
