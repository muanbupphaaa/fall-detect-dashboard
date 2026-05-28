import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  low: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  high: "bg-red-500/13 text-red-700 dark:text-red-300",
  emergency: "bg-red-600 text-white",
  neutral: "bg-secondary text-secondary-foreground"
};

export function Badge({ className, variant = "neutral", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", variants[variant], className)} {...props} />;
}
