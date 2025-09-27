import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import FfOpportunityPlayerClient from "@/components/FfOpportunityPlayerClient";
import {
  FfOpportunityRaw,
  normalizeOpportunities,
} from "@/components/FfOpportunityTable";
import { slugToPlayerKey } from "@/components/PlayersTable";
import { createClient } from "@/utils/supabase/server";

interface FfOpportunityPlayerPageProps {
  params: Promise<{ playerKey: string }>;
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function FfOpportunityPlayerPage({
  params,
}: FfOpportunityPlayerPageProps) {
  const { playerKey: rawPlayerKey } = await params;
  const normalizedKey = slugToPlayerKey(rawPlayerKey);
  const candidateName = titleCase(normalizedKey);

  const supabase = await createClient();

  const initial = await supabase
    .from("nflreadr_nfl_ff_opportunity")
    .select("*")
    .eq("season", 2025)
    .eq("full_name", candidateName)
    .order("week", { ascending: true });

  if (initial.error) {
    console.error("Failed to load opportunity data", initial.error.message);
    throw new Error("Unable to load fantasy opportunity data");
  }

  let records = initial.data ?? [];

  if (records.length === 0) {
    const fallback = await supabase
      .from("nflreadr_nfl_ff_opportunity")
      .select("*")
      .eq("season", 2025)
      .ilike("full_name", `%${normalizedKey.replace(/\s+/g, "%")}%`)
      .order("week", { ascending: true });

    if (fallback.error) {
      console.error(
        "Failed to load opportunity data with fallback",
        fallback.error.message
      );
      throw new Error("Unable to load fantasy opportunity data");
    }

    records = fallback.data ?? [];
  }

  if (records.length === 0) {
    notFound();
  }

  const opportunities = normalizeOpportunities(records as FfOpportunityRaw[]);
  const first = opportunities[0];
  const displayName = first?.fullName || candidateName;
  const team = first?.team ?? "";
  const position = first?.position ?? "";
  const totalWeeks = opportunities.length;

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
              <p className="text-muted-foreground">
                2025 fantasy opportunity metrics across {totalWeeks}{" "}
                {totalWeeks === 1 ? "game" : "games"}.
              </p>
            </div>
            <span className="rounded-full border px-3 py-1 text-sm font-medium uppercase">
              {team || ""} · {position || ""}
            </span>
          </div>
        </header>

        <FfOpportunityPlayerClient data={opportunities} />
      </main>
    </>
  );
}
