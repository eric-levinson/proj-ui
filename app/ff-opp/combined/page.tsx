import Navbar from "@/components/Navbar";
import FfOpportunityCombinedClient from "@/components/FfOpportunityCombinedClient";
import {
  FfOpportunityRaw,
  normalizeOpportunities,
} from "@/components/FfOpportunityTable";
import { createClient } from "@/utils/supabase/server";

export default async function FfOpportunityCombinedPage() {
  const supabase = await createClient();
  const pageSize = 1000;
  let offset = 0;
  const rows: FfOpportunityRaw[] = [];

  // Load all opportunity data
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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Combined Opportunity Analysis
          </h1>
          <p className="text-muted-foreground">
            Multi-player opportunity analysis with configurable metrics, visualization modes, and detailed breakdowns.
          </p>
        </header>
        <FfOpportunityCombinedClient data={opportunities} />
      </main>
    </>
  );
}

export const metadata = {
  title: "Combined Opportunity Analysis",
  description: "Multi-player opportunity analysis with configurable metrics and visualization modes.",
};