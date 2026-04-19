import 'package:flutter/foundation.dart';

import '../engine/battle_engine.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';

enum BattleLogType {
  info,
  attack,
  special,
  defend,
  roundWin,
  roundLoss,
  victory,
  defeat,
  error,
}

class BattleLogEntry {
  final BattleLogType type;
  final String message;

  const BattleLogEntry({required this.type, required this.message});
}

class BattleProvider extends ChangeNotifier {
  final BattleEngine _engine = BattleEngine();

  List<HeroModel> _playerTeam = [];
  List<HeroModel> _aiTeam = [];
  int _playerIndex = 0;
  int _aiIndex = 0;
  int _playerHp = 0;
  int _aiHp = 0;
  int _rounds = 0;
  bool _playerTurn = true;
  bool _isComplete = false;
  bool? _playerWon;
  bool _recordSaved = false;
  bool _specialUsedThisBattle = false;
  bool _actionInProgress = false;
  bool _playerDefending = false;
  bool _aiDefending = false;
  bool _awaitingPlay = false;
  List<BattleLogEntry> _log = [];

  HeroModel? get playerHero => _heroAt(_playerTeam, _playerIndex);
  HeroModel? get aiHero => _heroAt(_aiTeam, _aiIndex);

  List<HeroModel> get playerTeam => List.unmodifiable(_playerTeam);
  List<HeroModel> get aiTeam => List.unmodifiable(_aiTeam);
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get rounds => _rounds;
  int get playerRemaining => (_playerTeam.length - _playerIndex).clamp(0, 99);
  int get aiRemaining => (_aiTeam.length - _aiIndex).clamp(0, 99);
  int get playerActiveNumber => _activeNumber(_playerTeam, _playerIndex);
  int get aiActiveNumber => _activeNumber(_aiTeam, _aiIndex);
  bool get playerTurn => _playerTurn;
  bool get isComplete => _isComplete;
  bool? get playerWon => _playerWon;
  bool get specialUsedThisBattle => _specialUsedThisBattle;
  bool get actionInProgress => _actionInProgress;
  bool get playerDefending => _playerDefending;
  bool get aiDefending => _aiDefending;
  bool get awaitingPlay => _awaitingPlay;
  List<BattleLogEntry> get log => List.unmodifiable(_log);

  void startBattle({required HeroModel playerHero, required HeroModel aiHero}) {
    startTeamBattle(playerTeam: [playerHero], aiTeam: [aiHero]);
  }

  void prepareTeamBattle({
    required List<HeroModel> playerTeam,
    required List<HeroModel> aiTeam,
  }) {
    _setUpTeamBattle(
      playerTeam: playerTeam,
      aiTeam: aiTeam,
      startImmediately: false,
    );
  }

  void startTeamBattle({
    required List<HeroModel> playerTeam,
    required List<HeroModel> aiTeam,
  }) {
    _setUpTeamBattle(
      playerTeam: playerTeam,
      aiTeam: aiTeam,
      startImmediately: true,
    );
  }

  void playPreparedBattle() {
    if (!_awaitingPlay || _isComplete || playerHero == null || aiHero == null) {
      return;
    }

    _awaitingPlay = false;
    _addLog(BattleLogType.info, 'Battle started.');

    if (!_playerTurn) {
      _aiTakeTurn();
    }

    notifyListeners();
  }

  void _setUpTeamBattle({
    required List<HeroModel> playerTeam,
    required List<HeroModel> aiTeam,
    required bool startImmediately,
  }) {
    _playerTeam = _uniqueTeam(playerTeam);
    _aiTeam = _uniqueTeam(aiTeam);
    if (_playerTeam.isEmpty || _aiTeam.isEmpty) return;

    _playerIndex = 0;
    _aiIndex = 0;
    _playerHp = playerHero!.maxHp;
    _aiHp = aiHero!.maxHp;
    _rounds = 1;
    _isComplete = false;
    _playerWon = null;
    _recordSaved = false;
    _specialUsedThisBattle = false;
    _actionInProgress = false;
    _playerDefending = false;
    _aiDefending = false;
    _awaitingPlay = !startImmediately;
    _playerTurn = playerHero!.initiative >= aiHero!.initiative;
    _log = [
      if (!startImmediately)
        const BattleLogEntry(
          type: BattleLogType.info,
          message: 'Battle is ready. Press Play to begin.',
        ),
      BattleLogEntry(
        type: BattleLogType.info,
        message: _playerTurn
            ? '${playerHero!.name} moves first.'
            : '${aiHero!.name} moves first.',
      ),
      BattleLogEntry(type: BattleLogType.info, message: _matchupMessage()),
      BattleLogEntry(
        type: BattleLogType.info,
        message:
            'Elimination battle: ${_playerTeam.length} vs ${_aiTeam.length}.',
      ),
    ];

    if (startImmediately && !_playerTurn) {
      _aiTakeTurn();
    }

    notifyListeners();
  }

  Future<void> playerAttack({required bool special}) async {
    if (_actionInProgress ||
        _isComplete ||
        !_playerTurn ||
        _awaitingPlay ||
        playerHero == null ||
        aiHero == null ||
        (special && _specialUsedThisBattle)) {
      return;
    }

    _actionInProgress = true;
    if (special) _specialUsedThisBattle = true;
    notifyListeners();

    final result = _engine.attack(
      attacker: playerHero!,
      defender: aiHero!,
      special: special,
      defenderDefending: _aiDefending,
    );
    _aiDefending = false;
    _aiHp = (_aiHp - result.damage).clamp(0, aiHero!.maxHp);
    _addLog(
      special ? BattleLogType.special : BattleLogType.attack,
      result.message,
    );
    final matchupChanged = _resolveKnockouts();

    if (!_isComplete && !matchupChanged) {
      _playerTurn = false;
      _aiTakeTurn();
    }

    _actionInProgress = false;
    notifyListeners();
    await saveRecordIfComplete();
  }

  Future<void> playerDefend() async {
    if (_actionInProgress ||
        _isComplete ||
        !_playerTurn ||
        _awaitingPlay ||
        playerHero == null ||
        aiHero == null) {
      return;
    }

    _actionInProgress = true;
    _playerDefending = true;
    _addLog(BattleLogType.defend, _engine.defendMessage(playerHero!));
    notifyListeners();

    _playerTurn = false;
    _aiTakeTurn();
    _actionInProgress = false;
    notifyListeners();
    await saveRecordIfComplete();
  }

  void _aiTakeTurn() {
    if (_isComplete || _awaitingPlay || playerHero == null || aiHero == null) {
      return;
    }

    if (_shouldAiDefend()) {
      _aiDefending = true;
      _addLog(BattleLogType.defend, _engine.defendMessage(aiHero!));
      _playerTurn = true;
      _rounds++;
      return;
    }

    _aiAttack();
  }

  bool _shouldAiDefend() {
    if (aiHero == null || playerHero == null || _aiDefending) return false;
    final lowHp = _aiHp <= (aiHero!.maxHp * 0.35).round();
    final sturdyEnough =
        aiHero!.powerStats.durability >= playerHero!.powerStats.strength;
    return lowHp && sturdyEnough && _rounds.isEven;
  }

  void _aiAttack() {
    if (_isComplete || playerHero == null || aiHero == null) return;
    final special = _rounds % 3 == 0;
    final result = _engine.attack(
      attacker: aiHero!,
      defender: playerHero!,
      special: special,
      defenderDefending: _playerDefending,
    );
    _playerDefending = false;
    _playerHp = (_playerHp - result.damage).clamp(0, playerHero!.maxHp);
    _addLog(
      special ? BattleLogType.special : BattleLogType.attack,
      result.message,
    );
    final matchupChanged = _resolveKnockouts();
    if (!_isComplete && !matchupChanged) {
      _playerTurn = true;
      _rounds++;
    }
  }

  bool _resolveKnockouts() {
    if (aiHero != null && _aiHp <= 0) {
      final defeated = aiHero!;
      _addLog(
        BattleLogType.roundWin,
        'Round won: ${playerHero!.name} eliminated ${defeated.name}.',
      );
      _aiIndex++;
      _aiDefending = false;
      _playerDefending = false;

      if (_aiIndex >= _aiTeam.length) {
        _finishBattle(playerWon: true);
        return true;
      }

      _aiHp = aiHero!.maxHp;
      _addLog(BattleLogType.info, _matchupMessage());
      _playerTurn = playerHero!.initiative >= aiHero!.initiative;
      if (!_playerTurn) _aiTakeTurn();
      return true;
    }

    if (playerHero != null && _playerHp <= 0) {
      final defeated = playerHero!;
      _addLog(
        BattleLogType.roundLoss,
        'Round lost: ${defeated.name} was eliminated by ${aiHero!.name}.',
      );
      _playerIndex++;
      _playerDefending = false;
      _aiDefending = false;

      if (_playerIndex >= _playerTeam.length) {
        _finishBattle(playerWon: false);
        return true;
      }

      _playerHp = playerHero!.maxHp;
      _addLog(BattleLogType.info, _matchupMessage());
      _playerTurn = playerHero!.initiative >= aiHero!.initiative;
      if (!_playerTurn) _aiTakeTurn();
      return true;
    }

    return false;
  }

  void _finishBattle({required bool playerWon}) {
    _isComplete = true;
    _playerWon = playerWon;
    _awaitingPlay = false;
    _addLog(
      playerWon ? BattleLogType.victory : BattleLogType.defeat,
      playerWon
          ? 'Victory! Your team is still standing.'
          : 'Defeat! The computer team wins.',
    );
  }

  Future<void> saveRecordIfComplete() async {
    if (!_isComplete ||
        _recordSaved ||
        _playerTeam.isEmpty ||
        _aiTeam.isEmpty) {
      return;
    }

    _recordSaved = true;
    try {
      await DatabaseService().saveBattleRecord(
        BattleRecord(
          playerHero: _playerTeam.map((hero) => hero.name).join(', '),
          aiHero: _aiTeam.map((hero) => hero.name).join(', '),
          playerWon: _playerWon == true,
          roundsPlayed: _rounds,
          playedAt: DateTime.now().toIso8601String(),
        ),
      );
    } catch (_) {
      _addLog(
        BattleLogType.error,
        'Battle finished, but history could not be saved.',
      );
      notifyListeners();
    }
  }

  List<HeroModel> _uniqueTeam(List<HeroModel> heroes) {
    final team = <HeroModel>[];
    for (final hero in heroes) {
      if (team.any((item) => item.id == hero.id)) continue;
      team.add(hero);
    }
    return team;
  }

  HeroModel? _heroAt(List<HeroModel> team, int index) {
    if (team.isEmpty) return null;
    if (index < 0) return team.first;
    if (index >= team.length) return team.last;
    return team[index];
  }

  int _activeNumber(List<HeroModel> team, int index) {
    if (team.isEmpty) return 0;
    final active = index + 1;
    if (active < 1) return 1;
    if (active > team.length) return team.length;
    return active;
  }

  String _matchupMessage() {
    return '${playerHero!.name} enters against ${aiHero!.name}.';
  }

  void _addLog(BattleLogType type, String message) {
    _log = [BattleLogEntry(type: type, message: message), ..._log];
  }
}
