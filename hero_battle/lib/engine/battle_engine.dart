import 'dart:math';
import 'package:hero_battle/models/hero_model.dart';

class BattleAction {
  final String name;
  final String description;
  final int damage;
  final int? heal;
  final double accuracy;
  final int cooldown;

  BattleAction({
    required this.name,
    required this.description,
    required this.damage,
    this.heal,
    required this.accuracy,
    this.cooldown = 0,
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

  bool get isPlayerWin => winner.id == playerHero.id;

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
}

class BattleEngine {
  late BattleState state;
  final Random _random = Random();

  // Cooldown tracking: action name -> remaining turns
  final Map<String, int> _playerCooldowns = {};
  final Map<String, int> _opponentCooldowns = {};

  Map<String, int> get playerCooldowns => Map.unmodifiable(_playerCooldowns);
  Map<String, int> get opponentCooldowns => Map.unmodifiable(_opponentCooldowns);

  /// Initialize a new battle
  void initializeBattle(HeroModel playerHero, HeroModel opponentHero) {
    state = BattleState.initialize(playerHero, opponentHero);
    _playerCooldowns.clear();
    _opponentCooldowns.clear();
  }

  /// Get all actions (with cooldown info) for the current hero
  List<BattleAction> getAllActions(bool forPlayer) {
    final hero = forPlayer ? state.playerHero : state.opponentHero;
    return _generateActions(hero);
  }

  /// Get only usable (off-cooldown) actions
  List<BattleAction> getAvailableActions(bool forPlayer) {
    final cd = forPlayer ? _playerCooldowns : _opponentCooldowns;
    return getAllActions(forPlayer)
        .where((a) => (cd[a.name] ?? 0) <= 0)
        .toList();
  }

  /// Get remaining cooldown turns for an action
  int getCooldown(String actionName, bool forPlayer) {
    final cd = forPlayer ? _playerCooldowns : _opponentCooldowns;
    return cd[actionName] ?? 0;
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
      // Still apply cooldown on miss
      if (action.cooldown > 0) {
        final cd = isPlayer ? _playerCooldowns : _opponentCooldowns;
        cd[action.name] = action.cooldown;
      }
      _tickCooldowns(isPlayer);
      state.isPlayerTurn = !state.isPlayerTurn;
      state.turnCount++;
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

    // Apply cooldown for the used action
    if (action.cooldown > 0) {
      final cd = isPlayer ? _playerCooldowns : _opponentCooldowns;
      cd[action.name] = action.cooldown;
    }

    // Tick down cooldowns for the acting side
    _tickCooldowns(isPlayer);

    state.isPlayerTurn = !state.isPlayerTurn;
    state.turnCount++;

    return BattleResult(
      damageDealt: actualDamage,
      healed: healed,
      log: '${action.name} dealt $actualDamage damage!',
      success: true,
    );
  }

  /// Decrement all cooldowns for a side (called after their turn)
  void _tickCooldowns(bool isPlayer) {
    final cd = isPlayer ? _playerCooldowns : _opponentCooldowns;
    final keys = cd.keys.toList();
    for (final key in keys) {
      cd[key] = cd[key]! - 1;
      if (cd[key]! <= 0) {
        cd.remove(key);
      }
    }
  }

  /// Simulate opponent turn (only picks from off-cooldown actions)
  BattleAction getOpponentAction() {
    final actions = getAvailableActions(false);
    if (actions.isEmpty) {
      // Fallback: all on cooldown, use first action anyway
      return getAllActions(false).first;
    }
    // AI prefers attacking when opponent is low on health, healing when they are
    final healAction = actions.where((a) => a.heal != null).toList();
    if (state.opponentHealth < state.opponentHero.powerstats.health * 0.3 &&
        healAction.isNotEmpty) {
      return healAction.first;
    }
    if (state.playerHealth > state.opponentHealth) {
      // Pick highest damage available
      final sorted = List.of(actions)..sort((a, b) => b.damage.compareTo(a.damage));
      return sorted.first;
    }
    return actions[_random.nextInt(actions.length)];
  }

  /// Generate actions based on hero stats
  List<BattleAction> _generateActions(HeroModel hero) {
    final stats = hero.powerstats;
    final alignment = hero.biography.alignment.toLowerCase();
    final isGood = alignment.contains('good');
    final isBad = alignment.contains('bad');

    // Determine hero's dominant stat for themed naming
    final statMap = {
      'intelligence': stats.intelligence,
      'strength': stats.strength,
      'speed': stats.speed,
      'power': stats.power,
      'combat': stats.combat,
      'durability': stats.durability,
    };
    final dominant = statMap.entries.reduce((a, b) => a.value >= b.value ? a : b).key;

    // ─ Skill 1: Primary Attack (strength-based) ────────────────────────
    final String atkName;
    final String atkDesc;
    if (stats.strength >= 80) {
      atkName = isBad ? 'Crushing Blow' : 'Titan Strike';
      atkDesc = 'A devastating show of raw strength';
    } else if (stats.combat >= 70) {
      atkName = isBad ? 'Dirty Strike' : 'Precision Combo';
      atkDesc = 'Trained combat technique';
    } else if (stats.intelligence >= 70) {
      atkName = isBad ? 'Exploit Weakness' : 'Calculated Hit';
      atkDesc = 'An attack aimed at the weak point';
    } else {
      atkName = isBad ? 'Savage Punch' : 'Power Strike';
      atkDesc = 'A strong physical attack';
    }
    final primaryAttack = BattleAction(
      name: atkName,
      description: atkDesc,
      damage: 20 + (stats.strength ~/ 8) + (stats.combat ~/ 12),
      accuracy: 0.85,
      cooldown: 1,
    );

    // ─ Skill 2: Special Attack (power + intelligence based) ────────────
    final String spcName;
    final String spcDesc;
    if (stats.power >= 80) {
      spcName = isBad ? 'Dark Blast' : 'Energy Nova';
      spcDesc = 'Unleash massive energy';
    } else if (stats.intelligence >= 80) {
      spcName = isBad ? 'Mind Crush' : 'Psychic Wave';
      spcDesc = 'A devastating mental assault';
    } else if (dominant == 'speed') {
      spcName = isBad ? 'Phantom Rush' : 'Blitz Barrage';
      spcDesc = 'A rapid multi-hit barrage';
    } else if (dominant == 'combat') {
      spcName = isBad ? 'Ruthless Assault' : 'Ultimate Technique';
      spcDesc = 'An advanced combat maneuver';
    } else {
      spcName = isBad ? 'Shadow Bolt' : 'Energy Blast';
      spcDesc = 'A focused energy projectile';
    }
    final specialAttack = BattleAction(
      name: spcName,
      description: spcDesc,
      damage: 30 + (stats.power ~/ 6) + (stats.intelligence ~/ 10),
      accuracy: 0.65 + (stats.intelligence / 1000),
      cooldown: 2,
    );

    // ─ Skill 3: Quick / Utility Attack (speed-based) ───────────────────
    final String qckName;
    final String qckDesc;
    if (stats.speed >= 80) {
      qckName = isBad ? 'Ambush' : 'Lightning Dash';
      qckDesc = 'A blindingly fast strike';
    } else if (stats.combat >= 60) {
      qckName = isBad ? 'Sucker Punch' : 'Counter Strike';
      qckDesc = 'A swift retaliatory move';
    } else {
      qckName = isBad ? 'Cheap Shot' : 'Quick Jab';
      qckDesc = 'A fast, reliable hit';
    }
    final quickAttack = BattleAction(
      name: qckName,
      description: qckDesc,
      damage: 12 + (stats.speed ~/ 8) + (stats.combat ~/ 14),
      accuracy: 0.92 + (stats.speed / 2000),
    );

    // ─ Skill 4: Defensive / Heal (durability-based) ────────────────────
    final String defName;
    final String defDesc;
    int defDamage;
    int defHeal;
    if (stats.durability >= 80) {
      defName = isGood ? 'Iron Will' : 'Dark Regeneration';
      defDesc = 'Endure and recover significantly';
      defDamage = 5;
      defHeal = 35 + (stats.durability ~/ 5);
    } else if (stats.intelligence >= 70) {
      defName = isGood ? 'Tactical Retreat' : 'Drain Life';
      defDesc = isBad ? 'Steal vitality from the foe' : 'Regroup and recover';
      defDamage = isBad ? 15 + (stats.intelligence ~/ 10) : 8;
      defHeal = 25 + (stats.durability ~/ 6);
    } else {
      defName = isGood ? 'Second Wind' : 'Desperate Recovery';
      defDesc = 'Catch your breath and heal';
      defDamage = 8;
      defHeal = 20 + (stats.durability ~/ 7);
    }
    final defensiveHeal = BattleAction(
      name: defName,
      description: defDesc,
      damage: defDamage,
      heal: defHeal,
      accuracy: 1.0,
      cooldown: 3,
    );

    return [primaryAttack, specialAttack, quickAttack, defensiveHeal];
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
