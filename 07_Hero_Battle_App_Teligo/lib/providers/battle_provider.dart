import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../models/battle_record.dart';
import '../services/database_service.dart';

enum BattleState { idle, inProgress, playerWon, aiWon }

class BattleLogEntry {
  final String message;
  final bool isPlayer;
  BattleLogEntry({required this.message, required this.isPlayer});
}

class BattleProvider extends ChangeNotifier {
  HeroModel? _playerHero;
  HeroModel? _aiHero;

  int _playerHp = 0;
  int _aiHp = 0;
  int _round = 1;
  BattleState _state = BattleState.idle;
  List<BattleLogEntry> _log = [];

  HeroModel? get playerHero => _playerHero;
  HeroModel? get aiHero => _aiHero;
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get playerMaxHp => _playerHero?.maxHp ?? 1;
  int get aiMaxHp => _aiHero?.maxHp ?? 1;
  int get round => _round;
  BattleState get state => _state;
  List<BattleLogEntry> get log => List.unmodifiable(_log);
  bool get isOver => _state == BattleState.playerWon || _state == BattleState.aiWon;

  void startBattle(HeroModel player, HeroModel ai) {
    _playerHero = player;
    _aiHero = ai;
    _playerHp = player.maxHp;
    _aiHp = ai.maxHp;
    _round = 1;
    _state = BattleState.inProgress;
    _log = [BattleLogEntry(message: '⚔️ Battle begins! Round 1', isPlayer: true)];
    notifyListeners();
  }

  void attack() {
    if (isOver || _playerHero == null || _aiHero == null) return;
    _performAttack(isSpecial: false);
  }

  void specialAttack() {
    if (isOver || _playerHero == null || _aiHero == null) return;
    _performAttack(isSpecial: true);
  }

  void _performAttack({required bool isSpecial}) {
    final rng = Random();

    // Player attacks
    final playerDmg = isSpecial
        ? (_playerHero!.specialAttack + rng.nextInt(10)).clamp(1, 999)
        : (_playerHero!.attack + rng.nextInt(8)).clamp(1, 999);
    final reducedPlayerDmg = (playerDmg - _aiHero!.defense).clamp(1, 999);
    _aiHp = (_aiHp - reducedPlayerDmg).clamp(0, _aiHero!.maxHp);

    final atkType = isSpecial ? '✨ Special' : '⚔️ Attack';
    _log.add(BattleLogEntry(
      message: '${_playerHero!.name} uses $atkType for $reducedPlayerDmg dmg!',
      isPlayer: true,
    ));

    if (_aiHp <= 0) {
      _state = BattleState.playerWon;
      _log.add(BattleLogEntry(
        message: '🏆 ${_playerHero!.name} wins! Victory!',
        isPlayer: true,
      ));
      _saveBattleRecord();
      notifyListeners();
      return;
    }

    // AI counterattacks
    final aiDmg = (_aiHero!.attack + rng.nextInt(6)).clamp(1, 999);
    final reducedAiDmg = (aiDmg - _playerHero!.defense).clamp(1, 999);
    _playerHp = (_playerHp - reducedAiDmg).clamp(0, _playerHero!.maxHp);

    _log.add(BattleLogEntry(
      message: '${_aiHero!.name} counters for $reducedAiDmg dmg!',
      isPlayer: false,
    ));

    if (_playerHp <= 0) {
      _state = BattleState.aiWon;
      _log.add(BattleLogEntry(
        message: '💀 ${_aiHero!.name} wins! Defeated.',
        isPlayer: false,
      ));
      _saveBattleRecord();
      notifyListeners();
      return;
    }

    _round++;
    _log.add(BattleLogEntry(
      message: '--- Round $_round ---',
      isPlayer: true,
    ));
    notifyListeners();
  }

  Future<void> _saveBattleRecord() async {
    if (_playerHero == null || _aiHero == null) return;
    final record = BattleRecord(
      playerHero: _playerHero!.name,
      aiHero: _aiHero!.name,
      playerWon: _state == BattleState.playerWon,
      roundsPlayed: _round,
      playedAt: DateTime.now().toIso8601String(),
    );
    await DatabaseService().saveBattleRecord(record);
  }

  void resetBattle() {
    _playerHero = null;
    _aiHero = null;
    _playerHp = 0;
    _aiHp = 0;
    _round = 1;
    _state = BattleState.idle;
    _log = [];
    notifyListeners();
  }
}