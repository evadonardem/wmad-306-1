import 'dart:math';

import '../models/hero_model.dart';

class BattleOutcome {
	const BattleOutcome({
		required this.heroAScore,
		required this.heroBScore,
		required this.winner,
		required this.log,
	});

	final double heroAScore;
	final double heroBScore;
	final HeroModel winner;
	final String log;
}

class BattleEngine {
	BattleEngine({Random? random}) : _random = random ?? Random();

	final Random _random;

	BattleOutcome fight(HeroModel heroA, HeroModel heroB) {
		final aScore = _score(heroA);
		final bScore = _score(heroB);

		HeroModel winner;
		final buffer = StringBuffer()
			..writeln('Weighted score battle')
			..writeln('${heroA.name}: ${aScore.toStringAsFixed(2)}')
			..writeln('${heroB.name}: ${bScore.toStringAsFixed(2)}');

		if ((aScore - bScore).abs() > 0.01) {
			winner = aScore > bScore ? heroA : heroB;
			buffer.writeln('Winner by score: ${winner.name}');
		} else {
			final aInt = heroA.powerstats.intelligence;
			final bInt = heroB.powerstats.intelligence;
			if (aInt != bInt) {
				winner = aInt > bInt ? heroA : heroB;
				buffer.writeln('Tie-break by intelligence: ${winner.name}');
			} else {
				final aSpeed = heroA.powerstats.speed;
				final bSpeed = heroB.powerstats.speed;
				if (aSpeed != bSpeed) {
					winner = aSpeed > bSpeed ? heroA : heroB;
					buffer.writeln('Tie-break by speed: ${winner.name}');
				} else {
					winner = _random.nextBool() ? heroA : heroB;
					buffer.writeln('Tie-break by random draw: ${winner.name}');
				}
			}
		}

		return BattleOutcome(
			heroAScore: aScore,
			heroBScore: bScore,
			winner: winner,
			log: buffer.toString().trim(),
		);
	}

	double _score(HeroModel hero) {
		final s = hero.powerstats;
		return (s.combat * 0.25) +
				(s.strength * 0.20) +
				(s.durability * 0.20) +
				(s.speed * 0.15) +
				(s.intelligence * 0.10) +
				(s.power * 0.10);
	}
}
