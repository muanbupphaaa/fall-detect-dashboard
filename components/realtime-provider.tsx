"use client";

import type React from "react";
import { useEffect } from "react";
import { useMonitoringStore } from "@/store/monitoring-store";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const stream = useMonitoringStore((state) => state.stream);

  useEffect(() => {
    const id = window.setInterval(stream, 2600);
    return () => window.clearInterval(id);
  }, [stream]);

  return children;
}
