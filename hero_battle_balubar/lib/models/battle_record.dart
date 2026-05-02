import 'package:hero_battle/models/hero_model.dart';

class BattleRecord {
  final String id;
  final HeroModel playerHero;
  final HeroModel opponentHero;
  final HeroModel winner;
  final int playerHeroHealth;
  final int opponentHeroHealth;
  final int turns;
  final DateTime timestamp;
  final String battleType; // 'quick', 'ranked', 'practice'

  BattleRecord({
    required this.id,
    required this.playerHero,
    required this.opponentHero,
    required this.winner,
    required this.playerHeroHealth,
    required this.opponentHeroHealth,
    required this.turns,
    required this.timestamp,
    required this.battleType,
  });

  bool get isPlayerWin => winner.id == playerHero.id;

  factory BattleRecord.fromJson(Map<String, dynamic> json) {
    return BattleRecord(
      id: json['id'] ?? '',
      playerHero: HeroModel.fromJson(json['playerHero']),
      opponentHero: HeroModel.fromJson(json['opponentHero']),
      winner: HeroModel.fromJson(json['winner']),
      playerHeroHealth: json['playerHeroHealth'] ?? 0,
      opponentHeroHealth: json['opponentHeroHealth'] ?? 0,
      turns: json['turns'] ?? 0,
      timestamp: DateTime.parse(json['timestamp']),
      battleType: json['battleType'] ?? 'quick',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'playerHero': playerHero,
        'opponentHero': opponentHero,
        'winner': winner,
        'playerHeroHealth': playerHeroHealth,
        'opponentHeroHealth': opponentHeroHealth,
        'turns': turns,
        'timestamp': timestamp.toIso8601String(),
        'battleType': battleType,
      };
}
