import 'hero_model.dart';

class BattleRecord {
  final HeroModel hero1;
  final HeroModel hero2;
  final HeroModel winner;
  final DateTime date;

  BattleRecord({
    required this.hero1,
    required this.hero2,
    required this.winner,
    required this.date,
  });
}