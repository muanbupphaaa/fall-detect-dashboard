"use client";

import { create } from "zustand";
import { analyzeReading } from "@/lib/ai-engine";
import {
  buildGaitData,
  buildHeatPoints,
  buildHourlyActivityData,
  buildMetrics,
  buildRoomRisks,
  buildRoomUsageData,
  buildTrendData,
  initialInsights,
  seedReadings,
} from "@/lib/mock-data";
import {
  AIInsight,
  CareAlert,
  GaitDatum,
  HeatPoint,
  HourlyActivityDatum,
  MonitoringMetrics,
  RoomRisk,
  RoomUsageDatum,
  SensorReading,
  TrendDatum,
} from "@/lib/types";

const seededReadings = seedReadings();
const stableInitialReading: SensorReading = {
  ...seededReadings[seededReadings.length - 1],
  gait_speed: 1.05,
  sway: 1.4,
  cadence: 106,
  turning_velocity: 96,
  instability_score: 12,
  fall_risk: 8,
  fall_detected: false,
  near_fall: false,
  alert_event_key: undefined,
  ax: 0.18,
  ay: 0.04,
  az: 1,
  gx: 2.2,
  gy: 0.8,
  gz: 1.4,
};
const initialReadings = [stableInitialReading];

interface MonitoringState {
  readings: SensorReading[];
  livePosition: SensorReading;
  alerts: CareAlert[];
  insights: AIInsight[];
  roomRisks: RoomRisk[];
  heatPoints: HeatPoint[];
  metrics: MonitoringMetrics;
  trendData: TrendDatum[];
  roomUsageData: RoomUsageDatum[];
  hourlyActivityData: HourlyActivityDatum[];
  gaitData: GaitDatum[];
  streamIndex: number;
  playbackIndex: number;
  nightMode: boolean;
  notificationOpen: boolean;
  applyReading: (reading: SensorReading) => void;
  acknowledgeAlert: (id: string) => void;
  setPlaybackIndex: (index: number) => void;
  toggleNightMode: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
}

function derive(readings: SensorReading[]) {
  return {
    livePosition: readings[readings.length - 1],
    roomRisks: buildRoomRisks(readings),
    heatPoints: buildHeatPoints(readings),
    metrics: buildMetrics(readings),
    trendData: buildTrendData(readings),
    roomUsageData: buildRoomUsageData(readings),
    hourlyActivityData: buildHourlyActivityData(readings),
    gaitData: buildGaitData(readings),
  };
}

export const useMonitoringStore = create<MonitoringState>((set, get) => ({
  readings: initialReadings,
  alerts: [],
  insights: initialInsights,
  streamIndex: 0,
  playbackIndex: 0,
  nightMode: false,
  notificationOpen: false,
  ...derive(initialReadings),
  applyReading: (reading) => {
    const previous = get().readings;
    const readings = [...previous, reading].slice(-80);
    const ai = analyzeReading(reading, previous);
    set({
      readings,
      streamIndex: get().streamIndex + 1,
      playbackIndex: readings.length - 1,
      alerts: ai.alert ? [ai.alert, ...get().alerts].slice(0, 24) : get().alerts,
      insights: ai.insight ? [ai.insight, ...get().insights].slice(0, 18) : get().insights,
      ...derive(readings),
    });
  },
  acknowledgeAlert: (id) =>
    set({
      alerts: get().alerts.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert,
      ),
    }),
  setPlaybackIndex: (index) => set({ playbackIndex: index }),
  toggleNightMode: () => set({ nightMode: !get().nightMode }),
  openNotifications: () => set({ notificationOpen: true }),
  closeNotifications: () => set({ notificationOpen: false }),
}));
