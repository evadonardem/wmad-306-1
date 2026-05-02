class PlayerStats {
  final String playerName;
  final int totalWins;
  final int totalBattles;

  const PlayerStats({
    required this.playerName,
    required this.totalWins,
    required this.totalBattles,
  });

  double get winRate => totalBattles == 0 ? 0 : (totalWins / totalBattles) * 100;
}