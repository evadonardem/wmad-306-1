import 'battle_record.dart'; // Add this import if BattleRecord is in another file

class PlayerStats {
  final int totalBattles;
  final int wins;
  final int losses;
  final double winRate;

  PlayerStats({
    required this.totalBattles,
    required this.wins,
    required this.losses,
    required this.winRate,
  });

  factory PlayerStats.fromHistory(List<BattleRecord> history) {
    final wins = history.where((r) => r.playerWon).length;
    final total = history.length;
    return PlayerStats(
      totalBattles: total,
      wins: wins,
      losses: total - wins,
      winRate: total == 0 ? 0 : (wins / total * 100),
    );
  }
}