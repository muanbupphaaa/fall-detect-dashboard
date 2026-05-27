import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function riskColor(score: number) {
  if (score >= 82) return "#ef4444";
  if (score >= 62) return "#f97316";
  if (score >= 42) return "#facc15";
  return "#22c55e";
}

export function severityTone(severity: string) {
  switch (severity) {
    case "emergency":
      return "border-rose-400/50 bg-rose-500/15 text-rose-100";
    case "high":
      return "border-orange-300/50 bg-orange-400/15 text-orange-100";
    case "medium":
      return "border-amber-300/50 bg-amber-400/15 text-amber-100";
    default:
      return "border-emerald-300/40 bg-emerald-400/10 text-emerald-100";
  }
}

export function formatClock(timestamp: string) {
  const date = new Date(timestamp);
  const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return `${String(bangkokDate.getUTCHours()).padStart(2, "0")}:${String(
    bangkokDate.getUTCMinutes(),
  ).padStart(2, "0")}`;
}
