import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models.dart';

const _deckKey = 'hero_battle_deck';
const _historyKey = 'hero_battle_history';
const _playerNameKey = 'hero_battle_player_name';
const _isDarkKey = 'hero_battle_is_dark';

class AppStore extends ChangeNotifier {
  AppStore._({
    required SharedPreferences prefs,
    required List<HeroModel> deck,
    required List<BattleRecord> history,
    required String playerName,
    required bool isDark,
  })  : _prefs = prefs,
        _deck = deck,
        _history = history,
        _playerName = playerName,
        _isDark = isDark;

  final SharedPreferences _prefs;
  List<HeroModel> _deck;
  List<BattleRecord> _history;
  String _playerName;
  bool _isDark;

  static const int maxDeck = 5;

  List<HeroModel> get deck => List.unmodifiable(_deck);
  List<BattleRecord> get history => List.unmodifiable(_history);
  String get playerName => _playerName;
  bool get isDark => _isDark;

  static Future<AppStore> load() async {
    final prefs = await SharedPreferences.getInstance();

    List<HeroModel> deck = const [];
    final deckRaw = prefs.getString(_deckKey);
    if (deckRaw != null) {
      try {
        final data = jsonDecode(deckRaw) as List<dynamic>;
        deck = data
            .whereType<Map<String, dynamic>>()
            .map(HeroModel.fromJson)
            .toList(growable: false);
      } catch (_) {
        deck = const [];
      }
    }

    List<BattleRecord> history = const [];
    final historyRaw = prefs.getString(_historyKey);
    if (historyRaw != null) {
      try {
        final data = jsonDecode(historyRaw) as List<dynamic>;
        history = data
            .whereType<Map<String, dynamic>>()
            .map(BattleRecord.fromJson)
            .toList(growable: false);
      } catch (_) {
        history = const [];
      }
    }

    final playerName = prefs.getString(_playerNameKey) ?? 'Hero';
    final isDark = prefs.getBool(_isDarkKey) ?? true;

    return AppStore._(
      prefs: prefs,
      deck: deck,
      history: history,
      playerName: playerName,
      isDark: isDark,
    );
  }

  bool containsHero(HeroModel hero) => _deck.any((h) => h.id == hero.id);

  void addHero(HeroModel hero) {
    if (_deck.length >= maxDeck || containsHero(hero)) {
      return;
    }
    _deck = [..._deck, hero];
    _saveDeck();
    notifyListeners();
  }

  void removeHero(String heroId) {
    _deck = _deck.where((h) => h.id != heroId).toList(growable: false);
    _saveDeck();
    notifyListeners();
  }

  void clearDeck() {
    _deck = const [];
    _saveDeck();
    notifyListeners();
  }

  void addBattleRecord({
    required String playerHero,
    required String aiHero,
    required bool playerWon,
    required int roundsPlayed,
  }) {
    final record = BattleRecord(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      playerHero: playerHero,
      aiHero: aiHero,
      playerWon: playerWon,
      roundsPlayed: roundsPlayed,
      playedAt: DateTime.now(),
    );
    _history = [record, ..._history].take(100).toList(growable: false);
    _saveHistory();
    notifyListeners();
  }

  void setPlayerName(String name) {
    final next = name.trim().isEmpty ? 'Hero' : name.trim();
    _playerName = next;
    _prefs.setString(_playerNameKey, next);
    notifyListeners();
  }

  void toggleTheme() {
    _isDark = !_isDark;
    _prefs.setBool(_isDarkKey, _isDark);
    notifyListeners();
  }

  void _saveDeck() {
    final encoded = jsonEncode(_deck.map((e) => e.toJson()).toList(growable: false));
    _prefs.setString(_deckKey, encoded);
  }

  void _saveHistory() {
    final encoded = jsonEncode(_history.map((e) => e.toJson()).toList(growable: false));
    _prefs.setString(_historyKey, encoded);
  }
}
