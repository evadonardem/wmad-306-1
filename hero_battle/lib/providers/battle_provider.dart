import 'package:flutter/foundation.dart';
import 'package:hero_battle/engine/battle_engine.dart';
import 'package:hero_battle/models/hero_model.dart';

class BattleProvider extends ChangeNotifier {
  late BattleEngine _engine;
  BattleState? _battleState;
  final bool _isLoading = false;
  String? _errorMessage;
  bool _needsSwap = false;

  BattleProvider() {
    _engine = BattleEngine();
  }

  BattleState? get battleState => _battleState;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isBattleActive => _battleState != null && !_battleState!.isBattleReallyOver;
  bool get isBattleOver => _battleState != null && _battleState!.isBattleReallyOver;

  /// Whether the active hero is knocked out and a swap is required
  bool get needsSwap => _needsSwap;

  /// Start a new battle with the full deck deployed
  void startBattle(HeroModel playerHero, HeroModel opponentHero, {List<HeroModel> playerDeck = const [], List<HeroModel> opponentDeck = const []}) {
    _engine.initializeBattle(playerHero, opponentHero, playerDeck: playerDeck, opponentDeck: opponentDeck);
    _battleState = _engine.state;
    _errorMessage = null;
    _needsSwap = false;
    notifyListeners();
  }

  /// Execute player action, then immediately execute opponent response.
  void executePlayerAction(BattleAction action) {
    if (_battleState == null || !isBattleActive) return;

    // Player acts
    _engine.executeAction(action, true);
    _battleState = _engine.state;

    // If opponent's active hero was KO'd, auto-swap to next alive hero
    if (_battleState!.opponentHealth <= 0 && !_battleState!.isOpponentDeckWipedOut) {
      _engine.swapOpponentHero();
      _battleState = _engine.state;
    }

    // Opponent responds immediately (if battle not over)
    if (!_battleState!.isBattleReallyOver) {
      final opAction = _engine.getOpponentAction();
      _engine.executeAction(opAction, false);
      _battleState = _engine.state;

      // Check if player's active hero was knocked out
      if (_battleState!.playerHealth <= 0 && !_battleState!.isDeckWipedOut) {
        _needsSwap = true;
        _battleState!.battleLog.add('💀 ${_battleState!.playerHero.name} was knocked out!');
      }
    }

    notifyListeners();
  }

  /// Swap active hero with a bench hero (voluntary or forced).
  /// Opponent responds immediately after the swap.
  void swapHero(HeroModel newHero) {
    if (_battleState == null) return;

    _engine.swapActiveHero(newHero);
    _battleState = _engine.state;
    _needsSwap = false;

    // Opponent responds immediately after swap
    if (!_battleState!.isBattleReallyOver) {
      final opAction = _engine.getOpponentAction();
      _engine.executeAction(opAction, false);
      _battleState = _engine.state;

      // Check if new hero was also knocked out
      if (_battleState!.playerHealth <= 0 && !_battleState!.isDeckWipedOut) {
        _needsSwap = true;
        _battleState!.battleLog.add('💀 ${_battleState!.playerHero.name} was knocked out!');
      }
    }

    notifyListeners();
  }

  /// Get all actions for the player (including on-cooldown ones)
  List<BattleAction> getAllActions() {
    if (_battleState == null) return [];
    return _engine.getAllActions(true);
  }

  /// Get only usable (off-cooldown) actions
  List<BattleAction> getAvailableActions() {
    if (_battleState == null) return [];
    return _engine.getAvailableActions(true);
  }

  /// Get remaining cooldown for a specific action
  int getCooldown(String actionName) {
    return _engine.getCooldown(actionName, true);
  }

  /// Reset battle
  void resetBattle() {
    _battleState = null;
    _errorMessage = null;
    _needsSwap = false;
    notifyListeners();
  }
}
