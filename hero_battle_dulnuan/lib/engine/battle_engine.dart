import 'dart:math';
import '../models/hero_model.dart';

class BattleEngine {
  static Random _random = Random();

  /// Simple turn-based battle system
  /// Returns the winner HeroModel
  static HeroModel calculateBattle(HeroModel hero1, HeroModel hero2) {
    // Parse stats with fallback to 0
    final power1 = int.tryParse(hero1.power) ?? 0;
    final power2 = int.tryParse(hero2.power) ?? 0;
    final speed1 = int.tryParse(hero1.speed) ?? 0;
    final speed2 = int.tryParse(hero2.speed) ?? 0;
    final intel1 = int.tryParse(hero1.intelligence) ?? 0;
    final intel2 = int.tryParse(hero2.intelligence) ?? 0;

    // Calculate overall scores with weighted average
    final score1 = (power1 * 0.5) + (speed1 * 0.25) + (intel1 * 0.25);
    final score2 = (power2 * 0.5) + (speed2 * 0.25) + (intel2 * 0.25);

    // Add randomness (±10%)
    final randomFactor1 = 0.9 + (_random.nextDouble() * 0.2);
    final randomFactor2 = 0.9 + (_random.nextDouble() * 0.2);

    final finalScore1 = score1 * randomFactor1;
    final finalScore2 = score2 * randomFactor2;

    return finalScore1 >= finalScore2 ? hero1 : hero2;
  }

  /// Simulates multiple rounds of battle for more dramatic effect
  static HeroModel simulateBattleRounds({
    required HeroModel hero1,
    required HeroModel hero2,
    int rounds = 3,
  }) {
    int hero1Wins = 0;
    int hero2Wins = 0;

    for (int i = 0; i < rounds; i++) {
      final winner = calculateBattle(hero1, hero2);
      if (winner.name == hero1.name) {
        hero1Wins++;
      } else {
        hero2Wins++;
      }
    }

    return hero1Wins > hero2Wins ? hero1 : hero2;
  }
}
