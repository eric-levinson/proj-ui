import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { normalizeOpportunities, FfOpportunityRaw } from "@/components/FfOpportunityTable";

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("nflreadr_nfl_ff_opportunity")
      .select("*")
      .eq("season", 2025)
      .eq("player_id", playerId)
      .order("week", { ascending: true });

    if (error) {
      console.error("Player data fetch error:", error);
      return NextResponse.json({ error: "Data fetch failed" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    const opportunities = normalizeOpportunities(data as FfOpportunityRaw[]);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Player ff-opportunity API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}