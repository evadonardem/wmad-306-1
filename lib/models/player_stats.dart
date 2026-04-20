import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../models/battle_model.dart';
import '../services/database_service.dart';
import '../engine/battle_engine.dart';

class BattleProvider extends ChangeNotifier {
  BattleModel? _lastBattle;

  BattleModel? get lastBattle => _lastBattle;

  Future<void> startBattle(
    List<HeroModel> playerDeck,
    List<HeroModel> enemyDeck,
  ) async {
    final result = BattleEngine.battle(playerDeck, enemyDeck);
    final battle = BattleModel(
      id: DateTime.now().millisecondsSinceEpoch,
      playerDeck: playerDeck,
      enemyDeck: enemyDeck,
      result: result,
      date: DateTime.now(),
    );
    await DatabaseService().insertBattle(battle);
    _lastBattle = battle;
    notifyListeners();
  }
}
