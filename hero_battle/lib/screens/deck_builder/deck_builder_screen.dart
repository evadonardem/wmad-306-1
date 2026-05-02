import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  void _showSaveDeckDialog(BuildContext context, DeckProvider deck) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Save Deck'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Deck name'),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (controller.text.trim().isNotEmpty) {
                await deck.saveDeckToDb(controller.text.trim());
                if (ctx.mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Deck saved!')),
                  );
                }
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Deck Builder'),
        actions: [
          Consumer<DeckProvider>(
            builder: (context, deck, _) => TextButton.icon(
              onPressed: deck.isReady
                  ? () => _showSaveDeckDialog(context, deck)
                  : null,
              icon: const Icon(Icons.save),
              label: const Text('Save'),
            ),
          ),
        ],
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          return Column(
            children: [
              // Header with deck count
              Container(
                width: double.infinity,
                color: scheme.primaryContainer,
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Icon(Icons.style, color: scheme.onPrimaryContainer),
                    const SizedBox(width: 8),
                    Text(
                      'Your Deck: ${deck.deckSize} / ${DeckProvider.maxDeckSize} heroes',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: scheme.onPrimaryContainer,
                      ),
                    ),
                    const Spacer(),
                    if (deck.isReady)
                      TextButton(
                        onPressed: deck.clearDeck,
                        child: Text('Clear',
                            style: TextStyle(color: scheme.onPrimaryContainer)),
                      ),
                  ],
                ),
              ),

              // Deck list
              Expanded(
                child: deck.deck.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.style_outlined, size: 64, color: Colors.grey),
                            const SizedBox(height: 16),
                            const Text('Your deck is empty'),
                            const SizedBox(height: 8),
                            const Text(
                              'Go to Home and tap a hero to add it',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(12),
                        itemCount: deck.deck.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 8),
                        itemBuilder: (context, i) {
                          final hero = deck.deck[i];
                          return _HeroDeckTile(
                            hero: hero,
                            onRemove: () => deck.removeHero(hero),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: Consumer<DeckProvider>(
        builder: (context, deck, _) => FloatingActionButton.extended(
          onPressed: deck.isReady
              ? () {
                  Navigator.pushNamed(context, RouteNames.battle);
                }
              : null,
          icon: const Icon(Icons.flash_on),
          label: const Text('Start Battle'),
          backgroundColor: deck.isReady ? null : Colors.grey,
        ),
      ),
    );
  }
}

class _HeroDeckTile extends StatelessWidget {
  final HeroModel hero;
  final VoidCallback onRemove;

  const _HeroDeckTile({required this.hero, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: hero.imageUrl.isNotEmpty
              ? CachedNetworkImage(
                  imageUrl: hero.imageUrl,
                  width: 48,
                  height: 48,
                  fit: BoxFit.cover,
                  placeholder: (_, __) =>
                      const SizedBox(width: 48, height: 48, child: CircularProgressIndicator()),
                  errorWidget: (_, __, ___) =>
                      const Icon(Icons.person, size: 48),
                )
              : const Icon(Icons.person, size: 48),
        ),
        title: Text(hero.name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('ATK ${hero.attack}  HP ${hero.maxHp}  DEF ${hero.defense}'),
        trailing: IconButton(
          icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
          onPressed: onRemove,
        ),
      ),
    );
  }
}
