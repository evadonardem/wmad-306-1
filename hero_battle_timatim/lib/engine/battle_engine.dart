// Pure-Dart turn resolver. No Flutter imports — easy to unit-test.

import 'dart:math';

import '../models/hero_model.dart';

class TurnResult {
  final int damage;
  final bool isCrit;
  final String log;

  const TurnResult({
    required this.damage,
    required this.isCrit,
    required this.log,
  });
}

class BattleEngine {
  static final Random _rng = Random();

  /// Resolve a single attacker → defender swing.
  /// Damage = max(1, attacker.attack - defender.defense ~/ 2)
  /// 15% chance to crit (×2 damage).
  static TurnResult resolveTurn(HeroModel attacker, HeroModel defender) {
    final base = max(1, attacker.attack - (defender.defense ~/ 2));
    final isCrit = _rng.nextDouble() < 0.15;
    final damage = isCrit ? base * 2 : base;
    final log = isCrit
        ? '${attacker.name} CRITS ${defender.name} for $damage!'
        : '${attacker.name} hits ${defender.name} for $damage.';
    return TurnResult(damage: damage, isCrit: isCrit, log: log);
  }

  /// True if [a] should attack first this round.
  static bool playerGoesFirst(HeroModel player, HeroModel ai) {
    if (player.initiative == ai.initiative) return _rng.nextBool();
    return player.initiative > ai.initiative;
  }
}
