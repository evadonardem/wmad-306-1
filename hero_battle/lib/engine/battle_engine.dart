import '../models/hero_model.dart';

class BattleEngine {
  /// Simulate a battle royale: all heroes fight until one remains
  /// Returns the name of the last hero standing and a log of eliminations
  static Map<String, dynamic> battleRoyale(List<HeroModel> allHeroes) {
    final log = <String>[];
    final alive = List<HeroModel>.from(allHeroes);
    final rng = allHeroes.length > 1 ? allHeroes.first.name.hashCode : 0;
    int round = 1;
    while (alive.length > 1) {
      // Pick two random heroes to fight (or just pairwise)
      alive.shuffle();
      final toRemove = <HeroModel>[];
      for (int i = 0; i < alive.length - 1; i += 2) {
        final h1 = alive[i];
        final h2 = alive[i + 1];
        int hp1 = h1.maxHp;
        int hp2 = h2.maxHp;
        bool h1First = h1.initiative >= h2.initiative;
        while (hp1 > 0 && hp2 > 0) {
          if (h1First) {
            hp2 -= (h1.attack - h2.defense).clamp(5, 50);
            if (hp2 <= 0) break;
            hp1 -= (h2.attack - h1.defense).clamp(5, 50);
          } else {
            hp1 -= (h2.attack - h1.defense).clamp(5, 50);
            if (hp1 <= 0) break;
            hp2 -= (h1.attack - h2.defense).clamp(5, 50);
          }
        }
        if (hp1 > 0) {
          log.add('Round $round: ${h1.name} eliminates ${h2.name}');
          toRemove.add(h2);
        } else {
          log.add('Round $round: ${h2.name} eliminates ${h1.name}');
          toRemove.add(h1);
        }
      }
      for (final h in toRemove) {
        alive.remove(h);
      }
      round++;
    }
    final winner = alive.isNotEmpty ? alive.first.name : 'None';
    log.add('Winner: $winner');
    return {'winner': winner, 'log': log};
  }

  static String battle(List<HeroModel> playerDeck, List<HeroModel> enemyDeck) {
    int playerScore = 0;
    int enemyScore = 0;

    for (int i = 0; i < playerDeck.length; i++) {
      final playerHero = playerDeck[i];
      final enemyHero = enemyDeck.length > i ? enemyDeck[i] : enemyDeck[0];

      int playerHp = playerHero.maxHp;
      int enemyHp = enemyHero.maxHp;

      // Initiative: who attacks first
      bool playerFirst = playerHero.initiative >= enemyHero.initiative;

      while (playerHp > 0 && enemyHp > 0) {
        if (playerFirst) {
          enemyHp -= (playerHero.attack - enemyHero.defense).clamp(5, 50);
          if (enemyHp <= 0) break;
          playerHp -= (enemyHero.attack - playerHero.defense).clamp(5, 50);
        } else {
          playerHp -= (enemyHero.attack - playerHero.defense).clamp(5, 50);
          if (playerHp <= 0) break;
          enemyHp -= (playerHero.attack - enemyHero.defense).clamp(5, 50);
        }
      }

      if (playerHp > 0) {
        playerScore++;
      } else {
        enemyScore++;
      }
    }

    if (playerScore > enemyScore) return 'Win';
    if (playerScore < enemyScore) return 'Lose';
    return 'Draw';
  }
}
