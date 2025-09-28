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
import { 
  Check, 
  ChevronsUpDown, 
  X, 
  Plus,
  Filter,
  ChevronDown,
  ChevronRight,
  Settings,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { FfOpportunity } from "./FfOpportunityTable";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

// Helper function to format values using metric-specific formatters
const formatMetricValue = (value: number, metricId: string): string => {
  const metric = METRIC_OPTIONS.find(m => m.id === metricId);
  if (metric?.format) {
    return metric.format(value);
  }
  return numberFormatter.format(value);
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

const colorPalette = [
  {
    base: "#2563eb",
    shades: ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
    name: "blue"
  },
  {
    base: "#f97316", 
    shades: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"],
    name: "orange"
  },
  {
    base: "#16a34a",
    shades: ["#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac"],
    name: "green"
  },
  {
    base: "#dc2626",
    shades: ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"],
    name: "red"
  },
  {
    base: "#7c3aed",
    shades: ["#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd"],
    name: "purple"
  },
  {
    base: "#db2777",
    shades: ["#be185d", "#db2777", "#ec4899", "#f472b6", "#f9a8d4"],
    name: "pink"
  },
  {
    base: "#0ea5e9",
    shades: ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
    name: "sky"
  },
  {
    base: "#059669",
    shades: ["#047857", "#059669", "#10b981", "#34d399", "#6ee7b7"],
    name: "emerald"
  },
];

type PlayerData = {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  data: FfOpportunity[];
  colorScheme: {
    base: string;
    shades: string[];
    name: string;
  };
};

type VisualizationMode = "line" | "scatter";

interface FfOpportunityCombinedClientProps {
  data: FfOpportunity[];
}

export default function FfOpportunityCombinedClient({
  data,
}: FfOpportunityCombinedClientProps) {
  // State for configuration
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([
    "receptions",
    "receivingYards",
  ]);
  const [selectedPlayers, setSelectedPlayers] = React.useState<PlayerData[]>([]);
  const [visualizationMode, setVisualizationMode] = React.useState<VisualizationMode>("line");
  const [selectedScatterMetric, setSelectedScatterMetric] = React.useState("receptions");
  
  // State for hover highlighting
  const [hoveredElement, setHoveredElement] = React.useState<string | null>(null);
  
  // Helper function to get color for a specific player-metric combination
  const getMetricColor = (player: PlayerData, metricIndex: number, isExpected: boolean = false) => {
    const shadeIndex = Math.min(metricIndex, player.colorScheme.shades.length - 1);
    const baseColor = player.colorScheme.shades[shadeIndex];
    return isExpected ? baseColor + "80" : baseColor; // Add transparency for expected lines
  };

  // Helper function to get element key for hover tracking
  const getElementKey = (playerId: string, metricId: string, type: "actual" | "expected") => {
    return `${playerId}_${metricId}_${type}`;
  };

  // Custom legend component with hover functionality
  const CustomLegend = ({ payload }: { payload?: Array<{
    value: string;
    type: string;
    color: string;
    dataKey: string;
  }> }) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {payload.map((entry, index) => {
          const dataKey = entry.dataKey;
          const elementKey = dataKey?.replace(/_(actual|expected)$/, '_$1');
          const isHovered = hoveredElement === elementKey;
          const isDimmed = hoveredElement && hoveredElement !== elementKey;
          
          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 cursor-pointer transition-opacity"
              style={{ 
                opacity: isDimmed ? 0.3 : 1,
                fontWeight: isHovered ? 'bold' : 'normal'
              }}
              onMouseEnter={() => setHoveredElement(elementKey || null)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div
                className="w-3 h-3 rounded"
                style={{ 
                  backgroundColor: entry.color,
                  border: entry.dataKey?.includes('expected') ? '2px dashed' : 'none'
                }}
              />
              <span className="text-sm">{entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  // State for player search
  const [playerSearchOpen, setPlayerSearchOpen] = React.useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = React.useState("");
  const [playerSearchResults, setPlayerSearchResults] = React.useState<Array<{
    playerId: string;
    playerName: string;
    team: string;
    position: string;
  }>>([]);
  const [isPlayerSearching, setIsPlayerSearching] = React.useState(false);
  
  // State for metric selection
  const [metricSearchOpen, setMetricSearchOpen] = React.useState(false);
  
  // State for table collapse
  const [isTableOpen, setIsTableOpen] = React.useState(false);
  
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Get unique players from the data for search
  const uniquePlayers = React.useMemo(() => {
    const players = new Map<string, {
      playerId: string;
      playerName: string;
      team: string;
      position: string;
    }>();
    
    data.forEach(row => {
      if (row.fullName && !players.has(row.fullName)) {
        players.set(row.fullName, {
          playerId: row.fullName,
          playerName: row.fullName,
          team: row.team || "",
          position: row.position || "",
        });
      }
    });
    
    return Array.from(players.values());
  }, [data]);

  // Handle player search
  const handlePlayerSearch = React.useCallback(async (query: string) => {
    setPlayerSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length < 2) {
      setPlayerSearchResults([]);
      setIsPlayerSearching(false);
      return;
    }

    setIsPlayerSearching(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      const filtered = uniquePlayers.filter(player =>
        player.playerName.toLowerCase().includes(query.toLowerCase())
      );
      setPlayerSearchResults(filtered);
      setIsPlayerSearching(false);
    }, 300);
  }, [uniquePlayers]);

  // Add player to comparison
  const addPlayer = React.useCallback((player: {
    playerId: string;
    playerName: string;
    team: string;
    position: string;
  }) => {
    if (selectedPlayers.some(p => p.playerId === player.playerId)) {
      return; // Player already added
    }

    const playerData = data.filter(row => row.fullName === player.playerName);
    if (playerData.length === 0) {
      return;
    }

    // Find an unused color scheme
    const usedColorIndices = new Set(selectedPlayers.map(p => 
      colorPalette.findIndex(palette => palette.base === p.colorScheme.base)
    ));
    
    let colorIndex = 0;
    while (usedColorIndices.has(colorIndex) && colorIndex < colorPalette.length) {
      colorIndex++;
    }
    
    // If all colors are used, cycle back to start
    if (colorIndex >= colorPalette.length) {
      colorIndex = selectedPlayers.length % colorPalette.length;
    }

    const newPlayer: PlayerData = {
      ...player,
      data: playerData,
      colorScheme: colorPalette[colorIndex],
    };

    setSelectedPlayers(prev => [...prev, newPlayer]);
    setPlayerSearchOpen(false);
    setPlayerSearchQuery("");
  }, [data, selectedPlayers]);

  // Remove player from comparison
  const removePlayer = React.useCallback((playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.playerId !== playerId));
  }, []);

  // Toggle metric selection
  const toggleMetric = React.useCallback((metricId: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  }, []);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (selectedPlayers.length === 0 || selectedMetrics.length === 0) {
      return [];
    }

    const weeks = new Set<number>();
    selectedPlayers.forEach(player => {
      player.data.forEach(row => {
        if (row.week) weeks.add(row.week);
      });
    });

    return Array.from(weeks).sort().map(week => {
      const weekData: Record<string, number | string> = { week };
      
      selectedPlayers.forEach(player => {
        const weekRow = player.data.find(row => row.week === week);
        if (weekRow) {
          selectedMetrics.forEach(metricId => {
            const metric = METRIC_OPTIONS.find(m => m.id === metricId);
            if (metric) {
              let actual: number;
              let expected: number;
              
              if (metric.isCalculated && metric.calculator) {
                // Use calculator for computed metrics
                const calculated = metric.calculator(weekRow);
                actual = calculated.actual;
                expected = calculated.expected;
              } else {
                // Use direct field access for raw metrics
                actual = weekRow[metric.actualKey] as number;
                expected = weekRow[metric.expectedKey] as number;
              }
              
              weekData[`${player.playerId}_${metricId}_actual`] = actual || 0;
              weekData[`${player.playerId}_${metricId}_expected`] = expected || 0;
              weekData[`${player.playerId}_${metricId}_diff`] = (actual || 0) - (expected || 0);
            }
          });
        }
      });
      
      return weekData;
    });
  }, [selectedPlayers, selectedMetrics]);

  // Filter table data to only selected players
  const filteredData = React.useMemo(() => {
    if (selectedPlayers.length === 0) return [];
    const selectedPlayerNames = new Set(selectedPlayers.map(p => p.playerName));
    return data.filter(row => selectedPlayerNames.has(row.fullName || ''));
  }, [data, selectedPlayers]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Keep selectedScatterMetric in sync with selectedMetrics
  React.useEffect(() => {
    if (!selectedMetrics.includes(selectedScatterMetric)) {
      setSelectedScatterMetric(selectedMetrics[0] || "receptions");
    }
  }, [selectedMetrics, selectedScatterMetric]);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No data to visualize</h3>
            <p className="text-sm text-muted-foreground">
              Select players and metrics to see visualizations
            </p>
          </div>
        </div>
      );
    }

    const primaryMetric = METRIC_OPTIONS.find(m => m.id === selectedMetrics[0]);
    if (!primaryMetric) return null;

    if (visualizationMode === "scatter") {
      // Ensure selected metric is available
      const availableMetric = selectedMetrics.includes(selectedScatterMetric) 
        ? selectedScatterMetric 
        : selectedMetrics[0];
        
      if (!availableMetric) return null;
      
      const metric = METRIC_OPTIONS.find(m => m.id === availableMetric);
      if (!metric) return null;

      // Prepare scatter data for the selected metric
      const scatterData = chartData.map(week => {
        const dataPoint: Record<string, unknown> = { week: week.week };
        selectedPlayers.forEach(player => {
          const expectedKey = `${player.playerId}_${availableMetric}_expected`;
          const actualKey = `${player.playerId}_${availableMetric}_actual`;
          dataPoint[`${player.playerId}_x`] = week[expectedKey];
          dataPoint[`${player.playerId}_y`] = week[actualKey];
        });
        return dataPoint;
      });

      return (
        <div className="space-y-4">
          {/* Metric Selector */}
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border">
            <h4 className="text-lg font-semibold">
              {metric.label}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="min-w-[200px] justify-between bg-background hover:bg-accent shadow-sm">
                  {metric.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border shadow-lg" align="end">
                <DropdownMenuLabel>Select Metric</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {selectedMetrics.map(metricId => {
                  const option = METRIC_OPTIONS.find(m => m.id === metricId);
                  if (!option) return null;
                  return (
                    <DropdownMenuItem 
                      key={metricId}
                      onClick={() => setSelectedScatterMetric(metricId)}
                      className={availableMetric === metricId ? "bg-accent" : ""}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">{option.description}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                dataKey={`${selectedPlayers[0]?.playerId}_x`}
                name="Expected"
                domain={['dataMin', 'dataMax']}
                label={{ value: 'Expected', position: 'bottom', offset: 0 }}
              />
              <YAxis
                type="number" 
                name="Actual"
                domain={['dataMin', 'dataMax']}
                label={{ value: 'Actual', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <p className="text-sm font-medium mb-2">
                          Week {payload[0]?.payload?.week}
                        </p>
                        {selectedPlayers.map(player => {
                          const expected = payload[0]?.payload?.[`${player.playerId}_x`] || 0;
                          const actual = payload[0]?.payload?.[`${player.playerId}_y`] || 0;
                          const formatValue = metric?.format ? metric.format : (v: number) => numberFormatter.format(v);
                          const diff = actual - expected;
                          const diffFormatted = metric?.format ? metric.format(diff) : numberFormatter.format(diff);
                          
                          return (
                            <div key={player.playerId} className="mb-2 last:mb-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div 
                                  className="w-3 h-3 rounded-full border-2"
                                  style={{ 
                                    backgroundColor: player.colorScheme.shades[2],
                                    borderColor: player.colorScheme.shades[4]
                                  }}
                                />
                                <span className="text-sm font-medium">{player.playerName}</span>
                              </div>
                              <div className="text-xs text-muted-foreground ml-5 space-y-0.5">
                                <p>Expected: {formatValue(expected)}</p>
                                <p>Actual: {formatValue(actual)}</p>
                                <p className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  Diff: {diff >= 0 ? '+' : ''}{diffFormatted}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Diagonal reference line (perfect performance) */}
              <ReferenceLine stroke="#666" strokeDasharray="5 5" />
              {selectedPlayers.map((player, index) => (
                <Scatter
                  key={`${player.playerId}_${availableMetric}`}
                  dataKey={`${player.playerId}_y`}
                  name={`${player.playerName}`}
                  fill={player.colorScheme.shades[2]}
                  stroke={player.colorScheme.shades[4]}
                  strokeWidth={3}
                  r={8}
                  onMouseEnter={() => setHoveredElement(`${player.playerId}_${availableMetric}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    filter: hoveredElement && hoveredElement !== `${player.playerId}_${availableMetric}` 
                      ? 'opacity(0.3)' 
                      : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
              <Legend 
                content={({ payload }) => (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {payload?.map((entry, index) => {
                      const player = selectedPlayers[index];
                      if (!player) return null;
                      const elementKey = `${player.playerId}_${availableMetric}`;
                      return (
                        <div 
                          key={elementKey}
                          className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity px-3 py-1 rounded-md hover:bg-muted"
                          onMouseEnter={() => setHoveredElement(elementKey)}
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border-2"
                            style={{ 
                              backgroundColor: player.colorScheme.shades[2],
                              borderColor: player.colorScheme.shades[4]
                            }}
                          />
                          <span className="text-sm font-medium">{player.playerName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              borderRadius: '6px',
              color: '#fafafa',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{
              color: '#fafafa',
              fontWeight: '500'
            }}
          />
          <Legend content={<CustomLegend />} />
          {selectedPlayers.map(player => 
            selectedMetrics.map((metricId, metricIndex) => {
              const metric = METRIC_OPTIONS.find(m => m.id === metricId);
              const actualKey = getElementKey(player.playerId, metricId, "actual");
              const expectedKey = getElementKey(player.playerId, metricId, "expected");
              
              return [
                <Line
                  key={actualKey}
                  type="monotone"
                  dataKey={`${player.playerId}_${metricId}_actual`}
                  stroke={getMetricColor(player, metricIndex)}
                  strokeWidth={hoveredElement === actualKey ? 4 : 2}
                  strokeOpacity={hoveredElement && hoveredElement !== actualKey ? 0.3 : 1}
                  name={`${player.playerName} - ${metric?.label?.replace(' vs Expected', '')} (Actual)`}
                  onMouseEnter={() => setHoveredElement(actualKey)}
                  onMouseLeave={() => setHoveredElement(null)}
                />,
                <Line
                  key={expectedKey}
                  type="monotone"
                  dataKey={`${player.playerId}_${metricId}_expected`}
                  stroke={getMetricColor(player, metricIndex, true)}
                  strokeWidth={hoveredElement === expectedKey ? 4 : 2}
                  strokeOpacity={hoveredElement && hoveredElement !== expectedKey ? 0.3 : 1}
                  strokeDasharray="5 5"
                  name={`${player.playerName} - ${metric?.label?.replace(' vs Expected', '')} (Expected)`}
                  onMouseEnter={() => setHoveredElement(expectedKey)}
                  onMouseLeave={() => setHoveredElement(null)}
                />
              ];
            }).flat()
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderMetricCards = () => {
    if (selectedPlayers.length === 0 || selectedMetrics.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedPlayers.map(player => (
          <div key={player.playerId} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold">{player.playerName}</h4>
              <span className="text-sm text-muted-foreground">
                {player.team} · {player.position}
              </span>
            </div>
            <div className="space-y-2">
              {selectedMetrics.map(metricId => {
                const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                if (!metric) return null;
                
                const totalActual = player.data.reduce((sum, row) => 
                  sum + (row[metric.actualKey] as number || 0), 0);
                const totalExpected = player.data.reduce((sum, row) => 
                  sum + (row[metric.expectedKey] as number || 0), 0);
                const difference = totalActual - totalExpected;
                
                return (
                  <div key={metricId} className="flex items-center justify-between text-sm">
                    <span className="truncate">{metric.label.replace(' vs Expected', '')}</span>
                    <span className={cn(
                      "font-medium",
                      difference > 0 ? "text-green-600" : difference < 0 ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {difference > 0 ? "+" : ""}{numberFormatter.format(difference)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h3 className="font-semibold">Configuration</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Player Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Players</label>
            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map(player => (
                <div
                  key={player.playerId}
                  className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                  style={{ backgroundColor: `${player.colorScheme.base}20`, borderColor: player.colorScheme.base, border: `1px solid ${player.colorScheme.base}` }}
                >
                  <span>{player.playerName}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => removePlayer(player.playerId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <Popover open={playerSearchOpen} onOpenChange={setPlayerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Player
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-background" align="start">
                  <Command shouldFilter={false}>
                    <div className="border-b px-3 py-2">
                      <CommandInput
                        placeholder="Search players..."
                        value={playerSearchQuery}
                        onValueChange={handlePlayerSearch}
                      />
                    </div>
                    <CommandList>
                      {playerSearchQuery.length < 2 ? (
                        <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
                      ) : isPlayerSearching ? (
                        <CommandEmpty>Searching...</CommandEmpty>
                      ) : playerSearchResults.length === 0 ? (
                        <CommandEmpty>No players found</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {playerSearchResults.slice(0, 10).map(player => (
                            <CommandItem
                              key={player.playerId}
                              onSelect={() => addPlayer(player)}
                              value={player.playerId}
                            >
                              <div className="flex w-full items-center justify-between">
                                <span>{player.playerName}</span>
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
            </div>
          </div>

          {/* Metric Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Metrics</label>
            <Popover open={metricSearchOpen} onOpenChange={setMetricSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full max-w-[360px] justify-between"
                >
                  {selectedMetrics.length === 0 
                    ? "Select metrics..." 
                    : `${selectedMetrics.length} metric${selectedMetrics.length > 1 ? 's' : ''} selected`
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-background">
                <Command>
                  <CommandInput placeholder="Search metrics..." />
                  <CommandList>
                    {Object.entries(
                      METRIC_OPTIONS.reduce((acc, metric) => {
                        if (!acc[metric.category]) acc[metric.category] = [];
                        acc[metric.category].push(metric);
                        return acc;
                      }, {} as Record<string, MetricOption[]>)
                    ).map(([category, metrics]) => (
                      <CommandGroup key={category} heading={category}>
                        {metrics.map(metric => (
                          <CommandItem
                            key={metric.id}
                            onSelect={() => toggleMetric(metric.id)}
                            value={metric.id}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMetrics.includes(metric.id) ? "opacity-100" : "opacity-0"
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
        </div>
      </div>

      {/* Collapsible Data Table */}
      <Collapsible open={isTableOpen} onOpenChange={setIsTableOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Data Table ({filteredData.length} rows)
            </div>
            {isTableOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Week</TableHead>
                  {selectedMetrics.map(metricId => {
                    const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                    if (!metric) return null;
                    return (
                      <TableHead key={`${metricId}_actual`} className="text-center">
                        {metric.label.replace(' vs Expected', '')} (Actual)
                      </TableHead>
                    );
                  })}
                  {selectedMetrics.map(metricId => {
                    const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                    if (!metric) return null;
                    return (
                      <TableHead key={`${metricId}_expected`} className="text-center">
                        {metric.label.replace(' vs Expected', '')} (Expected)
                      </TableHead>
                    );
                  })}
                  {selectedMetrics.map(metricId => {
                    const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                    if (!metric) return null;
                    return (
                      <TableHead key={`${metricId}_diff`} className="text-center">
                        {metric.label.replace(' vs Expected', '')} (Diff)
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.slice(0, 50).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <button
                        onClick={() => {
                          if (row.fullName) {
                            const player = {
                              playerId: row.fullName,
                              playerName: row.fullName,
                              team: row.team || "",
                              position: row.position || "",
                            };
                            addPlayer(player);
                          }
                        }}
                        className="font-medium text-foreground underline-offset-4 hover:underline text-left"
                      >
                        {row.fullName}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold uppercase">
                        {row.position}
                      </span>
                    </TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.week}</TableCell>
                    {selectedMetrics.map(metricId => {
                      const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                      if (!metric) return null;
                      
                      let actual: number;
                      if (metric.isCalculated && metric.calculator) {
                        actual = metric.calculator(row).actual;
                      } else {
                        actual = row[metric.actualKey] as number || 0;
                      }
                      
                      const displayValue = metric.format ? metric.format(actual) : numberFormatter.format(actual);
                      return (
                        <TableCell key={`${metricId}_actual_${index}`} className="text-center">
                          {displayValue}
                        </TableCell>
                      );
                    })}
                    {selectedMetrics.map(metricId => {
                      const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                      if (!metric) return null;
                      
                      let expected: number;
                      if (metric.isCalculated && metric.calculator) {
                        expected = metric.calculator(row).expected;
                      } else {
                        expected = row[metric.expectedKey] as number || 0;
                      }
                      
                      const displayValue = metric.format ? metric.format(expected) : numberFormatter.format(expected);
                      return (
                        <TableCell key={`${metricId}_expected_${index}`} className="text-center">
                          {displayValue}
                        </TableCell>
                      );
                    })}
                    {selectedMetrics.map(metricId => {
                      const metric = METRIC_OPTIONS.find(m => m.id === metricId);
                      if (!metric) return null;
                      
                      let actual: number, expected: number;
                      if (metric.isCalculated && metric.calculator) {
                        const calculated = metric.calculator(row);
                        actual = calculated.actual;
                        expected = calculated.expected;
                      } else {
                        actual = row[metric.actualKey] as number || 0;
                        expected = row[metric.expectedKey] as number || 0;
                      }
                      
                      const diff = actual - expected;
                      const displayValue = metric.format ? metric.format(diff) : numberFormatter.format(diff);
                      const isPositive = diff > 0;
                      
                      return (
                        <TableCell key={`${metricId}_diff_${index}`} className="text-center">
                          <span className={isPositive ? 'text-green-600 font-medium' : diff < 0 ? 'text-red-600 font-medium' : ''}>
                            {isPositive ? '+' : ''}{displayValue}
                          </span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length > 50 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing first 50 of {filteredData.length} rows
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Visualization Mode Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visualization</h3>
        <Tabs value={visualizationMode} onValueChange={(value) => setVisualizationMode(value as VisualizationMode)}>
          <TabsList>
            <TabsTrigger value="line" className="flex items-center gap-1">
              <LineChartIcon className="h-4 w-4" />
              Line
            </TabsTrigger>
            <TabsTrigger value="scatter" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Scatter
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart Visualization */}
      <div className="rounded-lg border p-4">
        {renderChart()}
      </div>

      {/* Metric Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance Summary</h3>
        {renderMetricCards()}
      </div>
    </div>
  );
}