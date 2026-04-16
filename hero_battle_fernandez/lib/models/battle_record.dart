class BattleRecord {
  final int? id;
  final String playerHero;
  final String aiHero;
  final bool playerWon;
  final int roundsPlayed;
  final String playedAt;

  const BattleRecord({
    this.id,
    required this.playerHero,
    required this.aiHero,
    required this.playerWon,
    required this.roundsPlayed,
    required this.playedAt,
  });

  factory BattleRecord.fromMap(Map<String, dynamic> map) => BattleRecord(
    id: map['id'] as int?,
    playerHero: map['player_hero'] as String,
    aiHero: map['ai_hero'] as String,
    playerWon: (map['player_won'] as int) == 1,
    roundsPlayed: map['rounds_played'] as int,
    playedAt: map['played_at'] as String,
  );

  Map<String, dynamic> toMap() => {
    if (id != null) 'id': id,
    'player_hero': playerHero,
    'ai_hero': aiHero,
    'player_won': playerWon ? 1 : 0,
    'rounds_played': roundsPlayed,
    'played_at': playedAt,
  };
}
