import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/battle_provider.dart';
import '../../providers/player_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _nameController.text = context.read<PlayerProvider>().playerName;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final player = context.watch<PlayerProvider>();
    final stats = context.watch<BattleProvider>().playerStats;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile & Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Current player: ${player.playerName}',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Player name',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 10),
          FilledButton(
            onPressed: () async {
              final value = _nameController.text.trim();
              final messenger = ScaffoldMessenger.of(context);
              if (value.isEmpty) {
                if (!mounted) return;
                messenger.showSnackBar(
                  const SnackBar(content: Text('Player name cannot be empty.')),
                );
                return;
              }

              await context.read<PlayerProvider>().updatePlayerName(value);
              if (!mounted) return;
              messenger.showSnackBar(
                const SnackBar(content: Text('Player name saved.')),
              );
            },
            child: const Text('Save Name'),
          ),
          const SizedBox(height: 16),
          SwitchListTile(
            value: player.isDarkTheme,
            title: const Text('Dark theme'),
            onChanged: (v) => context.read<PlayerProvider>().setDarkTheme(v),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Player Stats', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Total battles: ${stats.totalBattles}'),
                  Text('Wins: ${stats.totalWins}'),
                  Text('Losses: ${stats.totalLosses}'),
                  Text('Win rate: ${stats.winRate.toStringAsFixed(1)}%'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
