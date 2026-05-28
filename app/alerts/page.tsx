"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bell, CheckCircle2, Siren } from "lucide-react";
import { AlertPanel } from "@/components/alert-panel";
import { RiskScoreCard } from "@/components/risk-score-card";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function AlertsPage() {
  const alerts = useMonitoringStore((state) => state.alerts);
  const emergency = alerts.filter((alert) => alert.severity === "emergency").length;
  const unresolved = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <section className="grid gap-4 md:grid-cols-4">
        <RiskScoreCard title="Open notifications" value={unresolved} trend={6} icon={Bell} tone={unresolved > 5 ? "danger" : "warn"} />
        <RiskScoreCard title="Emergency events" value={emergency} trend={emergency > 0 ? 18 : -5} icon={Siren} tone={emergency > 0 ? "danger" : "safe"} />
        <RiskScoreCard title="Acknowledged" value={alerts.length - unresolved} trend={-4} icon={CheckCircle2} />
        <RiskScoreCard title="High severity" value={alerts.filter((alert) => alert.severity === "high").length} trend={9} icon={AlertTriangle} tone="danger" />
      </section>
      <AlertPanel />
    </motion.div>
  );
}
