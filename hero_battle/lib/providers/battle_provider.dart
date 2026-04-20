import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../models/battle_model.dart';
import '../services/database_service.dart';

import '../engine/battle_engine.dart';

class BattleProvider extends ChangeNotifier {
  final List<String> _battleLog = [];
  bool _isBattleOver = false;
  String _winner = '';
  int _turn = 0;

  List<String> get battleLog => _battleLog;
  bool get isBattleOver => _isBattleOver;
  String get winner => _winner;

  void nextTurn() {
    // Example logic for advancing turns (replace with real logic)
    _turn++;
    _battleLog.add('Turn \\$_turn played.');
    if (_turn >= 5) {
      _isBattleOver = true;
      _winner = 'Player';
    }
    notifyListeners();
  }

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
