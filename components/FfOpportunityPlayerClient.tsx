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
  ScatterChart,
  Scatter,
  ReferenceLine,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { FfOpportunity } from "./FfOpportunityTable";
import { PlayerComparison } from "./PlayerComparison";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

type MetricOption = {
  id: string;
  label: string;
  category: "Receiving" | "Rushing" | "Passing" | "Total" | "Efficiency" | "Usage";
  description: string;
  actualKey: keyof FfOpportunity;
  expectedKey: keyof FfOpportunity;
  format?: (value: number) => string;
  isCalculated?: boolean;
  calculator?: (data: FfOpportunity) => { actual: number; expected: number };
};

const METRIC_OPTIONS: MetricOption[] = [
  // Receiving Metrics
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
    id: "receivingInterceptions",
    label: "Receiving Interceptions vs Expected",
    category: "Receiving",
    description: "Interceptions thrown when targeting this player.",
    actualKey: "receivingInterceptions",
    expectedKey: "receivingInterceptionsExpected",
  },
  {
    id: "receivingTwoPointConv",
    label: "Receiving 2PT Conv vs Expected",
    category: "Receiving",
    description: "Two-point conversions caught vs expected.",
    actualKey: "receivingTwoPointConv",
    expectedKey: "receivingTwoPointConvExpected",
  },
  // Rushing Metrics
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
    id: "rushingTwoPointConv",
    label: "Rushing 2PT Conv vs Expected",
    category: "Rushing",
    description: "Two-point conversions rushed vs expected.",
    actualKey: "rushingTwoPointConv",
    expectedKey: "rushingTwoPointConvExpected",
  },
  // Passing Metrics
  {
    id: "passingCompletions",
    label: "Completions vs Expected",
    category: "Passing",
    description: "Pass completions versus expected rate.",
    actualKey: "passingCompletions",
    expectedKey: "passingCompletionsExpected",
  },
  {
    id: "passingYards",
    label: "Passing Yards vs Expected",
    category: "Passing",
    description: "Air production versus the expected baseline.",
    actualKey: "passingYards",
    expectedKey: "passingYardsExpected",
  },
  {
    id: "passingTD",
    label: "Passing TD vs Expected",
    category: "Passing",
    description: "Passing touchdowns relative to model expectations.",
    actualKey: "passingTD",
    expectedKey: "passingTDExpected",
  },
  {
    id: "passingFirstDowns",
    label: "Passing 1st Downs vs Expected",
    category: "Passing",
    description: "Drive extenders compared with expected quarterback output.",
    actualKey: "passingFirstDowns",
    expectedKey: "passingFirstDownsExpected",
  },
  {
    id: "passingFantasyPoints",
    label: "Passing Fantasy Pts vs Expected",
    category: "Passing",
    description: "Passing fantasy totals against expectation.",
    actualKey: "passingFantasyPoints",
    expectedKey: "passingFantasyPointsExpected",
  },
  {
    id: "passingInterceptions",
    label: "Interceptions vs Expected",
    category: "Passing",
    description: "Interceptions thrown versus expected rate.",
    actualKey: "passingInterceptions",
    expectedKey: "passingInterceptionsExpected",
  },
  {
    id: "passingTwoPointConv",
    label: "Passing 2PT Conv vs Expected",
    category: "Passing",
    description: "Two-point conversions passed vs expected.",
    actualKey: "passingTwoPointConv",
    expectedKey: "passingTwoPointConvExpected",
  },
  // Total Metrics
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
    id: "totalFirstDowns",
    label: "Total 1st Downs vs Expected",
    category: "Total",
    description: "All first downs compared to expected.",
    actualKey: "totalFirstDowns",
    expectedKey: "totalFirstDownsExpected",
  },
  {
    id: "totalFantasyPoints",
    label: "Total Fantasy Pts vs Expected",
    category: "Total",
    description: "Aggregate fantasy production versus expectation.",
    actualKey: "totalFantasyPoints",
    expectedKey: "totalFantasyPointsExpected",
  },
  // Efficiency Metrics (calculated)
  {
    id: "receptionRate",
    label: "Reception Rate",
    category: "Efficiency",
    description: "Catch rate on targets (actual vs expected based on target quality).",
    actualKey: "receptions", // placeholder
    expectedKey: "receptionsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
    calculator: (data: FfOpportunity) => ({
      actual: data.targets > 0 ? data.receptions / data.targets : 0,
      expected: data.targets > 0 ? data.receptionsExpected / data.targets : 0,
    }),
  },
  {
    id: "yardsPerReception",
    label: "Yards per Reception",
    category: "Efficiency",
    description: "Average yards gained per catch (actual vs expected).",
    actualKey: "receivingYards", // placeholder
    expectedKey: "receivingYardsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => value.toFixed(1),
    calculator: (data: FfOpportunity) => ({
      actual: data.receptions > 0 ? data.receivingYards / data.receptions : 0,
      expected: data.receptionsExpected > 0 ? data.receivingYardsExpected / data.receptionsExpected : 0,
    }),
  },
  {
    id: "yardsPerTarget",
    label: "Yards per Target",
    category: "Efficiency",
    description: "Average yards gained per target (actual vs expected).",
    actualKey: "receivingYards", // placeholder
    expectedKey: "receivingYardsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => value.toFixed(1),
    calculator: (data: FfOpportunity) => ({
      actual: data.targets > 0 ? data.receivingYards / data.targets : 0,
      expected: data.targets > 0 ? data.receivingYardsExpected / data.targets : 0,
    }),
  },
  {
    id: "airYardsPerTarget",
    label: "Air Yards per Target",
    category: "Efficiency",
    description: "Average air yards (depth of target) per target.",
    actualKey: "airYards", // placeholder
    expectedKey: "airYards", // placeholder (no expected for air yards)
    isCalculated: true,
    format: (value: number) => value.toFixed(1),
    calculator: (data: FfOpportunity) => ({
      actual: data.targets > 0 ? data.airYards / data.targets : 0,
      expected: data.targets > 0 ? data.airYards / data.targets : 0, // No expected version
    }),
  },
  {
    id: "yardsPerRush",
    label: "Yards per Rush",
    category: "Efficiency",
    description: "Average yards gained per rush attempt (actual vs expected).",
    actualKey: "rushingYards", // placeholder
    expectedKey: "rushingYardsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => value.toFixed(1),
    calculator: (data: FfOpportunity) => ({
      actual: data.rushingAttempts > 0 ? data.rushingYards / data.rushingAttempts : 0,
      expected: data.rushingAttempts > 0 ? data.rushingYardsExpected / data.rushingAttempts : 0,
    }),
  },
  {
    id: "completionRate",
    label: "Completion Rate",
    category: "Efficiency",
    description: "Pass completion rate (actual vs expected).",
    actualKey: "passingCompletions", // placeholder
    expectedKey: "passingCompletionsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
    calculator: (data: FfOpportunity) => ({
      actual: data.passingAttempts > 0 ? data.passingCompletions / data.passingAttempts : 0,
      expected: data.passingAttempts > 0 ? data.passingCompletionsExpected / data.passingAttempts : 0,
    }),
  },
  {
    id: "yardsPerPass",
    label: "Yards per Pass Attempt",
    category: "Efficiency",
    description: "Average yards gained per pass attempt (actual vs expected).",
    actualKey: "passingYards", // placeholder
    expectedKey: "passingYardsExpected", // placeholder
    isCalculated: true,
    format: (value: number) => value.toFixed(1),
    calculator: (data: FfOpportunity) => ({
      actual: data.passingAttempts > 0 ? data.passingYards / data.passingAttempts : 0,
      expected: data.passingAttempts > 0 ? data.passingYardsExpected / data.passingAttempts : 0,
    }),
  },
  // Usage/Share Metrics (calculated)
  {
    id: "targetShare",
    label: "Target Share",
    category: "Usage",
    description: "Percentage of team targets received by this player.",
    actualKey: "targets", // placeholder
    expectedKey: "targets", // placeholder
    isCalculated: true,
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
    calculator: (data: FfOpportunity) => ({
      actual: data.teamTargets > 0 ? data.targets / data.teamTargets : 0,
      expected: data.teamTargets > 0 ? data.targets / data.teamTargets : 0, // No expected version
    }),
  },
  {
    id: "rushShare",
    label: "Rush Share",
    category: "Usage",
    description: "Percentage of team rush attempts by this player.",
    actualKey: "rushingAttempts", // placeholder
    expectedKey: "rushingAttempts", // placeholder
    isCalculated: true,
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
    calculator: (data: FfOpportunity) => ({
      actual: data.teamRushAttempts > 0 ? data.rushingAttempts / data.teamRushAttempts : 0,
      expected: data.teamRushAttempts > 0 ? data.rushingAttempts / data.teamRushAttempts : 0, // No expected version
    }),
  },
  {
    id: "airYardShare",
    label: "Air Yard Share",
    category: "Usage",
    description: "Percentage of team air yards allocated to this player.",
    actualKey: "airYards", // placeholder
    expectedKey: "airYards", // placeholder
    isCalculated: true,
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
    calculator: (data: FfOpportunity) => ({
      actual: data.teamReceivingAirYards > 0 ? data.airYards / data.teamReceivingAirYards : 0,
      expected: data.teamReceivingAirYards > 0 ? data.airYards / data.teamReceivingAirYards : 0, // No expected version
    }),
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
  const metricIds = React.useMemo(
    () => new Set(METRIC_OPTIONS.map((option) => option.id)),
    []
  );

  const defaultMetricSelection = React.useMemo(() => {
    const position = data[0]?.position?.toUpperCase() ?? "";

    let defaults: string[];

    if (position === "QB") {
      defaults = ["completionRate", "yardsPerPass", "passingFantasyPoints", "totalFantasyPoints"];
    } else if (position === "RB") {
      defaults = ["rushShare", "yardsPerRush", "rushingFantasyPoints", "totalFantasyPoints"];
    } else if (position === "WR" || position === "TE") {
      defaults = [
        "targetShare",
        "receptionRate", 
        "yardsPerTarget",
        "receivingFantasyPoints",
        "totalFantasyPoints",
      ];
    } else {
      defaults = ["totalFantasyPoints"];
    }

    const filtered = defaults.filter((id) => metricIds.has(id));

    if (filtered.length > 0) {
      return filtered;
    }

    // fallback to original defaults if necessary
    const original = [
      "receptions",
      "receivingFantasyPoints",
      "totalFantasyPoints",
    ].filter((id) => metricIds.has(id));

    return original.length ? original : [METRIC_OPTIONS[0]?.id].filter(Boolean) as string[];
  }, [data, metricIds]);

  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>(
    defaultMetricSelection
  );

  React.useEffect(() => {
    setSelectedMetrics(defaultMetricSelection);
  }, [defaultMetricSelection]);

  const selectedOptions = React.useMemo(
    () => METRIC_OPTIONS.filter((option) => selectedMetrics.includes(option.id)),
    [selectedMetrics]
  );

  const [chartView, setChartView] = React.useState<"trend" | "scatter">("trend");

  // Player comparison functions
  const handlePlayerSearch = React.useCallback(async (query: string) => {
    try {
      const response = await fetch('/api/players/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Player search error:', error);
      return [];
    }
  }, []);

  const handlePlayerDataFetch = React.useCallback(async (playerId: string) => {
    try {
      const response = await fetch('/api/players/ff-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });
      
      if (!response.ok) {
        throw new Error('Data fetch failed');
      }
      
      const playerData = await response.json();
      return playerData;
    } catch (error) {
      console.error('Player data fetch error:', error);
      return [];
    }
  }, []);

  const scatterSeries = React.useMemo(
    () =>
      selectedOptions.map((option) => {
        const formatter = option.format ?? ((value: number) => numberFormatter.format(value));
        const points = data.map((row) => {
          let actualValue: number;
          let expectedValue: number;

          if (option.isCalculated && option.calculator) {
            const calculated = option.calculator(row);
            actualValue = calculated.actual;
            expectedValue = calculated.expected;
          } else {
            actualValue = Number(row[option.actualKey] ?? 0);
            expectedValue = Number(row[option.expectedKey] ?? 0);
          }

          return {
            week: row.week,
            actual: Number.isFinite(actualValue) ? actualValue : 0,
            expected: Number.isFinite(expectedValue) ? expectedValue : 0,
            label: `Week ${row.week}`,
            metricId: option.id,
            metricLabel: option.label,
          };
        });

        return {
          option,
          formatter,
          points,
        };
      }),
    [data, selectedOptions]
  );

  const scatterDomain = React.useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    scatterSeries.forEach(({ points }) => {
      points.forEach((point) => {
        if (Number.isFinite(point.actual)) {
          min = Math.min(min, point.actual);
          max = Math.max(max, point.actual);
        }
        if (Number.isFinite(point.expected)) {
          min = Math.min(min, point.expected);
          max = Math.max(max, point.expected);
        }
      });
    });

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { min: 0, max: 1 };
    }

    if (min === max) {
      const padding = Math.abs(min) * 0.1 || 1;
      return { min: min - padding, max: max + padding };
    }

    const padding = (max - min) * 0.08;
    return { min: min - padding, max: max + padding };
  }, [scatterSeries]);

  const chartData = React.useMemo(() => {
    return data.map((row) => {
      const point: Record<string, number | string> = {
        week: row.week,
        label: `Week ${row.week}`,
      };

      selectedOptions.forEach((option) => {
        if (option.isCalculated && option.calculator) {
          const calculated = option.calculator(row);
          point[option.id] = calculated.actual;
          point[`${option.id}Expected`] = calculated.expected;
        } else {
          const actualValue = row[option.actualKey];
          const expectedValue = row[option.expectedKey];
          point[option.id] = typeof actualValue === "number" ? actualValue : Number(actualValue ?? 0);
          point[`${option.id}Expected`] =
            typeof expectedValue === "number" ? expectedValue : Number(expectedValue ?? 0);
        }
      });

      return point;
    });
  }, [data, selectedOptions]);

  const summaries = React.useMemo(() => {
    return selectedOptions.map((option) => {
      let actualTotal: number;
      let expectedTotal: number;

      if (option.isCalculated && option.calculator) {
        // For calculated metrics, average the weekly values
        const weeklyCalculations = data.map((row) => option.calculator!(row));
        actualTotal = weeklyCalculations.reduce((sum, calc) => sum + calc.actual, 0) / weeklyCalculations.length;
        expectedTotal = weeklyCalculations.reduce((sum, calc) => sum + calc.expected, 0) / weeklyCalculations.length;
      } else {
        // For raw metrics, sum the weekly values
        actualTotal = data.reduce((sum, row) => sum + Number(row[option.actualKey] ?? 0), 0);
        expectedTotal = data.reduce((sum, row) => sum + Number(row[option.expectedKey] ?? 0), 0);
      }

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

      {/* Player Comparison Component */}
      <PlayerComparison
        currentPlayer={{
          playerId: data[0]?.playerId || "",
          playerName: data[0]?.fullName || "",
          team: data[0]?.team || "",
          position: data[0]?.position || "",
          data: data,
        }}
        metrics={METRIC_OPTIONS}
        onPlayerSearch={handlePlayerSearch}
        onPlayerDataFetch={handlePlayerDataFetch}
      />

      {selectedOptions.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Choose at least one metric to visualize opportunity trends.
          </p>
        </div>
      ) : (
        <>
          <Tabs
            value={chartView}
            onValueChange={(value) => setChartView(value as "trend" | "scatter")}
            className="space-y-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-muted-foreground">
                Visualization mode
              </h3>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="trend">Line trend</TabsTrigger>
                <TabsTrigger value="scatter">Actual vs Expected</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="trend" className="mt-0">
              <div className="rounded-lg border bg-background p-4 shadow-sm">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ left: 8, right: 16, top: 12, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      label={{ value: "Week", position: "insideBottom", offset: -12 }}
                    />
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
                                let actual: number | undefined;
                                let expected: number | undefined;

                                if (option.isCalculated && option.calculator) {
                                  const weekData = data.find((row) => row.week === Number(label));
                                  if (weekData) {
                                    const calculated = option.calculator(weekData);
                                    actual = calculated.actual;
                                    expected = calculated.expected;
                                  }
                                } else {
                                  actual = payload.find((item) => item.dataKey === option.id)?.value as
                                    | number
                                    | undefined;
                                  expected = payload.find((item) => item.dataKey === `${option.id}Expected`)?.value as
                                    | number
                                    | undefined;
                                }

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
                    <Legend wrapperStyle={{ paddingTop: 16 }} />
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
            </TabsContent>

            <TabsContent value="scatter" className="mt-0">
              <div className="rounded-lg border bg-background p-4 pb-6 shadow-sm">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ left: 16, right: 32, top: 12, bottom: 32 }}>
                    <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
                    <XAxis
                      type="number"
                      dataKey="expected"
                      name="Expected"
                      domain={[scatterDomain.min, scatterDomain.max]}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => Math.round(value).toString()}
                      allowDecimals={false}
                      label={{ value: "Expected", position: "insideBottom", offset: -12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="actual"
                      name="Actual"
                      domain={[scatterDomain.min, scatterDomain.max]}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => Math.round(value).toString()}
                      allowDecimals={false}
                      label={{ value: "Actual", angle: -90, position: "insideLeft", offset: 10 }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "4 4" }}
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) {
                          return null;
                        }

                        const point = payload[0]?.payload as
                          | { week: number; actual: number; expected: number; metricId: string }
                          | undefined;

                        if (!point) {
                          return null;
                        }

                        const series = scatterSeries.find((item) => item.option.id === point.metricId);
                        const formatter = series?.formatter ?? ((value: number) => numberFormatter.format(value));

                        return (
                          <div className="rounded-md border bg-background p-3 shadow-md">
                            <p className="text-sm font-medium text-foreground">
                              {series?.option.label ?? "Metric"}
                            </p>
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Week</span>
                                <span className="font-semibold">{point.week}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Actual</span>
                                <span className="font-semibold">{formatter(point.actual)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Expected</span>
                                <span className="font-semibold">{formatter(point.expected)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 8 }} />
                    <ReferenceLine
                      stroke="var(--muted-foreground)"
                      strokeDasharray="6 6"
                      segment={[
                        { x: scatterDomain.min, y: scatterDomain.min },
                        { x: scatterDomain.max, y: scatterDomain.max },
                      ]}
                    />
                    {scatterSeries.map((series, index) => {
                      const color = colorPalette[index % colorPalette.length];
                      return (
                        <Scatter
                          key={series.option.id}
                          name={series.option.label}
                          data={series.points.map((point) => ({ ...point, metricId: series.option.id }))}
                          fill={color}
                          fillOpacity={0.85}
                        />
                      );
                    })}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map(({ option, actualTotal, expectedTotal, diff }) => {
              const formatter = option.format ?? ((value: number) => numberFormatter.format(value));
              const sign = diff === 0 ? "even" : diff > 0 ? "above" : "below";
              const isRate = option.isCalculated && (option.id.includes("Rate") || option.id.includes("Share"));
              const summaryLabel = isRate ? "Season average vs expected" : "Season totals vs expected";
              
              return (
                <div key={option.id} className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{summaryLabel}</p>
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
                        {isRate ? `${(diff * 100).toFixed(1)}%` : numberFormatter.format(diff)}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default FfOpportunityPlayerClient;
