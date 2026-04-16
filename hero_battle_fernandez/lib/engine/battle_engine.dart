import 'dart:math';

import '../models/hero_model.dart';

class BattleTurnResult {
  final int damage;
  final String message;

  const BattleTurnResult({required this.damage, required this.message});
}

class BattleEngine {
  final Random _random;

  BattleEngine({Random? random}) : _random = random ?? Random();

  BattleTurnResult attack({
    required HeroModel attacker,
    required HeroModel defender,
    required bool special,
  }) {
    final base = special ? attacker.specialAttack : attacker.attack;
    final variance = _random.nextInt(15) - 5;
    final rawDamage = base + variance - defender.defense;
    final damage = max(5, rawDamage);
    final move = special ? 'special attack' : 'attack';

    return BattleTurnResult(
      damage: damage,
      message: '${attacker.name} used $move for $damage damage.',
    );
  }
}
