import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../widgets/hero_image.dart';
import '../../providers/deck_provider.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: buildHeroImage(
                hero.imageUrl,
                hero.name,
                height: 250,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              hero.name,
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            // Stats
            _StatRow(
              label: 'Intelligence',
              value: hero.powerStats.intelligence,
            ),
            _StatRow(label: 'Strength', value: hero.powerStats.strength),
            _StatRow(label: 'Speed', value: hero.powerStats.speed),
            _StatRow(label: 'Durability', value: hero.powerStats.durability),
            _StatRow(label: 'Power', value: hero.powerStats.power),
            _StatRow(label: 'Combat', value: hero.powerStats.combat),
            const SizedBox(height: 24),
            Consumer<DeckProvider>(
              builder: (context, deck, _) {
                final inDeck = deck.contains(hero);
                return ElevatedButton.icon(
                  onPressed: inDeck
                      ? () => deck.removeHero(hero)
                      : deck.isFull
                      ? null
                      : () => deck.addHero(hero),
                  icon: Icon(inDeck ? Icons.remove : Icons.add),
                  label: Text(inDeck ? 'Remove' : 'Add to Deck'),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label;
  final int value;
  const _StatRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [Text(label), Text(value.toString())],
      ),
    );
  }
}
