import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../services/database_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _nameController;
  late final Future<int> _totalBattlesFuture;

  @override
  void initState() {
    super.initState();
    final player = context.read<PlayerProvider>();
    _nameController = TextEditingController(text: player.playerName);
    _totalBattlesFuture = DatabaseService()
        .loadHistory()
        .then((records) => records.length);
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _saveName(PlayerProvider player) async {
    final name = _nameController.text.trim();
    if (name.isEmpty) return;
    await player.updatePlayerName(name);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Name saved!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Player Profile')),
      body: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Avatar
              Center(
                child: CircleAvatar(
                  radius: 50,
                  backgroundColor: scheme.primary,
                  child: Text(
                    player.playerName.isNotEmpty
                        ? player.playerName[0].toUpperCase()
                        : 'H',
                    style: const TextStyle(fontSize: 40, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Name card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Player Name',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: scheme.primary,
                              )),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                hintText: 'Enter your name',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: () => _saveName(player),
                            child: const Text('Save'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Theme toggle
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Theme',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(fontWeight: FontWeight.bold, color: scheme.primary)),
                          Text(player.isDarkTheme ? 'Dark Mode' : 'Light Mode'),
                        ],
                      ),
                      Switch(
                        value: player.isDarkTheme,
                        onChanged: (_) => player.toggleTheme(),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Stats card
              FutureBuilder<int>(
                future: _totalBattlesFuture,
                builder: (context, snapshot) {
                  final totalBattles = snapshot.data ?? 0;
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Battle Stats',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: scheme.primary,
                                  )),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _statBox(context, '${player.totalWins}', 'Session Wins',
                                  Colors.green),
                              _statBox(context, '$totalBattles', 'Total Battles',
                                  scheme.primary),
                              _statBox(
                                context,
                                totalBattles == 0
                                    ? '-'
                                    : '${(player.totalWins / totalBattles * 100).toStringAsFixed(0)}%',
                                'Win Rate',
                                Colors.amber,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _statBox(BuildContext context, String value, String label, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontSize: 24, fontWeight: FontWeight.bold, color: color)),
        Text(label,
            style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
