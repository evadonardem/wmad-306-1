import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/hero_model.dart';
import '../../../providers/deck_provider.dart';
import '../../../widgets/hero_card.dart';
import '../../../router/app_router.dart';

class DeckBuilderScreen extends StatefulWidget {
  const DeckBuilderScreen({super.key});

  @override
  State<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends State<DeckBuilderScreen> {
  final _deckNameController = TextEditingController();

  @override
  void dispose() {
    _deckNameController.dispose();
    super.dispose();
  }

  Future<void> _saveDeck() async {
    final deck = context.read<DeckProvider>();
    if (deck.deck.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Your deck is empty!')),
      );
      return;
    }

    final name = await _showSaveDialog();
    if (name != null && name.trim().isNotEmpty) {
      await deck.saveDeckToDb(name);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Deck "$name" saved!')),
        );
      }
    }
  }

  Future<String?> _showSaveDialog() async {
    return showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Save Deck'),
        content: TextField(
          controller: _deckNameController,
          decoration: const InputDecoration(
            hintText: 'Enter deck name',
            border: OutlineInputBorder(),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              final name = _deckNameController.text.trim();
              if (name.isNotEmpty) {
                Navigator.pop(context, name);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  Future<void> _showSavedDecks() async {
    final deck = context.read<DeckProvider>();
    await deck.loadSavedDecks();

    if (deck.savedDecks.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No saved decks yet')),
        );
      }
      return;
    }

    if (mounted) {
      showModalBottomSheet(
        context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              child: const Text(
                'Saved Decks',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            Expanded(
              child: Consumer<DeckProvider>(
                builder: (context, deck, _) {
                  if (deck.savedDecks.isEmpty) {
                    return const Center(child: Text('No saved decks'));
                  }
                  return ListView.builder(
                    controller: scrollController,
                    itemCount: deck.savedDecks.length,
                    itemBuilder: (context, i) {
                      final savedDeck = deck.savedDecks[i];
                      return ListTile(
                        leading: const Icon(Icons.style),
                        title: Text(savedDeck['name'] as String),
                        subtitle: Text('Created: ${savedDeck['created']}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            await deck.deleteDeck(savedDeck['id'] as int);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Deck deleted'),
                                ),
                              );
                            }
                          },
                        ),
                        onTap: () async {
                          final heroes = await deck.loadDeckHeroes(savedDeck);
                          if (mounted) {
                            Navigator.pop(context);
                          }
                          if (mounted) {
                            _showLoadConfirmation(savedDeck['name'] as String, heroes);
                          }
                        },
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
    }
  }

  void _showLoadConfirmation(String deckName, List<HeroModel> heroes) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Load "$deckName"?'),
        content: Text('This will replace your current deck with ${heroes.length} heroes.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              final deck = context.read<DeckProvider>();
              deck.clearDeck();
              for (final hero in heroes) {
                deck.addHero(hero);
              }
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Loaded deck "$deckName"')),
              );
            },
            child: const Text('Load'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Deck Builder'),
        actions: [
          IconButton(
            icon: const Icon(Icons.folder_open),
            onPressed: _showSavedDecks,
            tooltip: 'Load saved deck',
          ),
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveDeck,
            tooltip: 'Save current deck',
          ),
        ],
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          if (deck.deck.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.style, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'Your deck is empty',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Add heroes from the Hero Roster',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                color: Theme.of(context).colorScheme.primaryContainer,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Deck (${deck.deckSize}/${DeckProvider.maxDeckSize})',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Row(
                      children: [
                        ElevatedButton.icon(
                          onPressed: deck.deck.isNotEmpty
                              ? () {
                                  Navigator.pushNamed(
                                    context,
                                    RouteNames.battle,
                                    arguments: deck.deck,
                                  );
                                }
                              : null,
                          icon: const Icon(Icons.play_arrow),
                          label: const Text('Battle!'),
                        ),
                        const SizedBox(width: 8),
                        TextButton(
                          onPressed: deck.clearDeck,
                          child: const Text('Clear All'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: deck.deck.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.7,
                  ),
                  itemBuilder: (context, i) {
                    final hero = deck.deck[i];
                    return Stack(
                      children: [
                        HeroCard(hero: hero),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.red,
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: const Icon(Icons.close, size: 16),
                              color: Colors.white,
                              onPressed: () => deck.removeHero(hero),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}