import 'package:flutter/material.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import 'package:provider/provider.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;
  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final deckProvider = Provider.of<DeckProvider>(context, listen: false);
    final isInDeck = deckProvider.isInDeck(hero);
    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Image.network(
                hero.imageUrl.startsWith('http')
                    ? hero.imageUrl
                    : HeroModel.IMAGE_BASE_URL + hero.imageUrl,
                height: 180,
                width: 180,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(height: 16),
            Text('Stats', style: Theme.of(context).textTheme.titleLarge),
            SizedBox(height: 8),
            Text('HP: ${hero.maxHp}'),
            Text('Attack: ${hero.attack}'),
            Text('Defense: ${hero.defense}'),
            Text('Initiative: ${hero.initiative}'),
            SizedBox(height: 24),
            Row(
              children: [
                ElevatedButton.icon(
                  icon: Icon(isInDeck ? Icons.remove : Icons.add),
                  label: Text(isInDeck ? 'Remove from Deck' : 'Add to Deck'),
                  onPressed: () {
                    if (isInDeck) {
                      deckProvider.removeHero(hero);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Removed from deck')),
                      );
                    } else {
                      deckProvider.addHero(hero);
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text('Added to deck')));
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
