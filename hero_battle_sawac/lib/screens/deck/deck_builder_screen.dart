import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/hero_portrait.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  Future<void> _saveDeckWithName(BuildContext context, DeckProvider deckProvider) async {
    if (deckProvider.count != DeckProvider.maxDeckSize) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Build a full 5-hero deck first, then save it.'),
        ),
      );
      return;
    }

    final name = await _showDeckNameDialog(context, deckProvider.savedDecks.length + 1);
    if (!context.mounted || name == null) {
      return;
    }

    final saved = deckProvider.saveCurrentDeckAsNew(name: name);
    if (saved && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Deck "$name" saved successfully!')),
      );
      // Clear the draft after saving
      deckProvider.clear();
    }
  }

  Future<String?> _showDeckNameDialog(BuildContext context, int deckNumber) async {
    final controller = TextEditingController(text: 'Deck $deckNumber');
    String? errorText;

    final result = await showDialog<String>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Name New Deck'),
          content: TextField(
            controller: controller,
            autofocus: true,
            maxLength: 28,
            decoration: InputDecoration(
              labelText: 'Deck name',
              hintText: 'Ex: Cosmic Titans',
              errorText: errorText,
            ),
            onChanged: (_) {
              if (errorText != null) {
                setDialogState(() => errorText = null);
              }
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                final trimmed = controller.text.trim();
                if (trimmed.isEmpty) {
                  setDialogState(() => errorText = 'Deck name is required.');
                  return;
                }
                Navigator.pop(dialogContext, trimmed);
              },
              child: const Text('Save Deck'),
            ),
          ],
        ),
      ),
    );

    controller.dispose();
    return result;
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();
    final deck = deckProvider.deck;
    final savedDecks = deckProvider.savedDecks;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF101827) : const Color(0xFFFFFAF2);
    final cardBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Deck Builder'),
        actions: [
          IconButton(
            onPressed: deck.isEmpty ? null : deckProvider.clear,
            icon: const Icon(Icons.delete_sweep_rounded),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Current Draft',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: cardBorder),
            ),
            child: Column(
              children: [
                Text(
                  '${deck.length}/${DeckProvider.maxDeckSize} heroes',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                if (deck.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(12),
                    child: Text('No heroes in your draft. Add heroes from Home and return here.'),
                  )
                else
                  SizedBox(
                    height: 80,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: deck.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final hero = deck[index];
                        return SizedBox(
                          width: 76,
                          child: Stack(
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Expanded(
                                    child: HeroPortrait(
                                      hero: hero,
                                      fit: BoxFit.cover,
                                      padding: EdgeInsets.zero,
                                      borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(10),
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF1F2937)
                                          : const Color(0xFFE9DCC8),
                                      borderRadius: const BorderRadius.vertical(
                                        bottom: Radius.circular(10),
                                      ),
                                    ),
                                    child: Text(
                                      hero.name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Positioned(
                                right: 0,
                                top: 0,
                                child: InkWell(
                                  onTap: () => deckProvider.removeHero(hero),
                                  child: Container(
                                    width: 20,
                                    height: 20,
                                    decoration: BoxDecoration(
                                      color: Colors.black.withValues(alpha: 0.5),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.close_rounded,
                                      color: Colors.white,
                                      size: 12,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                            .animate(delay: (70 * index).ms)
                            .fadeIn(duration: 220.ms)
                            .slideY(begin: 0.18, end: 0, duration: 220.ms);
                      },
                    ),
                  ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    OutlinedButton.icon(
                      onPressed: deck.isEmpty ? null : deckProvider.clear,
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Reset'),
                    ),
                    FilledButton.icon(
                      onPressed: deck.length == DeckProvider.maxDeckSize
                          ? () => _saveDeckWithName(context, deckProvider)
                          : null,
                      icon: const Icon(Icons.save_rounded),
                      label: const Text('Save Deck'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Text(
                'Stored Decks',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
              ),
              const Spacer(),
              TextButton.icon(
                onPressed: savedDecks.isEmpty ? null : deckProvider.clearSavedDecks,
                icon: const Icon(Icons.delete_outline_rounded),
                label: const Text('Clear All'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (savedDecks.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: cardBorder),
              ),
              child: const Text(
                'No stored decks yet. Build 5 heroes and tap New Deck to prepare deck-vs-deck battles.',
              ),
            )
          else
            ...savedDecks.map(
              (savedDeck) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: cardBorder),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            savedDeck.name,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${savedDeck.heroes.length} heroes',
                            style: TextStyle(
                              fontSize: 11,
                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 56,
                      width: 260,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: savedDeck.heroes.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 4),
                        itemBuilder: (context, index) {
                          final hero = savedDeck.heroes[index];
                          return ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: HeroPortrait(
                              hero: hero,
                              fit: BoxFit.cover,
                              padding: EdgeInsets.zero,
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Wrap(
                      direction: Axis.vertical,
                      spacing: 2,
                      children: [
                        Tooltip(
                          message: 'Load into draft',
                          child: SizedBox(
                            width: 36,
                            height: 36,
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              onPressed: () {
                                final loaded = deckProvider.loadSavedDeck(savedDeck.id);
                                if (!loaded) {
                                  return;
                                }
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('${savedDeck.name} loaded.')),
                                );
                              },
                              icon: const Icon(Icons.file_download_done_rounded, size: 18),
                            ),
                          ),
                        ),
                        Tooltip(
                          message: 'Battle with this deck',
                          child: SizedBox(
                            width: 36,
                            height: 36,
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              onPressed: () => Navigator.pushNamed(
                                context,
                                RouteNames.deckBattle,
                                arguments: savedDeck,
                              ),
                              icon: const Icon(Icons.flash_on_rounded, size: 18),
                            ),
                          ),
                        ),
                        Tooltip(
                          message: 'Delete',
                          child: SizedBox(
                            width: 36,
                            height: 36,
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              onPressed: () => deckProvider.deleteSavedDeck(savedDeck.id),
                              icon: const Icon(Icons.delete_outline_rounded, size: 18),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 220.ms).slideY(begin: 0.1, end: 0),
            ),
        ],
      ),
    );
  }
}
