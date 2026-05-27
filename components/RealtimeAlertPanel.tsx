"use client";

import { BellRing } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareAlert } from "@/lib/types";
import { severityTone } from "@/lib/utils";

export function RealtimeAlertPanel({ alerts }: { alerts: CareAlert[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Realtime Alerts</CardTitle>
        <BellRing className="h-4 w-4 text-cyan-300" />
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              className={`rounded-lg border p-3 ${severityTone(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{alert.message}</div>
                  <div className="mt-1 text-xs opacity-75">
                    {alert.room} · {alert.timestamp}
                  </div>
                </div>
                <Badge variant={alert.severity === "emergency" ? "danger" : "soft"}>
                  {alert.severity}
                </Badge>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
