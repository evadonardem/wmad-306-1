class PlayerStats {
	const PlayerStats({
		required this.totalBattles,
		required this.totalWins,
		required this.totalLosses,
	});

	final int totalBattles;
	final int totalWins;
	final int totalLosses;

	double get winRate {
		if (totalBattles == 0) {
			return 0;
		}
		return (totalWins / totalBattles) * 100;
	}
}
