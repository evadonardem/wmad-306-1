import 'dart:math';

import 'package:flutter/foundation.dart';

import 'package:hero_battle/models/battle_record.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';

class BattleProvider extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();
  final Random _random = Random();

  List<HeroModel> _playerTeam = <HeroModel>[];
  List<HeroModel> _aiTeam = <HeroModel>[];
  List<int> _playerHps = <int>[];
  List<int> _aiHps = <int>[];

  int _activePlayerIndex = 0;
  int _activeAiIndex = 0;
  int _round = 1;
  bool _isPlayerTurn = true;
  bool _isLoading = false;
  bool _battleOver = false;
  bool _playerWon = false;
  final List<String> _battleLog = <String>[];

  List<HeroModel> get playerTeam => List<HeroModel>.unmodifiable(_playerTeam);
  List<HeroModel> get aiTeam => List<HeroModel>.unmodifiable(_aiTeam);
  List<int> get playerHps => List<int>.unmodifiable(_playerHps);
  List<int> get aiHps => List<int>.unmodifiable(_aiHps);

  int get activePlayerIndex => _activePlayerIndex;
  int get activeAiIndex => _activeAiIndex;
  int get round => _round;
  bool get isPlayerTurn => _isPlayerTurn;
  bool get isLoading => _isLoading;
  bool get battleOver => _battleOver;
  bool get playerWon => _playerWon;
  List<String> get battleLog => List<String>.unmodifiable(_battleLog);

  Future<void> startBattle(List<HeroModel> playerTeam, List<HeroModel> aiTeam) async {
    _isLoading = true;
    _battleOver = false;
    _playerWon = false;
    _round = 1;
    _isPlayerTurn = true;
    _battleLog
      ..clear()
      ..add('Battle starts!');

    _playerTeam = playerTeam.take(5).toList(growable: false);
    _aiTeam = aiTeam.take(5).toList(growable: false);

    _playerHps = _playerTeam.map(_maxHpFor).toList(growable: false);
    _aiHps = _aiTeam.map(_maxHpFor).toList(growable: false);

    _activePlayerIndex = _nextLivingIndex(_playerHps, 0);
    _activeAiIndex = _nextLivingIndex(_aiHps, 0);

    if (_activePlayerIndex == -1 || _activeAiIndex == -1) {
      _battleOver = true;
      _playerWon = false;
      _battleLog.add('Unable to start battle. Team setup is invalid.');
      _isLoading = false;
      notifyListeners();
      return;
    }

    _battleLog.add('${_playerTeam[_activePlayerIndex].name} steps up!');
    _battleLog.add('${_aiTeam[_activeAiIndex].name} steps up!');

    _isLoading = false;
    notifyListeners();
  }

  Future<void> playerAttack({required bool special}) async {
    if (_battleOver || !_isPlayerTurn || _isLoading) {
      return;
    }
    if (_activePlayerIndex < 0 || _activeAiIndex < 0) {
      return;
    }

    _round += 1;
    final attacker = _playerTeam[_activePlayerIndex];
    final defender = _aiTeam[_activeAiIndex];
    final damage = _damage(attacker, special: special);

    _aiHps[_activeAiIndex] = max(0, _aiHps[_activeAiIndex] - damage);
    _battleLog.add(
      '${attacker.name} uses ${special ? 'special attack' : 'attack'} on ${defender.name} for $damage.',
    );

    if (_aiHps[_activeAiIndex] <= 0) {
      _battleLog.add('${defender.name} is defeated!');
      final nextAi = _nextLivingIndex(_aiHps, _activeAiIndex + 1);
      if (nextAi == -1) {
        await _endBattle(playerWon: true);
        return;
      }
      _activeAiIndex = nextAi;
      _battleLog.add('${_aiTeam[_activeAiIndex].name} steps up!');
      _isPlayerTurn = false;
      notifyListeners();
      await Future<void>.delayed(const Duration(milliseconds: 900));
      if (_battleOver) return;
      await _aiTurn();
      return;
    }

    _isPlayerTurn = false;
    notifyListeners();
    await Future<void>.delayed(const Duration(milliseconds: 900));
    if (_battleOver) return;
    await _aiTurn();
  }

  Future<void> _aiTurn() async {
    if (_battleOver || _activeAiIndex < 0 || _activePlayerIndex < 0) {
      return;
    }

    final attacker = _aiTeam[_activeAiIndex];
    final defender = _playerTeam[_activePlayerIndex];
    final useSpecial = _random.nextDouble() > 0.7;
    final damage = _damage(attacker, special: useSpecial);

    _playerHps[_activePlayerIndex] = max(0, _playerHps[_activePlayerIndex] - damage);
    _battleLog.add(
      '${attacker.name} ${useSpecial ? 'unleashes special' : 'attacks'} ${defender.name} for $damage.',
    );

    if (_playerHps[_activePlayerIndex] <= 0) {
      _battleLog.add('${defender.name} is defeated!');
      final nextPlayer = _nextLivingIndex(_playerHps, _activePlayerIndex + 1);
      if (nextPlayer == -1) {
        await _endBattle(playerWon: false);
        return;
      }
      _activePlayerIndex = nextPlayer;
      _battleLog.add('${_playerTeam[_activePlayerIndex].name} steps up!');
    }

    _isPlayerTurn = true;
    notifyListeners();
  }

  int _nextLivingIndex(List<int> hpList, int startAt) {
    for (int i = startAt; i < hpList.length; i++) {
      if (hpList[i] > 0) return i;
    }
    return -1;
  }

  int _damage(HeroModel hero, {required bool special}) {
    final base = ((hero.strength + hero.power + hero.combat) / 3).round();
    final spread = special ? 18 : 10;
    final bonus = special ? 14 : 6;
    return max(8, (base ~/ 7) + bonus + _random.nextInt(spread));
  }

  int _maxHpFor(HeroModel hero) {
    return 100 + hero.durability ~/ 2;
  }

  Future<void> _endBattle({required bool playerWon}) async {
    _battleOver = true;
    _playerWon = playerWon;
    _isPlayerTurn = false;

    final winner = playerWon ? 'Player' : 'AI';
    _battleLog.add('$winner wins the battle!');

    await _databaseService.saveHistory(
      BattleRecord(
        heroName: _playerTeam.isEmpty ? 'Unknown' : _playerTeam.first.name,
        opponentName: _aiTeam.isEmpty ? 'Unknown' : _aiTeam.first.name,
        winnerName: winner,
        log: List<String>.from(_battleLog),
        createdAt: DateTime.now(),
      ),
    );

    notifyListeners();
  }

  void resetBattle() {
    _playerTeam = <HeroModel>[];
    _aiTeam = <HeroModel>[];
    _playerHps = <int>[];
    _aiHps = <int>[];
    _activePlayerIndex = 0;
    _activeAiIndex = 0;
    _round = 1;
    _isPlayerTurn = true;
    _isLoading = false;
    _battleOver = false;
    _playerWon = false;
    _battleLog.clear();
    notifyListeners();
  }
}