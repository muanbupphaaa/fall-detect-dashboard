import seedData from "@/data/mock-sensor-data.json";
import { clamp } from "@/lib/utils";
import type { AIInference, AlertItem, Room, RoomRisk, SensorReading } from "@/lib/types";

const rooms: Room[] = ["Bedroom", "Bathroom", "Kitchen", "Living Room", "Hallway"];
const roomBias: Record<Room, number> = {
  Bedroom: 5,
  Bathroom: 24,
  Kitchen: 8,
  "Living Room": 10,
  Hallway: 16
};

export const baseReadings = seedData as SensorReading[];

export function extractFeatures(reading: SensorReading) {
  const gaitVariability = clamp((1.05 - reading.gait_speed) * 52 + reading.sway * 28, 0, 100);
  const swayAmplitude = clamp(reading.sway * 100, 0, 100);
  const instabilityScore = clamp(reading.instability_score + roomBias[reading.room] * 0.5, 0, 100);
  const confidence = clamp(92 - Math.abs(55 - instabilityScore) * 0.18 + reading.cadence * 0.03, 72, 98);

  return {
    gaitVariability,
    swayAmplitude,
    cadence: reading.cadence,
    turningVelocity: reading.turning_velocity,
    instabilityScore,
    confidence
  };
}

export function inferRisk(reading: SensorReading): AIInference {
  const features = extractFeatures(reading);
  const isNight = new Date(reading.timestamp).getHours() < 6 || new Date(reading.timestamp).getHours() > 20;
  const riskScore = clamp(
    reading.fall_risk +
      features.swayAmplitude * 0.17 +
      features.gaitVariability * 0.12 +
      (reading.room === "Bathroom" ? 10 : 0) +
      (isNight ? 8 : 0),
    0,
    100
  );
  const stabilityScore = Math.round(100 - riskScore * 0.76);

  const state =
    riskScore > 82
      ? "high-risk"
      : features.turningVelocity > 86
        ? "abnormal turning"
        : features.gaitVariability > 58
          ? "possible fatigue"
          : riskScore > 58
            ? "unstable"
            : "stable";

  const message =
    state === "high-risk"
      ? `High fall probability near ${reading.room.toLowerCase()} with elevated sway.`
      : state === "abnormal turning"
        ? `Turning stability decreased in the ${reading.room.toLowerCase()}.`
        : state === "possible fatigue"
          ? `Reduced gait speed suggests possible fatigue in ${reading.room.toLowerCase()}.`
          : state === "unstable"
            ? `Instability rising around ${reading.room.toLowerCase()} walking pattern.`
            : `Movement pattern stable in ${reading.room.toLowerCase()}.`;

  return { state, riskScore: Math.round(riskScore), stabilityScore, message, features };
}

export function makeSensorTick(index: number): SensorReading {
  const base = baseReadings[index % baseReadings.length];
  const wave = Math.sin(index / 2.3);
  const room = rooms[index % rooms.length];
  const sway = clamp(base.sway + wave * 0.08 + (room === "Bathroom" ? 0.1 : 0), 0.18, 0.94);
  const gaitSpeed = clamp(base.gait_speed + Math.cos(index / 3) * 0.08 - (room === "Bathroom" ? 0.08 : 0), 0.42, 1.04);
  const fallRisk = clamp(base.fall_risk + roomBias[room] + wave * 8, 12, 96);

  return {
    ...base,
    timestamp: new Date().toISOString(),
    room,
    gait_speed: Number(gaitSpeed.toFixed(2)),
    sway: Number(sway.toFixed(2)),
    cadence: Math.round(clamp(base.cadence + wave * 7, 68, 112)),
    turning_velocity: Math.round(clamp(base.turning_velocity + (room === "Bathroom" ? 16 : 0) + wave * 9, 24, 112)),
    instability_score: Math.round(clamp(base.instability_score + roomBias[room] + wave * 10, 14, 97)),
    fall_risk: Math.round(fallRisk),
    near_fall: fallRisk > 84 || (room === "Bathroom" && index % 9 === 0),
    ax: Number((base.ax + wave * 0.06).toFixed(2)),
    ay: Number((base.ay - wave * 0.05).toFixed(2)),
    az: Number((base.az + wave * 0.03).toFixed(2)),
    gx: Number((base.gx + wave * 0.09).toFixed(2)),
    gy: Number((base.gy - wave * 0.07).toFixed(2)),
    gz: Number((base.gz + wave * 0.06).toFixed(2))
  };
}

export function alertFrom(reading: SensorReading, risk: AIInference): AlertItem | null {
  if (risk.riskScore < 58 && !reading.near_fall) return null;

  const severity = risk.riskScore > 90 ? "emergency" : risk.riskScore > 78 ? "high" : risk.riskScore > 64 ? "medium" : "low";
  return {
    id: `${reading.timestamp}-${reading.room}-${risk.state}`,
    timestamp: reading.timestamp,
    room: reading.room,
    severity,
    title: reading.near_fall ? "Near-fall event detected" : risk.state === "abnormal turning" ? "Abnormal gait pattern detected" : "Instability threshold crossed",
    detail: risk.message,
    acknowledged: false
  };
}

export function roomRisks(readings: SensorReading[]): RoomRisk[] {
  return rooms.map((room) => {
    const roomReadings = readings.filter((reading) => reading.room === room);
    const usage = roomReadings.length;
    const risk = usage ? roomReadings.reduce((sum, reading) => sum + reading.fall_risk, 0) / usage : roomBias[room];
    return {
      room,
      risk: Math.round(clamp(risk + roomBias[room] * 0.25, 0, 100)),
      usage,
      nearFalls: roomReadings.filter((reading) => reading.near_fall).length,
      trend: Math.round((risk - 45) / 4)
    };
  });
}
