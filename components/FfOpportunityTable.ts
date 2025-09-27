export type FfOpportunityRaw = {
  season: string | number | null;
  week: string | number | null;
  full_name: string | null;
  posteam: string | null;
  position: string | null;
  receptions: string | number | null;
  rec_attempt: string | number | null;
  rush_attempt: string | number | null;
  pass_attempt: string | number | null;
  pass_completions: string | number | null;
  pass_completions_exp: string | number | null;
  rec_yards_gained: string | number | null;
  rec_air_yards: string | number | null;
  pass_air_yards: string | number | null;
  total_touchdown: string | number | null;
  total_yards_gained: string | number | null;
  total_fantasy_points: string | number | null;
  total_first_down: string | number | null;
  rec_touchdown: string | number | null;
  rec_first_down: string | number | null;
  rec_fantasy_points: string | number | null;
  rec_interception: string | number | null;
  rec_interception_exp: string | number | null;
  rec_fumble_lost: string | number | null;
  rec_two_point_conv: string | number | null;
  rec_two_point_conv_exp: string | number | null;
  rush_touchdown: string | number | null;
  rush_yards_gained: string | number | null;
  rush_first_down: string | number | null;
  rush_fantasy_points: string | number | null;
  rush_fumble_lost: string | number | null;
  rush_two_point_conv: string | number | null;
  rush_two_point_conv_exp: string | number | null;
  pass_yards_gained: string | number | null;
  pass_yards_gained_exp: string | number | null;
  pass_touchdown: string | number | null;
  pass_touchdown_exp: string | number | null;
  pass_first_down: string | number | null;
  pass_first_down_exp: string | number | null;
  pass_fantasy_points: string | number | null;
  pass_fantasy_points_exp: string | number | null;
  pass_interception: string | number | null;
  pass_interception_exp: string | number | null;
  pass_two_point_conv: string | number | null;
  pass_two_point_conv_exp: string | number | null;
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
  // Team context fields
  rec_attempt_team: string | number | null;
  rush_attempt_team: string | number | null;
  pass_attempt_team: string | number | null;
  rec_air_yards_team: string | number | null;
  pass_air_yards_team: string | number | null;
  receptions_team: string | number | null;
  rec_yards_gained_team: string | number | null;
  rec_touchdown_team: string | number | null;
  rec_fantasy_points_team: string | number | null;
  rush_yards_gained_team: string | number | null;
  rush_touchdown_team: string | number | null;
  rush_fantasy_points_team: string | number | null;
  pass_yards_gained_team: string | number | null;
  pass_touchdown_team: string | number | null;
  pass_fantasy_points_team: string | number | null;
  pass_completions_team: string | number | null;
  total_yards_gained_team: string | number | null;
  total_touchdown_team: string | number | null;
  total_fantasy_points_team: string | number | null;
  player_id: string | null;
};

export type FfOpportunity = {
  season: number;
  week: number;
  playerId: string;
  fullName: string;
  team: string;
  position: string;
  // Basic receiving metrics
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
  receivingInterceptions: number;
  receivingInterceptionsExpected: number;
  receivingFumbles: number;
  receivingTwoPointConv: number;
  receivingTwoPointConvExpected: number;
  // Basic rushing metrics
  rushingAttempts: number;
  rushingYards: number;
  rushingYardsExpected: number;
  rushingTD: number;
  rushingTDExpected: number;
  rushingFirstDowns: number;
  rushingFirstDownsExpected: number;
  rushingFantasyPoints: number;
  rushingFantasyPointsExpected: number;
  rushingFumbles: number;
  rushingTwoPointConv: number;
  rushingTwoPointConvExpected: number;
  // Basic passing metrics
  passingAttempts: number;
  passingCompletions: number;
  passingCompletionsExpected: number;
  passingYards: number;
  passingYardsExpected: number;
  passingAirYards: number;
  passingTD: number;
  passingTDExpected: number;
  passingFirstDowns: number;
  passingFirstDownsExpected: number;
  passingFantasyPoints: number;
  passingFantasyPointsExpected: number;
  passingInterceptions: number;
  passingInterceptionsExpected: number;
  passingTwoPointConv: number;
  passingTwoPointConvExpected: number;
  // Total metrics
  totalYards: number;
  totalYardsExpected: number;
  totalTD: number;
  totalTDExpected: number;
  totalFirstDowns: number;
  totalFirstDownsExpected: number;
  totalFantasyPoints: number;
  totalFantasyPointsExpected: number;
  // Team context for calculating shares
  teamTargets: number;
  teamRushAttempts: number;
  teamPassAttempts: number;
  teamReceivingAirYards: number;
  teamPassingAirYards: number;
  teamReceptions: number;
  teamReceivingYards: number;
  teamReceivingTDs: number;
  teamReceivingFantasyPoints: number;
  teamRushingYards: number;
  teamRushingTDs: number;
  teamRushingFantasyPoints: number;
  teamPassingYards: number;
  teamPassingTDs: number;
  teamPassingFantasyPoints: number;
  teamPassingCompletions: number;
  teamTotalYards: number;
  teamTotalTDs: number;
  teamTotalFantasyPoints: number;
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
    // Basic receiving metrics
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
    receivingInterceptions: toNumber(row.rec_interception),
    receivingInterceptionsExpected: toNumber(row.rec_interception_exp),
    receivingFumbles: toNumber(row.rec_fumble_lost),
    receivingTwoPointConv: toNumber(row.rec_two_point_conv),
    receivingTwoPointConvExpected: toNumber(row.rec_two_point_conv_exp),
    // Basic rushing metrics
    rushingAttempts: toNumber(row.rush_attempt),
    rushingYards: toNumber(row.rush_yards_gained),
    rushingYardsExpected: toNumber(row.rush_yards_gained_exp),
    rushingTD: toNumber(row.rush_touchdown),
    rushingTDExpected: toNumber(row.rush_touchdown_exp),
    rushingFirstDowns: toNumber(row.rush_first_down),
    rushingFirstDownsExpected: toNumber(row.rush_first_down_exp),
    rushingFantasyPoints: toNumber(row.rush_fantasy_points),
    rushingFantasyPointsExpected: toNumber(row.rush_fantasy_points_exp),
    rushingFumbles: toNumber(row.rush_fumble_lost),
    rushingTwoPointConv: toNumber(row.rush_two_point_conv),
    rushingTwoPointConvExpected: toNumber(row.rush_two_point_conv_exp),
    // Basic passing metrics
    passingAttempts: toNumber(row.pass_attempt),
    passingCompletions: toNumber(row.pass_completions),
    passingCompletionsExpected: toNumber(row.pass_completions_exp),
    passingYards: toNumber(row.pass_yards_gained),
    passingYardsExpected: toNumber(row.pass_yards_gained_exp),
    passingAirYards: toNumber(row.pass_air_yards),
    passingTD: toNumber(row.pass_touchdown),
    passingTDExpected: toNumber(row.pass_touchdown_exp),
    passingFirstDowns: toNumber(row.pass_first_down),
    passingFirstDownsExpected: toNumber(row.pass_first_down_exp),
    passingFantasyPoints: toNumber(row.pass_fantasy_points),
    passingFantasyPointsExpected: toNumber(row.pass_fantasy_points_exp),
    passingInterceptions: toNumber(row.pass_interception),
    passingInterceptionsExpected: toNumber(row.pass_interception_exp),
    passingTwoPointConv: toNumber(row.pass_two_point_conv),
    passingTwoPointConvExpected: toNumber(row.pass_two_point_conv_exp),
    // Total metrics
    totalYards: toNumber(row.total_yards_gained),
    totalYardsExpected: toNumber(row.total_yards_gained_exp),
    totalTD: toNumber(row.total_touchdown),
    totalTDExpected: toNumber(row.total_touchdown_exp),
    totalFirstDowns: toNumber(row.total_first_down),
    totalFirstDownsExpected: toNumber(row.total_first_down_exp),
    totalFantasyPoints: toNumber(row.total_fantasy_points),
    totalFantasyPointsExpected: toNumber(row.total_fantasy_points_exp),
    // Team context for calculating shares
    teamTargets: toNumber(row.rec_attempt_team),
    teamRushAttempts: toNumber(row.rush_attempt_team),
    teamPassAttempts: toNumber(row.pass_attempt_team),
    teamReceivingAirYards: toNumber(row.rec_air_yards_team),
    teamPassingAirYards: toNumber(row.pass_air_yards_team),
    teamReceptions: toNumber(row.receptions_team),
    teamReceivingYards: toNumber(row.rec_yards_gained_team),
    teamReceivingTDs: toNumber(row.rec_touchdown_team),
    teamReceivingFantasyPoints: toNumber(row.rec_fantasy_points_team),
    teamRushingYards: toNumber(row.rush_yards_gained_team),
    teamRushingTDs: toNumber(row.rush_touchdown_team),
    teamRushingFantasyPoints: toNumber(row.rush_fantasy_points_team),
    teamPassingYards: toNumber(row.pass_yards_gained_team),
    teamPassingTDs: toNumber(row.pass_touchdown_team),
    teamPassingFantasyPoints: toNumber(row.pass_fantasy_points_team),
    teamPassingCompletions: toNumber(row.pass_completions_team),
    teamTotalYards: toNumber(row.total_yards_gained_team),
    teamTotalTDs: toNumber(row.total_touchdown_team),
    teamTotalFantasyPoints: toNumber(row.total_fantasy_points_team),
  };
}

export function normalizeOpportunities(
  rows: FfOpportunityRaw[]
): FfOpportunity[] {
  return rows.map(normalizeOpportunity);
}
