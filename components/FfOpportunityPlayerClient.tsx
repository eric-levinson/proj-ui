"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FfOpportunity } from "./FfOpportunityTable";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

type MetricOption = {
  id: string;
  label: string;
  category: "Receiving" | "Rushing" | "Total";
  description: string;
  actualKey: keyof FfOpportunity;
  expectedKey: keyof FfOpportunity;
  format?: (value: number) => string;
};

const METRIC_OPTIONS: MetricOption[] = [
  {
    id: "receptions",
    label: "Receptions vs Expected",
    category: "Receiving",
    description: "How actual catches compare to expected receptions.",
    actualKey: "receptions",
    expectedKey: "receptionsExpected",
  },
  {
    id: "receivingYards",
    label: "Receiving Yards vs Expected",
    category: "Receiving",
    description: "Track yardage over expectation on receptions.",
    actualKey: "receivingYards",
    expectedKey: "receivingYardsExpected",
  },
  {
    id: "receivingTD",
    label: "Receiving TD vs Expected",
    category: "Receiving",
    description: "Touchdowns scored versus model expectation.",
    actualKey: "receivingTD",
    expectedKey: "receivingTDExpected",
  },
  {
    id: "receivingFirstDowns",
    label: "Receiving 1st Downs vs Expected",
    category: "Receiving",
    description: "Drive-extending plays compared to expected.",
    actualKey: "receivingFirstDowns",
    expectedKey: "receivingFirstDownsExpected",
  },
  {
    id: "receivingFantasyPoints",
    label: "Receiving Fantasy Pts vs Expected",
    category: "Receiving",
    description: "Fantasy impact relative to expectation.",
    actualKey: "receivingFantasyPoints",
    expectedKey: "receivingFantasyPointsExpected",
  },
  {
    id: "rushingYards",
    label: "Rushing Yards vs Expected",
    category: "Rushing",
    description: "Ground yardage over expectation.",
    actualKey: "rushingYards",
    expectedKey: "rushingYardsExpected",
  },
  {
    id: "rushingTD",
    label: "Rushing TD vs Expected",
    category: "Rushing",
    description: "Rushing scores versus expected.",
    actualKey: "rushingTD",
    expectedKey: "rushingTDExpected",
  },
  {
    id: "rushingFirstDowns",
    label: "Rushing 1st Downs vs Expected",
    category: "Rushing",
    description: "Chain-movers compared with expected.",
    actualKey: "rushingFirstDowns",
    expectedKey: "rushingFirstDownsExpected",
  },
  {
    id: "rushingFantasyPoints",
    label: "Rushing Fantasy Pts vs Expected",
    category: "Rushing",
    description: "Rushing fantasy output relative to expected.",
    actualKey: "rushingFantasyPoints",
    expectedKey: "rushingFantasyPointsExpected",
  },
  {
    id: "totalYards",
    label: "Total Yards vs Expected",
    category: "Total",
    description: "All-purpose yardage versus expectation.",
    actualKey: "totalYards",
    expectedKey: "totalYardsExpected",
  },
  {
    id: "totalTD",
    label: "Total TD vs Expected",
    category: "Total",
    description: "Total touchdowns compared to expected.",
    actualKey: "totalTD",
    expectedKey: "totalTDExpected",
  },
  {
    id: "totalFantasyPoints",
    label: "Total Fantasy Pts vs Expected",
    category: "Total",
    description: "Aggregate fantasy production versus expectation.",
    actualKey: "totalFantasyPoints",
    expectedKey: "totalFantasyPointsExpected",
  },
];

const metricGroups = METRIC_OPTIONS.reduce(
  (groups, option) => {
    groups[option.category] = [...(groups[option.category] ?? []), option];
    return groups;
  },
  {} as Record<MetricOption["category"], MetricOption[]>
);

interface MetricMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function MetricMultiSelect({ value, onChange }: MetricMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = new Set(value);

  const toggleValue = (metricId: string) => {
    const next = new Set(selected);
    if (next.has(metricId)) {
      next.delete(metricId);
    } else {
      next.add(metricId);
    }
    const result = Array.from(next);
    onChange(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3"
        >
          <span className="truncate text-left">
            {value.length ? `${value.length} metric${value.length === 1 ? "" : "s"} selected` : "Select metrics"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] rounded-md border bg-background p-0 shadow-lg"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search metrics..." />
          <CommandEmpty>No metrics found.</CommandEmpty>
          <CommandList>
            {Object.entries(metricGroups).map(([category, options]) => (
              <CommandGroup key={category} heading={category}>
                {options.map((option) => {
                  const isSelected = selected.has(option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      onSelect={() => {
                        toggleValue(option.id);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface FfOpportunityPlayerClientProps {
  data: FfOpportunity[];
}

const colorPalette = [
  "#2563eb",
  "#db2777",
  "#f97316",
  "#16a34a",
  "#7c3aed",
  "#0ea5e9",
];

export function FfOpportunityPlayerClient({ data }: FfOpportunityPlayerClientProps) {
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([
    "receptions",
    "receivingFantasyPoints",
    "totalFantasyPoints",
  ]);

  const selectedOptions = React.useMemo(
    () => METRIC_OPTIONS.filter((option) => selectedMetrics.includes(option.id)),
    [selectedMetrics]
  );

  const chartData = React.useMemo(() => {
    return data.map((row) => {
      const point: Record<string, number | string> = {
        week: row.week,
        label: `Week ${row.week}`,
      };

      selectedOptions.forEach((option) => {
        const actualValue = row[option.actualKey];
        const expectedValue = row[option.expectedKey];
        point[option.id] = typeof actualValue === "number" ? actualValue : Number(actualValue ?? 0);
        point[`${option.id}Expected`] =
          typeof expectedValue === "number" ? expectedValue : Number(expectedValue ?? 0);
      });

      return point;
    });
  }, [data, selectedOptions]);

  const summaries = React.useMemo(() => {
    return selectedOptions.map((option) => {
      const actualTotal = data.reduce((sum, row) => sum + Number(row[option.actualKey] ?? 0), 0);
      const expectedTotal = data.reduce((sum, row) => sum + Number(row[option.expectedKey] ?? 0), 0);
      const diff = actualTotal - expectedTotal;
      return {
        option,
        actualTotal,
        expectedTotal,
        diff,
      };
    });
  }, [data, selectedOptions]);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <MetricMultiSelect value={selectedMetrics} onChange={setSelectedMetrics} />
          </div>
          {selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="gap-1"
                  onClick={() => {
                    setSelectedMetrics((prev) => prev.filter((id) => id !== option.id));
                  }}
                >
                  {option.label}
                  <X className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Pick one or more metrics to compare actual production against expected values. You can search inside the selector to quickly find the categories you care about.
        </p>
      </div>

      {selectedOptions.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Choose at least one metric to visualize opportunity trends.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ left: 8, right: 16, top: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) {
                      return null;
                    }

                    const weekLabel = `Week ${label}`;
                    return (
                      <div className="rounded-md border bg-background p-3 shadow-md">
                        <p className="mb-2 text-sm font-medium text-foreground">{weekLabel}</p>
                        <div className="space-y-1 text-sm">
                          {selectedOptions.map((option) => {
                            const actual = payload.find((item) => item.dataKey === option.id)?.value as
                              | number
                              | undefined;
                            const expected = payload.find((item) => item.dataKey === `${option.id}Expected`)?.value as
                              | number
                              | undefined;
                            const formatter = option.format ?? ((value: number) => numberFormatter.format(value));
                            return (
                              <div key={option.id} className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-muted-foreground">
                                  Actual: {formatter(actual ?? 0)} • Expected: {formatter(expected ?? 0)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                {selectedOptions.map((option, index) => {
                  const color = colorPalette[index % colorPalette.length];
                  return (
                    <React.Fragment key={option.id}>
                      <Line
                        type="monotone"
                        dataKey={option.id}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        name={`${option.label} (Actual)`}
                      />
                      <Line
                        type="monotone"
                        dataKey={`${option.id}Expected`}
                        stroke={color}
                        strokeDasharray="6 4"
                        strokeWidth={2}
                        dot={false}
                        name={`${option.label} (Expected)`}
                      />
                    </React.Fragment>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map(({ option, actualTotal, expectedTotal, diff }) => {
              const formatter = option.format ?? ((value: number) => numberFormatter.format(value));
              const sign = diff === 0 ? "even" : diff > 0 ? "above" : "below";
              return (
                <div key={option.id} className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">Season totals vs expected</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        diff > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200" : diff < 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200" : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {sign}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Actual</dt>
                      <dd className="font-semibold">{formatter(actualTotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Expected</dt>
                      <dd className="font-semibold">{formatter(expectedTotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Difference</dt>
                      <dd className={cn("font-semibold", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : "text-foreground")}> 
                        {diff > 0 ? "+" : ""}
                        {numberFormatter.format(diff)}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default FfOpportunityPlayerClient;
