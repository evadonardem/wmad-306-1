import 'package:flutter/foundation.dart';

import '../engine/combat_engine.dart';
import '../models/match_record.dart';
import '../models/warrior_model.dart';
import '../services/storage_service.dart';

enum LogTag { info, strike, ultimate, parry, win, loss, victory, defeat, error }

class LogLine {
  final LogTag tag;
  final String text;

  const LogLine({required this.tag, required this.text});
}

class CombatProvider extends ChangeNotifier {
  final CombatEngine _engine = CombatEngine();

  List<WarriorModel> _playerSquad = [];
  List<WarriorModel> _rivalSquad = [];
  int _playerIdx = 0;
  int _rivalIdx = 0;
  int _playerVitality = 0;
  int _rivalVitality = 0;
  int _turn = 0;
  bool _playerTurn = true;
  bool _done = false;
  bool? _playerWon;
  bool _saved = false;
  bool _ultimateUsed = false;
  bool _busy = false;
  bool _playerParrying = false;
  bool _rivalParrying = false;
  bool _awaitingStart = false;
  List<LogLine> _log = [];

  WarriorModel? get playerWarrior => _at(_playerSquad, _playerIdx);
  WarriorModel? get rivalWarrior => _at(_rivalSquad, _rivalIdx);

  List<WarriorModel> get playerSquad => List.unmodifiable(_playerSquad);
  List<WarriorModel> get rivalSquad => List.unmodifiable(_rivalSquad);
  int get playerVitality => _playerVitality;
  int get rivalVitality => _rivalVitality;
  int get turn => _turn;
  int get playerRemaining => (_playerSquad.length - _playerIdx).clamp(0, 99);
  int get rivalRemaining => (_rivalSquad.length - _rivalIdx).clamp(0, 99);
  bool get playerTurn => _playerTurn;
  bool get isDone => _done;
  bool? get playerWon => _playerWon;
  bool get ultimateUsed => _ultimateUsed;
  bool get busy => _busy;
  bool get playerParrying => _playerParrying;
  bool get awaitingStart => _awaitingStart;
  List<LogLine> get log => List.unmodifiable(_log);

  // ── Setup ──────────────────────────────────────────────────────────────────

  void prepareMatch({
    required List<WarriorModel> player,
    required List<WarriorModel> rival,
  }) {
    _init(player: player, rival: rival, startNow: false);
  }

  void startMatch({
    required List<WarriorModel> player,
    required List<WarriorModel> rival,
  }) {
    _init(player: player, rival: rival, startNow: true);
  }

  void beginPreparedMatch() {
    if (!_awaitingStart || _done || playerWarrior == null || rivalWarrior == null) {
      return;
    }
    _awaitingStart = false;
    _addLog(LogTag.info, 'Match started!');
    if (!_playerTurn) _rivalActs();
    notifyListeners();
  }

  void _init({
    required List<WarriorModel> player,
    required List<WarriorModel> rival,
    required bool startNow,
  }) {
    _playerSquad = _dedupe(player);
    _rivalSquad = _dedupe(rival);
    if (_playerSquad.isEmpty || _rivalSquad.isEmpty) return;

    _playerIdx = 0;
    _rivalIdx = 0;
    _playerVitality = playerWarrior!.vitality;
    _rivalVitality = rivalWarrior!.vitality;
    _turn = 1;
    _done = false;
    _playerWon = null;
    _saved = false;
    _ultimateUsed = false;
    _busy = false;
    _playerParrying = false;
    _rivalParrying = false;
    _awaitingStart = !startNow;
    // Higher agility goes first
    _playerTurn = playerWarrior!.agility >= rivalWarrior!.agility;

    _log = [
      if (!startNow)
        const LogLine(tag: LogTag.info, text: 'Ready — tap Start to begin.'),
      LogLine(
        tag: LogTag.info,
        text: _playerTurn
            ? '${playerWarrior!.name} strikes first!'
            : '${rivalWarrior!.name} strikes first!',
      ),
      LogLine(tag: LogTag.info, text: _matchupLine()),
      LogLine(
        tag: LogTag.info,
        text:
            'Elimination: ${_playerSquad.length} vs ${_rivalSquad.length} warriors.',
      ),
    ];

    if (startNow && !_playerTurn) _rivalActs();
    notifyListeners();
  }

  // ── Player Actions ─────────────────────────────────────────────────────────

  Future<void> playerStrike({required bool useUltimate}) async {
    if (_busy ||
        _done ||
        !_playerTurn ||
        _awaitingStart ||
        playerWarrior == null ||
        rivalWarrior == null ||
        (useUltimate && _ultimateUsed)) {
      return;
    }

    _busy = true;
    if (useUltimate) _ultimateUsed = true;
    notifyListeners();

    final result = _engine.strike(
      attacker: playerWarrior!,
      defender: rivalWarrior!,
      isUltimate: useUltimate,
      defenderParrying: _rivalParrying,
    );
    _rivalParrying = false;
    _rivalVitality =
        (_rivalVitality - result.damage).clamp(0, rivalWarrior!.vitality);
    _addLog(useUltimate ? LogTag.ultimate : LogTag.strike, result.message);

    final changed = _resolveDefeats();
    if (!_done && !changed) {
      _playerTurn = false;
      _rivalActs();
    }

    _busy = false;
    notifyListeners();
    await _saveIfDone();
  }

  Future<void> playerParry() async {
    if (_busy ||
        _done ||
        !_playerTurn ||
        _awaitingStart ||
        playerWarrior == null ||
        rivalWarrior == null) {
      return;
    }

    _busy = true;
    _playerParrying = true;
    _addLog(LogTag.parry, _engine.parryMessage(playerWarrior!));
    notifyListeners();

    _playerTurn = false;
    _rivalActs();
    _busy = false;
    notifyListeners();
    await _saveIfDone();
  }

  // ── AI Logic (different strategy from original) ────────────────────────────

  void _rivalActs() {
    if (_done || _awaitingStart || playerWarrior == null || rivalWarrior == null) {
      return;
    }

    // AI parries when vitality ≤ 20% AND turn is divisible by 5 (not 35%/even)
    if (_shouldRivalParry()) {
      _rivalParrying = true;
      _addLog(LogTag.parry, _engine.parryMessage(rivalWarrior!));
      _playerTurn = true;
      _turn++;
      return;
    }

    _rivalStrikes();
  }

  bool _shouldRivalParry() {
    if (rivalWarrior == null || playerWarrior == null || _rivalParrying) {
      return false;
    }
    final lowVitality =
        _rivalVitality <= (rivalWarrior!.vitality * 0.20).round();
    return lowVitality && _turn % 5 == 0; // different condition from original
  }

  void _rivalStrikes() {
    if (_done || playerWarrior == null || rivalWarrior == null) {
      return;
    }
    // AI uses ultimate every 4th turn (original uses every 3rd)
    final useUltimate = _turn % 4 == 0;
    final result = _engine.strike(
      attacker: rivalWarrior!,
      defender: playerWarrior!,
      isUltimate: useUltimate,
      defenderParrying: _playerParrying,
    );
    _playerParrying = false;
    _playerVitality =
        (_playerVitality - result.damage).clamp(0, playerWarrior!.vitality);
    _addLog(useUltimate ? LogTag.ultimate : LogTag.strike, result.message);

    final changed = _resolveDefeats();
    if (!_done && !changed) {
      _playerTurn = true;
      _turn++;
    }
  }

  // ── Defeat Resolution ──────────────────────────────────────────────────────

  bool _resolveDefeats() {
    if (rivalWarrior != null && _rivalVitality <= 0) {
      final fallen = rivalWarrior!;
      _addLog(
        LogTag.win,
        '${playerWarrior!.name} defeated ${fallen.name}!',
      );
      _rivalIdx++;
      _rivalParrying = false;
      _playerParrying = false;

      if (_rivalIdx >= _rivalSquad.length) {
        _finish(won: true);
        return true;
      }

      _rivalVitality = rivalWarrior!.vitality;
      _addLog(LogTag.info, _matchupLine());
      _playerTurn = playerWarrior!.agility >= rivalWarrior!.agility;
      if (!_playerTurn) _rivalActs();
      return true;
    }

    if (playerWarrior != null && _playerVitality <= 0) {
      final fallen = playerWarrior!;
      _addLog(
        LogTag.loss,
        '${fallen.name} was defeated by ${rivalWarrior!.name}.',
      );
      _playerIdx++;
      _playerParrying = false;
      _rivalParrying = false;

      if (_playerIdx >= _playerSquad.length) {
        _finish(won: false);
        return true;
      }

      _playerVitality = playerWarrior!.vitality;
      _addLog(LogTag.info, _matchupLine());
      _playerTurn = playerWarrior!.agility >= rivalWarrior!.agility;
      if (!_playerTurn) _rivalActs();
      return true;
    }

    return false;
  }

  void _finish({required bool won}) {
    _done = true;
    _playerWon = won;
    _awaitingStart = false;
    _addLog(
      won ? LogTag.victory : LogTag.defeat,
      won ? '🏆 Victory! Your squad triumphed!' : '💀 Defeat. The rival wins.',
    );
  }

  // ── Persistence ────────────────────────────────────────────────────────────

  Future<void> _saveIfDone() async {
    if (!_done || _saved || _playerSquad.isEmpty || _rivalSquad.isEmpty) return;
    _saved = true;
    try {
      await StorageService().saveMatchRecord(
        MatchRecord(
          playerSquad: _playerSquad.map((w) => w.name).join(', '),
          rivalSquad: _rivalSquad.map((w) => w.name).join(', '),
          playerWon: _playerWon == true,
          turnsPlayed: _turn,
          playedAt: DateTime.now().toIso8601String(),
        ),
      );
    } catch (_) {
      _addLog(LogTag.error, 'Match ended but history could not be saved.');
      notifyListeners();
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  List<WarriorModel> _dedupe(List<WarriorModel> warriors) {
    final result = <WarriorModel>[];
    for (final w in warriors) {
      if (!result.any((e) => e.id == w.id)) result.add(w);
    }
    return result;
  }

  WarriorModel? _at(List<WarriorModel> squad, int idx) {
    if (squad.isEmpty) return null;
    return squad[idx.clamp(0, squad.length - 1)];
  }

  String _matchupLine() =>
      '⚔️ ${playerWarrior!.name} faces ${rivalWarrior!.name}.';

  void _addLog(LogTag tag, String text) {
    _log = [LogLine(tag: tag, text: text), ..._log];
  }
}
