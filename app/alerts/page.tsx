"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";
import { severityTone } from "@/lib/utils";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useMonitoringStore();
  const emergencyCount = alerts.filter((alert) => alert.severity === "emergency").length;
  const openCount = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
      <div className="space-y-4">
        <RealtimeAlertPanel alerts={alerts.slice(0, 6)} />
        <Card>
          <CardHeader>
            <CardTitle>Escalation Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SummaryItem icon={AlertTriangle} label="Open alerts" value={openCount} />
            <SummaryItem icon={AlertTriangle} label="Emergency alerts" value={emergencyCount} />
            <SummaryItem icon={CheckCircle2} label="Caregiver SLA" value="02:00 min" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Caregiver Alert Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${severityTone(alert.severity)}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === "emergency" ? "danger" : "soft"}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-slate-300">{alert.timestamp}</span>
                  </div>
                  <div className="mt-2 font-semibold">{alert.message}</div>
                  <div className="mt-1 text-sm opacity-80">{alert.room}</div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15 disabled:opacity-50"
                  disabled={alert.acknowledged}
                >
                  {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <div className="flex items-center gap-3 text-slate-300">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span>{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
