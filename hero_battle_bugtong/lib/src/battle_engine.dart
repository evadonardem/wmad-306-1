import 'dart:math';

import 'models.dart';

int heroMaxHp(HeroModel h) => ((h.powerStats.durability + h.powerStats.power) / 2).round();
int heroAttack(HeroModel h) => ((h.powerStats.strength + h.powerStats.combat) / 2).round();
int heroSpecialAttack(HeroModel h) => ((h.powerStats.intelligence + h.powerStats.power) / 2).round();
int heroDefense(HeroModel h) => ((h.powerStats.durability + h.powerStats.combat) / 4).round();
int heroInitiative(HeroModel h) => h.powerStats.speed;

class RoundResult {
  const RoundResult({
    required this.newPlayerHp,
    required this.newAiHp,
    required this.messages,
  });

  final int newPlayerHp;
  final int newAiHp;
  final List<String> messages;
}

RoundResult resolveRound(
  HeroModel player,
  HeroModel ai,
  int playerHp,
  int aiHp,
) {
  final messages = <String>[];
  var pHp = playerHp;
  var aHp = aiHp;

  int calcDamage(HeroModel attacker, HeroModel defender) {
    final random = Random();
    final isSpecial = random.nextDouble() < 0.3;
    final rawAtk = isSpecial ? heroSpecialAttack(attacker) : heroAttack(attacker);
    final randomVariance = random.nextDouble() * 10 - 5;
    return max(1, (rawAtk - heroDefense(defender) * 0.5 + randomVariance).round());
  }

  final playerFirst = heroInitiative(player) >= heroInitiative(ai);
  if (playerFirst) {
    final pDmg = calcDamage(player, ai);
    aHp = max(0, aHp - pDmg);
    messages.add('${player.name} deals $pDmg damage -> ${ai.name} HP: $aHp');
    if (aHp > 0) {
      final aDmg = calcDamage(ai, player);
      pHp = max(0, pHp - aDmg);
      messages.add('${ai.name} deals $aDmg damage -> ${player.name} HP: $pHp');
    }
  } else {
    final aDmg = calcDamage(ai, player);
    pHp = max(0, pHp - aDmg);
    messages.add('${ai.name} deals $aDmg damage -> ${player.name} HP: $pHp');
    if (pHp > 0) {
      final pDmg = calcDamage(player, ai);
      aHp = max(0, aHp - pDmg);
      messages.add('${player.name} deals $pDmg damage -> ${ai.name} HP: $aHp');
    }
  }

  return RoundResult(newPlayerHp: pHp, newAiHp: aHp, messages: messages);
}
