import 'hero_model.dart';

class BattleModel {
  final int id;
  final List<HeroModel> playerDeck;
  final List<HeroModel> enemyDeck;
  final String result;
  final DateTime date;

  BattleModel({
    required this.id,
    required this.playerDeck,
    required this.enemyDeck,
    required this.result,
    required this.date,
  });

  factory BattleModel.fromJson(Map<String, dynamic> json) {
    return BattleModel(
      id: json['id'],
      playerDeck: (json['playerDeck'] as List)
          .map((e) => HeroModel.fromJson(e))
          .toList(),
      enemyDeck: (json['enemyDeck'] as List)
          .map((e) => HeroModel.fromJson(e))
          .toList(),
      result: json['result'],
      date: DateTime.parse(json['date']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'playerDeck': playerDeck.map((e) => e.toJson()).toList(),
    'enemyDeck': enemyDeck.map((e) => e.toJson()).toList(),
    'result': result,
    'date': date.toIso8601String(),
  };
}
