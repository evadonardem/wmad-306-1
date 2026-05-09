import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_manager_provider.dart';
import 'create_player_screen.dart';

class PlayerSelectionScreen extends StatefulWidget {
  const PlayerSelectionScreen({super.key});

  @override
  State<PlayerSelectionScreen> createState() => _PlayerSelectionScreenState();
}

class _PlayerSelectionScreenState extends State<PlayerSelectionScreen> {
  @override
  void initState() {
    super.initState();
    // Always load players when this screen is shown
    Future.microtask(() => context.read<PlayerManagerProvider>().loadPlayers());
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PlayerManagerProvider>(
      builder: (context, playerManager, _) {
        if (playerManager.loading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Select Player')),
          body: Column(
            children: [
              /// 🔹 PLAYER LIST
              Expanded(
                child: playerManager.players.isEmpty
                    ? const Center(child: Text("No players yet"))
                    : ListView.builder(
                        itemCount: playerManager.players.length,
                        itemBuilder: (context, i) {
                          final player = playerManager.players[i];

                          return ListTile(
                            leading: const CircleAvatar(
                              child: Icon(Icons.person),
                            ),
                            title: Text(player.name),

                            /// 🔹 DELETE PLAYER
                            trailing: IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () async {
                                final confirm = await showDialog<bool>(
                                  context: context,
                                  builder: (_) => AlertDialog(
                                    title: const Text("Delete Player"),
                                    content: Text(
                                      "Delete '${player.name}' permanently?",
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () =>
                                            Navigator.pop(context, false),
                                        child: const Text("Cancel"),
                                      ),
                                      ElevatedButton(
                                        onPressed: () =>
                                            Navigator.pop(context, true),
                                        child: const Text("Delete"),
                                      ),
                                    ],
                                  ),
                                );

                                if (confirm == true) {
                                  await playerManager.deletePlayer(player.id!);
                                }
                              },
                            ),

                            /// 🔹 SELECT PLAYER
                            onTap: () async {
                              await playerManager.selectPlayer(player);
                              if (context.mounted) {
                                Navigator.of(context).pop();
                              }
                            },
                          );
                        },
                      ),
              ),

              /// 🔹 CREATE PLAYER BUTTON
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Create New Player'),
                  onPressed: () async {
                    // Navigate to CreatePlayerScreen and reload players after
                    await Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => CreatePlayerScreen()),
                    );
                    await playerManager.loadPlayers();
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
