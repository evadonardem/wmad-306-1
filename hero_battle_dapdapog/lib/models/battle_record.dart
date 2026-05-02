class BattleRecord {
	final int? id;
	final String heroName;
	final String opponentName;
	final String winnerName;
	final List<String> log;
	final DateTime createdAt;

	const BattleRecord({
		this.id,
		required this.heroName,
		required this.opponentName,
		required this.winnerName,
		required this.log,
		required this.createdAt,
	});

	bool get heroWon => winnerName == heroName;

	BattleRecord copyWith({
		int? id,
		String? heroName,
		String? opponentName,
		String? winnerName,
		List<String>? log,
		DateTime? createdAt,
	}) {
		return BattleRecord(
			id: id ?? this.id,
			heroName: heroName ?? this.heroName,
			opponentName: opponentName ?? this.opponentName,
			winnerName: winnerName ?? this.winnerName,
			log: log ?? this.log,
			createdAt: createdAt ?? this.createdAt,
		);
	}

	factory BattleRecord.fromJson(Map<String, dynamic> json) {
		return BattleRecord(
			id: json['id'] as int?,
			heroName: json['heroName'] as String,
			opponentName: json['opponentName'] as String,
			winnerName: json['winnerName'] as String,
			log: (json['log'] as List<dynamic>).map((e) => e as String).toList(),
			createdAt: DateTime.parse(json['createdAt'] as String),
		);
	}

	Map<String, dynamic> toJson() {
		return {
			'id': id,
			'heroName': heroName,
			'opponentName': opponentName,
			'winnerName': winnerName,
			'log': log,
			'createdAt': createdAt.toIso8601String(),
		};
	}
}
