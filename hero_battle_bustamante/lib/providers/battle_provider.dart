import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../models/battle_record.dart';
import '../engine/battle_engine.dart';
import '../services/database_service.dart';
import '../services/superhero_api_service.dart';

enum BattlePhase { setup, fighting, finished }

/// Manages live battle state: HP, turns, rounds, log, result.
class BattleProvider extends ChangeNotifier {
  final DatabaseService _db = DatabaseService();
  final SuperheroApiService _api = SuperheroApiService();
  final _rng = Random();

  HeroModel? _playerHero;
  HeroModel? _aiHero;
  int _playerHp = 0;
  int _aiHp = 0;
  int _playerMaxHp = 0;
  int _aiMaxHp = 0;
  int _round = 0;
  bool _playerTurn = true;
  BattlePhase _phase = BattlePhase.setup;
  bool? _playerWon;
  final List<String> _log = [];
  bool _busy = false;
  bool _disposed = false;

  // ── Getters ──
  HeroModel? get playerHero => _playerHero;
  HeroModel? get aiHero => _aiHero;
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get playerMaxHp => _playerMaxHp;
  int get aiMaxHp => _aiMaxHp;
  int get round => _round;
  bool get playerTurn => _playerTurn;
  BattlePhase get phase => _phase;
  bool? get playerWon => _playerWon;
  List<String> get log => List.unmodifiable(_log);
  bool get busy => _busy;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  // ── Battle lifecycle ──────────────────────────────────

  /// Set up a new battle; AI picks a random opponent from the API.
  Future<void> startBattle(HeroModel playerHero) async {
    _playerHero = playerHero;
    _phase = BattlePhase.setup;
    _busy = true;
    _log.clear();
    _round = 1;
    _playerWon = null;
    notifyListeners();

    try {
      HeroModel? ai;
      int attempts = 0;
      while (ai == null && attempts < 10) {
        final id = _rng.nextInt(731) + 1;
        try {
          ai = await _api.fetchHeroById(id);
          if (ai.id == playerHero.id) ai = null;
        } catch (_) {}
        attempts++;
      }
      if (ai == null) throw Exception('Could not find an opponent');
      _aiHero = ai;
    } catch (e) {
      _log.add('Error finding opponent. Please go back and try again.');
      _phase = BattlePhase.finished;
      _busy = false;
      notifyListeners();
      return;
    }

    _playerHp = _playerHero!.hp;
    _aiHp = _aiHero!.hp;
    _playerMaxHp = _playerHp;
    _aiMaxHp = _aiHp;
    _playerTurn = BattleEngine.playerGoesFirst(_playerHero!, _aiHero!);
    _phase = BattlePhase.fighting;
    _busy = false;

    _log.add('Battle begins! ${_playerHero!.name} vs ${_aiHero!.name}');
    _log.add(_playerTurn
        ? '${_playerHero!.name} moves first!'
        : '${_aiHero!.name} moves first!');

    if (!_playerTurn) _executeAiTurn();
    notifyListeners();
  }

  // ── Player actions ────────────────────────────────────

  void playerAttack() => _playerAction(isSpecial: false);
  void playerSpecialAttack() => _playerAction(isSpecial: true);

  void _playerAction({required bool isSpecial}) {
    if (_phase != BattlePhase.fighting || !_playerTurn || _busy) return;
    _busy = true;
    notifyListeners();

    final action = BattleEngine.performAction(
      attacker: _playerHero!,
      defender: _aiHero!,
      isSpecial: isSpecial,
    );
    _aiHp = (_aiHp - action.damage).clamp(0, _aiMaxHp);
    _log.add(action.log);

    if (_aiHp <= 0) {
      _endBattle(playerWins: true);
      return;
    }

    _playerTurn = false;
    _busy = false;
    notifyListeners();

    // AI responds after a short delay
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!_disposed) _executeAiTurn();
    });
  }

  // ── AI turn ───────────────────────────────────────────

  void _executeAiTurn() {
    if (_phase != BattlePhase.fighting || _disposed) return;
    _busy = true;
    notifyListeners();

    final action = BattleEngine.aiAction(_aiHero!, _playerHero!);
    _playerHp = (_playerHp - action.damage).clamp(0, _playerMaxHp);
    _log.add(action.log);

    if (_playerHp <= 0) {
      _endBattle(playerWins: false);
      return;
    }

    _round++;
    _playerTurn = true;
    _busy = false;
    notifyListeners();
  }

  // ── Battle end ────────────────────────────────────────

  void _endBattle({required bool playerWins}) {
    _playerWon = playerWins;
    _phase = BattlePhase.finished;
    _busy = false;
    _log.add(playerWins
        ? '${_playerHero!.name} wins the battle!'
        : '${_aiHero!.name} wins the battle!');
    notifyListeners();
    _saveBattleRecord();
  }

  Future<void> _saveBattleRecord() async {
    final record = BattleRecord(
      playerHeroName: _playerHero!.name,
      playerHeroImage: _playerHero!.imageUrl,
      aiHeroName: _aiHero!.name,
      aiHeroImage: _aiHero!.imageUrl,
      playerWon: _playerWon!,
      rounds: _round,
      playedAt: DateTime.now().toIso8601String(),
    );
    await _db.insertBattleRecord(record);
  }

  /// Load all battle history records.
  Future<List<BattleRecord>> loadHistory() => _db.loadBattleHistory();

  void reset() {
    _playerHero = null;
    _aiHero = null;
    _phase = BattlePhase.setup;
    _log.clear();
    _playerWon = null;
    _round = 0;
    _busy = false;
    notifyListeners();
  }
}
