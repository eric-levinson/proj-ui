import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();
    
    // Search for players with similar names
    const { data, error } = await supabase
      .from("nflreadr_nfl_ff_opportunity")
      .select("full_name, player_id, position, posteam")
      .eq("season", 2025)
      .ilike("full_name", `%${query}%`)
      .not("full_name", "is", null)
      .not("player_id", "is", null)
      .limit(20);

    if (error) {
      console.error("Player search error:", error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    // Group by player and get unique results
    const uniquePlayers = Array.from(
      new Map(
        data.map(player => [
          player.player_id,
          {
            playerId: player.player_id,
            playerName: player.full_name,
            team: player.posteam,
            position: player.position,
          }
        ])
      ).values()
    );

    return NextResponse.json(uniquePlayers);
  } catch (error) {
    console.error("Player search API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}