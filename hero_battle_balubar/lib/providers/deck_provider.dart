import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';

class Deck {
  final String id;
  String name;
  final List<HeroModel> heroes;
  final DateTime createdAt;
  bool isActive;

  Deck({
    required this.id,
    required this.name,
    required this.heroes,
    required this.createdAt,
    this.isActive = false,
  });

  bool get isValid => heroes.isNotEmpty && heroes.length <= 5;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'heroes': heroes.map((h) => h.toJson()).toList(),
        'createdAt': createdAt.toIso8601String(),
        'isActive': isActive,
      };

  factory Deck.fromJson(Map<String, dynamic> json) => Deck(
        id: json['id'] as String,
        name: json['name'] as String,
        heroes: (json['heroes'] as List)
            .map((h) => HeroModel.fromJson(h as Map<String, dynamic>))
            .toList(),
        createdAt: DateTime.parse(json['createdAt'] as String),
        isActive: json['isActive'] as bool? ?? false,
      );
}

class DeckProvider extends ChangeNotifier {
  static const _storageKey = 'saved_decks';
  final List<Deck> _decks = [];
  Deck? _activeDeck;
  final _random = Random();

  List<Deck> get decks => _decks;
  Deck? get activeDeck => _activeDeck;
  bool get hasActiveDeck => _activeDeck != null;

  /// Load decks from SharedPreferences
  Future<void> loadDecks() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_storageKey);
    if (raw != null) {
      try {
        final list = jsonDecode(raw) as List;
        _decks.clear();
        for (final item in list) {
          _decks.add(Deck.fromJson(item as Map<String, dynamic>));
        }
        // Restore active deck
        final active = _decks.where((d) => d.isActive).toList();
        _activeDeck = active.isNotEmpty ? active.first : (_decks.isNotEmpty ? _decks.first : null);
      } catch (_) {
        // Corrupted data – start fresh
      }
    }
    notifyListeners();
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(_decks.map((d) => d.toJson()).toList());
    await prefs.setString(_storageKey, encoded);
  }

  /// Create a new deck (always sets it as active)
  void createDeck(String name, List<HeroModel> heroes) {
    if (heroes.isEmpty || heroes.length > 5) {
      throw Exception('Deck must have 1-5 heroes');
    }

    final deck = Deck(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      heroes: heroes,
      createdAt: DateTime.now(),
    );

    _decks.add(deck);
    setActiveDeck(deck.id);

    notifyListeners();
    _save();
  }

  /// Update an existing deck's name and heroes
  void updateDeck(String id, String name, List<HeroModel> heroes) {
    if (heroes.isEmpty || heroes.length > 5) {
      throw Exception('Deck must have 1-5 heroes');
    }

    final index = _decks.indexWhere((d) => d.id == id);
    if (index < 0) return;

    _decks[index] = Deck(
      id: id,
      name: name,
      heroes: heroes,
      createdAt: _decks[index].createdAt,
      isActive: _decks[index].isActive,
    );

    if (_activeDeck?.id == id) {
      _activeDeck = _decks[index];
    }

    notifyListeners();
    _save();
  }

  /// Delete a deck
  void deleteDeck(String id) {
    _decks.removeWhere((deck) => deck.id == id);
    if (_activeDeck?.id == id) {
      _activeDeck = _decks.isNotEmpty ? _decks.first : null;
    }
    notifyListeners();
    _save();
  }

  /// Set active deck
  void setActiveDeck(String id) {
    for (final d in _decks) {
      d.isActive = d.id == id;
    }
    _activeDeck = _decks.firstWhere(
      (deck) => deck.id == id,
      orElse: () => throw Exception('Deck not found'),
    );
    notifyListeners();
    _save();
  }

  /// Get random hero from active deck
  HeroModel? getRandomHeroFromDeck() {
    if (_activeDeck == null || _activeDeck!.heroes.isEmpty) return null;
    return _activeDeck!.heroes[_random.nextInt(_activeDeck!.heroes.length)];
  }

  // ── SQLite operations ─────────────────────────────────────────────

  final DatabaseService _dbService = DatabaseService();

  /// Save current selected heroes as a deck to SQLite
  Future<void> saveDeckToDb(String name, List<HeroModel> heroes) async {
    final heroesJson = jsonEncode(heroes.map((h) => h.toJson()).toList());
    await _dbService.insertDeck(name, heroesJson);
  }

  /// Load all saved decks from SQLite
  Future<List<Map<String, dynamic>>> loadSavedDecks() async {
    return _dbService.getAllDecks();
  }

  /// Delete a saved deck from SQLite
  Future<void> deleteSavedDeck(int id) async {
    await _dbService.deleteDeckById(id);
  }
}
