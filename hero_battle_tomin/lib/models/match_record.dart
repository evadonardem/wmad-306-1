class MatchRecord {
  final int? id;
  final String playerSquad;
  final String rivalSquad;
  final bool playerWon;
  final int turnsPlayed;
  final String playedAt;

  const MatchRecord({
    this.id,
    required this.playerSquad,
    required this.rivalSquad,
    required this.playerWon,
    required this.turnsPlayed,
    required this.playedAt,
  });

  Map<String, dynamic> toMap() => {
    if (id != null) 'id': id,
    'player_squad': playerSquad,
    'rival_squad': rivalSquad,
    'player_won': playerWon ? 1 : 0,
    'turns_played': turnsPlayed,
    'played_at': playedAt,
  };

  factory MatchRecord.fromMap(Map<String, dynamic> map) => MatchRecord(
    id: map['id'] as int?,
    playerSquad: map['player_squad'] as String,
    rivalSquad: map['rival_squad'] as String,
    playerWon: (map['player_won'] as int) == 1,
    turnsPlayed: map['turns_played'] as int,
    playedAt: map['played_at'] as String,
  );
}
