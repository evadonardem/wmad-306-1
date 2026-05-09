import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/player_manager_provider.dart';
import '../../models/player_model.dart';
import '../../providers/theme_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  PlayerModel? _lastLoadedPlayer;
  late TextEditingController nameController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // 🔥 use read (NOT watch here)
    final playerManager = context.read<PlayerManagerProvider>();
    final currentPlayer = playerManager.currentPlayer;

    if (currentPlayer != null && currentPlayer != _lastLoadedPlayer) {
      _lastLoadedPlayer = currentPlayer;

      nameController.text = currentPlayer.name;

      // 🔥 load related data per player
      context.read<DeckProvider>().loadDecksForPlayer(currentPlayer.id!);
      context.read<BattleProvider>().loadBattleHistory(currentPlayer.id!);
    }
  }

  double _calculateWinRate(PlayerModel player) {
    final total = player.wins + player.losses;
    if (total == 0) return 0;
    return (player.wins / total) * 100;
  }

  @override
  void dispose() {
    nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final playerManager = context.watch<PlayerManagerProvider>();
    final themeProvider = context.watch<ThemeProvider>();
    final currentPlayer = playerManager.currentPlayer;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// 🔹 Manage Players
              ElevatedButton.icon(
                icon: const Icon(Icons.people),
                label: const Text('Manage Players'),
                onPressed: () {
                  Navigator.pushNamed(context, '/player-selection');
                },
              ),
              const SizedBox(height: 16),
              // 🔹 Player Stats
              if (currentPlayer != null) ...[
                Text(
                  'Wins:  ${currentPlayer.wins}',
                  style: const TextStyle(fontSize: 16),
                ),
                Text(
                  'Losses: ${currentPlayer.losses}',
                  style: const TextStyle(fontSize: 16),
                ),
                Text(
                  'Winning %: ${currentPlayer.winRate.toStringAsFixed(1)}%',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],

              const SizedBox(height: 12),

              /// 🔹 Player Dropdown
              if (playerManager.players.isNotEmpty) ...[
                DropdownButton<PlayerModel>(
                  isExpanded: true,
                  value: currentPlayer,
                  hint: const Text("Select Player"),
                  items: playerManager.players.map((player) {
                    return DropdownMenuItem<PlayerModel>(
                      value: player,
                      child: Text(player.name),
                    );
                  }).toList(),
                  onChanged: (player) async {
                    if (player != null) {
                      await playerManager.selectPlayer(player);
                    }
                  },
                ),

                /// 🔹 Delete Player
                if (currentPlayer != null)
                  Align(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () async {
                        await playerManager.deletePlayer(currentPlayer.id!);
                      },
                    ),
                  ),
              ],

              const SizedBox(height: 16),

              /// 🔹 Edit Name
              const Text(
                'Player Name:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),

              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: nameController,
                      decoration: const InputDecoration(
                        hintText: 'Enter your name',
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.save),
                    onPressed: () async {
                      if (currentPlayer == null) return;

                      final newName = nameController.text.trim();
                      if (newName.isEmpty) return;

                      // Name update feature not implemented in provider
                    },
                  ),
                ],
              ),

              const SizedBox(height: 24),

              /// 🔹 Dark Mode
              Row(
                children: [
                  const Text('Dark Mode'),
                  const SizedBox(width: 8),
                  Switch(
                    value: themeProvider.isDark,
                    onChanged: (val) {
                      themeProvider.setTheme(val);
                    },
                  ),
                ],
              ),

              const SizedBox(height: 24),

              /// 🔹 PLAYER STATS
              if (currentPlayer == null)
                const Text(
                  "No player selected",
                  style: TextStyle(fontWeight: FontWeight.bold),
                )
              else
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Wins: ${currentPlayer.wins}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Losses: ${currentPlayer.losses}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Win Rate: ${_calculateWinRate(currentPlayer).toStringAsFixed(1)}%',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),

                    const SizedBox(height: 20),

                    /// 🔹 NAVIGATION
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/decks');
                      },
                      child: const Text("My Decks"),
                    ),

                    const SizedBox(height: 12),

                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/history');
                      },
                      child: const Text("Battle History"),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
