"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type OpportunityDiffTickerItem = {
  id: string;
  playerName: string;
  team: string;
  position: string;
  diff: number;
  href: string;
  week: number;
};

interface OpportunityDiffTickerProps {
  items: OpportunityDiffTickerItem[];
  intervalMs?: number;
}

export function OpportunityDiffTicker({
  items,
  intervalMs = 4000,
}: OpportunityDiffTickerProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [items.length, intervalMs]);

  if (!items.length) {
    return null;
  }

  const active = items[index] ?? items[0];
  const isPositive = active.diff >= 0;
  const diffLabel = `${isPositive ? "+" : ""}${active.diff.toFixed(1)} fantasy pts vs expected`;

  return (
    <div className="rounded-lg border bg-background/90 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Week {active.week} standouts</span>
        <span>
          {index + 1}
          <span className="mx-1 text-muted-foreground/50">/</span>
          {items.length}
        </span>
      </div>
      <Link
        href={active.href}
        className="mt-3 flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-4 py-3 transition hover:border-foreground/20 hover:bg-muted/50"
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">
            {active.playerName}
          </span>
          <span className="text-sm text-muted-foreground">
            {[active.team, active.position].filter(Boolean).join(" · ") || ""}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
            isPositive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-200"
              : "bg-rose-100 text-rose-700 dark:bg-rose-600/20 dark:text-rose-200"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {diffLabel}
        </span>
      </Link>
    </div>
  );
}

export default OpportunityDiffTicker;
