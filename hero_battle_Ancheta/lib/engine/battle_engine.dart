import '../models/hero_model.dart';

enum BattleAction { attack, specialAttack, defend }

class BattleTurn {
  final String actor;
  final BattleAction action;
  final int damage;
  final int remainingHp;

  BattleTurn({
    required this.actor,
    required this.action,
    required this.damage,
    required this.remainingHp,
  });
}

class BattleEngine {
  HeroModel playerHero;
  HeroModel aiHero;
  int playerCurrentHp;
  int aiCurrentHp;
  int round;
  bool isPlayerTurn;
  List<BattleTurn> turnHistory;
  bool isDefending;

  BattleEngine({
    required this.playerHero,
    required this.aiHero,
  })  : playerCurrentHp = playerHero.maxHp,
        aiCurrentHp = aiHero.maxHp,
        round = 1,
        isPlayerTurn = true,
        turnHistory = [],
        isDefending = false;

  bool get isBattleOver => playerCurrentHp <= 0 || aiCurrentHp <= 0;
  bool get playerWon => aiCurrentHp <= 0;
  int get currentHpPercent => (playerCurrentHp / playerHero.maxHp * 100).toInt();

  BattleTurn executePlayerAction(BattleAction action) {
    if (!isPlayerTurn || isBattleOver) {
      throw Exception('Not player\'s turn or battle is over');
    }

    final damage = _calculateDamage(action, isPlayer: true);
    final actualDamage = damage.clamp(0, aiCurrentHp);
    aiCurrentHp -= actualDamage;
    isDefending = action == BattleAction.defend;

    final turn = BattleTurn(
      actor: playerHero.name,
      action: action,
      damage: actualDamage,
      remainingHp: aiCurrentHp,
    );
    turnHistory.add(turn);

    if (!isBattleOver) {
      isPlayerTurn = false;
    }

    return turn;
  }

  BattleTurn executeAIAction() {
    if (isPlayerTurn || isBattleOver) {
      throw Exception('Not AI\'s turn or battle is over');
    }

    // Simple AI: choose best attack based on remaining HP
    BattleAction action;
    if (aiCurrentHp < aiHero.maxHp * 0.3) {
      // Low HP - go for big damage
      action = BattleAction.specialAttack;
    } else if (playerCurrentHp > playerHero.maxHp * 0.7) {
      // Player has high HP - use regular attack
      action = BattleAction.attack;
    } else {
      action = [BattleAction.attack, BattleAction.specialAttack]
          [DateTime.now().millisecondsSinceEpoch % 2];
    }

    final damage = _calculateDamage(action, isPlayer: false);
    final actualDamage = damage.clamp(0, playerCurrentHp);
    playerCurrentHp -= actualDamage;

    final turn = BattleTurn(
      actor: aiHero.name,
      action: action,
      damage: actualDamage,
      remainingHp: playerCurrentHp,
    );
    turnHistory.add(turn);

    if (!isBattleOver) {
      isPlayerTurn = true;
      round++;
    }

    return turn;
  }

  int _calculateDamage(BattleAction action, {required bool isPlayer}) {
    final attacker = isPlayer ? playerHero : aiHero;
    final defender = isPlayer ? aiHero : playerHero;
    final isAttackerDefending = isPlayer ? isDefending : false;

    int baseDamage;
    switch (action) {
      case BattleAction.attack:
        baseDamage = attacker.attack;
        break;
      case BattleAction.specialAttack:
        baseDamage = attacker.specialAttack;
        break;
      case BattleAction.defend:
        return 0;
    }

    // Apply defender's defense reduction
    double damage = baseDamage * (100 / (100 + defender.defense));

    // Random variance ±15%
    final variance = 0.85 + (DateTime.now().millisecondsSinceEpoch % 30) / 100;
    damage *= variance;

    // Apply defending bonus (50% damage reduction)
    if (isAttackerDefending) {
      damage *= 0.5;
    }

    return damage.round();
  }

  void reset() {
    playerCurrentHp = playerHero.maxHp;
    aiCurrentHp = aiHero.maxHp;
    round = 1;
    isPlayerTurn = true;
    turnHistory = [];
    isDefending = false;
  }
}