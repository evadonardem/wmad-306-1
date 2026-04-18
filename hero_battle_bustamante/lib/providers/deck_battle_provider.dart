import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../models/battle_record.dart';
import '../engine/battle_engine.dart';
import '../services/database_service.dart';
import '../services/superhero_api_service.dart';

enum DeckBattlePhase { loading, matchupIntro, fighting, matchupResult, warResult }

/// Manages a full deck-vs-deck battle (best of 5, turn-based RPG per matchup).
class DeckBattleProvider extends ChangeNotifier {
  final DatabaseService _db = DatabaseService();
  final SuperheroApiService _api = SuperheroApiService();
  final _rng = Random();

  // ── Deck data ──
  List<HeroModel> _playerDeck = [];
  List<HeroModel> _aiDeck = [];

  // ── War state ──
  int _matchupIndex = 0;
  int _playerWins = 0;
  int _aiWins = 0;
  bool? _warWon;

  // ── Current matchup state ──
  int _playerHp = 0;
  int _aiHp = 0;
  int _playerMaxHp = 0;
  int _aiMaxHp = 0;
  int _round = 0;
  bool _playerTurn = true;
  bool? _matchupWon;
  final List<String> _log = [];
  bool _busy = false;
  bool _disposed = false;
  bool _defending = false;

  DeckBattlePhase _phase = DeckBattlePhase.loading;
  String _statusMessage = '';

  // ── Getters ──
  List<HeroModel> get playerDeck => _playerDeck;
  List<HeroModel> get aiDeck => _aiDeck;
  int get matchupIndex => _matchupIndex;
  int get playerWins => _playerWins;
  int get aiWins => _aiWins;
  bool? get warWon => _warWon;
  HeroModel get currentPlayerHero => _playerDeck[_matchupIndex];
  HeroModel get currentAiHero => _aiDeck[_matchupIndex];
  int get playerHp => _playerHp;
  int get aiHp => _aiHp;
  int get playerMaxHp => _playerMaxHp;
  int get aiMaxHp => _aiMaxHp;
  int get round => _round;
  bool get playerTurn => _playerTurn;
  bool? get matchupWon => _matchupWon;
  List<String> get log => List.unmodifiable(_log);
  bool get busy => _busy;
  DeckBattlePhase get phase => _phase;
  String get statusMessage => _statusMessage;
  int get totalMatchups => _playerDeck.length;
  bool get isWarOver => _playerWins >= 3 || _aiWins >= 3 || _matchupIndex >= _playerDeck.length;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  /// Start a deck war. Generates AI deck matching player power level.
  Future<void> startWar(List<HeroModel> playerDeck) async {
    _playerDeck = List.from(playerDeck);
    _aiDeck = [];
    _matchupIndex = 0;
    _playerWins = 0;
    _aiWins = 0;
    _warWon = null;
    _phase = DeckBattlePhase.loading;
    _statusMessage = 'Finding worthy opponents...';
    notifyListeners();

    try {
      _aiDeck = await _generateAiDeck(playerDeck);
    } catch (e) {
      _statusMessage = 'Failed to find opponents. Try again.';
      notifyListeners();
      return;
    }

    // Shuffle AI deck for variety
    _aiDeck.shuffle(_rng);
    _phase = DeckBattlePhase.matchupIntro;
    _statusMessage = '';
    notifyListeners();
  }

  /// Generate AI deck with similar total power to player's deck.
  Future<List<HeroModel>> _generateAiDeck(List<HeroModel> playerDeck) async {
    final totalPlayerPower = playerDeck.fold<int>(
      0, (sum, h) => sum + h.hp + h.attack + h.defense + h.specialAttack + h.speed,
    );
    final avgPower = totalPlayerPower ~/ playerDeck.length;

    final List<HeroModel> aiDeck = [];
    final usedIds = playerDeck.map((h) => h.id).toSet();
    int attempts = 0;

    while (aiDeck.length < playerDeck.length && attempts < 80) {
      final id = _rng.nextInt(731) + 1;
      if (usedIds.contains(id)) {
        attempts++;
        continue;
      }
      try {
        final hero = await _api.fetchHeroById(id);
        final heroPower = hero.hp + hero.attack + hero.defense + hero.specialAttack + hero.speed;
        // Accept heroes within ±40% of average power
        if (heroPower > avgPower * 0.6 && heroPower < avgPower * 1.4) {
          aiDeck.add(hero);
          usedIds.add(id);
        }
      } catch (_) {}
      attempts++;
    }

    // Fill remaining slots with any random heroes if needed
    while (aiDeck.length < playerDeck.length) {
      final id = _rng.nextInt(731) + 1;
      if (usedIds.contains(id)) continue;
      try {
        final hero = await _api.fetchHeroById(id);
        aiDeck.add(hero);
        usedIds.add(id);
      } catch (_) {}
    }

    return aiDeck;
  }

  /// Begin fighting the current matchup.
  void startMatchup() {
    final player = currentPlayerHero;
    final ai = currentAiHero;

    _playerHp = player.hp;
    _aiHp = ai.hp;
    _playerMaxHp = player.hp;
    _aiMaxHp = ai.hp;
    _round = 1;
    _matchupWon = null;
    _defending = false;
    _log.clear();
    _playerTurn = BattleEngine.playerGoesFirst(player, ai);
    _phase = DeckBattlePhase.fighting;
    _busy = false;

    _log.add('⚔️ Match ${_matchupIndex + 1}: ${player.name} vs ${ai.name}');
    _log.add(_playerTurn
        ? '${player.name} moves first!'
        : '${ai.name} moves first!');

    notifyListeners();

    if (!_playerTurn) {
      Future.delayed(const Duration(milliseconds: 800), () {
        if (!_disposed) _executeAiTurn();
      });
    }
  }

  // ── Player actions ────────────────────────────────────

  void playerAttack() => _playerAction(isSpecial: false);
  void playerSpecialAttack() => _playerAction(isSpecial: true);

  void playerDefend() {
    if (_phase != DeckBattlePhase.fighting || !_playerTurn || _busy) return;
    _busy = true;
    _defending = true;
    _log.add('🛡️ ${currentPlayerHero.name} takes a defensive stance!');
    _playerTurn = false;
    _busy = false;
    notifyListeners();

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!_disposed) _executeAiTurn();
    });
  }

  void _playerAction({required bool isSpecial}) {
    if (_phase != DeckBattlePhase.fighting || !_playerTurn || _busy) return;
    _busy = true;
    _defending = false;
    notifyListeners();

    final action = BattleEngine.performAction(
      attacker: currentPlayerHero,
      defender: currentAiHero,
      isSpecial: isSpecial,
    );
    _aiHp = (_aiHp - action.damage).clamp(0, _aiMaxHp);
    _log.add(action.log);

    if (_aiHp <= 0) {
      _endMatchup(playerWins: true);
      return;
    }

    _playerTurn = false;
    _busy = false;
    notifyListeners();

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!_disposed) _executeAiTurn();
    });
  }

  // ── AI turn ───────────────────────────────────────────

  void _executeAiTurn() {
    if (_phase != DeckBattlePhase.fighting || _disposed) return;
    _busy = true;
    notifyListeners();

    final action = BattleEngine.aiAction(currentAiHero, currentPlayerHero);
    int damage = action.damage;

    // Defend reduces incoming damage by 50%
    if (_defending) {
      damage = (damage * 0.5).round();
      _log.add('🛡️ ${currentPlayerHero.name}\'s defense reduces damage!');
      _defending = false;
    }

    _playerHp = (_playerHp - damage).clamp(0, _playerMaxHp);
    _log.add(action.log.replaceAll('${action.damage} damage', '$damage damage'));

    if (_playerHp <= 0) {
      _endMatchup(playerWins: false);
      return;
    }

    _round++;
    _playerTurn = true;
    _busy = false;
    notifyListeners();
  }

  // ── Matchup end ───────────────────────────────────────

  void _endMatchup({required bool playerWins}) {
    _matchupWon = playerWins;
    if (playerWins) {
      _playerWins++;
      _log.add('🏆 ${currentPlayerHero.name} wins this round!');
    } else {
      _aiWins++;
      _log.add('💀 ${currentAiHero.name} wins this round!');
    }

    _phase = DeckBattlePhase.matchupResult;
    _busy = false;
    notifyListeners();
  }

  /// Advance to next matchup or end the war.
  void nextMatchup() {
    _matchupIndex++;

    if (_playerWins >= 3 || _aiWins >= 3 || _matchupIndex >= _playerDeck.length) {
      _warWon = _playerWins > _aiWins;
      _phase = DeckBattlePhase.warResult;
      _saveWarRecord();
      notifyListeners();
      return;
    }

    _phase = DeckBattlePhase.matchupIntro;
    notifyListeners();
  }

  Future<void> _saveWarRecord() async {
    final record = BattleRecord(
      playerHeroName: 'Deck War (${_playerWins}-${_aiWins})',
      playerHeroImage: _playerDeck.first.imageUrl,
      aiHeroName: 'AI Deck',
      aiHeroImage: _aiDeck.first.imageUrl,
      playerWon: _warWon!,
      rounds: _matchupIndex,
      playedAt: DateTime.now().toIso8601String(),
    );
    await _db.insertBattleRecord(record);
  }
}
