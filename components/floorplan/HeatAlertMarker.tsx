"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { HeatPoint } from "@/lib/types";

export function HeatAlertMarker({ point }: { point: HeatPoint }) {
  return (
    <foreignObject x={point.x - 18} y={point.y - 38} width="56" height="56">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 8 }}
        animate={{ opacity: 1, scale: [1, 1.12, 1], y: 0 }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4 }}
        className="grid h-9 w-9 place-items-center rounded-full border border-rose-200/70 bg-rose-500/85 text-white shadow-risk"
      >
        <AlertTriangle className="h-5 w-5" />
      </motion.div>
    </foreignObject>
  );
}
