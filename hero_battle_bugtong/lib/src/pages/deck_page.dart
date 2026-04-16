import 'package:flutter/material.dart';

import '../app_store.dart';
import '../battle_engine.dart';
import 'battle_page.dart';

class DeckPage extends StatelessWidget {
  const DeckPage({super.key, required this.store});

  final AppStore store;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: store,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Deck Builder'),
            actions: [
              if (store.deck.isNotEmpty)
                TextButton(
                  onPressed: store.clearDeck,
                  child: const Text('Clear All'),
                ),
            ],
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Heroes in Deck: ${store.deck.length}/${AppStore.maxDeck}'),
                const SizedBox(height: 12),
                if (store.deck.isEmpty)
                  const Expanded(
                    child: Center(child: Text('Your deck is empty.')),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      itemCount: store.deck.length,
                      separatorBuilder: (_, index) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final hero = store.deck[index];
                        return ListTile(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          tileColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                          leading: CircleAvatar(
                            backgroundImage: hero.imageUrl.isEmpty ? null : NetworkImage(hero.imageUrl),
                            child: hero.imageUrl.isEmpty ? const Icon(Icons.shield) : null,
                          ),
                          title: Text(hero.name),
                          subtitle: Text(
                            'ATK ${heroAttack(hero)} · HP ${heroMaxHp(hero)} · DEF ${heroDefense(hero)}',
                          ),
                          trailing: IconButton(
                            onPressed: () => store.removeHero(hero.id),
                            icon: const Icon(Icons.remove_circle_outline),
                          ),
                        );
                      },
                    ),
                  ),
                if (store.deck.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => BattlePage(store: store)),
                      );
                    },
                    child: const Text('Start Battle'),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
