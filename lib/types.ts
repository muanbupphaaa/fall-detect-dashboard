export type Room = "Bedroom" | "Bathroom" | "Kitchen" | "Living Room" | "Hallway";
export type GaitState = "stable" | "unstable" | "high-risk" | "abnormal turning" | "possible fatigue";
export type AlertSeverity = "low" | "medium" | "high" | "emergency";

export interface SensorReading {
  timestamp: string;
  room: Room;
  gait_speed: number;
  sway: number;
  cadence: number;
  turning_velocity: number;
  instability_score: number;
  fall_risk: number;
  near_fall: boolean;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
}

export interface AIFeatures {
  gaitVariability: number;
  swayAmplitude: number;
  cadence: number;
  turningVelocity: number;
  instabilityScore: number;
  confidence: number;
}

export interface AIInference {
  state: GaitState;
  riskScore: number;
  stabilityScore: number;
  message: string;
  features: AIFeatures;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  room: Room;
  severity: AlertSeverity;
  title: string;
  detail: string;
  acknowledged: boolean;
}

export interface RoomRisk {
  room: Room;
  risk: number;
  usage: number;
  nearFalls: number;
  trend: number;
}
