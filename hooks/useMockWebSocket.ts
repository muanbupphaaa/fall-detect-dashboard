"use client";

import { useEffect } from "react";
import { generateReading } from "@/lib/mock-data";
import { useMonitoringStore } from "@/store/monitoring-store";

export function useMockWebSocket() {
  const applyReading = useMonitoringStore((state) => state.applyReading);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentIndex = useMonitoringStore.getState().streamIndex;
      applyReading(generateReading(currentIndex, new Date()));
    }, 1600);

    return () => window.clearInterval(timer);
  }, [applyReading]);
}
