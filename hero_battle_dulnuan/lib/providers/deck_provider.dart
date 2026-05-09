import 'package:flutter/material.dart';
import '../models/hero_model.dart';

class DeckProvider with ChangeNotifier {
  final List<HeroModel> _deck = [];

  List<HeroModel> get deck => _deck;

  void addHero(HeroModel hero) {
    if (_deck.length < 5 && !_deck.contains(hero)) {
      _deck.add(hero);
      notifyListeners();
    }
  }

  void removeHero(HeroModel hero) {
    _deck.remove(hero);
    notifyListeners();
  }

  void clearDeck() {
    _deck.clear();
    notifyListeners();
  }
}