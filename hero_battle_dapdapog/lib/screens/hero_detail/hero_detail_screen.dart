import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: AspectRatio(
              aspectRatio: 1,
              child: CachedNetworkImage(
                imageUrl: hero.imageUrl,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(
                  color: theme.colorScheme.surfaceContainerHighest,
                  child: const Center(child: CircularProgressIndicator()),
                ),
                errorWidget: (_, __, ___) => Container(
                  color: theme.colorScheme.surfaceContainerHighest,
                  child: const Center(child: Icon(Icons.broken_image_outlined, size: 48)),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            hero.name,
            style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          Text('Total power ${hero.totalPower}', style: theme.textTheme.titleMedium),
          const SizedBox(height: 20),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  StatRow(label: 'Intelligence', value: hero.intelligence),
                  StatRow(label: 'Strength', value: hero.strength),
                  StatRow(label: 'Speed', value: hero.speed),
                  StatRow(label: 'Durability', value: hero.durability),
                  StatRow(label: 'Power', value: hero.power),
                  StatRow(label: 'Combat', value: hero.combat),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          Consumer<DeckProvider>(
            builder: (context, deck, _) {
              final isInDeck = deck.isInDeck(hero);
              return FilledButton.icon(
                icon: Icon(isInDeck ? Icons.remove_circle_outline : Icons.add_circle_outline),
                label: Text(isInDeck ? 'Remove from Deck' : 'Add to Deck'),
                onPressed: () => deck.toggleHero(hero),
              );
            },
          ),
        ],
      ),
    );
  }
}