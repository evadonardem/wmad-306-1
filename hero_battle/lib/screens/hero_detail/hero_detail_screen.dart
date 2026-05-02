import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                hero.name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: Colors.black, blurRadius: 8)],
                ),
              ),
              background: hero.imageUrl.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: hero.imageUrl,
                      fit: BoxFit.cover,
                      placeholder: (_, __) =>
                          const Center(child: CircularProgressIndicator()),
                      errorWidget: (_, __, ___) =>
                          const Icon(Icons.person, size: 80),
                    )
                  : const Icon(Icons.person, size: 80),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Biography
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Biography',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: scheme.primary,
                                  )),
                          const SizedBox(height: 8),
                          if (hero.fullName.isNotEmpty)
                            _bioRow('Full Name', hero.fullName),
                          if (hero.publisher.isNotEmpty)
                            _bioRow('Publisher', hero.publisher),
                          _bioRow('Alignment', hero.alignment.toUpperCase()),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Game Stats
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Game Stats',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: scheme.primary,
                                  )),
                          const SizedBox(height: 8),
                          StatRow(label: 'Max HP', value: hero.maxHp),
                          StatRow(label: 'Attack', value: hero.attack),
                          StatRow(label: 'Special Attack', value: hero.specialAttack),
                          StatRow(label: 'Defense', value: hero.defense),
                          StatRow(label: 'Initiative (SPD)', value: hero.initiative),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Raw Power Stats
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Power Stats',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: scheme.primary,
                                  )),
                          const SizedBox(height: 8),
                          StatRow(label: 'Intelligence', value: hero.powerStats.intelligence),
                          StatRow(label: 'Strength', value: hero.powerStats.strength),
                          StatRow(label: 'Speed', value: hero.powerStats.speed),
                          StatRow(label: 'Durability', value: hero.powerStats.durability),
                          StatRow(label: 'Power', value: hero.powerStats.power),
                          StatRow(label: 'Combat', value: hero.powerStats.combat),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          final inDeck = deck.contains(hero);
          return FloatingActionButton.extended(
            onPressed: inDeck
                ? () {
                    deck.removeHero(hero);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${hero.name} removed from deck')),
                    );
                  }
                : deck.isFull
                    ? null
                    : () {
                        deck.addHero(hero);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                              content: Text('${hero.name} added to deck (${deck.deckSize}/5)')),
                        );
                      },
            icon: Icon(inDeck ? Icons.remove : Icons.add),
            label: Text(
              inDeck
                  ? 'Remove from Deck'
                  : deck.isFull
                      ? 'Deck Full'
                      : 'Add to Deck',
            ),
            backgroundColor: deck.isFull && !inDeck ? Colors.grey : null,
          );
        },
      ),
    );
  }

  Widget _bioRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label,
                style: const TextStyle(color: Colors.grey, fontSize: 13)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
