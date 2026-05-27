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

type SyntheticWaypoint = {
  time: string;
  room: RoomName;
  point: number;
  riskBoost?: number;
  nearFall?: boolean;
};

type LiveMovementPoint = {
  room: RoomName;
  x: number;
  y: number;
  riskBoost?: number;
  nearFall?: boolean;
};

const syntheticDate = "2026-05-27";

const syntheticDailyTimeline: SyntheticWaypoint[] = [
  { time: "02:08", room: "Bedroom", point: 0, riskBoost: 4 },
  { time: "02:12", room: "Hallway", point: 0, riskBoost: 18 },
  { time: "02:16", room: "Bathroom", point: 0, riskBoost: 24, nearFall: true },
  { time: "02:24", room: "Hallway", point: 1, riskBoost: 16 },
  { time: "02:31", room: "Bedroom", point: 1, riskBoost: 8 },
  { time: "05:56", room: "Bedroom", point: 2, riskBoost: 2 },
  { time: "06:04", room: "Hallway", point: 0, riskBoost: 10 },
  { time: "06:09", room: "Bathroom", point: 1, riskBoost: 18 },
  { time: "06:22", room: "Kitchen", point: 0, riskBoost: 4 },
  { time: "06:42", room: "Living Room", point: 0 },
  { time: "07:18", room: "Bedroom", point: 3, riskBoost: 6 },
  { time: "07:25", room: "Hallway", point: 1, riskBoost: 14 },
  { time: "07:31", room: "Bathroom", point: 2, riskBoost: 22 },
  { time: "07:43", room: "Kitchen", point: 1, riskBoost: 8 },
  { time: "08:06", room: "Living Room", point: 1 },
  { time: "08:34", room: "Balcony", point: 0 },
  { time: "08:48", room: "Living Room", point: 2 },
  { time: "09:12", room: "Kitchen", point: 2, riskBoost: 7 },
  { time: "09:36", room: "Hallway", point: 2, riskBoost: 12 },
  { time: "09:44", room: "Bathroom", point: 0, riskBoost: 15 },
  { time: "10:05", room: "Living Room", point: 0 },
  { time: "10:28", room: "Balcony", point: 1 },
  { time: "10:51", room: "Hallway", point: 1, riskBoost: 20 },
  { time: "10:55", room: "Bathroom", point: 1, riskBoost: 26, nearFall: true },
  { time: "11:04", room: "Hallway", point: 0, riskBoost: 14 },
  { time: "11:18", room: "Kitchen", point: 1, riskBoost: 5 },
  { time: "11:32", room: "Living Room", point: 1 },
];

const roomRiskBias: Record<RoomName, number> = {
  Bedroom: 44,
  Bathroom: 74,
  Kitchen: 52,
  "Living Room": 35,
  Hallway: 58,
  Balcony: 42,
};

const liveMovementPath: LiveMovementPoint[] = [
  { room: "Bedroom", x: 176, y: 154, riskBoost: 3 },
  { room: "Bedroom", x: 228, y: 188, riskBoost: 4 },
  { room: "Bedroom", x: 252, y: 214, riskBoost: 7 },
  { room: "Hallway", x: 280, y: 238, riskBoost: 12 },
  { room: "Hallway", x: 286, y: 292, riskBoost: 14 },
  { room: "Bathroom", x: 220, y: 304, riskBoost: 22 },
  { room: "Bathroom", x: 166, y: 344, riskBoost: 28, nearFall: true },
  { room: "Bathroom", x: 206, y: 316, riskBoost: 22 },
  { room: "Hallway", x: 286, y: 300, riskBoost: 13 },
  { room: "Hallway", x: 322, y: 338, riskBoost: 10 },
  { room: "Kitchen", x: 358, y: 334, riskBoost: 8 },
  { room: "Kitchen", x: 430, y: 340, riskBoost: 7 },
  { room: "Kitchen", x: 514, y: 354, riskBoost: 6 },
  { room: "Living Room", x: 536, y: 232, riskBoost: 4 },
  { room: "Living Room", x: 466, y: 198, riskBoost: 6 },
  { room: "Living Room", x: 384, y: 222, riskBoost: 5 },
  { room: "Living Room", x: 536, y: 236, riskBoost: 4 },
  { room: "Balcony", x: 570, y: 258, riskBoost: 10 },
  { room: "Balcony", x: 620, y: 304, riskBoost: 8 },
  { room: "Balcony", x: 570, y: 258, riskBoost: 10 },
  { room: "Living Room", x: 524, y: 232, riskBoost: 5 },
  { room: "Hallway", x: 356, y: 236, riskBoost: 10 },
  { room: "Hallway", x: 286, y: 292, riskBoost: 13 },
  { room: "Bedroom", x: 252, y: 214, riskBoost: 7 },
];

function bangkokIso(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const [year, month, day] = syntheticDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute)).toISOString();
}

function bangkokHour(date: Date) {
  const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return bangkokDate.getUTCHours();
}

function makeReading(
  index: number,
  room: RoomName,
  timestamp: string,
  riskBoost = 0,
  forcedNearFall = false,
  pointIndex = index,
  exactPoint?: { x: number; y: number },
): SensorReading {
  const coordinates = roomCoordinates[room];
  const basePoint = exactPoint ?? coordinates[pointIndex % coordinates.length];
  const hour = bangkokHour(new Date(timestamp));
  const wave = Math.sin(index / 2.7);
  const fatigue = hour >= 10 ? clamp((hour - 8) * 2.1, 0, 14) : hour < 5 ? 11 : 0;
  const nighttimeBoost = hour < 5 && ["Bathroom", "Hallway"].includes(room) ? 18 : 0;
  const turningBoost = room === "Hallway" && index % 3 === 1 ? 8 : 0;
  const roomRisk = roomRiskBias[room];
  const instability = clamp(
    roomRisk * 0.56 + wave * 8 + fatigue + nighttimeBoost + turningBoost + riskBoost,
    16,
    96,
  );
  const fallRisk = clamp(
    instability + (room === "Bathroom" ? 12 : 0) + (room === "Bedroom" && hour < 5 ? 9 : 0),
    12,
    98,
  );
  const nearFall = forcedNearFall || (fallRisk > 90 && room === "Bathroom");

  return {
    timestamp,
    room,
    x: clamp(basePoint.x + Math.cos(index * 0.7) * (exactPoint ? 2.4 : 14), 54, 688),
    y: clamp(basePoint.y + Math.sin(index * 0.6) * (exactPoint ? 2 : 12), 58, 426),
    gait_speed: clamp(1.08 - instability / 145 + Math.sin(index) * 0.05, 0.34, 1.18),
    sway: clamp(1.7 + instability / 17 + Math.cos(index / 2) * 0.42, 1.25, 8.4),
    cadence: clamp(106 - instability * 0.36 + Math.sin(index / 3) * 3.5, 62, 114),
    turning_velocity: clamp(94 - instability * 0.64 + Math.cos(index / 3) * 7, 24, 104),
    instability_score: instability,
    fall_risk: fallRisk,
    near_fall: nearFall,
    ax: Number((Math.sin(index) * 0.34 + (nearFall ? 1.55 : 0.08)).toFixed(3)),
    ay: Number((Math.cos(index / 1.6) * 0.26 + (hour < 5 ? 0.08 : 0)).toFixed(3)),
    az: Number((0.98 + Math.sin(index / 2.4) * 0.08).toFixed(3)),
    gx: Number((Math.sin(index / 2) * 8 + instability / 8).toFixed(3)),
    gy: Number((Math.cos(index / 2.2) * 6).toFixed(3)),
    gz: Number((Math.sin(index / 3) * 7 + (nearFall ? 24 : 0)).toFixed(3)),
  };
}

export function generateReading(index: number, now = new Date()): SensorReading {
  const point = liveMovementPath[index % liveMovementPath.length];
  const hour = bangkokHour(now);
  const nighttimeRisk = hour < 5 && ["Bathroom", "Hallway"].includes(point.room) ? 10 : 0;
  const riskBoost =
    (point.riskBoost ?? 0) +
    nighttimeRisk +
    (point.room === "Bathroom" ? 10 : point.room === "Hallway" ? 5 : 0);
  return makeReading(index, point.room, now.toISOString(), riskBoost, point.nearFall, index, point);
}

export function seedReadings(count = syntheticDailyTimeline.length) {
  return syntheticDailyTimeline.slice(-count).map((event, index) =>
    makeReading(
      index,
      event.room,
      bangkokIso(event.time),
      event.riskBoost ?? 0,
      event.nearFall ?? false,
      event.point,
    ),
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

export function buildHourlyActivityData(readings: SensorReading[] = []): HourlyActivityDatum[] {
  const hours = ["02", "05", "06", "07", "08", "09", "10", "11"];
  return hours.map((hour) => {
    const hourReadings = readings.filter((reading) => formatClock(reading.timestamp).startsWith(hour));
    const steps = hourReadings.reduce(
      (sum, reading) =>
        sum + Math.round(reading.cadence * reading.gait_speed * (reading.room === "Bedroom" ? 0.42 : 0.68)),
      0,
    );

    return {
      hour,
      steps: Math.max(steps, hour === "02" ? 46 : hour === "05" ? 18 : 0),
    };
  });
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
