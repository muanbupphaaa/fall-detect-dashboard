import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "soft" | "safe" | "warning" | "danger" | "care";

const variants: Record<BadgeVariant, string> = {
  soft: "border-white/10 bg-white/[0.06] text-slate-200",
  safe: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-300/35 bg-amber-400/12 text-amber-200",
  danger: "border-rose-300/40 bg-rose-500/15 text-rose-100",
  care: "border-cyan-300/35 bg-cyan-400/12 text-cyan-100",
};

export function Badge({
  className,
  variant = "soft",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
