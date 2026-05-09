// Deck Builder — current working deck, Save Deck dialog (Exercise 1),
// Start Battle CTA, link to Saved Decks.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../theme/app_theme.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  Future<void> _saveDeck(BuildContext context, DeckProvider deck) async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Save Deck'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Deck name'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, controller.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (name == null || name.isEmpty) return;
    await deck.saveDeckToDb(name);
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('"$name" saved to library'),
      ),
    );
  }

  void _startBattle(BuildContext context, DeckProvider deck) {
    if (!deck.isReady) return;
    final player = deck.deck.first;
    // Pick AI opponent: another hero in the deck if any, else the player.
    final ai = deck.deck.length > 1 ? deck.deck.last : player;
    context.read<BattleProvider>().startBattle(player, ai);
    Navigator.pushNamed(context, RouteNames.battle);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Deck'),
        actions: [
          IconButton(
            tooltip: 'Saved Decks',
            icon: Icon(Icons.bookmark, color: AppColors.primary),
            onPressed: () =>
                Navigator.pushNamed(context, RouteNames.savedDecks),
          ),
        ],
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          if (deck.deck.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.large),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.style,
                      color: AppColors.primary,
                      size: 64,
                    ),
                    const SizedBox(height: AppSpacing.medium),
                    Text(
                      'Your deck is empty',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: AppSpacing.small),
                    Text(
                      'Add up to 5 heroes from the roster.',
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(AppSpacing.medium),
                  itemCount: deck.deck.length,
                  itemBuilder: (context, index) {
                    final hero = deck.deck[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: AppSpacing.small),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundImage: NetworkImage(hero.imageUrl),
                          backgroundColor: AppColors.surfaceSoft,
                        ),
                        title: Text(hero.name),
                        subtitle: Text('HP ${hero.maxHp} • ATK ${hero.attack}'),
                        trailing: IconButton(
                          icon: Icon(
                            Icons.remove_circle,
                            color: AppColors.danger,
                          ),
                          onPressed: () => deck.removeHero(hero),
                        ),
                      ),
                    );
                  },
                ),
              ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.medium),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => Navigator.pushNamed(context, RouteNames.home),
                              icon: const Icon(Icons.add),
                              label: const Text('Add Heroes'),
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(52),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.small),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: deck.isReady ? () => _startBattle(context, deck) : null,
                              icon: const Icon(Icons.bolt),
                              label: const Text('Battle'),
                              style: ElevatedButton.styleFrom(
                                minimumSize: const Size.fromHeight(52),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.small),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () => _saveDeck(context, deck),
                          icon: const Icon(Icons.save),
                          label: const Text('Save Deck'),
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(52),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
