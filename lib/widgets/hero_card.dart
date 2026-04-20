import 'package:flutter/material.dart';

import '../models/hero_model.dart';
import 'package:provider/provider.dart';
import '../providers/deck_provider.dart';

class HeroCard extends StatelessWidget {
  final HeroModel hero;
  const HeroCard({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Card(
      clipBehavior: Clip.hardEdge, // ✅ prevents overflow warnings
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      elevation: 6,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Hero image with fallback to a generic placeholder
          Image.network(
            hero.imageUrl,
            height: 150,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Image.asset(
                'assets/images/placeholder.png',
                height: 150,
                fit: BoxFit.cover,
              );
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hero.name,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  hero.publisher,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    _StatBox(label: 'INT', value: hero.powerStats.intelligence),
                    _StatBox(label: 'STR', value: hero.powerStats.strength),
                    _StatBox(label: 'SPD', value: hero.powerStats.speed),
                    _StatBox(label: 'PWR', value: hero.powerStats.power),
                    _StatBox(label: 'COM', value: hero.powerStats.combat),
                    _StatBox(label: 'DUR', value: hero.powerStats.durability),
                  ],
                ),
              ],
            ),
          ),
          // ✅ Deck button row
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 0,
            ), // Remove vertical padding
            child: Row(
              children: [
                Expanded(
                  child: Builder(
                    builder: (context) {
                      final deckProvider = Provider.of<DeckProvider>(
                        context,
                        listen: false,
                      );
                      final isInDeck = deckProvider.isInDeck(hero);
                      return ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isInDeck
                              ? Colors.grey
                              : Colors.deepPurpleAccent,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                        onPressed: isInDeck
                            ? null
                            : () {
                                deckProvider.addHero(hero);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      '${hero.name} added to deck!',
                                    ),
                                    duration: const Duration(seconds: 1),
                                  ),
                                );
                              },
                        child: Text(
                          isInDeck ? 'In Deck' : '+ Deck',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: Colors.white70,
                    size: 22,
                  ),
                  onPressed: () => Navigator.pushNamed(
                    context,
                    '/hero',
                    arguments: {'hero': hero},
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String label;
  final int value;
  const _StatBox({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 10,
            ),
          ),
          Text(
            value.toString(),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
