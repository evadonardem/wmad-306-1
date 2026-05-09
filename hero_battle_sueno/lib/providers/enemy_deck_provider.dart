import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../models/enemy_deck.dart';

class EnemyDeckProvider extends ChangeNotifier {
  final List<EnemyDeck> _enemyDecks = [];

  List<EnemyDeck> get enemyDecks => _enemyDecks;

  /// 🔥 Generate up to 100 random enemy decks
  void generateDecks(List<HeroModel> allHeroes) {
    _enemyDecks.clear();

    for (int i = 0; i < 100; i++) {
      final shuffled = List<HeroModel>.from(allHeroes)..shuffle();
      final deckHeroes = shuffled.take(5).toList();
      _enemyDecks.add(
        EnemyDeck(name: "Enemy Deck ${i + 1}", heroes: deckHeroes),
      );
    }

    notifyListeners();
  }
}
