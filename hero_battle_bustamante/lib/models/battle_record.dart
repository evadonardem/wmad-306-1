/// Represents a single battle result stored in SQLite.
class BattleRecord {
  final int? id;
  final String playerHeroName;
  final String playerHeroImage;
  final String aiHeroName;
  final String aiHeroImage;
  final bool playerWon;
  final int rounds;
  final String playedAt;

  const BattleRecord({
    this.id,
    required this.playerHeroName,
    required this.playerHeroImage,
    required this.aiHeroName,
    required this.aiHeroImage,
    required this.playerWon,
    required this.rounds,
    required this.playedAt,
  });

  factory BattleRecord.fromJson(Map<String, dynamic> json) => BattleRecord(
        id: json['id'] as int?,
        playerHeroName: (json['playerHeroName'] ?? '') as String,
        playerHeroImage: (json['playerHeroImage'] ?? '') as String,
        aiHeroName: (json['aiHeroName'] ?? '') as String,
        aiHeroImage: (json['aiHeroImage'] ?? '') as String,
        playerWon: (json['playerWon'] as int?) == 1,
        rounds: (json['rounds'] as int?) ?? 0,
        playedAt: (json['playedAt'] ?? '') as String,
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'playerHeroName': playerHeroName,
        'playerHeroImage': playerHeroImage,
        'aiHeroName': aiHeroName,
        'aiHeroImage': aiHeroImage,
        'playerWon': playerWon ? 1 : 0,
        'rounds': rounds,
        'playedAt': playedAt,
      };
}
