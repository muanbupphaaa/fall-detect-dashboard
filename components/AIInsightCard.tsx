"use client";

import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIInsight } from "@/lib/types";

export function AIInsightCard({ insight }: { insight: AIInsight }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-cyan-50 p-2 text-cyan-700">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-950">{insight.title}</h3>
                <Badge variant={insight.severity === "high" || insight.severity === "emergency" ? "danger" : "care"}>
                  {insight.confidence}% confidence
                </Badge>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{insight.detail}</p>
              <div className="mt-3 text-xs font-semibold text-slate-600">
                {insight.room} · {insight.createdAt}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
