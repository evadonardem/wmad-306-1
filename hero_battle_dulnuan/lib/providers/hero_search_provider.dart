import 'package:flutter/material.dart';
import '../models/hero_model.dart';

class HeroSearchProvider with ChangeNotifier {
  List<HeroModel> _allHeroes = [];
  List<HeroModel> _filteredHeroes = [];

  List<HeroModel> get heroes => _filteredHeroes;

  void setHeroes(List<HeroModel> heroes) {
    _allHeroes = heroes;
    _filteredHeroes = heroes;
    notifyListeners();
  }

  void searchHero(String query) {
    if (query.isEmpty) {
      _filteredHeroes = _allHeroes;
    } else {
      _filteredHeroes = _allHeroes
          .where((hero) =>
              hero.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    }
    notifyListeners();
  }
}