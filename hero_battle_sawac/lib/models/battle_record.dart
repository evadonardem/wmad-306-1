class BattleRecord {
	BattleRecord({
		this.id,
		required this.heroAId,
		required this.heroAName,
		required this.heroBId,
		required this.heroBName,
		required this.heroAScore,
		required this.heroBScore,
		required this.winnerHeroId,
		required this.winnerHeroName,
		required this.createdAt,
		required this.log,
	});

	final int? id;
	final String heroAId;
	final String heroAName;
	final String heroBId;
	final String heroBName;
	final double heroAScore;
	final double heroBScore;
	final String winnerHeroId;
	final String winnerHeroName;
	final DateTime createdAt;
	final String log;

	Map<String, dynamic> toMap() {
		return {
			'id': id,
			'hero_a_id': heroAId,
			'hero_a_name': heroAName,
			'hero_b_id': heroBId,
			'hero_b_name': heroBName,
			'hero_a_score': heroAScore,
			'hero_b_score': heroBScore,
			'winner_hero_id': winnerHeroId,
			'winner_hero_name': winnerHeroName,
			'created_at': createdAt.toIso8601String(),
			'log': log,
		};
	}

	factory BattleRecord.fromMap(Map<String, dynamic> map) {
		return BattleRecord(
			id: map['id'] as int?,
			heroAId: (map['hero_a_id'] ?? '').toString(),
			heroAName: (map['hero_a_name'] ?? '').toString(),
			heroBId: (map['hero_b_id'] ?? '').toString(),
			heroBName: (map['hero_b_name'] ?? '').toString(),
			heroAScore: (map['hero_a_score'] as num?)?.toDouble() ?? 0,
			heroBScore: (map['hero_b_score'] as num?)?.toDouble() ?? 0,
			winnerHeroId: (map['winner_hero_id'] ?? '').toString(),
			winnerHeroName: (map['winner_hero_name'] ?? '').toString(),
			createdAt: DateTime.tryParse((map['created_at'] ?? '').toString()) ?? DateTime.now(),
			log: (map['log'] ?? '').toString(),
		);
	}
}
