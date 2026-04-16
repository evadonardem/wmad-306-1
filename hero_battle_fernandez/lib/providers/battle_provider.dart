import 'package:flutter/foundation.dart';

import '../engine/battle_engine.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';

class BattleProvider extends ChangeNotifier {
  final BattleEngine _engine = BattleEngine();

  HeroModel? _playerHero;
  HeroModel? _aiHero;
  int _playerHp = 0;
  int _aiHp = 0;
  int _rounds = 0;
  bool _playerTurn = true;
  bool _isComplete = false;
  bool? _playerWon;
  bool _recordSaved = false;
  bool _specialUsedThisBattle = false;
  bool _actionInProgress = false;
  List<String> _log = [];

  HeroModel? get playerHero => _playerHero;
  HeroModel? get aiHero => _aiHero;
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get rounds => _rounds;
  bool get playerTurn => _playerTurn;
  bool get isComplete => _isComplete;
  bool? get playerWon => _playerWon;
  bool get specialUsedThisBattle => _specialUsedThisBattle;
  bool get actionInProgress => _actionInProgress;
  List<String> get log => List.unmodifiable(_log);

  void startBattle({required HeroModel playerHero, required HeroModel aiHero}) {
    _playerHero = playerHero;
    _aiHero = aiHero;
    _playerHp = playerHero.maxHp;
    _aiHp = aiHero.maxHp;
    _rounds = 1;
    _isComplete = false;
    _playerWon = null;
    _recordSaved = false;
    _specialUsedThisBattle = false;
    _actionInProgress = false;
    _playerTurn = playerHero.initiative >= aiHero.initiative;
    _log = [
      '${playerHero.name} faces ${aiHero.name}.',
      _playerTurn
          ? '${playerHero.name} moves first.'
          : '${aiHero.name} moves first.',
    ];

    if (!_playerTurn) {
      _aiAttack();
    }

    notifyListeners();
  }

  Future<void> playerAttack({required bool special}) async {
    if (_actionInProgress ||
        _isComplete ||
        !_playerTurn ||
        _playerHero == null ||
        _aiHero == null ||
        (special && _specialUsedThisBattle)) {
      return;
    }

    _actionInProgress = true;
    if (special) _specialUsedThisBattle = true;
    notifyListeners();

    final result = _engine.attack(
      attacker: _playerHero!,
      defender: _aiHero!,
      special: special,
    );
    _aiHp = (_aiHp - result.damage).clamp(0, _aiHero!.maxHp);
    _log = [result.message, ..._log];
    _checkComplete();

    if (!_isComplete) {
      _playerTurn = false;
      _aiAttack();
    }

    _actionInProgress = false;
    notifyListeners();
    await saveRecordIfComplete();
  }

  void _aiAttack() {
    if (_isComplete || _playerHero == null || _aiHero == null) return;
    final special = _rounds % 3 == 0;
    final result = _engine.attack(
      attacker: _aiHero!,
      defender: _playerHero!,
      special: special,
    );
    _playerHp = (_playerHp - result.damage).clamp(0, _playerHero!.maxHp);
    _log = [result.message, ..._log];
    _checkComplete();
    if (!_isComplete) {
      _playerTurn = true;
      _rounds++;
    }
  }

  void _checkComplete() {
    if (_aiHp <= 0 || _playerHp <= 0) {
      _isComplete = true;
      _playerWon = _aiHp <= 0 && _playerHp > 0;
      _log = [_playerWon == true ? 'Victory!' : 'Defeat!', ..._log];
    }
  }

  Future<void> saveRecordIfComplete() async {
    if (!_isComplete ||
        _recordSaved ||
        _playerHero == null ||
        _aiHero == null) {
      return;
    }

    _recordSaved = true;
    try {
      await DatabaseService().saveBattleRecord(
        BattleRecord(
          playerHero: _playerHero!.name,
          aiHero: _aiHero!.name,
          playerWon: _playerWon == true,
          roundsPlayed: _rounds,
          playedAt: DateTime.now().toIso8601String(),
        ),
      );
    } catch (_) {
      _log = ['Battle finished, but history could not be saved.', ..._log];
      notifyListeners();
    }
  }
}
