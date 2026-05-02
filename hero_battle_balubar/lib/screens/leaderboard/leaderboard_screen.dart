import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/providers/player_provider.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rank & Stats'),
      ),
      body: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          final tier = player.rankTier;
          final tierColor = Color(int.parse('0xFF${tier.color}'));
          final nextTierPts = pointsForNextTier(tier);
          final progress = tier == RankTier.champion
              ? 1.0
              : (player.rankPoints % 500) / 500;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // ── Rank Card ──────────────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: tierColor, width: 2),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        tierColor.withValues(alpha: 0.2),
                        Theme.of(context).cardTheme.color ?? const Color(0xFF1a1f3a),
                      ],
                    ),
                  ),
                  child: Column(
                    children: [
                      Icon(tier.icon, color: tierColor, size: 56),
                      const SizedBox(height: 12),
                      Text(
                        tier.displayName,
                        style: TextStyle(
                          color: tierColor,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${player.rankPoints} RP',
                        style: TextStyle(
                          color: Colors.grey[300],
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Progress bar to next rank
                      if (tier != RankTier.champion) ...[
                        Row(
                          children: [
                            Text('${player.rankPoints}',
                                style: TextStyle(
                                    color: Colors.grey[400], fontSize: 12)),
                            const Spacer(),
                            Text('$nextTierPts',
                                style: TextStyle(
                                    color: Colors.grey[400], fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 8,
                            backgroundColor: Colors.grey[800],
                            valueColor:
                                AlwaysStoppedAnimation<Color>(tierColor),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Next: ${_nextTierName(tier)}',
                          style: TextStyle(
                              color: Colors.grey[500], fontSize: 11),
                        ),
                      ] else
                        Text('Max Rank Achieved!',
                            style: TextStyle(
                                color: tierColor,
                                fontSize: 14,
                                fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // ── Overall Stats ──────────────────────────────
                _buildSectionTitle(context, 'Overall Stats'),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildStatCard(context, 'Total Battles',
                        '${player.totalBattles}', Icons.sports_martial_arts, Colors.purple),
                    const SizedBox(width: 12),
                    _buildStatCard(context, 'Wins', '${player.totalWins}',
                        Icons.emoji_events, Colors.green),
                    const SizedBox(width: 12),
                    _buildStatCard(context, 'Losses', '${player.totalLosses}',
                        Icons.close, Colors.red),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildStatCard(
                        context,
                        'Win Rate',
                        '${player.winRate.toStringAsFixed(1)}%',
                        Icons.percent,
                        Colors.blue),
                    const SizedBox(width: 12),
                    _buildStatCard(context, 'Coins', '${player.coins}',
                        Icons.monetization_on, Colors.amber),
                    const SizedBox(width: 12),
                    _buildStatCard(
                        context,
                        'Unlocked',
                        '${player.unlockedHeroIds.length}',
                        Icons.lock_open,
                        Colors.teal),
                  ],
                ),
                const SizedBox(height: 24),

                // ── Ranked Stats ───────────────────────────────
                _buildSectionTitle(context, 'Ranked Stats'),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildStatCard(
                        context,
                        'Ranked Battles',
                        '${player.rankedBattles}',
                        Icons.military_tech,
                        Colors.orange),
                    const SizedBox(width: 12),
                    _buildStatCard(context, 'Ranked Wins', '${player.rankedWins}',
                        Icons.star, Colors.green),
                    const SizedBox(width: 12),
                    _buildStatCard(
                        context,
                        'Ranked Losses',
                        '${player.rankedLosses}',
                        Icons.star_border,
                        Colors.red),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildStatCard(
                        context,
                        'Ranked WR',
                        '${player.rankedWinRate.toStringAsFixed(1)}%',
                        Icons.trending_up,
                        Colors.cyan),
                    const SizedBox(width: 12),
                    _buildStatCard(context, 'Rank Points', '${player.rankPoints}',
                        Icons.shield, tierColor),
                    const SizedBox(width: 12),
                    const Expanded(child: SizedBox()),
                  ],
                ),
                const SizedBox(height: 24),

                // ── Rank Tiers Guide ───────────────────────────
                _buildSectionTitle(context, 'Rank Tiers'),
                const SizedBox(height: 12),
                ...RankTier.values.map((t) => _buildRankRow(
                      context,
                      t,
                      player.rankTier == t,
                    )),
              ],
            ),
          );
        },
      ),
    );
  }

  String _nextTierName(RankTier tier) {
    final idx = RankTier.values.indexOf(tier);
    if (idx >= RankTier.values.length - 1) return 'Max';
    return RankTier.values[idx + 1].displayName;
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: TextStyle(
          color: Theme.of(context).colorScheme.onSurface,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildStatCard(
      BuildContext context, String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Theme.of(context).cardTheme.color,
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[500], fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRankRow(BuildContext context, RankTier tier, bool isCurrent) {
    final color = Color(int.parse('0xFF${tier.color}'));
    final pts = tier == RankTier.bronze
        ? '0'
        : '${RankTier.values.indexOf(tier) * 500}';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: isCurrent
            ? color.withValues(alpha: 0.15)
            : Theme.of(context).cardTheme.color,
        border: Border.all(
          color: isCurrent ? color : Colors.transparent,
          width: isCurrent ? 2 : 0,
        ),
      ),
      child: Row(
        children: [
          Icon(tier.icon, color: color, size: 24),
          const SizedBox(width: 12),
          Text(
            tier.displayName,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Spacer(),
          Text(
            '$pts+ RP',
            style: TextStyle(color: Colors.grey[400], fontSize: 12),
          ),
          if (isCurrent) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('YOU',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold)),
            ),
          ],
        ],
      ),
    );
  }
}
