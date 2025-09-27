import Link from "next/link";

import Navbar from "@/components/Navbar";
import OpportunityDiffTicker, {
  type OpportunityDiffTickerItem,
} from "@/components/OpportunityDiffTicker";
import { playerKeyToSlug } from "@/components/PlayersTable";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  let tickerItems: OpportunityDiffTickerItem[] = [];
  let latestWeek: number | null = null;

  const {
    data: weekRow,
    error: weekError,
  } = await supabase
    .from("nflreadr_nfl_ff_opportunity")
    .select("week")
    .eq("season", 2025)
    .order("week", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (weekError) {
    console.error("Failed to determine latest week", weekError.message);
  }

  if (weekRow?.week !== undefined && weekRow?.week !== null) {
    const parsed = Number(weekRow.week);
    latestWeek = Number.isFinite(parsed) ? parsed : null;
  }

  if (latestWeek !== null) {
    const columns =
      "full_name, posteam, position, week, total_fantasy_points_diff";

    const [overperformers, underperformers] = await Promise.all([
      supabase
        .from("nflreadr_nfl_ff_opportunity")
        .select(columns)
        .eq("season", 2025)
        .eq("week", latestWeek)
        .order("total_fantasy_points_diff", { ascending: false })
        .limit(15),
      supabase
        .from("nflreadr_nfl_ff_opportunity")
        .select(columns)
        .eq("season", 2025)
        .eq("week", latestWeek)
        .order("total_fantasy_points_diff", { ascending: true })
        .limit(15),
    ]);

    if (overperformers.error) {
      console.error(
        "Failed to load overperformers",
        overperformers.error.message
      );
    }

    if (underperformers.error) {
      console.error(
        "Failed to load underperformers",
        underperformers.error.message
      );
    }

    const combined = [
      ...(overperformers.data ?? []),
      ...(underperformers.data ?? []),
    ];

    const seen = new Set<string>();

    tickerItems = combined
      .map((row, index) => {
        const diffValue = Number(row.total_fantasy_points_diff ?? 0);
        const playerName = (row.full_name ?? "").trim();

        if (!playerName || !Number.isFinite(diffValue) || diffValue === 0) {
          return null;
        }

        const dedupeKey = `${playerName}-${row.posteam ?? "UNK"}`;
        if (seen.has(dedupeKey)) {
          return null;
        }
        seen.add(dedupeKey);

        return {
          id: `${playerName}-${row.posteam ?? "UNK"}-${row.week ?? latestWeek}-${index}`,
          playerName,
          team: row.posteam ?? "",
          position: row.position ?? "",
          diff: diffValue,
          href: `/ff-opp/${playerKeyToSlug(playerName)}`,
          week: Number(row.week ?? latestWeek),
        } satisfies OpportunityDiffTickerItem;
      })
      .filter((value): value is OpportunityDiffTickerItem => Boolean(value))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
      .slice(0, 25);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        {tickerItems.length > 0 && latestWeek !== null && (
          <section className="space-y-2">
            <OpportunityDiffTicker items={tickerItems} />
            <p className="text-xs text-muted-foreground">
              Highlighting the biggest Week {latestWeek} swings in 2025 fantasy points versus expected.
            </p>
          </section>
        )}

        <section className="rounded-xl border bg-background p-8 shadow-sm">
          <h1 className="text-4xl font-black tracking-tight">Fantasy Freaks HQ</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Welcome to Fantasy Freaks HQ, where we blend signal with a wink and keep the spreadsheets humming so you can focus on lineup decisions that matter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/players"
              className="rounded-md border bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:bg-foreground/90"
            >
              Browse the player buffet
            </Link>
            <Link
              href="/ff-opp"
              className="rounded-md border border-dashed px-4 py-2 text-sm font-semibold text-foreground transition hover:border-foreground"
            >
              Investigate opportunity shifts
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Snap judgments, backed by stats</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Did a backup tight end rescue your week? Verify the story by digging into per-player projection history and season-long trends.
            </p>
          </article>
          <article className="rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Usage swings before they trend</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our actual-versus-expected charts surface the weird outliers early, letting you plan the waiver wire before the noise kicks in.
            </p>
          </article>
        </section>

        <section className="rounded-lg border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
          <p>
            These numbers are conversation starters, not gospel. Mix them with your own scouting (and maybe a little superstition) before locking anything in.
          </p>
        </section>
      </main>
    </>
  );
}
