import 'package:flutter/foundation.dart';
import 'dart:convert';
import '../models/hero_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  static const int maxDeckSize = 5;

  List<HeroModel> _deck = [];
  List<Map<String, dynamic>> _savedDecks = [];

  List<HeroModel> get deck => List.unmodifiable(_deck);
  List<Map<String, dynamic>> get savedDecks => List.unmodifiable(_savedDecks);
  bool get isFull => _deck.length >= maxDeckSize;
  bool get isEmpty => _deck.isEmpty;
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
    if (_deck.isEmpty) return;
    await DatabaseService().saveDeck(name, _deck);
    await loadSavedDecks();
  }

  Future<void> loadSavedDecks() async {
    _savedDecks = await DatabaseService().loadDecks();
    notifyListeners();
  }

  Future<void> deleteDeck(int id) async {
    await DatabaseService().deleteDeck(id);
    await loadSavedDecks();
  }

  Future<List<HeroModel>> loadDeckHeroes(Map<String, dynamic> deckData) async {
    final heroesJson = jsonDecode(deckData['heroes'] as String) as List;
    return heroesJson.map((json) => HeroModel.fromJson(json)).toList();
  }
}