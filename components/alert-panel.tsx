"use client";

import { BellRing, CheckCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMonitoringStore } from "@/store/monitoring-store";
import { formatTime } from "@/lib/utils";

export function AlertPanel({ limit }: { limit?: number }) {
  const alerts = useMonitoringStore((state) => state.alerts);
  const acknowledgeAlert = useMonitoringStore((state) => state.acknowledgeAlert);
  const visible = limit ? alerts.slice(0, limit) : alerts;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Caregiver notifications</CardTitle>
          <CardDescription>Realtime triage for abnormal movement and inactivity patterns</CardDescription>
        </div>
        <BellRing className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-3">
        {visible.map((alert) => (
          <div key={alert.id} className="flex items-start justify-between gap-3 rounded-lg border bg-background p-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={alert.severity}>{alert.severity}</Badge>
                <span className="text-xs text-muted-foreground">{formatTime(new Date(alert.timestamp))} · {alert.room}</span>
              </div>
              <p className="font-semibold">{alert.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{alert.detail}</p>
            </div>
            <Button variant={alert.acknowledged ? "secondary" : "outline"} size="icon" aria-label="Acknowledge alert" onClick={() => acknowledgeAlert(alert.id)}>
              <CheckCheck className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
