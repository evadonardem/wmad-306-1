import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../models/skill.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_manager_provider.dart';
import '../profile/create_player_screen.dart';

class SavedDecksScreen extends StatefulWidget {
  const SavedDecksScreen({super.key});

  @override
  State<SavedDecksScreen> createState() => _SavedDecksScreenState();
}

class _SavedDecksScreenState extends State<SavedDecksScreen> {
  int? _loadedPlayerId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final player = context.read<PlayerManagerProvider>().currentPlayer;

    if (player != null && player.id != _loadedPlayerId) {
      _loadedPlayerId = player.id;
      context.read<DeckProvider>().loadDecksForPlayer(player.id!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();
    final player = context.watch<PlayerManagerProvider>().currentPlayer;
    if (player == null) {
      return const Scaffold(body: Center(child: Text("No player selected")));
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Saved Decks"),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add),
            tooltip: 'Create Player',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreatePlayerScreen()),
              );
            },
          ),
        ],
      ),
      body: deckProvider.decks.isEmpty
          ? const Center(child: Text("No saved decks"))
          : ListView.builder(
              itemCount: deckProvider.decks.length,
              itemBuilder: (context, index) {
                final deck = deckProvider.decks[index];
                return Card(
                  child: ListTile(
                    title: Text(deck.name),
                    subtitle: Text(
                      deck.heroes.join(', '),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        /// 🔹 LOAD DECK
                        IconButton(
                          icon: const Icon(Icons.upload),
                          tooltip: 'Load Deck',
                          onPressed: () {
                            final rand = Random();
                            final heroes = deck.heroes.asMap().entries.map((
                              entry,
                            ) {
                              final index = entry.key;
                              final name = entry.value;
                              return HeroModel(
                                id: index.toString(),
                                name: name,
                                imageUrl:
                                    'https://via.placeholder.com/300x400.png?text=${Uri.encodeComponent(name)}',
                                powerStats: PowerStats(
                                  intelligence: 40 + rand.nextInt(30),
                                  strength: 40 + rand.nextInt(30),
                                  speed: 40 + rand.nextInt(30),
                                  durability: 40 + rand.nextInt(30),
                                  power: 40 + rand.nextInt(30),
                                  combat: 40 + rand.nextInt(30),
                                ),
                                skills: [
                                  Skill(
                                    name: "Punch",
                                    multiplier: 1.0,
                                    critChance: 0.1,
                                    type: SkillType.physical,
                                  ),
                                  Skill(
                                    name: "Power Blast",
                                    multiplier: 1.5,
                                    critChance: 0.2,
                                    type: SkillType.energy,
                                  ),
                                  Skill(
                                    name: "Ultimate",
                                    multiplier: 2.2,
                                    critChance: 0.3,
                                    type: SkillType.magic,
                                  ),
                                ],
                              );
                            }).toList();
                            // Prompt for deck name
                            showDialog(
                              context: context,
                              builder: (context) {
                                final TextEditingController
                                deckNameController = TextEditingController();
                                return AlertDialog(
                                  title: const Text('Save Deck'),
                                  content: TextField(
                                    controller: deckNameController,
                                    decoration: const InputDecoration(
                                      labelText: 'Deck Name',
                                    ),
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.pop(context),
                                      child: const Text('Cancel'),
                                    ),
                                    ElevatedButton(
                                      onPressed: () async {
                                        final deckName = deckNameController
                                            .text
                                            .trim();
                                        if (deckName.isNotEmpty) {
                                          await context
                                              .read<DeckProvider>()
                                              .addDeck(
                                                player.id!,
                                                deckName,
                                                heroes
                                                    .map((h) => h.name)
                                                    .toList(),
                                              );
                                          Navigator.pop(
                                            context,
                                          ); // Close dialog
                                          Navigator.pop(
                                            context,
                                          ); // Close decks screen
                                        }
                                      },
                                      child: const Text('Save'),
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                        ),

                        /// 🔹 DELETE
                        IconButton(
                          icon: const Icon(Icons.delete),
                          tooltip: 'Delete Deck',
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text("Delete Deck"),
                                content: Text(
                                  "Delete '${deck.name}' permanently?",
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
                              context.read<DeckProvider>().deleteDeck(deck.id!);
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
