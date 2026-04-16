import 'dart:math';
import 'package:hero_battle/models/hero_model.dart';

class BattleAction {
  final String name;
  final String description;
  final int damage;
  final int? heal;
  final double accuracy;

  BattleAction({
    required this.name,
    required this.description,
    required this.damage,
    this.heal,
    required this.accuracy,
  });
}

class BattleState {
  final HeroModel playerHero;
  final HeroModel opponentHero;
  int playerHealth;
  int opponentHealth;
  bool isPlayerTurn;
  int turnCount;
  final List<String> battleLog;

  BattleState({
    required this.playerHero,
    required this.opponentHero,
    required this.playerHealth,
    required this.opponentHealth,
    required this.isPlayerTurn,
    required this.turnCount,
    this.battleLog = const [],
  });

  bool get isBattleOver => playerHealth <= 0 || opponentHealth <= 0;

  HeroModel get winner => playerHealth > 0 ? playerHero : opponentHero;

  HeroModel get loser => playerHealth > 0 ? opponentHero : playerHero;

  factory BattleState.initialize(HeroModel playerHero, HeroModel opponentHero) {
    return BattleState(
      playerHero: playerHero,
      opponentHero: opponentHero,
      playerHealth: playerHero.powerstats.health,
      opponentHealth: opponentHero.powerstats.health,
      isPlayerTurn: true,
      turnCount: 0,
      battleLog: [],
    );
  }

  void copy({
    HeroModel? playerHero,
    HeroModel? opponentHero,
    int? playerHealth,
    int? opponentHealth,
    bool? isPlayerTurn,
    int? turnCount,
    List<String>? battleLog,
  }) {
    if (playerHero != null) {
      this.playerHero == playerHero;
    }
    if (opponentHero != null) {
      this.opponentHero == opponentHero;
    }
    if (playerHealth != null) {
      this.playerHealth = playerHealth;
    }
    if (opponentHealth != null) {
      this.opponentHealth = opponentHealth;
    }
    if (isPlayerTurn != null) {
      this.isPlayerTurn = isPlayerTurn;
    }
    if (turnCount != null) {
      this.turnCount = turnCount;
    }
    if (battleLog != null) {
      this.battleLog.addAll(battleLog);
    }
  }
}

class BattleEngine {
  late BattleState state;
  final Random _random = Random();

  /// Initialize a new battle
  void initializeBattle(HeroModel playerHero, HeroModel opponentHero) {
    state = BattleState.initialize(playerHero, opponentHero);
  }

  /// Get available actions for the current hero
  List<BattleAction> getAvailableActions(bool forPlayer) {
    final hero = forPlayer ? state.playerHero : state.opponentHero;
    return _generateActions(hero);
  }

  /// Execute an action and return damage dealt
  BattleResult executeAction(BattleAction action, bool isPlayer) {
    if (state.isBattleOver) {
      return BattleResult(
        damageDealt: 0,
        healed: 0,
        log: 'Battle is already over!',
        success: false,
      );
    }

    final isAccurate = _random.nextDouble() < action.accuracy;

    if (!isAccurate) {
      state.battleLog.add(
        '${isPlayer ? state.playerHero.name : state.opponentHero.name} '
        'used ${action.name} but missed!',
      );
      return BattleResult(
        damageDealt: 0,
        healed: 0,
        log: 'Miss!',
        success: false,
      );
    }

    // Calculate damage with some variance
    final damageVariance = (action.damage * 0.2).toInt();
    final actualDamage =
        action.damage - damageVariance + _random.nextInt(damageVariance * 2);

    int healed = 0;

    if (isPlayer) {
      state.opponentHealth = (state.opponentHealth - actualDamage).clamp(0, state.opponentHero.powerstats.health);

      if (action.heal != null) {
        healed = action.heal!;
        state.playerHealth = (state.playerHealth + healed).clamp(0, state.playerHero.powerstats.health);
      }

      state.battleLog.add(
        '${state.playerHero.name} used ${action.name}! '
        'Dealt $actualDamage damage. '
        '${action.heal != null ? 'Healed $healed HP.' : ''}',
      );
    } else {
      state.playerHealth = (state.playerHealth - actualDamage).clamp(0, state.playerHero.powerstats.health);

      if (action.heal != null) {
        healed = action.heal!;
        state.opponentHealth = (state.opponentHealth + healed).clamp(0, state.opponentHero.powerstats.health);
      }

      state.battleLog.add(
        '${state.opponentHero.name} used ${action.name}! '
        'Dealt $actualDamage damage. '
        '${action.heal != null ? 'Healed $healed HP.' : ''}',
      );
    }

    state.isPlayerTurn = !state.isPlayerTurn;
    state.turnCount++;

    return BattleResult(
      damageDealt: actualDamage,
      healed: healed,
      log: '${action.name} dealt $actualDamage damage!',
      success: true,
    );
  }

  /// Simulate opponent turn
  BattleAction getOpponentAction() {
    final actions = getAvailableActions(false);
    // AI prefers attacking when opponent is low on health, healing when they are
    if (state.playerHealth > state.opponentHealth) {
      return actions.first; // Attack
    } else if (state.opponentHealth < state.opponentHero.powerstats.health * 0.3) {
      return actions.last; // Heal if available
    }
    return actions[_random.nextInt(actions.length)];
  }

  /// Generate actions based on hero stats
  List<BattleAction> _generateActions(HeroModel hero) {
    final stats = hero.powerstats;

    // Basic Attack - uses strength stat
    final basicAttack = BattleAction(
      name: 'Power Strike',
      description: 'A strong physical attack',
      damage: 20 + (stats.strength ~/ 10),
      accuracy: 0.85,
    );

    // Special Attack - uses power stat
    final specialAttack = BattleAction(
      name: 'Energy Blast',
      description: 'A devastating energy attack',
      damage: 35 + (stats.power ~/ 8),
      accuracy: 0.70,
    );

    // Speed Attack - uses speed stat
    final speedAttack = BattleAction(
      name: 'Quick Strike',
      description: 'A swift high-accuracy attack',
      damage: 15 + (stats.speed ~/ 12),
      accuracy: 0.95,
    );

    // Defense/Heal - uses durability stat
    final defensiveHeal = BattleAction(
      name: 'Recover',
      description: 'Recover some health',
      damage: 10,
      heal: 30 + (stats.durability ~/ 8),
      accuracy: 1.0,
    );

    return [basicAttack, specialAttack, speedAttack, defensiveHeal];
  }
}

class BattleResult {
  final int damageDealt;
  final int healed;
  final String log;
  final bool success;

  BattleResult({
    required this.damageDealt,
    required this.healed,
    required this.log,
    required this.success,
  });
}
