export type FfOpportunityRaw = {
  season: string | number | null;
  week: string | number | null;
  full_name: string | null;
  posteam: string | null;
  position: string | null;
  receptions: string | number | null;
  rec_attempt: string | number | null;
  rush_attempt: string | number | null;
  rec_yards_gained: string | number | null;
  rec_air_yards: string | number | null;
  total_touchdown: string | number | null;
  total_yards_gained: string | number | null;
  total_fantasy_points: string | number | null;
  rec_touchdown: string | number | null;
  rec_first_down: string | number | null;
  rec_fantasy_points: string | number | null;
  rush_touchdown: string | number | null;
  rush_yards_gained: string | number | null;
  rush_first_down: string | number | null;
  rush_fantasy_points: string | number | null;
  pass_yards_gained: string | number | null;
  pass_yards_gained_exp: string | number | null;
  pass_touchdown: string | number | null;
  pass_touchdown_exp: string | number | null;
  pass_first_down: string | number | null;
  pass_first_down_exp: string | number | null;
  pass_fantasy_points: string | number | null;
  pass_fantasy_points_exp: string | number | null;
  receptions_exp: string | number | null;
  rec_yards_gained_exp: string | number | null;
  rec_touchdown_exp: string | number | null;
  rec_first_down_exp: string | number | null;
  rec_fantasy_points_exp: string | number | null;
  rush_yards_gained_exp: string | number | null;
  rush_touchdown_exp: string | number | null;
  rush_first_down_exp: string | number | null;
  rush_fantasy_points_exp: string | number | null;
  total_yards_gained_exp: string | number | null;
  total_touchdown_exp: string | number | null;
  total_first_down_exp: string | number | null;
  total_fantasy_points_exp: string | number | null;
  player_id: string | null;
};

export type FfOpportunity = {
  season: number;
  week: number;
  playerId: string;
  fullName: string;
  team: string;
  position: string;
  receptions: number;
  receptionsExpected: number;
  targets: number;
  receivingYards: number;
  receivingYardsExpected: number;
  airYards: number;
  receivingTD: number;
  receivingTDExpected: number;
  receivingFirstDowns: number;
  receivingFirstDownsExpected: number;
  receivingFantasyPoints: number;
  receivingFantasyPointsExpected: number;
  rushingAttempts: number;
  rushingYards: number;
  rushingYardsExpected: number;
  rushingTD: number;
  rushingTDExpected: number;
  rushingFirstDowns: number;
  rushingFirstDownsExpected: number;
  totalYards: number;
  totalYardsExpected: number;
  totalTD: number;
  totalTDExpected: number;
  totalFantasyPoints: number;
  totalFantasyPointsExpected: number;
  rushingFantasyPoints: number;
  rushingFantasyPointsExpected: number;
  passingYards: number;
  passingYardsExpected: number;
  passingTD: number;
  passingTDExpected: number;
  passingFirstDowns: number;
  passingFirstDownsExpected: number;
  passingFantasyPoints: number;
  passingFantasyPointsExpected: number;
};

function toNumber(value: string | number | null): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toInteger(value: string | number | null): number {
  return Math.round(toNumber(value));
}

export function normalizeOpportunity(row: FfOpportunityRaw): FfOpportunity {
  return {
    season: toInteger(row.season),
    week: toInteger(row.week),
    playerId: row.player_id?.trim() ?? "",
    fullName: row.full_name?.trim() ?? "",
    team: row.posteam?.trim() ?? "",
    position: row.position?.trim() ?? "",
    receptions: toNumber(row.receptions),
    receptionsExpected: toNumber(row.receptions_exp),
    targets: toNumber(row.rec_attempt),
    receivingYards: toNumber(row.rec_yards_gained),
    receivingYardsExpected: toNumber(row.rec_yards_gained_exp),
    airYards: toNumber(row.rec_air_yards),
    receivingTD: toNumber(row.rec_touchdown),
    receivingTDExpected: toNumber(row.rec_touchdown_exp),
    receivingFirstDowns: toNumber(row.rec_first_down),
    receivingFirstDownsExpected: toNumber(row.rec_first_down_exp),
    receivingFantasyPoints: toNumber(row.rec_fantasy_points),
    receivingFantasyPointsExpected: toNumber(row.rec_fantasy_points_exp),
    rushingAttempts: toNumber(row.rush_attempt),
    rushingYards: toNumber(row.rush_yards_gained),
    rushingYardsExpected: toNumber(row.rush_yards_gained_exp),
    rushingTD: toNumber(row.rush_touchdown),
    rushingTDExpected: toNumber(row.rush_touchdown_exp),
    rushingFirstDowns: toNumber(row.rush_first_down),
    rushingFirstDownsExpected: toNumber(row.rush_first_down_exp),
    totalYards: toNumber(row.total_yards_gained),
    totalYardsExpected: toNumber(row.total_yards_gained_exp),
    totalTD: toNumber(row.total_touchdown),
    totalTDExpected: toNumber(row.total_touchdown_exp),
    totalFantasyPoints: toNumber(row.total_fantasy_points),
    totalFantasyPointsExpected: toNumber(row.total_fantasy_points_exp),
    rushingFantasyPoints: toNumber(row.rush_fantasy_points),
    rushingFantasyPointsExpected: toNumber(row.rush_fantasy_points_exp),
    passingYards: toNumber(row.pass_yards_gained),
    passingYardsExpected: toNumber(row.pass_yards_gained_exp),
    passingTD: toNumber(row.pass_touchdown),
    passingTDExpected: toNumber(row.pass_touchdown_exp),
    passingFirstDowns: toNumber(row.pass_first_down),
    passingFirstDownsExpected: toNumber(row.pass_first_down_exp),
    passingFantasyPoints: toNumber(row.pass_fantasy_points),
    passingFantasyPointsExpected: toNumber(row.pass_fantasy_points_exp),
  };
}

export function normalizeOpportunities(
  rows: FfOpportunityRaw[]
): FfOpportunity[] {
  return rows.map(normalizeOpportunity);
}
