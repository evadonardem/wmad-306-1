import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  const HeroDetailScreen({super.key, required this.hero});

  final HeroModel hero;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            LayoutBuilder(
              builder: (context, constraints) {
                final frameHeight = (constraints.maxWidth * 1.28).clamp(
                  280.0,
                  640.0,
                );

                return SizedBox(
                  height: frameHeight,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: ColoredBox(
                      color: theme.colorScheme.surfaceContainerHighest,
                      child: CachedNetworkImage(
                        imageUrl: hero.imageUrl,
                        fit: BoxFit.contain,
                        alignment: Alignment.topCenter,
                        filterQuality: FilterQuality.high,
                        placeholder: (context, imageUrl) => Center(
                          child: CircularProgressIndicator(
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        errorWidget: (context, imageUrl, error) => Center(
                          child: Icon(
                            Icons.broken_image_outlined,
                            size: 42,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
            Text(
              hero.fullName.isEmpty ? hero.name : hero.fullName,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 4),
            Text(
              '${hero.publisher} • ${hero.alignment.toUpperCase()}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  children: <Widget>[
                    StatRow(label: 'Intelligence', value: hero.intelligence),
                    const SizedBox(height: 10),
                    StatRow(label: 'Strength', value: hero.strength),
                    const SizedBox(height: 10),
                    StatRow(label: 'Speed', value: hero.speed),
                    const SizedBox(height: 10),
                    StatRow(label: 'Durability', value: hero.durability),
                    const SizedBox(height: 10),
                    StatRow(label: 'Power', value: hero.power),
                    const SizedBox(height: 10),
                    StatRow(label: 'Combat', value: hero.combat),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Consumer<DeckProvider>(
              builder: (context, deck, child) {
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
