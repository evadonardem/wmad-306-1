import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart'; // ✅ ADD THIS
import '../../widgets/hero_card.dart';
import '../../router/app_router.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Deck')),

      body: Consumer<DeckProvider>(
        builder: (context, deckProvider, _) {
          final deck = deckProvider.deck;

          if (deck.isEmpty) {
            return const Center(child: Text('No heroes in deck'));
          }

          return GridView.builder(
            itemCount: deck.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
            ),
            itemBuilder: (context, i) {
              final hero = deck[i];

              return GestureDetector(
                onTap: () => deckProvider.removeHero(hero),
                child: HeroCard(hero: hero),
              );
            },
          );
        },
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () {
          final deck = context.read<DeckProvider>().deck;

          if (deck.length < 2) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Select at least 2 heroes")),
            );
            return;
          }

          /// ✅ START BATTLE
          context.read<BattleProvider>().startBattle(deck);

          /// ✅ NAVIGATE
          Navigator.pushNamed(context, RouteNames.battle);
        },
        child: const Icon(Icons.sports_martial_arts),
      ),
    );
  }
}
