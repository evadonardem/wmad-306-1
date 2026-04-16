import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../models/battle_record.dart';
import '../engine/battle_engine.dart';
import '../services/database_service.dart';

enum BattleState { idle, active, finished }

class BattleProvider extends ChangeNotifier {
  BattleEngine? _engine;
  BattleState _state = BattleState.idle;
  String? _winner;
  List<BattleTurn> _turnHistory = [];
  bool _isPlayerTurn = true;

  BattleEngine? get engine => _engine;
  BattleState get state => _state;
  String? get winner => _winner;
  List<BattleTurn> get turnHistory => _turnHistory;
  bool get isPlayerTurn => _isPlayerTurn;
  bool get isBattleActive => _state == BattleState.active;

  void startBattle(HeroModel playerHero, HeroModel aiHero) {
    _engine = BattleEngine(playerHero: playerHero, aiHero: aiHero);
    _state = BattleState.active;
    _winner = null;
    _turnHistory = [];
    _isPlayerTurn = true;
    notifyListeners();
  }

  Future<void> playerAction(BattleAction action) async {
    if (_engine == null || _state != BattleState.active) return;
    if (!_engine!.isPlayerTurn) return;

    _engine!.executePlayerAction(action);
    _turnHistory = [..._engine!.turnHistory];
    _isPlayerTurn = _engine!.isPlayerTurn;

    notifyListeners();

    if (_engine!.isBattleOver) {
      await _endBattle();
    } else {
      // AI responds after a short delay
      await Future.delayed(const Duration(milliseconds: 800));
      if (_engine != null && _engine!.isBattleOver == false) {
        _engine!.executeAIAction();
        _turnHistory = [..._engine!.turnHistory];
        _isPlayerTurn = _engine!.isPlayerTurn;
        notifyListeners();

        if (_engine!.isBattleOver) {
          await _endBattle();
        }
      }
    }
  }

  Future<void> _endBattle() async {
    if (_engine == null) return;

    final playerWon = _engine!.playerWon;
    _winner = playerWon ? _engine!.playerHero.name : _engine!.aiHero.name;
    _state = BattleState.finished;

    // Save battle record
    final record = BattleRecord(
      playerHero: _engine!.playerHero.name,
      aiHero: _engine!.aiHero.name,
      playerWon: playerWon,
      roundsPlayed: _engine!.round,
      playedAt: DateTime.now().toIso8601String(),
    );
    await DatabaseService().saveBattleRecord(record);

    notifyListeners();
  }

  void resetBattle() {
    _engine = null;
    _state = BattleState.idle;
    _winner = null;
    _turnHistory = [];
    _isPlayerTurn = true;
    notifyListeners();
  }
}