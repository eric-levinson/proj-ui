'use client';

import * as React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PlayerProjection } from '@/components/PlayersTable';

const SOURCE_COLORS = [
  '#2563EB',
  '#EA580C',
  '#F59E0B',
  '#7C3AED',
  '#DB2777',
  '#0891B2',
  '#16A34A',
  '#E11D48',
  '#BE123C',
  '#0F766E',
];

const ACTUAL_COLOR = '#10B981';

type PlayerProjectionChartProps = {
  data: PlayerProjection[];
};

type ChartDatum = {
  season: number;
  week: number;
  label: string;
  actual: number;
  [source: string]: string | number;
};

export function PlayerProjectionChart({ data }: PlayerProjectionChartProps) {
  const sources = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => {
      if (row.source) {
        set.add(row.source);
      }
    });
    return Array.from(set).sort();
  }, [data]);

  const chartData = React.useMemo<ChartDatum[]>(() => {
    const map = new Map<string, ChartDatum>();

    data.forEach((row) => {
      const key = `${row.season}-${row.week}`;
      if (!map.has(key)) {
        map.set(key, {
          season: row.season,
          week: row.week,
          label: `S${row.season} · W${row.week}`,
          actual: row.fantasyPoints,
        });
      }

      const entry = map.get(key)!;
      entry.actual = row.fantasyPoints;
      if (row.source) {
        entry[row.source] = row.projectedPoints;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.season === b.season) {
        return a.week - b.week;
      }
      return a.season - b.season;
    });
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">No projection data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Weekly Projection vs. Actual Points</h2>
        <p className="text-sm text-muted-foreground">
          Compare how each source projected the player against their actual fantasy output.
        </p>
      </div>
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 32, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            {/* Use numeric week as the X axis key so ticks are ordered numerically */}
            <XAxis
              dataKey="week"
              stroke="#94a3b8"
              tickFormatter={(value: number) => `W${value}`}
            />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: 12,
                border: '1px solid rgba(148, 163, 184, 0.35)',
              }}
              labelStyle={{ fontWeight: 600, color: 'var(--foreground)' }}
              formatter={(value: number, name) => [value.toFixed(2), name]}
            />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke={ACTUAL_COLOR}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            {sources.map((source, index) => (
              <Line
                key={source}
                type="monotone"
                dataKey={source}
                name={source}
                stroke={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PlayerProjectionChart;
