import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../widgets/hero_image.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  const HeroDetailScreen({super.key, required this.hero});

  final HeroModel hero;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(16, 8, 16, 16),
        child: Consumer<DeckProvider>(
          builder: (context, deck, _) {
            final inDeck = deck.contains(hero);
            return FilledButton.icon(
              onPressed: inDeck
                  ? () => deck.removeHero(hero)
                  : deck.isFull
                  ? null
                  : () => deck.addHero(hero),
              icon: Icon(inDeck ? Icons.remove : Icons.add),
              label: Text(
                inDeck
                    ? 'Remove from Deck'
                    : deck.isFull
                    ? 'Deck Full'
                    : 'Add to Deck',
              ),
            );
          },
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: AspectRatio(
              aspectRatio: 16 / 12,
              child: ColoredBox(
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: HeroImage(hero: hero, fit: BoxFit.contain, iconSize: 80),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            hero.fullName.isEmpty ? hero.name : hero.fullName,
            style: textTheme.headlineSmall,
          ),
          const SizedBox(height: 6),
          Text('${hero.publisher} - ${hero.alignment}'),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              Chip(label: Text('HP ${hero.maxHp}')),
              Chip(label: Text('Attack ${hero.attack}')),
              Chip(label: Text('Special ${hero.specialAttack}')),
              Chip(label: Text('Defense ${hero.defense}')),
            ],
          ),
          const SizedBox(height: 20),
          Text('Power Stats', style: textTheme.titleLarge),
          const SizedBox(height: 8),
          StatRow(label: 'Intelligence', value: hero.powerStats.intelligence),
          StatRow(label: 'Strength', value: hero.powerStats.strength),
          StatRow(label: 'Speed', value: hero.powerStats.speed),
          StatRow(label: 'Durability', value: hero.powerStats.durability),
          StatRow(label: 'Power', value: hero.powerStats.power),
          StatRow(label: 'Combat', value: hero.powerStats.combat),
        ],
      ),
    );
  }
}
