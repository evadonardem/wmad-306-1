import 'dart:math';
import '../models/hero_model.dart';

enum StatusEffect { none, burn, poison, stun }
enum CombatAction { basic, heal, shield, ultimate, buff } // Separated Heal/Shield

class Fighter {
  final HeroModel hero;
  int hp;
  int maxHp;
  int energy = 2;
  int shield = 0;
  StatusEffect status = StatusEffect.none;
  int statusTurns = 0;
  int ultimateCooldown = 0;
  
  // Buff state: 2.0 means double the next numeric effect
  double damageMultiplier = 1.0;

  Fighter({required this.hero, required int multiplier})
      : maxHp = hero.maxHp * multiplier,
        hp = hero.maxHp * multiplier;

  void addEnergy(int amount) {
    energy += amount;
    if (energy > 10) energy = 10;
  }
}

class BattleEngine {
  static final Random _random = Random();

  static List<String> executeTurn({
    required Fighter attacker,
    required Fighter defender,
    required CombatAction action,
    required bool isPlayer,
  }) {
    List<String> logs = [];
    String icon = isPlayer ? '🟢' : '🔴';

    // 1. Process Pre-Turn Status Effects
    if (attacker.status == StatusEffect.burn) {
      int burnDmg = (attacker.maxHp * 0.05).round();
      attacker.hp -= burnDmg;
      logs.add('🔥 ${attacker.hero.name} takes $burnDmg Burn damage!');
    } else if (attacker.status == StatusEffect.poison) {
      int poisonDmg = (attacker.maxHp * 0.03).round();
      attacker.hp -= poisonDmg;
      logs.add('☠️ ${attacker.hero.name} takes $poisonDmg Poison damage!');
    }

    if (attacker.hp <= 0) return logs;

    if (attacker.status == StatusEffect.stun) {
      logs.add('💫 ${attacker.hero.name} is STUNNED and skips their turn!');
      _tickStatus(attacker);
      return logs;
    }

    // 2. Execute Chosen Action
    if (action == CombatAction.buff) {
      // BUFF: Costs 2 Energy. Doubles the VERY NEXT action.
      attacker.energy -= 2;
      attacker.damageMultiplier = 2.0; 
      logs.add('$icon ${attacker.hero.name} is CHARGING! Next action will be DOUBLED! ❤️‍🔥');

    } else if (action == CombatAction.heal) {
      // HEAL: Costs 2 Energy. Base 15% HP.
      attacker.energy -= 2;
      int baseHeal = (attacker.maxHp * 0.15).round();
      int finalHeal = (baseHeal * attacker.damageMultiplier).round();
      
      attacker.hp = min(attacker.hp + finalHeal, attacker.maxHp);
      logs.add('$icon ${attacker.hero.name} used HEAL! Restored $finalHeal HP 💊');
      attacker.damageMultiplier = 1.0; // Consume Buff

    } else if (action == CombatAction.shield) {
      // SHIELD: Costs 1 Energy. Base 12% Shield.
      attacker.energy -= 1;
      int baseShield = (attacker.maxHp * 0.12).round();
      int finalShield = (baseShield * attacker.damageMultiplier).round();
      
      attacker.shield += finalShield;
      logs.add('$icon ${attacker.hero.name} generated $finalShield Shield 🛡️');
      attacker.damageMultiplier = 1.0; // Consume Buff

    } else {
      // ATTACK LOGIC (Basic or Ultimate)
      bool useUltimate = action == CombatAction.ultimate;
      attacker.energy -= useUltimate ? 3 : 1;
      if (useUltimate) attacker.ultimateCooldown = 3;

      if (_random.nextInt(100) < 10) {
        logs.add('💨 MISSED! ${defender.hero.name} dodged the attack!');
        attacker.damageMultiplier = 1.0; // Buff wasted on a miss
      } else {
        int baseDmg = useUltimate ? attacker.hero.specialAttack : attacker.hero.attack;
        
        // Apply multipliers (Buff and Poison)
        double currentMult = attacker.damageMultiplier;
        if (attacker.status == StatusEffect.poison) currentMult *= 0.8;
        
        int actualDmg = (baseDmg * currentMult).round() - defender.hero.defense;
        if (actualDmg < (baseDmg * 0.1)) actualDmg = (baseDmg * 0.1).round();

        bool isCrit = _random.nextInt(100) < 20;
        if (isCrit) actualDmg = (actualDmg * 1.5).round();

        if (defender.shield > 0) {
          if (defender.shield >= actualDmg) {
            defender.shield -= actualDmg;
            logs.add('$icon ${attacker.hero.name} hits Shield for $actualDmg!');
            actualDmg = 0;
          } else {
            actualDmg -= defender.shield;
            logs.add('$icon ${attacker.hero.name} broke the Shield!');
            defender.shield = 0;
          }
        }
      
        if (actualDmg > 0) {
          defender.hp -= actualDmg;
          String type = useUltimate ? 'ULTIMATE' : 'Attack';
          logs.add('$icon ${attacker.hero.name} deals $actualDmg $type damage!${isCrit ? " 💥" : ""}');
        }

        if (useUltimate && _random.nextInt(100) < 40 && defender.status == StatusEffect.none) {
          defender.status = [StatusEffect.burn, StatusEffect.poison, StatusEffect.stun][_random.nextInt(3)];
          defender.statusTurns = 2;
          logs.add('⚠️ ${defender.hero.name} is ${defender.status.name.toUpperCase()}ED!');
        }
        
        attacker.damageMultiplier = 1.0; // Consume Buff after attack
      }
    }

    // 3. Cleanup
    _tickStatus(attacker);
    if (attacker.ultimateCooldown > 0) attacker.ultimateCooldown--;
    attacker.addEnergy(2);

    return logs;
  }

  static void _tickStatus(Fighter f) {
    if (f.statusTurns > 0) {
      f.statusTurns--;
      if (f.statusTurns == 0) f.status = StatusEffect.none;
    }
  }
}