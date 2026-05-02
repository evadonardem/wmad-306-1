import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';
import '../../models/hero_model.dart';
import 'dart:convert';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  Future<void> _saveDeck(BuildContext context, DeckProvider deck) async {
    final controller = TextEditingController(text: 'My Deck');
    final name = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Save Deck', style: TextStyle(color: Color(0xFFE2D9F3))),
        content: TextField(
          controller: controller,
          style: const TextStyle(color: Color(0xFFE2D9F3)),
          decoration: InputDecoration(
            hintText: 'Deck name',
            hintStyle: const TextStyle(color: Color(0xFF666666)),
            filled: true,
            fillColor: const Color(0xFF0D0D1A),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF7B2FBE)),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF666666))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, controller.text),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7B2FBE),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Save', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (name != null && name.isNotEmpty) {
      await deck.saveDeckToDb(name);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Deck "$name" saved!'),
            backgroundColor: const Color(0xFF7B2FBE),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Deck Builder', style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600)),
        actions: [
          TextButton.icon(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SavedDecksScreen()),
            ),
            icon: const Icon(Icons.folder_open_rounded, color: Color(0xFF9370DB), size: 18),
            label: const Text('Saved', style: TextStyle(color: Color(0xFF9370DB), fontSize: 13)),
          ),
        ],
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          return Column(
            children: [
              // Deck size indicator
              Container(
                margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.style_rounded, color: Color(0xFFA855F7), size: 18),
                    const SizedBox(width: 10),
                    Text(
                      'Deck: ${deck.deckSize} / ${DeckProvider.maxDeckSize} heroes',
                      style: const TextStyle(color: Color(0xFFE2D9F3), fontSize: 13),
                    ),
                    const Spacer(),
                    if (deck.deckSize > 0)
                      TextButton(
                        onPressed: () => deck.clearDeck(),
                        child: const Text('Clear', style: TextStyle(color: Color(0xFFF87171), fontSize: 12)),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Hero slots
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    ...deck.deck.map((hero) => _DeckHeroTile(hero: hero, deck: deck)),
                    ...List.generate(
                      DeckProvider.maxDeckSize - deck.deckSize,
                      (_) => _EmptySlot(),
                    ),
                  ],
                ),
              ),

              // Action buttons
              Container(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
                decoration: const BoxDecoration(
                  color: Color(0xFF0D0D1A),
                  border: Border(top: BorderSide(color: Color(0xFF2A2A3E), width: 0.5)),
                ),
                child: Column(
                  children: [
                    if (deck.isReady) ...[
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () => Navigator.pushNamed(context, RouteNames.battle),
                          icon: const Icon(Icons.sports_martial_arts_rounded),
                          label: const Text('Start Battle!', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFF87171),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                    ],
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: deck.isReady ? () => _saveDeck(context, deck) : null,
                        icon: const Icon(Icons.save_rounded),
                        label: const Text('Save Deck to SQLite', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF7B2FBE),
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: const Color(0xFF2A2A3E),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _DeckHeroTile extends StatelessWidget {
  final HeroModel hero;
  final DeckProvider deck;
  const _DeckHeroTile({required this.hero, required this.deck});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF7B2FBE).withOpacity(0.4), width: 0.5),
      ),
      child: Row(
        children: [
          // Hero image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: hero.imageUrl.isNotEmpty
                ? Image.network(
                    hero.imageUrl,
                    width: 52, height: 52,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 52, height: 52,
                      color: const Color(0xFF0D0D1A),
                      child: const Center(child: Text('🦸', style: TextStyle(fontSize: 24))),
                    ),
                  )
                : Container(
                    width: 52, height: 52,
                    color: const Color(0xFF0D0D1A),
                    child: const Center(child: Text('🦸', style: TextStyle(fontSize: 24))),
                  ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(hero.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFFE2D9F3))),
                const SizedBox(height: 2),
                Text(
                  'ATK ${hero.attack}  ·  HP ${hero.maxHp}  ·  DEF ${hero.defense}',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF666666)),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => deck.removeHero(hero),
            icon: const Icon(Icons.remove_circle_rounded, color: Color(0xFFF87171), size: 22),
          ),
        ],
      ),
    );
  }
}

class _EmptySlot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2A2A3E), width: 1, style: BorderStyle.solid),
      ),
      child: Row(
        children: [
          Container(
            width: 52, height: 52,
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A2E),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(
              child: Icon(Icons.add_rounded, color: Color(0xFF3A3A4E), size: 24),
            ),
          ),
          const SizedBox(width: 12),
          const Text('Add a hero from the roster', style: TextStyle(fontSize: 13, color: Color(0xFF3A3A4E))),
        ],
      ),
    );
  }
}

// Exercise 1 — SavedDecksScreen
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
    _reload();
  }

  void _reload() {
    setState(() {
      _decksFuture = DatabaseService().loadDecks();
    });
  }

  Future<void> _deleteDeck(int id, String name) async {
    await DatabaseService().deleteDeck(id);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('"$name" deleted'),
          backgroundColor: const Color(0xFFF87171),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      _reload();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Saved Decks', style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600)),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _decksFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF7B2FBE)));
          }
          final decks = snapshot.data ?? [];
          if (decks.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('📭', style: TextStyle(fontSize: 48)),
                  SizedBox(height: 12),
                  Text('No saved decks yet', style: TextStyle(color: Color(0xFF666666), fontSize: 14)),
                  SizedBox(height: 4),
                  Text('Build a deck and save it!', style: TextStyle(color: Color(0xFF444444), fontSize: 12)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: decks.length,
            itemBuilder: (_, i) {
              final deck = decks[i];
              final heroes = (jsonDecode(deck['heroes'] as String) as List)
                  .map((h) => HeroModel.fromJson(h as Map<String, dynamic>))
                  .toList();
              final createdAt = deck['created'] as String;
              final date = DateTime.tryParse(createdAt);
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            deck['name'] as String,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFFE2D9F3)),
                          ),
                        ),
                        Text(
                          '${heroes.length} heroes',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF9370DB)),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: () => _deleteDeck(deck['id'] as int, deck['name'] as String),
                          icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFF87171), size: 20),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                        ),
                      ],
                    ),
                    if (date != null)
                      Text(
                        'Saved ${date.day}/${date.month}/${date.year}',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF555566)),
                      ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 6,
                      children: heroes.map((h) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0D0D1A),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF3A2A4E), width: 0.5),
                        ),
                        child: Text(h.name, style: const TextStyle(fontSize: 11, color: Color(0xFFA855F7))),
                      )).toList(),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
