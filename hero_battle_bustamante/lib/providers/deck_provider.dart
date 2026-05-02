import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  static const int maxDeckSize = 5;
  final DatabaseService _db = DatabaseService();

  final List<HeroModel> _deck = [];
  String _message = '';

  List<HeroModel> get deck => List.unmodifiable(_deck);
  int get deckSize => _deck.length;
  bool get isFull => _deck.length >= maxDeckSize;
  String get message => _message;

  bool containsHero(int heroId) => _deck.any((h) => h.id == heroId);

  /// Add a hero to the current deck.
  bool addHero(HeroModel hero) {
    if (containsHero(hero.id)) {
      _message = '${hero.name} is already in your deck.';
      notifyListeners();
      return false;
    }
    if (isFull) {
      _message = 'Deck is full! Remove a hero first.';
      notifyListeners();
      return false;
    }
    _deck.add(hero);
    _message = '${hero.name} added to deck!';
    notifyListeners();
    return true;
  }

  /// Remove a hero by ID.
  void removeHero(int heroId) {
    _deck.removeWhere((h) => h.id == heroId);
    _message = 'Hero removed from deck.';
    notifyListeners();
  }

  /// Clear the active deck.
  void clearDeck() {
    _deck.clear();
    _message = 'Deck cleared.';
    notifyListeners();
  }

  // ── SQLite persistence ────────────────────────────────

  /// Save active deck to SQLite.
  Future<void> saveDeck(String name) async {
    if (_deck.isEmpty) {
      _message = 'Cannot save an empty deck.';
      notifyListeners();
      return;
    }
    final heroesJson = _deck.map((h) => h.toCompactJson()).toList();
    await _db.saveDeck(name, heroesJson);
    _message = 'Deck "$name" saved!';
    notifyListeners();
  }

  Future<List<Map<String, dynamic>>> loadSavedDecks() => _db.loadDecks();

  Future<List<HeroModel>> loadDeckHeroes(int deckId) async {
    final jsonList = await _db.loadDeckHeroes(deckId);
    return jsonList.map((j) => HeroModel.fromCompactJson(j)).toList();
  }

  Future<void> deleteSavedDeck(int deckId) async {
    await _db.deleteDeck(deckId);
    notifyListeners();
  }

  /// Restore a saved deck into the active deck.
  Future<void> restoreDeck(int deckId) async {
    final heroes = await loadDeckHeroes(deckId);
    _deck
      ..clear()
      ..addAll(heroes);
    _message = 'Deck loaded!';
    notifyListeners();
  }

  void clearMessage() {
    _message = '';
  }
}
