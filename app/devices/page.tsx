"use client";

import { BatteryCharging, Cpu, Router, Smartphone, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const devices = [
  { name: "สายรัดตรวจจับการเดิน", icon: Smartphone, battery: 86, latency: "18 ms", status: "กำลังส่งข้อมูล" },
  { name: "เซนเซอร์ห้องน้ำ", icon: Wifi, battery: 100, latency: "24 ms", status: "ออนไลน์" },
  { name: "เกตเวย์ทางเดิน", icon: Router, battery: 100, latency: "12 ms", status: "ออนไลน์" },
  { name: "ระบบวิเคราะห์ความเสี่ยง", icon: Cpu, battery: 100, latency: "31 ms", status: "ทำงาน" },
];

export default function DeviceStatusPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {devices.map((device) => (
          <Card key={device.name}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <device.icon className="h-5 w-5 text-cyan-600" />
                <Badge variant="safe">{device.status}</Badge>
              </div>
              <div className="mt-5 font-semibold">{device.name}</div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${batteryTone(device.battery).bg}`}>
                    <BatteryCharging className={`h-4 w-4 ${batteryTone(device.battery).icon}`} />
                  </span>
                  <span className={`font-semibold ${batteryTone(device.battery).text}`}>
                    {device.battery}%
                  </span>
                </span>
                <span>{device.latency}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function batteryTone(battery: number) {
  if (battery >= 80) {
    return {
      bg: "bg-emerald-100",
      icon: "text-emerald-700",
      text: "text-emerald-700",
    };
  }

  if (battery >= 40) {
    return {
      bg: "bg-amber-100",
      icon: "text-amber-700",
      text: "text-amber-700",
    };
  }

  return {
    bg: "bg-rose-100",
    icon: "text-rose-700",
    text: "text-rose-700",
  };
}
