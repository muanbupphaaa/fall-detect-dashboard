"use client";

import { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72 min-h-72">
        {mounted ? (
          children
        ) : (
          <div className="h-full rounded-lg border border-white/10 bg-white/[0.025]" />
        )}
      </CardContent>
    </Card>
  );
}
