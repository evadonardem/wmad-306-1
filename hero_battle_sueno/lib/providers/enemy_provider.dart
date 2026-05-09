import 'package:flutter/material.dart';
import '../models/hero_model.dart';

class EnemyProvider extends ChangeNotifier {
  final List<HeroModel> _selectedEnemies = [];

  List<HeroModel> get selectedEnemies => _selectedEnemies;

  void addEnemy(HeroModel hero) {
    if (_selectedEnemies.length >= 5) return;
    if (_selectedEnemies.contains(hero)) return;

    _selectedEnemies.add(hero);
    notifyListeners();
  }

  void removeEnemy(HeroModel hero) {
    _selectedEnemies.remove(hero);
    notifyListeners();
  }

  void clear() {
    _selectedEnemies.clear();
    notifyListeners();
  }
}
