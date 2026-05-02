import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';
import '../../widgets/hero_image.dart';

class DeckBuilderScreen extends StatefulWidget {
  const DeckBuilderScreen({super.key});

  @override
  State<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends State<DeckBuilderScreen> {
  final _deckNameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _deckNameController.addListener(_onDeckNameChanged);
  }

  @override
  void dispose() {
    _deckNameController.removeListener(_onDeckNameChanged);
    _deckNameController.dispose();
    super.dispose();
  }

  void _onDeckNameChanged() {
    if (mounted) setState(() {});
  }

  Future<void> _saveDeck(BuildContext context) async {
    if (_deckNameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a deck name before saving.')),
      );
      return;
    }

    try {
      final savedId = await context.read<DeckProvider>().saveDeckToDb(
        _deckNameController.text,
      );
      if (!context.mounted) return;

      if (savedId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Add at least one hero before saving.')),
        );
        return;
      }

      _deckNameController.clear();
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Deck saved.')));
    } on DuplicateDeckException {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('A saved deck with these heroes already exists.'),
        ),
      );
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Could not save deck: $error')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final deck = context.watch<DeckProvider>();
    final canSave =
        deck.deck.isNotEmpty && _deckNameController.text.trim().isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: Text('Deck ${deck.deckSize}/${DeckProvider.maxDeckSize}'),
        actions: [
          IconButton(
            tooltip: 'Saved decks',
            icon: const Icon(Icons.folder),
            onPressed: () =>
                Navigator.pushNamed(context, RouteNames.savedDecks),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          if (deck.deck.isEmpty)
            const _EmptyPanel(
              text: 'Add heroes from the roster to build a deck.',
            )
          else
            ...deck.deck.map((hero) => _DeckHeroTile(hero: hero)),
          const SizedBox(height: 12),
          TextField(
            controller: _deckNameController,
            enabled: deck.deck.isNotEmpty,
            decoration: const InputDecoration(
              labelText: 'Deck name',
              hintText: 'Enter a deck name',
              border: OutlineInputBorder(),
            ),
            textInputAction: TextInputAction.done,
            onSubmitted: deck.deck.isEmpty ? null : (_) => _saveDeck(context),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: deck.deck.isEmpty ? null : () => deck.clearDeck(),
                icon: const Icon(Icons.delete_outline),
                label: const Text('Clear'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: canSave ? () => _saveDeck(context) : null,
                icon: const Icon(Icons.save),
                label: const Text('Save'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: FilledButton.icon(
                onPressed: deck.deck.isEmpty
                    ? null
                    : () => Navigator.pushNamed(context, RouteNames.battle),
                icon: const Icon(Icons.sports_mma),
                label: const Text('Battle'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DeckHeroTile extends StatelessWidget {
  const _DeckHeroTile({required this.hero});

  final HeroModel hero;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: ClipOval(
          child: SizedBox(
            width: 40,
            height: 40,
            child: HeroImage(hero: hero, iconSize: 22),
          ),
        ),
        title: Text(hero.name),
        subtitle: Text('HP ${hero.maxHp} - ATK ${hero.attack}'),
        trailing: IconButton(
          tooltip: 'Remove',
          icon: const Icon(Icons.remove_circle_outline),
          onPressed: () => context.read<DeckProvider>().removeHero(hero),
        ),
      ),
    );
  }
}

class _EmptyPanel extends StatelessWidget {
  const _EmptyPanel({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(text),
    );
  }
}
