import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/battle_provider.dart';
import '../../providers/player_manager_provider.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final player = context.read<PlayerManagerProvider>().currentPlayer;

    if (player != null) {
      context.read<BattleProvider>().loadBattleHistory(player.id!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final battleProvider = context.watch<BattleProvider>();
    final player = context.watch<PlayerManagerProvider>().currentPlayer;

    if (player == null) {
      return const Scaffold(body: Center(child: Text("No player selected")));
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Battle History")),
      body: battleProvider.battles.isEmpty
          ? const Center(child: Text("No battle history yet"))
          : ListView.builder(
              itemCount: battleProvider.battles.length,
              itemBuilder: (context, index) {
                final battle = battleProvider.battles[index];

                return Card(
                  child: ExpansionTile(
                    leading: Icon(
                      battle.result == "win"
                          ? Icons.check_circle
                          : Icons.cancel,
                      color: battle.result == "win" ? Colors.green : Colors.red,
                    ),
                    title: Text("Result: ${battle.result.toUpperCase()}"),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (dialogContext) => AlertDialog(
                            title: const Text('Delete Battle'),
                            content: const Text(
                              'Are you sure you want to delete this battle record?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.of(
                                  dialogContext,
                                  rootNavigator: true,
                                ).pop(false),
                                child: const Text('Cancel'),
                              ),
                              ElevatedButton(
                                onPressed: () => Navigator.of(
                                  dialogContext,
                                  rootNavigator: true,
                                ).pop(true),
                                child: const Text('Delete'),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && mounted) {
                          context.read<BattleProvider>().deleteBattle(
                            battle.id,
                          );
                        }
                      },
                    ),
                    children: [
                      if (battle.log != null && battle.log!.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.all(8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Battle Log:",
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              ...battle.log!.map((line) => Text(line)),
                            ],
                          ),
                        )
                      else
                        const Padding(
                          padding: EdgeInsets.all(8),
                          child: Text("No log available"),
                        ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
