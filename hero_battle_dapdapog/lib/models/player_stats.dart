class PlayerStats {
	final int wins;
	final int battles;
	final int losses;

	const PlayerStats({
		required this.wins,
		required this.battles,
		required this.losses,
	});

	PlayerStats copyWith({int? wins, int? battles, int? losses}) {
		return PlayerStats(
			wins: wins ?? this.wins,
			battles: battles ?? this.battles,
			losses: losses ?? this.losses,
		);
	}

	factory PlayerStats.fromJson(Map<String, dynamic> json) {
		return PlayerStats(
			wins: json['wins'] as int,
			battles: json['battles'] as int,
			losses: json['losses'] as int,
		);
	}

	Map<String, dynamic> toJson() {
		return {
			'wins': wins,
			'battles': battles,
			'losses': losses,
		};
	}
}
