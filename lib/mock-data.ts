import { baselinePath, riskZones, roomCoordinates } from "@/data/floorplan";
import {
  AIInsight,
  CareAlert,
  GaitDatum,
  HeatPoint,
  HourlyActivityDatum,
  MonitoringMetrics,
  RoomName,
  RoomRisk,
  RoomUsageDatum,
  SensorReading,
  TrendDatum,
} from "@/lib/types";
import { clamp } from "@/lib/utils";
import { formatClock } from "@/lib/utils";

const route: RoomName[] = [
  "Bedroom",
  "Bedroom",
  "Hallway",
  "Bathroom",
  "Hallway",
  "Kitchen",
  "Living Room",
  "Balcony",
  "Living Room",
  "Hallway",
];

const roomRiskBias: Record<RoomName, number> = {
  Bedroom: 44,
  Bathroom: 74,
  Kitchen: 52,
  "Living Room": 35,
  Hallway: 58,
  Balcony: 42,
};

export function generateReading(index: number, now = new Date()): SensorReading {
  const room = route[index % route.length];
  const coordinates = roomCoordinates[room];
  const basePoint = coordinates[index % coordinates.length];
  const wave = Math.sin(index / 2.7);
  const fatigue = clamp(index * 0.45, 0, 16);
  const roomRisk = roomRiskBias[room];
  const nighttimeBoost = room === "Bathroom" && index % 13 > 8 ? 12 : 0;
  const instability = clamp(roomRisk * 0.62 + wave * 12 + fatigue + nighttimeBoost, 18, 96);
  const fallRisk = clamp(instability + (room === "Bathroom" ? 12 : 0) + (index % 17 === 0 ? 18 : 0), 12, 98);
  const nearFall = fallRisk > 88 && index % 3 === 0;

  return {
    timestamp: now.toISOString(),
    room,
    x: clamp(basePoint.x + Math.cos(index * 1.7) * 14, 54, 668),
    y: clamp(basePoint.y + Math.sin(index * 1.2) * 12, 58, 418),
    gait_speed: clamp(1.05 - instability / 140 + Math.sin(index) * 0.06, 0.34, 1.18),
    sway: clamp(1.8 + instability / 16 + Math.cos(index / 2) * 0.5, 1.3, 8.4),
    cadence: clamp(104 - instability * 0.34 + Math.sin(index / 3) * 4, 62, 112),
    turning_velocity: clamp(92 - instability * 0.62 + Math.cos(index / 3) * 8, 24, 102),
    instability_score: instability,
    fall_risk: fallRisk,
    near_fall: nearFall,
    ax: Number((Math.sin(index) * 0.36 + (nearFall ? 1.45 : 0.1)).toFixed(3)),
    ay: Number((Math.cos(index / 1.6) * 0.28).toFixed(3)),
    az: Number((0.98 + Math.sin(index / 2.4) * 0.08).toFixed(3)),
    gx: Number((Math.sin(index / 2) * 8 + instability / 8).toFixed(3)),
    gy: Number((Math.cos(index / 2.2) * 6).toFixed(3)),
    gz: Number((Math.sin(index / 3) * 7 + (nearFall ? 22 : 0)).toFixed(3)),
  };
}

export function seedReadings(count = 24) {
  const start = new Date("2026-05-27T00:15:00.000Z");
  return Array.from({ length: count }, (_, index) =>
    generateReading(index, new Date(start.getTime() + index * 240000)),
  );
}

export function buildRoomRisks(readings: SensorReading[]): RoomRisk[] {
  const rooms = Object.keys(roomRiskBias) as RoomName[];
  return rooms.map((room) => {
    const roomReadings = readings.filter((reading) => reading.room === room).slice(-18);
    const averageRisk =
      roomReadings.reduce((sum, reading) => sum + reading.fall_risk, 0) /
        Math.max(1, roomReadings.length) || roomRiskBias[room];
    const instability =
      roomReadings.reduce((sum, reading) => sum + reading.instability_score, 0) /
        Math.max(1, roomReadings.length) || roomRiskBias[room];
    return {
      room,
      risk: Math.round(clamp(averageRisk, 18, 98)),
      activity: Math.round(clamp(roomReadings.length * 11 + averageRisk * 0.25, 18, 99)),
      instability: Math.round(clamp(instability, 18, 98)),
    };
  });
}

export function buildHeatPoints(readings: SensorReading[]): HeatPoint[] {
  const latest = readings.slice(-12).map((reading, index) => ({
    id: `live-${reading.room}-${index}`,
    x: reading.x,
    y: reading.y,
    radius: clamp(34 + reading.fall_risk * 0.55, 42, 82),
    intensity: reading.fall_risk,
    room: reading.room,
  }));
  return [...riskZones, ...latest].slice(-18);
}

export function buildMetrics(readings: SensorReading[]): MonitoringMetrics {
  const latest = readings[readings.length - 1];
  const avgRisk =
    readings.slice(-16).reduce((sum, reading) => sum + reading.fall_risk, 0) /
    Math.max(1, readings.slice(-16).length);
  const avgInstability =
    readings.slice(-16).reduce((sum, reading) => sum + reading.instability_score, 0) /
    Math.max(1, readings.slice(-16).length);
  return {
    riskScore: Math.round(clamp(latest?.fall_risk ?? avgRisk, 0, 100)),
    mobilityScore: Math.round(clamp(100 - avgInstability * 0.72, 12, 96)),
    nearFallCount: readings.filter((reading) => reading.near_fall).length,
    aiConfidence: Math.round(clamp(86 + (latest?.fall_risk ?? 50) / 12, 82, 98)),
    walkCount: Math.round(clamp(readings.length * 1.8, 12, 90)),
    heatIntensity: Math.round(clamp(avgRisk + 8, 12, 98)),
    stabilityScore: Math.round(clamp(100 - avgInstability * 0.68, 10, 96)),
    turningScore: Math.round(clamp(latest?.turning_velocity ?? 74, 0, 100)),
  };
}

export function buildTrendData(readings: SensorReading[]): TrendDatum[] {
  return readings.slice(-18).map((reading) => ({
    time: formatClock(reading.timestamp),
    mobility: Math.round(clamp(100 - reading.instability_score * 0.65, 0, 100)),
    stability: Math.round(clamp(100 - reading.sway * 8, 0, 100)),
    risk: Math.round(reading.fall_risk),
    instability: Math.round(reading.instability_score),
    heat: Math.round(clamp(reading.fall_risk + reading.sway * 3, 0, 100)),
  }));
}

export function buildRoomUsageData(readings: SensorReading[]): RoomUsageDatum[] {
  return buildRoomRisks(readings).map((room) => ({
    room: room.room,
    visits: readings.filter((reading) => reading.room === room.room).length,
    risk: room.risk,
  }));
}

export function buildHourlyActivityData(): HourlyActivityDatum[] {
  return ["06", "08", "10", "12", "14", "16", "18", "20", "22", "00"].map(
    (hour, index) => ({
      hour,
      steps: Math.round(18 + Math.sin(index / 1.4) * 10 + index * 4 + (hour === "00" ? 7 : 0)),
    }),
  );
}

export function buildGaitData(readings: SensorReading[]): GaitDatum[] {
  return readings.slice(-16).map((reading, index) => ({
    label: `${index + 1}`,
    cadence: Math.round(reading.cadence),
    sway: Number(reading.sway.toFixed(2)),
    turning: Math.round(100 - reading.turning_velocity),
  }));
}

export const initialInsights: AIInsight[] = [
  {
    id: "seed-bathroom",
    title: "Instability increased near bathroom",
    detail:
      "Wet-zone proximity and low-speed turns are contributing to an elevated bathroom risk score.",
    confidence: 91,
    severity: "high",
    room: "Bathroom",
    createdAt: "07:24",
  },
  {
    id: "seed-turning",
    title: "Turning stability decreased this week",
    detail:
      "Cadence remains acceptable, but turn recovery is slower around the hallway transition.",
    confidence: 84,
    severity: "medium",
    room: "Hallway",
    createdAt: "07:31",
  },
  {
    id: "seed-night",
    title: "Nighttime gait instability detected",
    detail:
      "The bedroom-to-bathroom route shows higher gait variability during low-light periods.",
    confidence: 88,
    severity: "high",
    room: "Bedroom",
    createdAt: "02:18",
  },
];

export const initialAlerts: CareAlert[] = [
  {
    id: "seed-alert-bath",
    message: "High instability detected in bathroom",
    severity: "high",
    room: "Bathroom",
    timestamp: "07:24",
    acknowledged: false,
  },
  {
    id: "seed-alert-gait",
    message: "Abnormal gait pattern detected",
    severity: "medium",
    room: "Hallway",
    timestamp: "07:31",
    acknowledged: false,
  },
  {
    id: "seed-alert-still",
    message: "No movement detected for 2 hours",
    severity: "low",
    room: "Living Room",
    timestamp: "05:42",
    acknowledged: true,
  },
];

export function baselineTrailReadings() {
  return baselinePath.map((point, index) => ({
    ...generateReading(index),
    x: point.x,
    y: point.y,
    fall_risk: point.risk,
  }));
}
