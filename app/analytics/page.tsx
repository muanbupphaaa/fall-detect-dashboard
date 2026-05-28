"use client";

import { motion } from "framer-motion";
import { Footprints, LineChart, Timer, TrendingUp } from "lucide-react";
import { RiskScoreCard } from "@/components/risk-score-card";
import { GaitChart } from "@/components/gait-chart";
import { StabilityTrendChart } from "@/components/stability-trend-chart";
import { HourlyMovementChart, RoomUsageChart } from "@/components/analytics-charts";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function AnalyticsPage() {
  const readings = useMonitoringStore((state) => state.readings);
  const current = useMonitoringStore((state) => state.currentReading);
  const averageRisk = Math.round(readings.reduce((sum, reading) => sum + reading.fall_risk, 0) / readings.length);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <section className="grid gap-4 md:grid-cols-4">
        <RiskScoreCard title="Daily walking count" value={readings.length * 38} unit="steps" trend={5} icon={Footprints} />
        <RiskScoreCard title="Avg mobility score" value={100 - averageRisk} unit="/100" trend={-2} icon={TrendingUp} />
        <RiskScoreCard title="Current cadence" value={current.cadence} unit="spm" trend={3} icon={Timer} />
        <RiskScoreCard title="Risk trend" value={averageRisk} unit="/100" trend={8} icon={LineChart} tone={averageRisk > 60 ? "danger" : "warn"} />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <RoomUsageChart />
        <HourlyMovementChart />
        <StabilityTrendChart />
        <GaitChart />
      </section>
    </motion.div>
  );
}
