import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../theme/cyber_theme.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'DECK BUILDER',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              letterSpacing: 2,
              fontSize: 16,
              color: cs.onSurface,
            ),
          ),
          bottom: TabBar(
            tabs: const [
              Tab(icon: Icon(Icons.style_rounded), text: 'Current Deck'),
              Tab(icon: Icon(Icons.save_rounded), text: 'Saved Decks'),
            ],
            indicatorWeight: 3,
            labelStyle:
                const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          ),
          actions: [
            Consumer<DeckProvider>(
              builder: (_, deck, child) => IconButton(
                icon: Icon(Icons.delete_sweep_rounded,
                    color: deck.deckSize == 0
                        ? cs.onSurface.withValues(alpha: 0.2)
                        : cs.error),
                tooltip: 'Clear Deck',
                onPressed: deck.deckSize == 0
                    ? null
                    : () {
                        deck.clearDeck();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Deck cleared')),
                        );
                      },
              ),
            ),
          ],
        ),
        body: const TabBarView(
          children: [
            _CurrentDeckTab(),
            _SavedDecksTab(),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Tab 1 – Current Deck
// ─────────────────────────────────────────────────────────

class _CurrentDeckTab extends StatelessWidget {
  const _CurrentDeckTab();

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Consumer<DeckProvider>(
      builder: (context, deck, _) {
        if (deck.deck.isEmpty) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: cs.primaryContainer.withValues(alpha: 0.3),
                  ),
                  child: Icon(Icons.style_outlined,
                      size: 44, color: cs.primary.withValues(alpha: 0.4)),
                ),
                const SizedBox(height: 20),
                Text(
                  'Your deck is empty',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: cs.onSurface.withValues(alpha: 0.6),
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Search for heroes and add them!',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.35),
                      ),
                ),
              ],
            ),
          );
        }

        return Column(
          children: [
            // Header row with count + save button
            Container(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: cs.primary.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${deck.deckSize} / ${DeckProvider.maxDeckSize}',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: cs.primary,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'heroes',
                        style: TextStyle(
                          color: cs.onSurface.withValues(alpha: 0.5),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: () => _showSaveDialog(context, deck),
                    icon: const Icon(Icons.save_rounded, size: 18),
                    label: const Text('Save Deck'),
                  ),
                ],
              ),
            ),

            // Hero list
            Expanded(
              child: ListView.builder(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                itemCount: deck.deck.length,
                itemBuilder: (_, i) {
                  final hero = deck.deck[i];
                  return _DeckHeroTile(
                    hero: hero,
                    onRemove: () => deck.removeHero(hero.id),
                    onBattle: () => Navigator.pushNamed(
                      context,
                      RouteNames.battle,
                      arguments: hero,
                    ),
                  )
                      .animate()
                      .fadeIn(
                          duration: 300.ms,
                          delay: Duration(milliseconds: i * 80))
                      .slideX(begin: -0.04);
                },
              ),
            ),
          ],
        );
      },
    );
  }

  void _showSaveDialog(BuildContext context, DeckProvider deck) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Save Deck'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Deck name',
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          FilledButton(
            onPressed: () async {
              final name = controller.text.trim();
              if (name.isEmpty) return;
              await deck.saveDeck(name);
              if (ctx.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(deck.message)),
                );
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Deck hero list tile
// ─────────────────────────────────────────────────────────

class _DeckHeroTile extends StatelessWidget {
  final HeroModel hero;
  final VoidCallback onRemove;
  final VoidCallback onBattle;

  const _DeckHeroTile({
    required this.hero,
    required this.onRemove,
    required this.onBattle,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 5),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: hero.imageUrl.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: hero.imageUrl,
                      width: 50,
                      height: 62,
                      fit: BoxFit.cover,
                      errorWidget: (x, y, z) => Container(
                        width: 50,
                        height: 62,
                        color: cs.surfaceContainerHighest,
                        child: const Icon(Icons.person_rounded),
                      ),
                    )
                  : Container(
                      width: 50,
                      height: 62,
                      color: cs.surfaceContainerHighest,
                      child: const Icon(Icons.person_rounded),
                    ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(hero.name,
                      style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      _MiniTag(
                        label: 'HP ${hero.hp}',
                        color: CyberColors.hp,
                      ),
                      const SizedBox(width: 6),
                      _MiniTag(
                        label: 'ATK ${hero.attack}',
                        color: CyberColors.attack,
                      ),
                      const SizedBox(width: 6),
                      _MiniTag(
                        label: 'DEF ${hero.defense}',
                        color: CyberColors.defense,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            IconButton(
              icon: Icon(Icons.sports_mma_rounded, color: cs.primary, size: 22),
              tooltip: 'Battle',
              onPressed: onBattle,
            ),
            IconButton(
              icon: Icon(Icons.remove_circle_outline_rounded,
                  color: cs.error, size: 22),
              tooltip: 'Remove',
              onPressed: onRemove,
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniTag extends StatelessWidget {
  final String label;
  final Color color;
  const _MiniTag({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: color,
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Tab 2 – Saved Decks
// ─────────────────────────────────────────────────────────

class _SavedDecksTab extends StatefulWidget {
  const _SavedDecksTab();
  @override
  State<_SavedDecksTab> createState() => _SavedDecksTabState();
}

class _SavedDecksTabState extends State<_SavedDecksTab> {
  late Future<List<Map<String, dynamic>>> _decksFuture;

  @override
  void initState() {
    super.initState();
    _refreshDecks();
  }

  void _refreshDecks() {
    _decksFuture = context.read<DeckProvider>().loadSavedDecks();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return FutureBuilder<List<Map<String, dynamic>>>(
      future: _decksFuture,
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return Center(
              child:
                  CircularProgressIndicator(strokeWidth: 3, color: cs.primary));
        }
        if (snap.hasError) {
          return Center(
              child: Text('Error loading decks: ${snap.error}',
                  style:
                      TextStyle(color: cs.onSurface.withValues(alpha: 0.6))));
        }
        final decks = snap.data ?? [];
        if (decks.isEmpty) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: cs.primaryContainer.withValues(alpha: 0.3),
                  ),
                  child: Icon(Icons.save_outlined,
                      size: 38, color: cs.primary.withValues(alpha: 0.4)),
                ),
                const SizedBox(height: 16),
                Text(
                  'No saved decks yet',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: cs.onSurface.withValues(alpha: 0.6),
                      ),
                ),
              ],
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: decks.length,
          itemBuilder: (_, i) {
            final d = decks[i];
            return Card(
              margin: const EdgeInsets.symmetric(vertical: 4),
              child: ListTile(
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                leading: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: cs.primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(Icons.style_rounded,
                      color: cs.primary, size: 20),
                ),
                title: Text(d['name'] as String,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text(
                  _formatDate(d['createdAt'] as String),
                  style: TextStyle(
                    fontSize: 12,
                    color: cs.onSurface.withValues(alpha: 0.4),
                  ),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: Icon(Icons.download_rounded,
                          color: cs.primary, size: 22),
                      tooltip: 'Load Deck',
                      onPressed: () async {
                        final deck = context.read<DeckProvider>();
                        await deck.restoreDeck(d['id'] as int);
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(deck.message)),
                          );
                        }
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.delete_rounded,
                          color: cs.error, size: 22),
                      tooltip: 'Delete',
                      onPressed: () async {
                        await context
                            .read<DeckProvider>()
                            .deleteSavedDeck(d['id'] as int);
                        setState(() => _refreshDecks());
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso);
      return '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}
