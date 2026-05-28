"use client";

import { motion } from "framer-motion";
import { CalendarClock, HeartHandshake, PhoneCall, UserRoundCheck } from "lucide-react";
import { AlertPanel } from "@/components/alert-panel";
import { AIInsightCard } from "@/components/ai-insight-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CaregiverPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 xl:pb-0">
      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>Caregiver overview</CardTitle>
            <CardDescription>Resident wellness, escalation readiness, and daily context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Primary caregiver", value: "Mina S.", icon: UserRoundCheck },
              { label: "Next check-in", value: "Today 19:30", icon: CalendarClock },
              { label: "Wellness plan", value: "Night bathroom assist", icon: HeartHandshake },
              { label: "Emergency contact", value: "+66 02 555 0198", icon: PhoneCall }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              );
            })}
            <div className="grid grid-cols-2 gap-3">
              <Button>Call caregiver</Button>
              <Button variant="outline">Send report</Button>
            </div>
          </CardContent>
        </Card>
        <AIInsightCard />
      </section>
      <AlertPanel limit={6} />
    </motion.div>
  );
}
