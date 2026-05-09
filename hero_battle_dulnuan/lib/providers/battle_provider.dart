import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../models/battle_record.dart';

class BattleProvider with ChangeNotifier {
  final List<BattleRecord> _battleHistory = [];

  List<BattleRecord> get battleHistory => _battleHistory;

  BattleRecord startBattle(HeroModel hero1, HeroModel hero2) {
    // Simple battle logic (you can improve this later)
    int hero1Power = int.tryParse(hero1.power) ?? 0;
    int hero2Power = int.tryParse(hero2.power) ?? 0;

    HeroModel winner = hero1Power >= hero2Power ? hero1 : hero2;

    BattleRecord record = BattleRecord(
      hero1: hero1,
      hero2: hero2,
      winner: winner,
      date: DateTime.now(),
    );

    _battleHistory.add(record);
    notifyListeners();

    return record;
  }

  void clearHistory() {
    _battleHistory.clear();
    notifyListeners();
  }
}