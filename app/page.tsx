"use client";

import { Activity, Footprints, Gauge, RotateCcw, ShieldAlert, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { RiskScoreCard } from "@/components/risk-score-card";
import { WalkingPathMap } from "@/components/walking-path-map";
import { StabilityTrendChart } from "@/components/stability-trend-chart";
import { GaitChart } from "@/components/gait-chart";
import { AlertPanel } from "@/components/alert-panel";
import { AIInsightCard } from "@/components/ai-insight-card";
import { SensorStatus } from "@/components/sensor-status";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function DashboardPage() {
  const current = useMonitoringStore((state) => state.currentReading);
  const inference = useMonitoringStore((state) => state.inference);
  const nearFalls = useMonitoringStore((state) => state.readings.filter((reading) => reading.near_fall).length);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <RiskScoreCard title="Current stability" value={inference.stabilityScore} unit="/100" trend={-4} icon={Gauge} tone={inference.stabilityScore < 45 ? "danger" : "safe"} />
        <RiskScoreCard title="Fall risk score" value={inference.riskScore} unit="/100" trend={7} icon={ShieldAlert} tone={inference.riskScore > 72 ? "danger" : "warn"} />
        <RiskScoreCard title="Walking speed" value={current.gait_speed} unit="m/s" trend={-3} icon={Footprints} />
        <RiskScoreCard title="Turning instability" value={current.turning_velocity} unit="deg/s" trend={9} icon={RotateCcw} tone={current.turning_velocity > 82 ? "danger" : "warn"} />
        <RiskScoreCard title="Sway level" value={Math.round(current.sway * 100)} unit="%" trend={6} icon={Waves} tone={current.sway > 0.62 ? "danger" : "safe"} />
        <RiskScoreCard title="Near-fall count" value={nearFalls} trend={12} icon={Activity} tone={nearFalls > 2 ? "danger" : "warn"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <WalkingPathMap />
        <AIInsightCard />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <StabilityTrendChart />
        <GaitChart />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SensorStatus />
        <AlertPanel limit={3} />
      </section>
    </motion.div>
  );
}
