import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  static const int maxDeckSize = 5;

  List<HeroModel> _deck = [];
  List<HeroModel> get deck => List.unmodifiable(_deck);
  bool get isFull => _deck.length >= maxDeckSize;
  bool get isReady => _deck.isNotEmpty;
  int get deckSize => _deck.length;

  bool contains(HeroModel hero) => _deck.any((h) => h.id == hero.id);

  void addHero(HeroModel hero) {
    if (isFull || contains(hero)) return;
    _deck = [..._deck, hero];
    notifyListeners();
  }

  void removeHero(HeroModel hero) {
    _deck = _deck.where((h) => h.id != hero.id).toList();
    notifyListeners();
  }

  void clearDeck() {
    _deck = [];
    notifyListeners();
  }

  Future<void> saveDeckToDb(String name) async {
    await DatabaseService().saveDeck(name, _deck);
  }
}