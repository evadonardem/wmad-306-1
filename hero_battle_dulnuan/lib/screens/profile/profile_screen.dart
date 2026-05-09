import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../providers/battle_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 40),
            // Avatar
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.purple.withOpacity(0.2),
                border: Border.all(color: Colors.purple, width: 2),
              ),
              child: const Icon(
                Icons.person,
                size: 50,
                color: Colors.purple,
              ),
            ),
            const SizedBox(height: 20),
            // Player Name
            Consumer<PlayerProvider>(
              builder: (context, player, _) {
                return Text(
                  player.playerName,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                );
              },
            ),
            const SizedBox(height: 40),
            // Stats Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Battle Statistics',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Consumer2<PlayerProvider, BattleProvider>(
                    builder: (context, player, battle, _) {
                      final totalBattles = battle.battleHistory.length;
                      final wins = player.totalWins;
                      final losses = totalBattles - wins;
                      final winRate = totalBattles > 0
                          ? ((wins / totalBattles) * 100).toStringAsFixed(1)
                          : '0';

                      return Column(
                        children: [
                          _buildStatCard(
                            context,
                            title: 'Total Battles',
                            value: totalBattles.toString(),
                            icon: Icons.swords,
                            color: Colors.blue,
                          ),
                          const SizedBox(height: 12),
                          _buildStatCard(
                            context,
                            title: 'Wins',
                            value: wins.toString(),
                            icon: Icons.emoji_events,
                            color: Colors.green,
                          ),
                          const SizedBox(height: 12),
                          _buildStatCard(
                            context,
                            title: 'Losses',
                            value: losses.toString(),
                            icon: Icons.close_circle,
                            color: Colors.red,
                          ),
                          const SizedBox(height: 12),
                          _buildStatCard(
                            context,
                            title: 'Win Rate',
                            value: '$winRate%',
                            icon: Icons.trending_up,
                            color: Colors.orange,
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            // Theme Toggle
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.brightness_4,
                            color: Theme.of(context).primaryColor,
                          ),
                          const SizedBox(width: 12),
                          const Text('Dark Theme'),
                        ],
                      ),
                      Consumer<PlayerProvider>(
                        builder: (context, player, _) {
                          return Switch(
                            value: player.isDarkTheme,
                            onChanged: (value) {
                              // Toggle theme functionality can be implemented here
                            },
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      value,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
