"use client";

import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export function AIInsightCard() {
  const inference = useMonitoringStore((state) => state.inference);
  const current = useMonitoringStore((state) => state.currentReading);
  const insights = [
    inference.message,
    current.room === "Bathroom" ? "Instability increased near bathroom threshold." : "Most walking remains inside the primary living corridor.",
    inference.features.turningVelocity > 80 ? "Turning velocity spike suggests supervision may be needed." : "Turning behavior is inside expected range.",
    current.near_fall ? "Near-fall detected during the latest room transition." : "No immediate near-fall event in the latest tick."
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>AI abnormal gait detection</CardTitle>
          <CardDescription>Sensor to feature extraction to inference pipeline</CardDescription>
        </div>
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <BrainCircuit className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={inference.riskScore > 78 ? "high" : inference.riskScore > 54 ? "medium" : "low"}>{inference.state}</Badge>
          <Badge>AI confidence {Math.round(inference.features.confidence)}%</Badge>
        </div>
        <div className="grid gap-3">
          {insights.map((insight, index) => (
            <motion.div key={insight} initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.08 }} className="flex gap-3 rounded-lg bg-secondary/55 p-3 text-sm">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{insight}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
