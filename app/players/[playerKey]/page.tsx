import { notFound } from "next/navigation";

import PlayerProjectionChart from "@/components/PlayerProjectionChart";
import {
  PlayerProjectionRaw,
  normalizeProjections,
  slugToPlayerKey,
} from "@/components/PlayersTable";
import { createClient } from "@/utils/supabase/server";

interface PlayerDetailPageProps {
  params: { playerKey: string };
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const playerKey = slugToPlayerKey(params.playerKey);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_projection")
    .select(
      'pos, source, "player.x", "player.y", player_key, season, week, team, projected_points, fantasy_points'
    )
    .eq("player_key", playerKey)
    .order("season", { ascending: true })
    .order("week", { ascending: true });

  if (error) {
    console.error("Failed to load player projections", error.message);
    throw new Error("Unable to load player projections");
  }

  if (!data || data.length === 0) {
    notFound();
  }

  const projections = normalizeProjections(data as PlayerProjectionRaw[]);
  const first = projections[0];
  const displayName =
    first?.playerName || first?.alternateName || titleCase(playerKey);
  const sources = Array.from(
    new Set(
      projections
        .map((projection) => projection.source)
        .filter((source) => Boolean(source))
    )
  ).sort();
  const seasons = Array.from(
    new Set(projections.map((projection) => projection.season))
  ).sort();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {displayName}
            </h1>
            <p className="text-muted-foreground">
              Historical projections and actual fantasy points across {seasons.length}{" "}
              {seasons.length === 1 ? "season" : "seasons"}.
            </p>
          </div>
          <span className="rounded-full border px-3 py-1 text-sm font-medium uppercase">
            {first?.team || ""} · {first?.pos || ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">Sources:</strong>
          {sources.map((source) => (
            <span
              key={source}
              className="rounded-full border border-muted-foreground/40 px-2 py-0.5"
            >
              {source}
            </span>
          ))}
        </div>
      </header>

      <PlayerProjectionChart data={projections} />
    </main>
  );
}
