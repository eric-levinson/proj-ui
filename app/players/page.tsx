import PlayersTableClient from "@/components/PlayersTableClient";
import {
  PlayerProjectionRaw,
  normalizeProjections,
} from "@/components/PlayersTable";
import { createClient } from "@/utils/supabase/server";

export default async function PlayersPage() {
  const supabase = await createClient();
  const pageSize = 1000;
  let offset = 0;
  const rows: PlayerProjectionRaw[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("player_projection")
      .select(
        'pos, source, "player.x", "player.y", player_key, season, week, team, projected_points, fantasy_points'
      )
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Failed to load player projections", error.message);
      throw new Error("Unable to load player projections");
    }

    if (!data || data.length === 0) {
      break;
    }

    rows.push(...(data as PlayerProjectionRaw[]));

    if (data.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  const projections = normalizeProjections(rows);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Player Projections</h1>
        <p className="text-muted-foreground">
          Explore projections alongside actual fantasy results. Filter by player, team, position, and
          source, or sort any column to find the matchups you care about.
        </p>
      </header>
      <PlayersTableClient data={projections} />
    </main>
  );
}
