export type RoomName =
  | "Bedroom"
  | "Bathroom"
  | "Kitchen"
  | "Living Room"
  | "Hallway"
  | "Balcony";

export type AlertSeverity = "low" | "medium" | "high" | "emergency";

export interface SensorReading {
  timestamp: string;
  room: RoomName;
  x: number;
  y: number;
  gait_speed: number;
  sway: number;
  cadence: number;
  turning_velocity: number;
  instability_score: number;
  fall_risk: number;
  fall_detected: boolean;
  near_fall: boolean;
  alert_event_key?: string;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
}

export interface AIInsight {
  id: string;
  title: string;
  detail: string;
  confidence: number;
  severity: AlertSeverity;
  room: RoomName;
  createdAt: string;
}

export interface CareAlert {
  id: string;
  message: string;
  severity: AlertSeverity;
  room: RoomName;
  timestamp: string;
  acknowledged: boolean;
  eventKey?: string;
}

export interface RoomRisk {
  room: RoomName;
  risk: number;
  activity: number;
  instability: number;
}

export interface HeatPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  room: RoomName;
}

export interface PathPoint {
  x: number;
  y: number;
  at: string;
  risk: number;
}

export interface MonitoringMetrics {
  riskScore: number;
  mobilityScore: number;
  nearFallCount: number;
  aiConfidence: number;
  walkCount: number;
  heatIntensity: number;
  stabilityScore: number;
  turningScore: number;
}

export interface TrendDatum {
  time: string;
  mobility: number;
  stability: number;
  risk: number;
  instability: number;
  heat: number;
}

export interface RoomUsageDatum {
  room: RoomName;
  visits: number;
  risk: number;
}

export interface HourlyActivityDatum {
  hour: string;
  steps: number;
}

export interface GaitDatum {
  label: string;
  cadence: number;
  sway: number;
  turning: number;
}
