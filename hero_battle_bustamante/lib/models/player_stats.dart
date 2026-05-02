/// Lightweight value object for displaying player statistics.
class PlayerStats {
  final String playerName;
  final int totalWins;
  final int totalLosses;

  const PlayerStats({
    this.playerName = 'Hero',
    this.totalWins = 0,
    this.totalLosses = 0,
  });

  int get totalBattles => totalWins + totalLosses;
  double get winRate => totalBattles == 0 ? 0 : totalWins / totalBattles;
}
