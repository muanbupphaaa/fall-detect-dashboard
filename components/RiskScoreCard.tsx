"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  risk: "from-rose-400/30 to-rose-500/5 text-rose-100",
  safe: "from-emerald-400/25 to-emerald-500/5 text-emerald-100",
  warning: "from-amber-400/25 to-orange-500/5 text-amber-100",
  care: "from-cyan-400/25 to-sky-500/5 text-cyan-100",
};

export function RiskScoreCard({
  label,
  value,
  icon: Icon,
  detail,
  tone = "care",
  max = 100,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  detail: string;
  tone?: keyof typeof tones;
  max?: number;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("rounded-lg bg-gradient-to-br p-2", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-400">{detail}</span>
        </div>
        <div className="mt-4 text-sm text-slate-400">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-normal">{value}</div>
        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
