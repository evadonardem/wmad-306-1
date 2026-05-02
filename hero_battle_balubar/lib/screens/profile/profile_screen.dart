import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/providers/player_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<PlayerProvider>(
      builder: (context, player, _) {
        final tier = player.rankTier;
        final tierColor = Color(int.parse('0xFF${tier.color}'));

        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          appBar: AppBar(
            title: const Text('Profile'),
            backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Player avatar / name
                CircleAvatar(
                  radius: 40,
                  backgroundColor: tierColor.withValues(alpha: 0.2),
                  child: Icon(tier.icon, color: tierColor, size: 40),
                ),
                const SizedBox(height: 12),
                Text(
                  player.playerName,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${tier.displayName} • ${player.rankPoints} RP',
                  style: TextStyle(color: tierColor, fontSize: 14),
                ),
                const SizedBox(height: 24),

                // Theme Toggle
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Theme.of(context).cardTheme.color ??
                        const Color(0xFF1a1f3a),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        player.isDarkTheme
                            ? Icons.dark_mode
                            : Icons.light_mode,
                        color: player.isDarkTheme
                            ? Colors.amber
                            : Colors.orange,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          player.isDarkTheme ? 'Dark Mode' : 'Light Mode',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Switch(
                        value: player.isDarkTheme,
                        onChanged: (_) => player.toggleTheme(),
                        activeThumbColor: Colors.purple,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Stats summary
                _buildStatRow('Total Battles', '${player.totalBattles}'),
                _buildStatRow('Wins', '${player.totalWins}'),
                _buildStatRow('Losses', '${player.totalLosses}'),
                _buildStatRow(
                    'Win Rate', '${player.winRate.toStringAsFixed(1)}%'),
                const Divider(height: 32),
                _buildStatRow('Ranked Battles', '${player.rankedBattles}'),
                _buildStatRow('Ranked Wins', '${player.rankedWins}'),
                _buildStatRow('Ranked Losses', '${player.rankedLosses}'),
                _buildStatRow('Ranked WR',
                    '${player.rankedWinRate.toStringAsFixed(1)}%'),
                const Divider(height: 32),
                _buildStatRow('Coins', '${player.coins}'),
                _buildStatRow(
                    'Heroes Unlocked', '${player.unlockedHeroIds.length}'),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Text(label, style: const TextStyle(fontSize: 14)),
          const Spacer(),
          Text(value,
              style:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
