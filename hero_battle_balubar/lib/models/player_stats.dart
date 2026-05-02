class PlayerStats {
  final int totalBattles;
  final int wins;
  final int losses;
  final int deckCount;
  final List<int> heroIds; // IDs of heroes collected

  PlayerStats({
    required this.totalBattles,
    required this.wins,
    required this.losses,
    required this.deckCount,
    required this.heroIds,
  });

  double get winRate =>
      totalBattles == 0 ? 0 : (wins / totalBattles * 100).toStringAsFixed(1) as double? ?? 0;

  factory PlayerStats.empty() => PlayerStats(
        totalBattles: 0,
        wins: 0,
        losses: 0,
        deckCount: 0,
        heroIds: [],
      );

  factory PlayerStats.fromJson(Map<String, dynamic> json) {
    return PlayerStats(
      totalBattles: json['totalBattles'] ?? 0,
      wins: json['wins'] ?? 0,
      losses: json['losses'] ?? 0,
      deckCount: json['deckCount'] ?? 0,
      heroIds: List<int>.from(json['heroIds'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
        'totalBattles': totalBattles,
        'wins': wins,
        'losses': losses,
        'deckCount': deckCount,
        'heroIds': heroIds,
      };
}
