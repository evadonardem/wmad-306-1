import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../theme/cyber_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'PROFILE',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            letterSpacing: 2,
            fontSize: 16,
            color: cs.onSurface,
          ),
        ),
      ),
      body: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          final winRate = player.totalBattles > 0
              ? (player.totalWins / player.totalBattles * 100)
              : 0.0;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // ── Avatar & name ──
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            cs.primary,
                            cs.primary.withValues(alpha: 0.5),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: cs.primary.withValues(alpha: 0.3),
                            blurRadius: 24,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          player.playerName.isNotEmpty
                              ? player.playerName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            fontSize: 42,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      player.playerName,
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Hero Battle Player',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: cs.primary.withValues(alpha: 0.6),
                            letterSpacing: 1,
                          ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.04),

              const SizedBox(height: 28),

              // ── Stats cards ──
              Row(
                children: [
                  _StatCard(
                    label: 'BATTLES',
                    value: '${player.totalBattles}',
                    icon: Icons.sports_mma_rounded,
                    color: cs.primary,
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    label: 'WINS',
                    value: '${player.totalWins}',
                    icon: Icons.emoji_events_rounded,
                    color: CyberColors.gold,
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    label: 'LOSSES',
                    value: '${player.totalLosses}',
                    icon: Icons.close_rounded,
                    color: CyberColors.error,
                  ),
                ],
              ).animate().fadeIn(delay: 150.ms, duration: 400.ms),

              const SizedBox(height: 10),

              // Win rate bar
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'WIN RATE',
                            style:
                                Theme.of(context).textTheme.labelSmall?.copyWith(
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 1.5,
                                      color: cs.primary.withValues(alpha: 0.6),
                                    ),
                          ),
                          Text(
                            '${winRate.toStringAsFixed(1)}%',
                            style:
                                Theme.of(context).textTheme.titleMedium?.copyWith(
                                      fontWeight: FontWeight.w800,
                                      color: cs.primary,
                                    ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Container(
                        height: 10,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(5),
                          color: cs.surfaceContainerHighest.withValues(alpha: 0.5),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(5),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: (winRate / 100).clamp(0.0, 1.0),
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    cs.primary,
                                    cs.primary.withValues(alpha: 0.6),
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: cs.primary.withValues(alpha: 0.3),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: 250.ms, duration: 400.ms),

              const SizedBox(height: 14),

              // ── Settings card ──
              Card(
                child: Column(
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: cs.primary.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(Icons.edit_rounded,
                            size: 18, color: cs.primary),
                      ),
                      title: const Text('Player Name',
                          style: TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text(
                        player.playerName,
                        style: TextStyle(
                          color: cs.onSurface.withValues(alpha: 0.45),
                          fontSize: 13,
                        ),
                      ),
                      trailing: Icon(Icons.chevron_right_rounded,
                          color: cs.onSurface.withValues(alpha: 0.3)),
                      onTap: () => _showNameDialog(context, player),
                    ),
                    Divider(
                        height: 1,
                        color: cs.primary.withValues(alpha: 0.08)),
                    SwitchListTile(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      secondary: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: cs.primary.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(
                          player.isDarkTheme
                              ? Icons.dark_mode_rounded
                              : Icons.light_mode_rounded,
                          size: 18,
                          color: cs.primary,
                        ),
                      ),
                      title: const Text('Dark Theme',
                          style: TextStyle(fontWeight: FontWeight.w600)),
                      value: player.isDarkTheme,
                      onChanged: (_) => player.toggleTheme(),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 350.ms, duration: 400.ms),
            ],
          );
        },
      ),
    );
  }

  void _showNameDialog(BuildContext context, PlayerProvider player) {
    final controller = TextEditingController(text: player.playerName);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Change Name'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Enter your name',
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              player.setPlayerName(controller.text);
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 8),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(height: 10),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color:
                          Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.45),
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                      fontSize: 10,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
