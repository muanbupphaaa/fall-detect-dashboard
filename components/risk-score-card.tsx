"use client";

import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RiskScoreCard({
  title,
  value,
  unit = "",
  trend,
  icon: Icon,
  tone = "safe"
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend: number;
  icon: LucideIcon;
  tone?: "safe" | "warn" | "danger";
}) {
  const color = tone === "danger" ? "text-red-600" : tone === "warn" ? "text-amber-600" : "text-emerald-600";
  const TrendIcon = trend >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className={cn("rounded-md bg-secondary p-2", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <motion.div key={String(value)} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-semibold">
            {value}
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          </motion.div>
          <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", trend >= 0 ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600")}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trend)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
