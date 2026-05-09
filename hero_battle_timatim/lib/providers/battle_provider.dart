// Manual §5.3 — Live battle state. Drives BattleEngine and persists the
// final BattleRecord to SQLite (Exercise 2 write side).
//
// The provider is now a small state machine with four phases:
//   waiting   → player can press Attack or Swap Hero
//   playerTurn → player swing animation playing
//   aiTurn    → AI swing animation playing
//   ended     → battle finished; UI shows the result overlay
// Async pauses between phases give the UI time to play the
// neon flash / shake animations before the next swing resolves.

import 'package:flutter/foundation.dart';

import '../engine/battle_engine.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';
import 'player_provider.dart';

enum BattlePhase { waiting, playerTurn, aiTurn, ended }

class BattleProvider extends ChangeNotifier {
  // ── Tunable timing for the inter-swing pauses ──────────────────────────
  static const Duration _swingTelegraph = Duration(milliseconds: 450);
  static const Duration _swingResolve = Duration(milliseconds: 650);

  HeroModel? _player;
  HeroModel? _ai;
  int _playerHp = 0;
  int _aiHp = 0;
  int _playerMaxHp = 1;
  int _aiMaxHp = 1;
  int _rounds = 0;
  bool _isOver = false;
  bool _playerWon = false;
  bool _saved = false;
  // Last damage dealt — drives the screen-shake animation.
  int _lastDamage = 0;
  // Whose portrait just took damage — 'player' | 'ai' | null.
  String? _lastTarget;
  BattlePhase _phase = BattlePhase.waiting;
  final List<String> _log = [];

  HeroModel? get player => _player;
  HeroModel? get ai => _ai;
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get playerMaxHp => _playerMaxHp;
  int get aiMaxHp => _aiMaxHp;
  int get rounds => _rounds;
  bool get isOver => _isOver;
  bool get playerWon => _playerWon;
  int get lastDamage => _lastDamage;
  String? get lastTarget => _lastTarget;
  BattlePhase get phase => _phase;
  List<String> get log => List.unmodifiable(_log);

  /// True only when the player can act — used to gate Attack & Swap buttons.
  bool get canAct => _phase == BattlePhase.waiting && !_isOver;

  /// Human-readable label for the phase indicator banner.
  String get phaseLabel {
    switch (_phase) {
      case BattlePhase.waiting:
        return _rounds == 0 ? 'BATTLE START' : 'YOUR TURN';
      case BattlePhase.playerTurn:
        return 'PLAYER ATTACKS';
      case BattlePhase.aiTurn:
        return 'AI ATTACKS';
      case BattlePhase.ended:
        return _playerWon ? 'VICTORY' : 'DEFEAT';
    }
  }

  void startBattle(HeroModel player, HeroModel ai) {
    _player = player;
    _ai = ai;
    _playerMaxHp = player.maxHp;
    _aiMaxHp = ai.maxHp;
    _playerHp = _playerMaxHp;
    _aiHp = _aiMaxHp;
    _rounds = 0;
    _isOver = false;
    _playerWon = false;
    _saved = false;
    _lastDamage = 0;
    _lastTarget = null;
    _phase = BattlePhase.waiting;
    _log
      ..clear()
      ..add('Battle begins: ${player.name} vs ${ai.name}!');
    notifyListeners();
  }

  /// Press Attack → resolve a full round (player + AI swings) with
  /// phase transitions so the UI can animate each swing distinctly.
  Future<void> playerAttack(PlayerProvider playerProvider) async {
    if (!canAct || _player == null || _ai == null) return;
    _rounds++;

    final playerFirst = BattleEngine.playerGoesFirst(_player!, _ai!);
    if (playerFirst) {
      await _runPlayerSwing();
      if (!_isOver) await _runAiSwing();
    } else {
      await _runAiSwing();
      if (!_isOver) await _runPlayerSwing();
    }

    if (_isOver) {
      _phase = BattlePhase.ended;
      notifyListeners();
      if (!_saved) {
        _saved = true;
        await _persistResult(playerProvider);
      }
    } else {
      _phase = BattlePhase.waiting;
      notifyListeners();
    }
  }

  Future<void> _runPlayerSwing() async {
    _phase = BattlePhase.playerTurn;
    notifyListeners();
    await Future.delayed(_swingTelegraph);
    _resolvePlayerHit();
    notifyListeners();
    if (!_isOver) await Future.delayed(_swingResolve);
  }

  Future<void> _runAiSwing() async {
    _phase = BattlePhase.aiTurn;
    notifyListeners();
    await Future.delayed(_swingTelegraph);
    _resolveAiHit();
    notifyListeners();
    if (!_isOver) await Future.delayed(_swingResolve);
  }

  void _resolvePlayerHit() {
    final r = BattleEngine.resolveTurn(_player!, _ai!);
    _aiHp = (_aiHp - r.damage).clamp(0, _aiMaxHp);
    _lastDamage = r.damage;
    _lastTarget = 'ai';
    _log.add(r.log);
    if (_aiHp <= 0) {
      _isOver = true;
      _playerWon = true;
      _log.add('🏆 ${_player!.name} wins!');
    }
  }

  void _resolveAiHit() {
    final r = BattleEngine.resolveTurn(_ai!, _player!);
    _playerHp = (_playerHp - r.damage).clamp(0, _playerMaxHp);
    _lastDamage = r.damage;
    _lastTarget = 'player';
    _log.add(r.log);
    if (_playerHp <= 0) {
      _isOver = true;
      _playerWon = false;
      _log.add('💀 ${_ai!.name} wins!');
    }
  }

  /// Swap the active player hero mid-battle. HP percentage is preserved
  /// (so a hero entering at 50% stays at 50% of their own max), and the
  /// turn state is left untouched — swap costs no round.
  /// Only allowed during [BattlePhase.waiting].
  bool swapHero(HeroModel newHero) {
    if (_player == null || _ai == null) return false;
    if (_phase != BattlePhase.waiting || _isOver) return false;
    if (newHero.id == _player!.id) return false;

    final pct = _playerMaxHp == 0 ? 1.0 : _playerHp / _playerMaxHp;
    final outgoing = _player!.name;
    _player = newHero;
    _playerMaxHp = newHero.maxHp;
    _playerHp = (newHero.maxHp * pct).round().clamp(1, newHero.maxHp);
    _log.add('🔄 $outgoing swapped out — ${newHero.name} steps in!');
    notifyListeners();
    return true;
  }

  /// Continue Battle — start a new round with the given heroes.
  /// Equivalent to startBattle but conveys intent at the call site.
  void continueBattle(HeroModel player, HeroModel ai) =>
      startBattle(player, ai);

  Future<void> _persistResult(PlayerProvider playerProvider) async {
    final record = BattleRecord(
      playerHero: _player!.name,
      aiHero: _ai!.name,
      playerWon: _playerWon,
      roundsPlayed: _rounds,
      playedAt: DateTime.now().toIso8601String(),
    );
    await DatabaseService().saveBattleRecord(record);
    if (_playerWon) playerProvider.incrementWins();
  }

  void reset() {
    _player = null;
    _ai = null;
    _playerHp = 0;
    _aiHp = 0;
    _playerMaxHp = 1;
    _aiMaxHp = 1;
    _rounds = 0;
    _isOver = false;
    _playerWon = false;
    _saved = false;
    _lastDamage = 0;
    _lastTarget = null;
    _phase = BattlePhase.waiting;
    _log.clear();
    notifyListeners();
  }
}
