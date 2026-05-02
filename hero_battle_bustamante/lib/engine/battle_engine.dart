import 'dart:math';
import '../models/hero_model.dart';

/// Represents a single action taken in a battle turn.
class BattleAction {
  final String attackerName;
  final String type; // 'attack' or 'special'
  final int damage;
  final String log;

  const BattleAction({
    required this.attackerName,
    required this.type,
    required this.damage,
    required this.log,
  });
}

/// Turn-based battle engine.
///
/// Damage formula:
///   Normal  = attack - (defense / 2)  + random variance
///   Special = specialAttack - (defense / 3) + wider variance
/// Initiative is based on speed with a small random factor.
class BattleEngine {
  static final _rng = Random();

  /// Determine who attacks first based on speed + small random factor.
  static bool playerGoesFirst(HeroModel player, HeroModel ai) {
    final pInit = player.speed + _rng.nextInt(20);
    final aInit = ai.speed + _rng.nextInt(20);
    return pInit >= aInit;
  }

  /// Calculate normal-attack damage.
  static int normalDamage(HeroModel attacker, HeroModel defender) {
    final raw = attacker.attack - (defender.defense ~/ 2);
    final variance = _rng.nextInt(10) - 3; // –3 to +6
    return (raw + variance).clamp(5, 999);
  }

  /// Calculate special-attack damage (stronger, wider variance).
  static int specialDamage(HeroModel attacker, HeroModel defender) {
    final raw = attacker.specialAttack - (defender.defense ~/ 3);
    final variance = _rng.nextInt(16) - 5; // –5 to +10
    return (raw + variance).clamp(3, 999);
  }

  /// Execute one attack action and return its result.
  static BattleAction performAction({
    required HeroModel attacker,
    required HeroModel defender,
    required bool isSpecial,
  }) {
    final dmg = isSpecial
        ? specialDamage(attacker, defender)
        : normalDamage(attacker, defender);
    final type = isSpecial ? 'special' : 'attack';
    final verb = isSpecial ? 'unleashes a special attack on' : 'attacks';
    return BattleAction(
      attackerName: attacker.name,
      type: type,
      damage: dmg,
      log: '${attacker.name} $verb ${defender.name} for $dmg damage!',
    );
  }

  /// AI selects an action (30 % chance of special attack).
  static BattleAction aiAction(HeroModel ai, HeroModel player) {
    final useSpecial = _rng.nextDouble() < 0.30;
    return performAction(attacker: ai, defender: player, isSpecial: useSpecial);
  }
}
