import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  static const int maxDeckSize = 5;

  List<HeroModel> _deck = <HeroModel>[];
  List<HeroModel> _readyBattleDeck = <HeroModel>[];
  String? _readyBattleDeckName;
  int? _readyBattleDeckId;

  List<HeroModel> get deck => List.unmodifiable(_deck);
  bool get isFull => _deck.length >= maxDeckSize;
  bool get isReady => _deck.isNotEmpty;
  int get deckSize => _deck.length;
  List<HeroModel> get readyBattleDeck => List.unmodifiable(_readyBattleDeck);
  bool get hasReadyBattleDeck => _readyBattleDeck.isNotEmpty;
  int get readyBattleDeckSize => _readyBattleDeck.length;
  String? get readyBattleDeckName => _readyBattleDeckName;
  int? get readyBattleDeckId => _readyBattleDeckId;

  // Compatibility getter used by current screens.
  int get count => deckSize;

  bool contains(HeroModel hero) {
    return _deck.any((h) => h.id == hero.id);
  }

  bool containsHero(String heroId) {
    return _deck.any((h) => h.id == heroId);
  }

  bool addHero(HeroModel hero) {
    if (isFull || contains(hero)) {
      return false;
    }

    _deck = <HeroModel>[..._deck, hero];
    notifyListeners();
    return true;
  }

  void removeHero(HeroModel hero) {
    _deck = _deck.where((h) => h.id != hero.id).toList();
    notifyListeners();
  }

  // Compatibility method used by current screens.
  void removeHeroById(String heroId) {
    _deck.removeWhere((hero) => hero.id == heroId);
    notifyListeners();
  }

  void clearDeck() {
    _deck = <HeroModel>[];
    notifyListeners();
  }

  int setReadyBattleDeck({
    required String name,
    required List<HeroModel> heroes,
    int? id,
  }) {
    final uniqueHeroIds = <String>{};
    final nextDeck = <HeroModel>[];

    for (final hero in heroes) {
      if (nextDeck.length >= maxDeckSize) {
        break;
      }

      if (uniqueHeroIds.add(hero.id)) {
        nextDeck.add(hero);
      }
    }

    _readyBattleDeck = nextDeck;
    _readyBattleDeckName = name;
    _readyBattleDeckId = id;
    notifyListeners();
    return _readyBattleDeck.length;
  }

  void clearReadyBattleDeck() {
    _readyBattleDeck = <HeroModel>[];
    _readyBattleDeckName = null;
    _readyBattleDeckId = null;
    notifyListeners();
  }

  bool isReadyDeckSelected(int? id) {
    if (id == null || _readyBattleDeckId == null) {
      return false;
    }
    return id == _readyBattleDeckId;
  }

  int replaceDeck(List<HeroModel> heroes) {
    final uniqueHeroIds = <String>{};
    final nextDeck = <HeroModel>[];

    for (final hero in heroes) {
      if (nextDeck.length >= maxDeckSize) {
        break;
      }

      if (uniqueHeroIds.add(hero.id)) {
        nextDeck.add(hero);
      }
    }

    _deck = nextDeck;
    notifyListeners();
    return _deck.length;
  }

  Future<int> saveDeckToDb(String name) async {
    return DatabaseService().saveDeck(name, _deck);
  }
}
