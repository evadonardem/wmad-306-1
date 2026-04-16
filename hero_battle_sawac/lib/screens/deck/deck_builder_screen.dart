import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();
    final deck = deckProvider.deck;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Deck Builder'),
        actions: [
          IconButton(
            onPressed: deck.isEmpty ? null : deckProvider.clear,
            icon: const Icon(Icons.delete_sweep_rounded),
          ),
        ],
      ),
      body: deck.isEmpty
          ? const Center(
              child: Text('No heroes in your deck yet. Add heroes from Home.'),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: deck.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final hero = deck[index];
                return Card(
                  child: ListTile(
                    title: Text(hero.name),
                    subtitle: Text(
                      '${hero.biography.publisher} • Overall ${hero.overallPower}',
                    ),
                    trailing: IconButton(
                      onPressed: () => deckProvider.removeHero(hero),
                      icon: const Icon(Icons.remove_circle_outline_rounded),
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: deck.length >= 2
          ? FloatingActionButton.extended(
              onPressed: () => Navigator.pushNamed(context, RouteNames.battle),
              icon: const Icon(Icons.bolt),
              label: const Text('Start Battle'),
            )
          : null,
    );
  }
}
