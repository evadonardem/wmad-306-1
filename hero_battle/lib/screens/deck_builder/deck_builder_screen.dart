import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';

import '../../models/hero_model.dart';
import '../../services/superhero_service.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final deckProvider = Provider.of<DeckProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Deck Builder')),
      body: ListView.builder(
        padding: const EdgeInsets.only(bottom: 100),
        itemCount: deckProvider.deck.length,
        itemBuilder: (context, index) {
          final hero = deckProvider.deck[index];
          return ListTile(
            leading: FutureBuilder<String?>(
              future: SuperHeroService().fetchHeroImage(
                int.tryParse(hero.id) ?? 0,
              ),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return SizedBox(
                    width: 56,
                    height: 56,
                    child: const Center(child: CircularProgressIndicator()),
                  );
                } else if (snapshot.hasError || snapshot.data == null) {
                  return Image.asset(
                    'assets/images/placeholder.png',
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                  );
                } else {
                  return Image.network(
                    snapshot.data!,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Image.asset(
                        'assets/images/placeholder.png',
                        width: 56,
                        height: 56,
                        fit: BoxFit.cover,
                      );
                    },
                  );
                }
              },
            ),
            title: Text(hero.name),
            trailing: IconButton(
              icon: Icon(Icons.remove_circle, color: Colors.red),
              onPressed: () => deckProvider.removeHero(hero),
            ),
          );
        },
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: ElevatedButton.icon(
          icon: const Icon(Icons.save),
          label: const Text('Save Deck'),
          onPressed: deckProvider.deck.isEmpty
              ? null
              : () async {
                  final name = await _showDeckNameDialog(context);
                  if (name != null && name.isNotEmpty) {
                    await deckProvider.saveDeck(name);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Deck saved!')),
                    );
                  }
                },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        label: const Text('Battle!'),
        icon: const Icon(Icons.sports_martial_arts),
        onPressed: deckProvider.deck.isEmpty
            ? null
            : () => Navigator.pushNamed(context, '/battle'),
      ),
    );
  }

  Future<String?> _showDeckNameDialog(BuildContext context) async {
    String name = '';
    return showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Deck Name'),
        content: TextField(
          onChanged: (value) => name = value,
          decoration: const InputDecoration(hintText: 'Enter deck name'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, null),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, name),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}
