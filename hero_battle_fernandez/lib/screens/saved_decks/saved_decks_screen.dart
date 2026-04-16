import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';
import '../../widgets/hero_image.dart';

class SavedDecksScreen extends StatefulWidget {
  const SavedDecksScreen({super.key});

  @override
  State<SavedDecksScreen> createState() => _SavedDecksScreenState();
}

class _SavedDecksScreenState extends State<SavedDecksScreen> {
  late Future<List<Map<String, dynamic>>> _decksFuture;

  @override
  void initState() {
    super.initState();
    _decksFuture = DatabaseService().loadDecks();
  }

  void _reload() {
    setState(() {
      _decksFuture = DatabaseService().loadDecks();
    });
  }

  Future<void> _deleteDeck(BuildContext context, int id) async {
    try {
      await DatabaseService().deleteDeck(id);
      if (!context.mounted) return;
      _reload();
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Saved deck deleted.')));
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Could not delete deck: $error')));
    }
  }

  void _useDeck(BuildContext context, List<HeroModel> heroes) {
    if (heroes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This saved deck has no heroes.')),
      );
      return;
    }

    context.read<DeckProvider>().replaceDeck(heroes);
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Saved deck loaded.')));
  }

  void _playDeck(BuildContext context, List<HeroModel> heroes) {
    if (heroes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This saved deck has no heroes.')),
      );
      return;
    }

    context.read<DeckProvider>().replaceDeck(heroes);
    Navigator.pushNamed(context, RouteNames.battle);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Decks')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _decksFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final decks = snapshot.data ?? [];
          if (decks.isEmpty) {
            return const Center(child: Text('No saved decks yet.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: decks.length,
            separatorBuilder: (context, index) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final deck = decks[index];
              final heroes = DatabaseService().tryDecodeDeckHeroes(
                deck['heroes'] as String? ?? '[]',
              );
              final created = DateTime.tryParse(deck['created'] as String);
              final date = created?.toLocal().toString().split('.').first;

              return _SavedDeckTile(
                deck: deck,
                heroes: heroes,
                date: date,
                onUse: () => _useDeck(context, heroes),
                onPlay: () => _playDeck(context, heroes),
                onDelete: () => _deleteDeck(context, deck['id'] as int),
              );
            },
          );
        },
      ),
    );
  }
}

class _SavedDeckTile extends StatelessWidget {
  const _SavedDeckTile({
    required this.deck,
    required this.heroes,
    required this.date,
    required this.onUse,
    required this.onPlay,
    required this.onDelete,
  });

  final Map<String, dynamic> deck;
  final List<HeroModel> heroes;
  final String? date;
  final VoidCallback onUse;
  final VoidCallback onPlay;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        title: Text(deck['name'] as String? ?? 'Saved Deck'),
        subtitle: Text(
          '${heroes.length} heroes${date == null ? '' : ' - $date'}',
        ),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        children: [
          if (heroes.isEmpty)
            const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text('No hero data saved for this deck.'),
              ),
            )
          else
            ...heroes.map(
              (hero) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: ClipOval(
                  child: SizedBox(
                    width: 36,
                    height: 36,
                    child: HeroImage(hero: hero, iconSize: 20),
                  ),
                ),
                title: Text(hero.name),
                subtitle: Text('HP ${hero.maxHp} - ATK ${hero.attack}'),
              ),
            ),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: heroes.isEmpty ? null : onUse,
                  icon: const Icon(Icons.style),
                  label: const Text('Use'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton.icon(
                  onPressed: heroes.isEmpty ? null : onPlay,
                  icon: const Icon(Icons.sports_mma),
                  label: const Text('Play'),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                tooltip: 'Delete',
                icon: const Icon(Icons.delete_outline),
                onPressed: onDelete,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
