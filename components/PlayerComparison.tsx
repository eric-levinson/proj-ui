"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X, Users } from "lucide-react";
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

type PlayerData = {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  data: FfOpportunity[];
  color: string;
};

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

const colorPalette = [
  "#2563eb", // blue
  "#db2777", // pink
  "#f97316", // orange  
  "#16a34a", // green
  "#7c3aed", // purple
  "#0ea5e9", // sky
  "#dc2626", // red
  "#059669", // emerald
];

interface PlayerComparisonProps {
  currentPlayer: {
    playerId: string;
    playerName: string;
    team: string;
    position: string;
    data: FfOpportunity[];
  };
  metrics: MetricOption[];
  onPlayerSearch: (query: string) => Promise<Array<{
    playerId: string;
    playerName: string;
    team: string;
    position: string;
  }>>;
  onPlayerDataFetch: (playerId: string) => Promise<FfOpportunity[]>;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function PlayerComparison({
  currentPlayer,
  metrics,
  onPlayerSearch,
  onPlayerDataFetch,
}: PlayerComparisonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPlayers, setSelectedPlayers] = React.useState<PlayerData[]>([
    {
      ...currentPlayer,
      color: colorPalette[0],
    },
  ]);
  const [searchResults, setSearchResults] = React.useState<Array<{
    playerId: string;
    playerName: string;
    team: string;
    position: string;
  }>>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedMetric, setSelectedMetric] = React.useState<string>(metrics[0]?.id || "");
  
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const currentMetric = metrics.find(m => m.id === selectedMetric);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = React.useCallback(async (query: string) => {
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await onPlayerSearch(query);
        console.log("Search results for", query, ":", results);
        setSearchResults(results || []);
      } catch (error) {
        console.error("Player search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [onPlayerSearch]);

  const handleAddPlayer = React.useCallback(async (player: {
    playerId: string;
    playerName: string;
    team: string;
    position: string;
  }) => {
    // Check if player already added
    if (selectedPlayers.some(p => p.playerId === player.playerId)) {
      return;
    }

    // Limit to 6 players for readability
    if (selectedPlayers.length >= 6) {
      return;
    }

    try {
      const playerData = await onPlayerDataFetch(player.playerId);
      const newPlayer: PlayerData = {
        ...player,
        data: playerData,
        color: colorPalette[selectedPlayers.length % colorPalette.length],
      };
      
      setSelectedPlayers(prev => [...prev, newPlayer]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  }, [selectedPlayers, onPlayerDataFetch]);

  const handleRemovePlayer = React.useCallback((playerId: string) => {
    if (playerId === currentPlayer.playerId) return; // Can't remove current player
    setSelectedPlayers(prev => prev.filter(p => p.playerId !== playerId));
  }, [currentPlayer.playerId]);

  const chartData = React.useMemo(() => {
    if (!currentMetric) return [];

    // Get all unique weeks from all players
    const allWeeks = Array.from(
      new Set(
        selectedPlayers.flatMap(player => 
          player.data.map(d => d.week)
        )
      )
    ).sort((a, b) => a - b);

    return allWeeks.map(week => {
      const weekData: Record<string, number | string> = { week };
      
      selectedPlayers.forEach(player => {
        const weeklyData = player.data.find(d => d.week === week);
        if (weeklyData) {
          let actualValue: number;
          let expectedValue: number;

          if (currentMetric.isCalculated && currentMetric.calculator) {
            const calculated = currentMetric.calculator(weeklyData);
            actualValue = calculated.actual;
            expectedValue = calculated.expected;
          } else {
            actualValue = Number(weeklyData[currentMetric.actualKey] ?? 0);
            expectedValue = Number(weeklyData[currentMetric.expectedKey] ?? 0);
          }

          weekData[`${player.playerId}_actual`] = actualValue;
          weekData[`${player.playerId}_expected`] = expectedValue;
        }
      });

      return weekData;
    });
  }, [selectedPlayers, currentMetric]);

  const summaryData = React.useMemo(() => {
    if (!currentMetric) return [];

    return selectedPlayers.map(player => {
      let actualTotal: number;
      let expectedTotal: number;

      if (currentMetric.isCalculated && currentMetric.calculator) {
        const weeklyCalculations = player.data.map(row => currentMetric.calculator!(row));
        actualTotal = weeklyCalculations.reduce((sum, calc) => sum + calc.actual, 0) / weeklyCalculations.length;
        expectedTotal = weeklyCalculations.reduce((sum, calc) => sum + calc.expected, 0) / weeklyCalculations.length;
      } else {
        actualTotal = player.data.reduce((sum, row) => sum + Number(row[currentMetric.actualKey] ?? 0), 0);
        expectedTotal = player.data.reduce((sum, row) => sum + Number(row[currentMetric.expectedKey] ?? 0), 0);
      }

      const diff = actualTotal - expectedTotal;
      const formatter = currentMetric.format ?? ((value: number) => numberFormatter.format(value));

      return {
        player,
        actualTotal,
        expectedTotal,
        diff,
        formatter,
      };
    });
  }, [selectedPlayers, currentMetric]);

  if (!isOpen) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full"
        >
          <Users className="mr-2 h-4 w-4" />
          Compare with Other Players
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Player Comparison</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Player selection */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {selectedPlayers.map((player, index) => (
            <div
              key={player.playerId}
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              style={{ borderColor: player.color }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <span className="font-medium">{player.playerName}</span>
              <span className="text-muted-foreground">
                {player.team} · {player.position}
              </span>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemovePlayer(player.playerId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {selectedPlayers.length < 6 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Player
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border border-border shadow-lg p-0" align="start">
              <Command className="bg-background border-0" shouldFilter={false}>
                <div className="border-b px-3 py-2">
                  <CommandInput
                    placeholder="Search players..."
                    value={searchQuery}
                    onValueChange={handleSearch}
                    className="bg-background border-0 px-0 py-1"
                  />
                </div>
                <CommandList className="bg-background max-h-[200px]">
                  {isSearching ? (
                    <CommandEmpty className="bg-background py-6 text-center text-sm">
                      Searching...
                    </CommandEmpty>
                  ) : searchQuery.length < 2 ? (
                    <CommandEmpty className="bg-background py-6 text-center text-sm">
                      Type at least 2 characters
                    </CommandEmpty>
                  ) : searchResults.length === 0 ? (
                    <CommandEmpty className="bg-background py-6 text-center text-sm">
                      No players found
                    </CommandEmpty>
                  ) : (
                    <CommandGroup heading="Players" className="bg-background">
                      {searchResults.map((player) => (
                        <CommandItem
                          key={player.playerId}
                          value={`${player.playerId}-${player.playerName}`}
                          onSelect={() => handleAddPlayer(player)}
                          disabled={selectedPlayers.some(p => p.playerId === player.playerId)}
                          className="bg-background hover:bg-muted data-[selected]:bg-muted cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{player.playerName}</span>
                            <span className="text-xs text-muted-foreground">
                              {player.team} · {player.position}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Metric selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Compare Metric:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {currentMetric ? currentMetric.label : "Select metric"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background border border-border shadow-lg p-0" align="start">
            <Command className="bg-background border-0">
              <div className="border-b px-3 py-2">
                <CommandInput placeholder="Search metrics..." className="bg-background border-0 px-0 py-1" />
              </div>
              <CommandList className="bg-background max-h-[300px]">
                <CommandEmpty className="bg-background py-6 text-center text-sm">No metrics found.</CommandEmpty>
                {Object.entries(
                  metrics.reduce((groups, metric) => {
                    groups[metric.category] = [...(groups[metric.category] ?? []), metric];
                    return groups;
                  }, {} as Record<string, MetricOption[]>)
                ).map(([category, categoryMetrics]) => (
                  <CommandGroup key={category} heading={category} className="bg-background">
                    {categoryMetrics.map((metric) => (
                      <CommandItem
                        key={metric.id}
                        onSelect={() => setSelectedMetric(metric.id)}
                        className="bg-background hover:bg-muted data-[selected]:bg-muted cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMetric === metric.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{metric.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {metric.description}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Comparison charts and data */}
      {currentMetric && (
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Trend Chart</TabsTrigger>
            <TabsTrigger value="summary">Season Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
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
                      if (!active || !payload || payload.length === 0) return null;

                      return (
                        <div className="rounded-md border bg-background p-3 shadow-md">
                          <p className="mb-2 text-sm font-medium">Week {label}</p>
                          <p className="mb-1 text-sm font-medium">{currentMetric.label}</p>
                          <div className="space-y-1 text-sm">
                            {selectedPlayers.map((player) => {
                              const actualValue = payload.find((item) => item.dataKey === `${player.playerId}_actual`)?.value as number | undefined;
                              const formatter = currentMetric.format ?? ((value: number) => numberFormatter.format(value));
                              
                              if (actualValue !== undefined) {
                                return (
                                  <div key={player.playerId} className="flex items-center gap-2">
                                    <div
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: player.color }}
                                    />
                                    <span className="font-medium">{player.playerName}:</span>
                                    <span>{formatter(actualValue)}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  {selectedPlayers.map((player) => (
                    <Line
                      key={player.playerId}
                      type="monotone"
                      dataKey={`${player.playerId}_actual`}
                      stroke={player.color}
                      strokeWidth={2}
                      dot={false}
                      name={player.playerName}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {summaryData.map(({ player, actualTotal, expectedTotal, diff, formatter }) => {
                const sign = diff === 0 ? "even" : diff > 0 ? "above" : "below";
                const isRate = currentMetric.isCalculated && (currentMetric.id.includes("Rate") || currentMetric.id.includes("Share"));
                
                return (
                  <div key={player.playerId} className="rounded-lg border bg-background p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <div>
                          <p className="text-sm font-medium">{player.playerName}</p>
                          <p className="text-xs text-muted-foreground">{player.team} · {player.position}</p>
                        </div>
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}