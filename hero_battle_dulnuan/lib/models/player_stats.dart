class PlayerStats {
  int wins;
  int losses;
  int draws;

  PlayerStats({
    this.wins = 0,
    this.losses = 0,
    this.draws = 0,
  });

  void recordWin() => wins++;
  void recordLoss() => losses++;
  void recordDraw() => draws++;

  int get totalBattles => wins + losses + draws;

  double get winRate {
    if (totalBattles == 0) return 0;
    return wins / totalBattles;
  }
}