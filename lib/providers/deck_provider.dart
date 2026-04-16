import 'package:flutter/foundation.dart';
import 'package:hero_battle/models/hero_model.dart';

class Deck {
  final String id;
  final String name;
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
}

class DeckProvider extends ChangeNotifier {
  final List<Deck> _decks = [];
  Deck? _activeDeck;

  List<Deck> get decks => _decks;
  Deck? get activeDeck => _activeDeck;
  bool get hasActiveDeck => _activeDeck != null;

  /// Create a new deck
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
    if (_activeDeck == null) {
      setActiveDeck(deck.id);
    }

    notifyListeners();
  }

  /// Delete a deck
  void deleteDeck(String id) {
    _decks.removeWhere((deck) => deck.id == id);
    if (_activeDeck?.id == id) {
      _activeDeck = _decks.isNotEmpty ? _decks.first : null;
    }
    notifyListeners();
  }

  /// Set active deck
  void setActiveDeck(String id) {
    _activeDeck = _decks.firstWhere(
      (deck) => deck.id == id,
      orElse: () => throw Exception('Deck not found'),
    );
    notifyListeners();
  }

  /// Get random hero from active deck
  HeroModel? getRandomHeroFromDeck() {
    if (_activeDeck == null || _activeDeck!.heroes.isEmpty) return null;
    return _activeDeck!.heroes[DateTime.now().microsecond % _activeDeck!.heroes.length];
  }

  /// Update deck name
  void updateDeckName(String id, String newName) {
    final deck = _decks.firstWhere((d) => d.id == id);
    _decks[_decks.indexOf(deck)].name == newName;
    notifyListeners();
  }
}
