import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../widgets/stat_row.dart';
import '../../providers/deck_provider.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(hero.name),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image
            ClipRRect(
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)),
              child: CachedNetworkImage(
                imageUrl: hero.imageUrl,
                height: 300,
                width: double.infinity,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  height: 300,
                  color: Colors.grey[300],
                  child: const Center(child: CircularProgressIndicator()),
                ),
                errorWidget: (context, url, error) => Container(
                  height: 300,
                  color: Colors.grey[300],
                  child: const Center(child: Icon(Icons.error, size: 50)),
                ),
              ),
            ),
            // Stats Section
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hero.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Power Stats',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  StatRow(
                    label: 'Power',
                    value: hero.power,
                    color: Colors.red,
                  ),
                  StatRow(
                    label: 'Intelligence',
                    value: hero.intelligence,
                    color: Colors.blue,
                  ),
                  StatRow(
                    label: 'Speed',
                    value: hero.speed,
                    color: Colors.orange,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          final isInDeck = deck.deck.any((h) => h.name == hero.name);
          return FloatingActionButton.extended(
            onPressed: isInDeck
                ? () {
                    deck.removeHero(hero);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${hero.name} removed from deck')),
                    );
                  }
                : () {
                    if (deck.deck.length < 5) {
                      deck.addHero(hero);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${hero.name} added to deck')),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Deck is full (max 5)')),
                      );
                    }
                  },
            backgroundColor: isInDeck ? Colors.orange : Colors.green,
            icon: Icon(isInDeck ? Icons.remove : Icons.add),
            label: Text(isInDeck ? 'Remove from Deck' : 'Add to Deck'),
          );
        },
      ),
    );
  }
}
