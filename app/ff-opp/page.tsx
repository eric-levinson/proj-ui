import Navbar from "@/components/Navbar";
import FfOpportunityTableClient from "@/components/FfOpportunityTableClient";
import {
  FfOpportunityRaw,
  normalizeOpportunities,
} from "@/components/FfOpportunityTable";
import { createClient } from "@/utils/supabase/server";

export default async function FfOpportunityPage() {
  const supabase = await createClient();
  const pageSize = 1000;
  let offset = 0;
  const rows: FfOpportunityRaw[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("nflreadr_nfl_ff_opportunity")
      .select("*")
      .eq("season", 2025)
      .order("season", { ascending: false })
      .order("week", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Failed to load opportunity data", error.message);
      throw new Error("Unable to load fantasy opportunity data");
    }

    if (!data || data.length === 0) {
      break;
    }

    rows.push(...(data as FfOpportunityRaw[]));

    if (data.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  const opportunities = normalizeOpportunities(rows);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Fantasy Opportunity Explorer
          </h1>
          <p className="text-muted-foreground">
            Analyze receiving and rushing opportunity metrics from nflreadr&#39;s fantasy football dataset. Filter by player, team, position, season, and week to spot usage trends.
          </p>
        </header>
        <FfOpportunityTableClient data={opportunities} />
      </main>
    </>
  );
}

export const metadata = {
  title: "Opportunity Explorer",
  description: "Analyze fantasy opportunity metrics (targets, touches, usage) across players and weeks.",
};
