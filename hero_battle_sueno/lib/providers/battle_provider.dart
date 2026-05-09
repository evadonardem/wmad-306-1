import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/hero_model.dart';
import '../models/battle_record.dart';
import '../services/db_service.dart';
import '../services/superhero_api_service.dart';
import '../engine/battle_engine.dart';
import 'player_manager_provider.dart';

class BattleProvider extends ChangeNotifier {
  /// 🔹 HISTORY
  List<BattleRecord> battles = [];

  Future<void> loadBattleHistory(int playerId) async {
    battles = await DBService.getBattlesForPlayer(playerId);
    notifyListeners();
  }

  Future<void> deleteBattle(int id) async {
    await DBService.deleteBattleHistory(id);
    battles.removeWhere((b) => b.id == id);
    notifyListeners();
  }

  Future<void> saveBattleResult({
    required int playerId,
    required bool won,
    required String opponent,
    required PlayerManagerProvider playerManager,
    required List<String> log,
  }) async {
    final result = won ? "win" : "loss";
    print("Saving battle: $log");
    await DBService.insertBattle(playerId: playerId, result: result, log: log);

    if (won) {
      await playerManager.incrementWins(playerId);
    } else {
      await playerManager.incrementLosses(playerId);
    }

    // Reload players so currentPlayer stats are up to date
    await playerManager.loadPlayers();
    await loadBattleHistory(playerId);
  }

  /// =============================
  /// 🔥 BATTLE ENGINE
  /// =============================

  final SuperheroApiService _api = SuperheroApiService();

  List<HeroModel> allHeroes = [];
  bool allHeroesLoaded = false;

  bool hasActiveBattle = false;

  List<HeroModel> playerDeck = [];
  List<HeroModel> enemyDeck = [];

  int playerIndex = 0;
  int enemyIndex = 0;

  HeroModel? playerHero;
  HeroModel? enemyHero;

  int playerHp = 0;
  int enemyHp = 0;

  bool isFinished = false;
  String result = "";

  final List<String> battleLog = [];

  /// 🔥 START BATTLE (THIS WAS MISSING ❗)
  Future<void> startBattle(
    List<HeroModel> deck, {
    List<HeroModel>? customEnemy,
  }) async {
    if (deck.length < 2) return;

    isFinished = false;
    result = "";
    battleLog.clear();

    playerDeck = List.from(deck);

    if (!allHeroesLoaded) {
      try {
        allHeroes = await _api.fetchAllHeroes();
        allHeroesLoaded = true;
      } catch (e) {
        debugPrint("Failed to load heroes: $e");
        allHeroes = [];
      }
    }

    enemyDeck = customEnemy ?? _generateEnemyTeam(deck);

    // Prevent empty enemy crash
    if (enemyDeck.isEmpty) {
      result = "No enemies available";
      isFinished = true;
      notifyListeners();
      return;
    }

    playerIndex = 0;
    enemyIndex = 0;

    playerHero = playerDeck[playerIndex];
    enemyHero = enemyDeck[enemyIndex];

    playerHp = playerHero!.maxHp;
    enemyHp = enemyHero!.maxHp;

    hasActiveBattle = true;

    notifyListeners();
  }

  /// 🔥 ENEMY GENERATION
  List<HeroModel> _generateEnemyTeam(List<HeroModel> playerDeck) {
    final rand = Random();

    final pool = allHeroes
        .where((h) => !playerDeck.any((p) => p.id == h.id))
        .toList();

    pool.shuffle(rand);

    return pool.take(playerDeck.length).toList();
  }

  void resetBattle() {
    hasActiveBattle = false;
    isFinished = false;
    result = "";
    battleLog.clear();

    playerHero = null;
    enemyHero = null;

    playerDeck.clear();
    enemyDeck.clear();

    notifyListeners();
  }

  /// ⚔️ PLAYER ATTACK
  void attack(BuildContext context) {
    if (isFinished || playerHero == null || enemyHero == null) return;
    final skill = BattleEngine.getRandomSkill(playerHero!);
    final damage = BattleEngine.calculateDamage(playerHero!, skill);
    enemyHp = max(0, enemyHp - damage).toInt();
    battleLog.add("${playerHero!.name} used ${skill.name} → $damage");
    if (enemyHp <= 0) {
      _nextEnemy(context);
      notifyListeners();
      return;
    }
    notifyListeners();
    Future.delayed(const Duration(milliseconds: 500), () {
      _enemyTurn(context);
      notifyListeners();
    });
  }

  /// 🔁 NEXT ENEMY
  Future<void> _nextEnemy(BuildContext context) async {
    battleLog.add("${enemyHero!.name} defeated!");
    enemyIndex++;

    if (enemyIndex >= enemyDeck.length) {
      debugPrint(
        "[BattleProvider] All enemies defeated. Setting isFinished = true, result = YOU WIN 🎉",
      );
      result = "YOU WIN 🎉";
      isFinished = true;
      notifyListeners();
      await _finalizeBattle(context, true);
      return;
    }

    enemyHero = enemyDeck[enemyIndex];
    enemyHp = enemyHero!.maxHp;

    battleLog.add("⚔️ New enemy: ${enemyHero!.name}");
    notifyListeners();
  }

  /// 🤖 ENEMY TURN
  void _enemyTurn(BuildContext context) {
    if (isFinished || playerHero == null || enemyHero == null) return;

    final skill = BattleEngine.getRandomSkill(enemyHero!);
    final damage = BattleEngine.calculateDamage(enemyHero!, skill);

    playerHp = max(0, playerHp - damage).toInt();

    battleLog.add("${enemyHero!.name} used ${skill.name} → $damage");

    if (playerHp <= 0) {
      _nextPlayer(context);
      return;
    }

    notifyListeners();
  }

  /// 🔁 NEXT PLAYER HERO
  Future<void> _nextPlayer(BuildContext context) async {
    battleLog.add("${playerHero!.name} defeated!");
    playerIndex++;

    if (playerIndex >= playerDeck.length) {
      debugPrint(
        "[BattleProvider] All player heroes defeated. Setting isFinished = true, result = YOU LOST 💀",
      );
      result = "YOU LOST 💀";
      isFinished = true;
      notifyListeners();
      await _finalizeBattle(context, false);
      return;
    }

    playerHero = playerDeck[playerIndex];
    playerHp = playerHero!.maxHp;

    battleLog.add("🧍 New hero: ${playerHero!.name}");
    notifyListeners();
  }

  /// 🔥 FINAL SAVE (CONNECTS EVERYTHING)
  Future<void> _finalizeBattle(BuildContext context, bool won) async {
    final playerManager = context.read<PlayerManagerProvider>();
    final currentPlayer = playerManager.currentPlayer;

    if (currentPlayer == null) return;

    await saveBattleResult(
      playerId: currentPlayer.id!,
      won: won,
      opponent: enemyHero?.name ?? "Enemy",
      playerManager: playerManager,
      log: List<String>.from(battleLog),
    );
  }
}
