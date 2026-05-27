"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";
import { severityTone } from "@/lib/utils";

export function CaregiverNotificationDrawer({ floating }: { floating?: boolean }) {
  const { alerts, notificationOpen, openNotifications, closeNotifications } =
    useMonitoringStore();

  if (!floating) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Notification Routing</CardTitle>
          <button
            onClick={openNotifications}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm"
          >
            Open drawer
          </button>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-300">
            Emergency alerts are routed to the primary caregiver first, then the care circle
            and concierge if unacknowledged.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog.Root open={notificationOpen} onOpenChange={(open) => (open ? openNotifications() : closeNotifications())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-slate-950 p-5 shadow-glow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="h-5 w-5 text-cyan-300" />
              Caregiver notifications
            </Dialog.Title>
            <Dialog.Close className="rounded-lg border border-white/10 p-2">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="mt-5 space-y-3">
            {alerts.slice(0, 8).map((alert) => (
              <div key={alert.id} className={`rounded-lg border p-3 ${severityTone(alert.severity)}`}>
                <div className="flex items-start justify-between gap-3">
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
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
