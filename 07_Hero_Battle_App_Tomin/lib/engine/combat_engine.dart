import 'dart:math';

import '../models/warrior_model.dart';

class CombatResult {
  final int damage;
  final int shielded;
  final bool superHit;
  final String message;

  const CombatResult({
    required this.damage,
    required this.shielded,
    required this.superHit,
    required this.message,
  });
}

class CombatEngine {
  final Random _rng;

  CombatEngine({Random? rng}) : _rng = rng ?? Random();

  /// Calculates damage for a turn.
  /// Different from the original:
  ///  - Uses agility as a bigger factor (0.09 vs 0.06)
  ///  - Shield multiplier is higher when parrying
  ///  - Super-hit chance scales off combat + intelligence
  ///  - Minimum damage is 2 always (not conditional)
  CombatResult strike({
    required WarriorModel attacker,
    required WarriorModel defender,
    required bool isUltimate,
    bool defenderParrying = false,
  }) {
    final offense = isUltimate ? attacker.ultimatePower : attacker.strike;
    final base = offense * (isUltimate ? 0.75 : 0.55);
    final resistanceCut = defender.resistance * 0.30;
    final parryBlock = defenderParrying
        ? (defender.resistance * 0.70) + (defender.coreStats.durability * 0.20)
        : 0.0;
    final agilityEdge =
        (attacker.agility - defender.agility) * 0.09; // bigger than original
    final roll = (_rng.nextInt(11) - 5).toDouble(); // ±5 variance
    // Super-hit scales from combat AND intelligence (original uses combat+speed)
    final superChance = min(
      0.20,
      (attacker.coreStats.combat + attacker.coreStats.intelligence) / 1100,
    );
    final superHit = !defenderParrying && _rng.nextDouble() < superChance;
    final superMult = superHit ? 1.45 : 1.0; // harder hit than original 1.35
    final raw =
        (base - resistanceCut - parryBlock + agilityEdge + roll) * superMult;
    final damage = max(2, raw.round()); // always at least 2
    final shielded = max(0, parryBlock.round());
    final moveLabel = isUltimate ? 'Ultimate' : 'Strike';
    final superText = superHit ? ' ⚡ Super Hit!' : '';
    final parryText =
        defenderParrying ? ' ${defender.name} parried $shielded.' : '';

    return CombatResult(
      damage: damage,
      shielded: shielded,
      superHit: superHit,
      message:
          '${attacker.name} used $moveLabel — $damage dmg.$superText$parryText',
    );
  }

  String parryMessage(WarriorModel warrior) {
    final shield =
        ((warrior.resistance * 0.70) +
                (warrior.coreStats.durability * 0.20))
            .round();
    return '${warrior.name} raised their guard — blocking ~$shield dmg next hit.';
  }
}
