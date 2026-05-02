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

  bool contains(HeroModel hero) => _deck.any((item) => item.id == hero.id);

  void addHero(HeroModel hero) {
    if (isFull || contains(hero)) return;
    _deck = [..._deck, hero];
    notifyListeners();
  }

  void removeHero(HeroModel hero) {
    _deck = _deck.where((item) => item.id != hero.id).toList();
    notifyListeners();
  }

  void replaceDeck(List<HeroModel> heroes) {
    final uniqueHeroes = <HeroModel>[];
    for (final hero in heroes) {
      if (uniqueHeroes.any((item) => item.id == hero.id)) continue;
      uniqueHeroes.add(hero);
      if (uniqueHeroes.length >= maxDeckSize) break;
    }

    _deck = uniqueHeroes;
    notifyListeners();
  }

  void clearDeck() {
    _deck = [];
    notifyListeners();
  }

  Future<int?> saveDeckToDb(String name) async {
    final trimmedName = name.trim();
    if (_deck.isEmpty || trimmedName.isEmpty) return null;
    return DatabaseService().saveDeck(trimmedName, _deck);
  }
}
