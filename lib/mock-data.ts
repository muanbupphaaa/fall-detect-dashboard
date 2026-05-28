import { baselinePath, roomCoordinates } from "@/data/floorplan";
import fallDetectionStream from "@/data/fall-detection-stream.json";
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

type FallDetectionStreamRecord = {
  window_start_ts: string;
  window_end_ts: string;
  session_id: string;
  class_en: string;
  category: string;
  label: number;
  model2_risk_score: number;
  model2_high_risk_probability: number;
  model2_risk_level: string;
  rule_feature_risk_score: number;
  component_gait_motion: number;
  component_rotation_balance: number;
  component_posture_transition: number;
  component_impact_event: number;
  component_physio_stress: number;
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

const streamData = fallDetectionStream as FallDetectionStreamRecord[];
const streamRoom: RoomName = "Living Room";
const livingRoomWalkingRoute = [
  { x: 404, y: 198 },
  { x: 452, y: 178 },
  { x: 518, y: 196 },
  { x: 550, y: 238 },
  { x: 496, y: 246 },
  { x: 430, y: 228 },
];

function streamDurationSeconds(record: FallDetectionStreamRecord) {
  const start = Date.parse(record.window_start_ts);
  const end = Date.parse(record.window_end_ts);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1;
  return clamp((end - start) / 1000, 0.2, 4);
}

function streamFallRisk(record: FallDetectionStreamRecord) {
  const modelRisk = clamp(record.model2_risk_score * 100, 3, 99);
  const highRiskProbability = clamp(record.model2_high_risk_probability * 100, 0, 100);
  return clamp(
    record.category === "fall" || record.label === 1
      ? Math.max(modelRisk, highRiskProbability)
      : modelRisk,
    3,
    99,
  );
}

function streamGaitSpeed(record: FallDetectionStreamRecord) {
  return clamp(1.12 - record.component_gait_motion * 0.5 - streamFallRisk(record) / 220, 0.28, 1.18);
}

const routeSegments = livingRoomWalkingRoute.map((point, index) => {
  const next = livingRoomWalkingRoute[(index + 1) % livingRoomWalkingRoute.length];
  const length = Math.hypot(next.x - point.x, next.y - point.y);
  return { point, next, length };
});

const routeLength = routeSegments.reduce((sum, segment) => sum + segment.length, 0);

const streamCumulativeDistances = streamData.reduce<number[]>((distances, record, index) => {
  const previous = index === 0 ? 0 : distances[index - 1];
  distances.push(previous + streamGaitSpeed(record) * streamDurationSeconds(record));
  return distances;
}, []);

function pointOnLivingRoomRoute(distanceMeters: number) {
  const pixelsPerMeter = 28;
  let distance = (distanceMeters * pixelsPerMeter) % routeLength;

  for (const segment of routeSegments) {
    if (distance <= segment.length) {
      const progress = segment.length === 0 ? 0 : distance / segment.length;
      return {
        x: segment.point.x + (segment.next.x - segment.point.x) * progress,
        y: segment.point.y + (segment.next.y - segment.point.y) * progress,
      };
    }

    distance -= segment.length;
  }

  return livingRoomWalkingRoute[0];
}

function pointForStreamRecord(record: FallDetectionStreamRecord, index: number) {
  const cycle = Math.floor(index / Math.max(1, streamData.length));
  const streamIndex = index % Math.max(1, streamData.length);
  const streamDistance = streamCumulativeDistances[streamIndex] ?? 0;
  const cycleDistance = (streamCumulativeDistances[streamCumulativeDistances.length - 1] ?? 0) * cycle;
  const point = pointOnLivingRoomRoute(streamDistance + cycleDistance);
  const riskDrift = record.category === "fall" ? 0 : Math.sin(index * 0.5) * 2;

  return {
    room: streamRoom,
    x: clamp(point.x + riskDrift, 54, 688),
    y: clamp(point.y + Math.cos(index * 0.42) * 2, 58, 426),
  };
}

function makeStreamReading(index: number, timestamp: string): SensorReading {
  const record = streamData[index % streamData.length];
  const point = pointForStreamRecord(record, index);
  const fallRisk = streamFallRisk(record);
  const instability = clamp(
    record.rule_feature_risk_score * 70 +
      record.component_gait_motion * 16 +
      record.component_rotation_balance * 22 +
      record.component_posture_transition * 18,
    8,
    98,
  );
  const nearFall =
    record.category === "fall" ||
    record.model2_risk_level === "high" ||
    record.component_impact_event > 0.82;
  const fallDetected = record.category === "fall" || record.label === 1;
  const alertEventKey = fallDetected
    ? `fall:${record.session_id}`
    : nearFall
      ? `near:${record.session_id}`
      : undefined;

  return {
    timestamp,
    room: point.room,
    x: point.x,
    y: point.y,
    gait_speed: streamGaitSpeed(record),
    sway: clamp(1.3 + record.component_rotation_balance * 5.2 + fallRisk / 30, 1.1, 8.8),
    cadence: clamp(110 - record.component_gait_motion * 34 - fallRisk * 0.25, 58, 116),
    turning_velocity: clamp(104 - record.component_rotation_balance * 54 - fallRisk * 0.34, 22, 106),
    instability_score: instability,
    fall_risk: fallRisk,
    fall_detected: fallDetected,
    near_fall: nearFall,
    alert_event_key: alertEventKey,
    ax: Number((record.component_gait_motion * 1.9 + (nearFall ? 0.7 : 0.05)).toFixed(3)),
    ay: Number((record.component_rotation_balance * 1.5).toFixed(3)),
    az: Number((0.92 + record.component_posture_transition * 0.38).toFixed(3)),
    gx: Number((record.component_rotation_balance * 70 + instability / 10).toFixed(3)),
    gy: Number((record.component_posture_transition * 58).toFixed(3)),
    gz: Number((record.component_impact_event * 86 + (nearFall ? 18 : 0)).toFixed(3)),
  };
}

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
    fall_detected: false,
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
  if (streamData.length > 0) {
    return makeStreamReading(index, now.toISOString());
  }

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
  if (streamData.length > 0) {
    const seedCount = Math.min(count, streamData.length);
    const now = Date.now();

    return Array.from({ length: seedCount }, (_, index) =>
      makeStreamReading(
        index,
        new Date(now - (seedCount - index) * 3200).toISOString(),
      ),
    );
  }

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
    const hasRoomData = roomReadings.length > 0;
    const averageRisk =
      roomReadings.reduce((sum, reading) => sum + reading.fall_risk, 0) /
        Math.max(1, roomReadings.length) || (streamData.length > 0 ? 0 : roomRiskBias[room]);
    const instability =
      roomReadings.reduce((sum, reading) => sum + reading.instability_score, 0) /
        Math.max(1, roomReadings.length) || (streamData.length > 0 ? 0 : roomRiskBias[room]);
    return {
      room,
      risk: Math.round(hasRoomData ? clamp(averageRisk, 3, 98) : 0),
      activity: Math.round(hasRoomData ? clamp(roomReadings.length * 11 + averageRisk * 0.25, 3, 99) : 0),
      instability: Math.round(hasRoomData ? clamp(instability, 3, 98) : 0),
    };
  });
}

export function buildHeatPoints(readings: SensorReading[]): HeatPoint[] {
  const riskReadings = readings.filter((reading) => reading.near_fall || reading.fall_risk >= 58);
  const latest = riskReadings.slice(-16).map((reading, index) => ({
    id: `stream-risk-${reading.timestamp}-${index}`,
    x: reading.x,
    y: reading.y,
    radius: clamp(34 + reading.fall_risk * 0.55, 42, 82),
    intensity: reading.fall_risk,
    room: reading.room,
  }));
  return latest;
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

export const initialInsights: AIInsight[] = [];

function alertSeverityFromRisk(risk: number): CareAlert["severity"] {
  if (risk >= 90) return "emergency";
  if (risk >= 78) return "high";
  if (risk >= 58) return "medium";
  return "low";
}

function buildInitialStreamAlerts(): CareAlert[] {
  const seenEvents = new Set<string>();

  return seedReadings(48)
    .filter((reading) => reading.fall_detected || reading.near_fall || reading.fall_risk >= 58)
    .filter((reading) => {
      const eventKey = reading.alert_event_key ?? `${reading.timestamp}-${reading.room}-${reading.fall_risk}`;
      if (seenEvents.has(eventKey)) return false;
      seenEvents.add(eventKey);
      return true;
    })
    .slice(-6)
    .reverse()
    .map((reading, index) => ({
      id: `stream-alert-${index}-${reading.timestamp}`,
      message: reading.fall_detected
        ? "Fall event detected"
        : reading.near_fall
          ? "Near-fall event detected"
          : "Abnormal gait pattern detected",
      severity: reading.fall_detected || reading.near_fall ? "emergency" : alertSeverityFromRisk(reading.fall_risk),
      room: reading.room,
      timestamp: formatClock(reading.timestamp),
      acknowledged: false,
      eventKey: reading.alert_event_key,
    }));
}

const fallbackInitialAlerts: CareAlert[] = [
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

export const initialAlerts: CareAlert[] = streamData.length
  ? buildInitialStreamAlerts()
  : fallbackInitialAlerts;

export function baselineTrailReadings() {
  return baselinePath.map((point, index) => ({
    ...generateReading(index),
    x: point.x,
    y: point.y,
    fall_risk: point.risk,
  }));
}
