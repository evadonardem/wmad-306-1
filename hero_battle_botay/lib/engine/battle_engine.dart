import '../models/hero_model.dart';

class BattleRound {
	const BattleRound({
		required this.label,
		required this.heroAScore,
		required this.heroBScore,
		required this.winner,
		required this.description,
	});

	final String label;
	final int heroAScore;
	final int heroBScore;
	final String winner;
	final String description;
}

class BattleOutcome {
	const BattleOutcome({
		required this.heroA,
		required this.heroB,
		required this.heroAScore,
		required this.heroBScore,
		required this.rounds,
		required this.winner,
		required this.summary,
	});

	final HeroDetail heroA;
	final HeroDetail heroB;
	final int heroAScore;
	final int heroBScore;
	final List<BattleRound> rounds;
	final HeroDetail? winner;
	final String summary;

	bool get isDraw => winner == null;
}

BattleOutcome simulateBattle(HeroDetail heroA, HeroDetail heroB) {
	const roundOrder = <String>[
		'intelligence',
		'strength',
		'speed',
		'durability',
		'power',
		'combat',
	];

	const roundLabels = <String, String>{
		'intelligence': 'Mind game',
		'strength': 'Close combat',
		'speed': 'Tempo control',
		'durability': 'Endurance test',
		'power': 'Energy surge',
		'combat': 'Final exchange',
	};

	const roundWeights = <String, int>{
		'intelligence': 2,
		'strength': 2,
		'speed': 2,
		'durability': 1,
		'power': 2,
		'combat': 3,
	};

	final rounds = <BattleRound>[];
	var heroAScore = 0;
	var heroBScore = 0;

	for (final stat in roundOrder) {
		final aValue = _parseStat(heroA.powerstats[stat]);
		final bValue = _parseStat(heroB.powerstats[stat]);
		final weight = roundWeights[stat] ?? 1;
		final label = roundLabels[stat] ?? stat;

		String winner;
		if (aValue > bValue) {
			heroAScore += weight;
			winner = heroA.name;
		} else if (bValue > aValue) {
			heroBScore += weight;
			winner = heroB.name;
		} else {
			heroAScore += 1;
			heroBScore += 1;
			winner = 'Tie';
		}

		rounds.add(
			BattleRound(
				label: label,
				heroAScore: aValue,
				heroBScore: bValue,
				winner: winner,
				description: _buildRoundDescription(
					heroA.name,
					heroB.name,
					stat,
					aValue,
					bValue,
				),
			),
		);
	}

	final winner = heroAScore == heroBScore
			? null
			: heroAScore > heroBScore
					? heroA
					: heroB;
	final summary = _buildSummary(heroA, heroB, heroAScore, heroBScore, winner);

	return BattleOutcome(
		heroA: heroA,
		heroB: heroB,
		heroAScore: heroAScore,
		heroBScore: heroBScore,
		rounds: rounds,
		winner: winner,
		summary: summary,
	);
}

int _parseStat(String? value) {
	final parsed = int.tryParse(value ?? '');
	if (parsed != null) return parsed;
	if (value == null) return 0;
	final normalized = value.trim().toLowerCase();
	if (normalized == 'null' || normalized == 'unknown' || normalized == '-') {
		return 0;
	}
	return 0;
}

String _buildRoundDescription(
	String heroA,
	String heroB,
	String stat,
	int aValue,
	int bValue,
) {
	final readableStat = stat[0].toUpperCase() + stat.substring(1);
	if (aValue == bValue) {
		return '$heroA and $heroB trade $readableStat evenly.';
	}
	if (aValue > bValue) {
		return '$heroA wins the $readableStat exchange with a sharper edge.';
	}
	return '$heroB pushes ahead in $readableStat and forces the tempo.';
}

String _buildSummary(
	HeroDetail heroA,
	HeroDetail heroB,
	int heroAScore,
	int heroBScore,
	HeroDetail? winner,
) {
	if (winner == null) {
		return '${heroA.name} and ${heroB.name} finish level after a tight, even fight.';
	}

	final loser = winner.id == heroA.id ? heroB : heroA;
	return '${winner.name} outlasts ${loser.name} with a stronger overall stat mix, finishing $heroAScore to $heroBScore.';
}
