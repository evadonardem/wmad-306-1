import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../providers/player_manager_provider.dart';

class DeckScreen extends StatefulWidget {
  const DeckScreen({super.key});

  @override
  State<DeckScreen> createState() => _DeckScreenState();
}

class _DeckScreenState extends State<DeckScreen> {
  final TextEditingController deckNameController = TextEditingController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final player = context.read<PlayerManagerProvider>().currentPlayer;

    if (player != null) {
      context.read<DeckProvider>().loadDecksForPlayer(player.id!);
    }
  }

  @override
  void dispose() {
    deckNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();
    final playerManager = context.watch<PlayerManagerProvider>();
    final currentPlayer = playerManager.currentPlayer;

    if (currentPlayer == null) {
      return const Scaffold(body: Center(child: Text("No player selected")));
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Decks")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            /// 🔹 DECK NAME INPUT
            TextField(
              controller: deckNameController,
              decoration: const InputDecoration(labelText: "Deck Name"),
            ),
            const SizedBox(height: 10),

            /// 🔹 SAVE BUTTON
            ElevatedButton(
              onPressed: () {
                final name = deckNameController.text.trim();
                if (name.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Enter deck name")),
                  );
                  return;
                }
                final heroes = deckProvider.deck;
                if (heroes.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Select heroes first")),
                  );
                  return;
                }
                deckProvider.addDeck(
                  currentPlayer.id!,
                  name,
                  heroes.map((h) => h.name).toList(),
                );
                deckNameController.clear();
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text("Deck saved")));
              },
              child: const Text("Save Deck"),
            ),
            const SizedBox(height: 20),

            /// 🔹 SAVED DECK LIST
            Expanded(
              child: deckProvider.decks.isEmpty
                  ? const Center(child: Text("No decks saved"))
                  : ListView.builder(
                      itemCount: deckProvider.decks.length,
                      itemBuilder: (context, index) {
                        final deck = deckProvider.decks[index];

                        return Card(
                          child: ListTile(
                            title: Text(deck.name),
                            subtitle: Text("Heroes: ${deck.heroes.join(', ')}"),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(
                                    Icons.edit,
                                    color: Colors.blue,
                                  ),
                                  tooltip: 'Rename Deck',
                                  onPressed: () async {
                                    final controller = TextEditingController(
                                      text: deck.name,
                                    );
                                    final newName = await showDialog<String>(
                                      context: context,
                                      builder: (dialogContext) => AlertDialog(
                                        title: const Text('Rename Deck'),
                                        content: TextField(
                                          controller: controller,
                                          decoration: const InputDecoration(
                                            labelText: 'New deck name',
                                          ),
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.of(
                                              dialogContext,
                                              rootNavigator: true,
                                            ).pop(),
                                            child: const Text('Cancel'),
                                          ),
                                          ElevatedButton(
                                            onPressed: () => Navigator.of(
                                              dialogContext,
                                              rootNavigator: true,
                                            ).pop(controller.text.trim()),
                                            child: const Text('Save'),
                                          ),
                                        ],
                                      ),
                                    );
                                    if (newName != null &&
                                        newName.isNotEmpty &&
                                        newName != deck.name &&
                                        mounted) {
                                      await context
                                          .read<DeckProvider>()
                                          .renameDeck(deck.id!, newName);
                                      if (mounted) {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Deck renamed to "$newName"',
                                            ),
                                          ),
                                        );
                                      }
                                    }
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(
                                    Icons.delete,
                                    color: Colors.red,
                                  ),
                                  tooltip: 'Delete Deck',
                                  onPressed: () async {
                                    final confirm = await showDialog<bool>(
                                      context: context,
                                      builder: (dialogContext) => AlertDialog(
                                        title: const Text('Delete Deck'),
                                        content: const Text(
                                          'Are you sure you want to delete this deck?',
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
                                    final playerId =
                                        playerManager.currentPlayer?.id;
                                    if (confirm == true &&
                                        playerId != null &&
                                        mounted) {
                                      await context
                                          .read<DeckProvider>()
                                          .deleteDeck(
                                            deck.id!,
                                            playerId: playerId,
                                          );
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
