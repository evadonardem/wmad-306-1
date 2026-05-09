import 'package:flutter/foundation.dart';

import '../models/deck_model.dart';
import '../models/hero_model.dart';
import '../services/db_service.dart';

class DeckProvider extends ChangeNotifier {
  Future<void> renameDeck(int id, String newName) async {
    await DBService.renameDeck(id, newName);
    // Update local list
    try {
      final deck = decks.firstWhere((d) => d.id == id);
      deck.name = newName;
      notifyListeners();
    } catch (_) {
      // Deck not found, do nothing
    }
  }

  /// 🔹 Selected heroes for building a deck
  static const int maxDeckSize = 5;
  final List<HeroModel> _deck = [];

  /// 🔹 Saved decks (from DB)
  List<DeckModel> decks = [];

  /// =============================
  /// 🔹 CURRENT DECK (builder)
  /// =============================
  List<HeroModel> get deck => List.unmodifiable(_deck);

  bool get isFull => _deck.length >= maxDeckSize;
  bool get isReady => _deck.isNotEmpty;
  int get deckSize => _deck.length;

  bool contains(HeroModel hero) => _deck.any((h) => h.id == hero.id);

  bool addHero(HeroModel hero) {
    if (isFull || contains(hero)) return false;
    _deck.add(hero);
    notifyListeners();
    return true;
  }

  void removeHero(HeroModel hero) {
    _deck.removeWhere((h) => h.id == hero.id);
    notifyListeners();
  }

  void clearDeck() {
    _deck.clear();
    notifyListeners();
  }

  void setDeck(List<HeroModel> heroes) {
    _deck
      ..clear()
      ..addAll(heroes);
    notifyListeners();
  }

  void setDeckFromJson(List<dynamic> heroesJson) {
    _deck
      ..clear()
      ..addAll(heroesJson.map((h) => HeroModel.fromJson(h)));
    notifyListeners();
  }

  /// =============================
  /// 🔹 DATABASE (PERSISTENT DECKS)
  /// =============================

  Future<void> loadDecksForPlayer(int playerId) async {
    decks = await DBService.getDecksForPlayer(playerId);
    notifyListeners();
  }

  Future<void> addDeck(int playerId, String name, List<String> heroes) async {
    final deck = DeckModel(playerId: playerId, name: name, heroes: heroes);

    await DBService.insertDeck(deck);
    await loadDecksForPlayer(playerId);
  }

  Future<void> deleteDeck(int id, {int? playerId}) async {
    await DBService.deleteDeck(id);
    if (playerId != null) {
      await loadDecksForPlayer(playerId);
    } else {
      decks.removeWhere((d) => d.id == id);
      notifyListeners();
    }
  }
}
