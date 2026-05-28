"use client";

import { AlertTriangle } from "lucide-react";
import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { RiskRoomSummaryCard } from "@/components/RiskRoomSummaryCard";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringStore } from "@/store/monitoring-store";
import { formatClock } from "@/lib/utils";

export default function MainDashboardPage() {
  const {
    alerts,
    metrics,
    readings,
    roomRisks,
  } = useMonitoringStore();

  const topRooms = [...roomRisks].sort((a, b) => b.risk - a.risk).slice(0, 3);
  const latestNearFall = [...readings].reverse().find((reading) => reading.near_fall);
  const nearFallDetail = latestNearFall
    ? `ล่าสุด ${formatClock(latestNearFall.timestamp)} · ${roomLabelThai(latestNearFall.room)}`
    : "ยังไม่พบเหตุการณ์วันนี้";

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm font-bold text-slate-700">สรุปวันนี้</div>
            <h2 className="mt-1 text-2xl font-semibold">
              {metrics.riskScore >= 70
                ? "ควรให้ผู้ดูแลเข้าไปดู"
                : metrics.riskScore >= 50
                  ? "มีความเสี่ยงปานกลาง ควรคอยสังเกต"
                  : "ตอนนี้ค่อนข้างปลอดภัย"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-700">
              ห้องที่ควรระวังคือ {topRooms.map((room) => roomLabelThai(room.room)).join(", ")}
            </p>
          </div>
          <LiveMonitoringBadge />
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>แผนที่คอนโดแบบ Heatmap</CardTitle>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                สีแดงคือเสี่ยงสูง สีเขียวคือปกติ และจุดคือการเคลื่อนไหวล่าสุด
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <CondoFloorplanMap className="min-h-[520px]" compact />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <RiskRoomSummaryCard
            riskScore={metrics.riskScore}
            rooms={topRooms}
            roomLabel={roomLabelThai}
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <RiskScoreCard
              label="เกือบล้ม"
              value={metrics.nearFallCount}
              icon={AlertTriangle}
              tone="warning"
              detail="ใน 24 ชม."
              subDetail={nearFallDetail}
              max={10}
            />
          </div>

          <RealtimeAlertPanel alerts={alerts.slice(0, 3)} />

        </div>
      </section>
    </div>
  );
}

function roomLabelThai(room: string) {
  const labels: Record<string, string> = {
    Bedroom: "ห้องนอน",
    Bathroom: "ห้องน้ำ",
    Kitchen: "ห้องครัว",
    "Living Room": "ห้องนั่งเล่น",
    Hallway: "ทางเดิน",
    Balcony: "ระเบียง",
  };

  return labels[room] ?? room;
}
