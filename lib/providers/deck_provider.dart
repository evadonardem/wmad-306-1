import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../models/deck_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  bool isInDeck(HeroModel hero) {
    return _deck.any((h) => h.id == hero.id);
  }

  final List<HeroModel> _deck = [];
  List<DeckModel> _savedDecks = [];

  List<HeroModel> get deck => _deck;
  List<DeckModel> get savedDecks => _savedDecks;

  void addHero(HeroModel hero) {
    if (_deck.length < 5 && !_deck.any((h) => h.id == hero.id)) {
      _deck.add(hero);
      notifyListeners();
    }
  }

  void removeHero(HeroModel hero) {
    _deck.removeWhere((h) => h.id == hero.id);
    notifyListeners();
  }

  void clearDeck() {
    _deck.clear();
    notifyListeners();
  }

  Future<void> saveDeck(String name) async {
    final deckModel = DeckModel(
      id: DateTime.now().millisecondsSinceEpoch,
      name: name,
      heroes: List.from(_deck),
    );
    await DatabaseService().insertDeck(deckModel);
    _savedDecks.add(deckModel);
    notifyListeners();
  }

  Future<void> loadDecks() async {
    _savedDecks = await DatabaseService().getDecks();
    notifyListeners();
  }
}
