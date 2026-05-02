import 'dart:math';

import '../models/hero_model.dart';

class BattleTurnResult {
  final int damage;
  final int blocked;
  final bool critical;
  final String message;

  const BattleTurnResult({
    required this.damage,
    required this.blocked,
    required this.critical,
    required this.message,
  });
}

class BattleEngine {
  final Random _random;

  BattleEngine({Random? random}) : _random = random ?? Random();

  BattleTurnResult attack({
    required HeroModel attacker,
    required HeroModel defender,
    required bool special,
    bool defenderDefending = false,
  }) {
    final offense = special ? attacker.specialAttack : attacker.attack;
    final base = offense * (special ? 0.72 : 0.58);
    final defenseMitigation = defender.defense * 0.35;
    final guardMitigation = defenderDefending
        ? (defender.defense * 0.65) + (defender.powerStats.durability * 0.25)
        : 0.0;
    final speedPressure =
        (attacker.powerStats.speed - defender.powerStats.speed) * 0.06;
    final variance = (_random.nextInt(9) - 4).toDouble();
    final criticalChance = min(
      0.24,
      (attacker.powerStats.combat + attacker.powerStats.speed) / 900,
    );
    final critical =
        !defenderDefending && _random.nextDouble() < criticalChance;
    final criticalMultiplier = critical ? 1.35 : 1.0;
    final rawDamage =
        (base -
            defenseMitigation -
            guardMitigation +
            speedPressure +
            variance) *
        criticalMultiplier;
    final minimumDamage = defenderDefending ? 1 : 3;
    final damage = max(minimumDamage, rawDamage.round());
    final blocked = max(0, guardMitigation.round());
    final move = special ? 'special attack' : 'attack';
    final critText = critical ? ' Critical hit!' : '';
    final guardText = defenderDefending
        ? ' ${defender.name} blocked $blocked.'
        : '';

    return BattleTurnResult(
      damage: damage,
      blocked: blocked,
      critical: critical,
      message:
          '${attacker.name} used $move for $damage damage.$critText$guardText',
    );
  }

  String defendMessage(HeroModel hero) {
    final guard = ((hero.defense * 0.65) + (hero.powerStats.durability * 0.25))
        .round();
    return '${hero.name} defended and prepared to block about $guard damage.';
  }
}
