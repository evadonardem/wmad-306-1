import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/enemy_deck_provider.dart';
import '../providers/deck_provider.dart';
import '../providers/battle_provider.dart';
import 'battle/battle_screen.dart';

class EnemyDeckListScreen extends StatelessWidget {
  const EnemyDeckListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final enemyDecks = context.watch<EnemyDeckProvider>().enemyDecks;

    return Scaffold(
      appBar: AppBar(title: const Text("Choose Enemy Deck")),
      body: ListView.builder(
        itemCount: enemyDecks.length,
        itemBuilder: (_, index) {
          final deck = enemyDecks[index];

          return ListTile(
            title: Text(deck.name),
            subtitle: Text(deck.heroes.map((h) => h.name).join(", ")),

            onTap: () {
              final playerDeck = context.read<DeckProvider>().deck;

              /// ✅ VALIDATION (VERY IMPORTANT)
              if (playerDeck.length != 5 || deck.heroes.length != 5) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Both decks must have 5 heroes"),
                  ),
                );
                return;
              }

              /// ✅ FIXED METHOD CALL: Only pass player deck
              context.read<BattleProvider>().startBattle(playerDeck);

              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const BattleScreen()),
              );
            },
          );
        },
      ),
    );
  }
}
