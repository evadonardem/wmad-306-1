import 'package:flutter/foundation.dart';
import 'package:hero_battle/engine/battle_engine.dart';
import 'package:hero_battle/models/hero_model.dart';

class BattleProvider extends ChangeNotifier {
  late BattleEngine _engine;
  BattleState? _battleState;
  bool _isLoading = false;
  String? _errorMessage;

  BattleProvider() {
    _engine = BattleEngine();
  }

  BattleState? get battleState => _battleState;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isBattleActive => _battleState != null && !_battleState!.isBattleOver;
  bool get isBattleOver => _battleState != null && _battleState!.isBattleOver;

  /// Start a new battle
  void startBattle(HeroModel playerHero, HeroModel opponentHero) {
    _engine.initializeBattle(playerHero, opponentHero);
    _battleState = _engine.state;
    _errorMessage = null;
    notifyListeners();
  }

  /// Execute player action
  void executePlayerAction(BattleAction action) {
    if (_battleState == null || !isBattleActive) return;

    final result = _engine.executeAction(action, true);
    _battleState = _engine.state;

    if (!_battleState!.isBattleOver) {
      Future.delayed(const Duration(milliseconds: 800), () {
        if (isBattleActive) {
          executeOpponentAction();
        }
      });
    }

    notifyListeners();
  }

  /// Execute opponent action
  void executeOpponentAction() {
    if (_battleState == null || !isBattleActive) return;

    final action = _engine.getOpponentAction();
    final result = _engine.executeAction(action, false);
    _battleState = _engine.state;
    notifyListeners();
  }

  /// Get available actions for current hero
  List<BattleAction> getAvailableActions() {
    if (_battleState == null) return [];
    return _engine.getAvailableActions(true);
  }

  /// Reset battle
  void resetBattle() {
    _battleState = null;
    _errorMessage = null;
    notifyListeners();
  }
}
