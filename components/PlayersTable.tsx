export type PlayerProjectionRaw = {
	pos: string | null;
	source: string | null;
	"player.x": string | null;
	"player.y": string | null;
	player_key: string | null;
	season: number | null;
	week: number | null;
	team: string | null;
	projected_points: number | null;
	fantasy_points: number | null;
};

export type PlayerProjection = {
	pos: string;
	source: string;
	playerName: string;
	alternateName: string;
	playerKey: string;
	season: number;
	week: number;
	team: string;
	projectedPoints: number;
	fantasyPoints: number;
};

export function normalizeProjection(row: PlayerProjectionRaw): PlayerProjection {
	return {
		pos: row.pos ?? "",
		source: row.source ?? "",
		playerName: row["player.x"] ?? "",
		alternateName: row["player.y"] ?? "",
		playerKey: row.player_key ?? "",
		season: row.season ?? 0,
		week: row.week ?? 0,
		team: row.team ?? "",
		projectedPoints: row.projected_points ?? 0,
		fantasyPoints: row.fantasy_points ?? 0,
	};
}

export function normalizeProjections(
	rows: PlayerProjectionRaw[]
): PlayerProjection[] {
	return rows.map(normalizeProjection);
}

export function playerKeyToSlug(playerKey: string): string {
	const normalized = playerKey.trim().toLowerCase().replace(/\s+/g, "-");
	return encodeURIComponent(normalized);
}

export function slugToPlayerKey(slug: string): string {
	const decoded = decodeURIComponent(slug);
	return decoded.replace(/-/g, " ");
}
