import 'dart:math';
import '../models/hero_model.dart';
import '../models/skill.dart';

class BattleEngine {
  static Skill getRandomSkill(HeroModel hero) {
    return hero.skills[Random().nextInt(hero.skills.length)];
  }

  static int calculateDamage(HeroModel attacker, Skill skill) {
    final stats = attacker.powerStats;
    double damage = stats.power * skill.multiplier;
    damage += stats.intelligence * 0.3;
    final rand = Random();
    damage *= (0.8 + rand.nextDouble() * 0.4);
    if (rand.nextDouble() < skill.critChance) {
      damage *= 2;
    }
    return damage.round();
  }
}
