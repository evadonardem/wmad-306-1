import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/providers/hero_search_provider.dart';
import 'package:hero_battle/router/app_router.dart';
import 'package:hero_battle/services/prefs_service.dart';
import 'package:hero_battle/services/superhero_api_service.dart';
import 'package:hero_battle/widgets/hero_card.dart';

class DeckBuilderScreen extends StatefulWidget {
  const DeckBuilderScreen({super.key});

  @override
  State<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends State<DeckBuilderScreen> {
  static const int _maxDeckSize = DeckProvider.maxDeckSize;

  final TextEditingController _searchController = TextEditingController();
  final PrefsService _prefsService = PrefsService();
  final SuperheroApiService _heroService = SuperheroApiService();

  Future<List<HeroModel>>? _collectionFuture;
  final List<int?> _slotOrder = <int?>[];

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final lastSearch = await _prefsService.loadLastSearch();
    if (!mounted) return;

    _searchController.text = lastSearch;
    context.read<HeroSearchProvider>().setQuery(lastSearch);
    setState(() {
      _collectionFuture = _heroService.fetchHeroes(query: lastSearch);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _submitSearch(String value) async {
    final query = value.trim();
    await _prefsService.saveLastSearch(query);
    if (!mounted) return;

    context.read<HeroSearchProvider>().setQuery(query);
    setState(() {
      _collectionFuture = _heroService.fetchHeroes(query: query);
    });
  }

  Future<void> _showSaveDialog(BuildContext context, DeckProvider deck, List<HeroModel> ordered) async {
    final controller = TextEditingController();

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Save Deck'),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(hintText: 'Deck name'),
            autofocus: true,
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                final name = controller.text.trim();
                if (name.isEmpty || ordered.isEmpty) {
                  return;
                }

                await deck.saveDeck(name);
                if (!dialogContext.mounted) return;
                Navigator.pop(dialogContext);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Deck saved! ✓')),
                );
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _syncSlots(List<HeroModel> deck) {
    final deckIds = deck.take(_maxDeckSize).map((h) => h.id).toList(growable: false);
    final preserved = _slotOrder
        .whereType<int>()
        .where((id) => deckIds.contains(id))
        .toList(growable: true);

    for (final id in deckIds) {
      if (!preserved.contains(id)) {
        preserved.add(id);
      }
    }

    _slotOrder
      ..clear()
      ..addAll(preserved.take(_maxDeckSize));

    while (_slotOrder.length < _maxDeckSize) {
      _slotOrder.add(null);
    }
  }

  List<HeroModel> _orderedDeck(List<HeroModel> deck) {
    final map = {for (final hero in deck) hero.id: hero};
    return _slotOrder
        .map((id) => id == null ? null : map[id])
        .whereType<HeroModel>()
        .toList(growable: false);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              Navigator.pushNamed(context, RouteNames.home);
            }
          },
        ),
        title: const Text('Deck Builder'),
      ),
      backgroundColor: colorScheme.surface,
      body: Stack(
        children: [
          _buildDeckBuilderBackground(context),
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth < 600) {
                return DefaultTabController(
                  length: 2,
                  child: SafeArea(
                    child: Column(
                      children: [
                        const TabBar(
                          tabs: [
                            Tab(text: 'Collection'),
                            Tab(text: 'Your Deck'),
                          ],
                        ),
                        Expanded(
                          child: TabBarView(
                            children: [
                              _buildCollectionPanel(context),
                              _buildDeckPanel(context),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return SafeArea(
                child: Row(
                  children: [
                    Expanded(flex: 3, child: _buildCollectionPanel(context)),
                    VerticalDivider(color: colorScheme.outlineVariant, width: 1),
                    Expanded(flex: 2, child: _buildDeckPanel(context)),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDeckBuilderBackground(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return IgnorePointer(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colorScheme.primaryContainer.withValues(alpha: 0.16),
              colorScheme.surface,
              colorScheme.tertiaryContainer.withValues(alpha: 0.12),
            ],
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              top: -70,
              left: -40,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: colorScheme.primary.withValues(alpha: 0.10),
                ),
              ),
            ),
            Positioned(
              bottom: -90,
              right: -30,
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: colorScheme.tertiary.withValues(alpha: 0.10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCollectionPanel(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerLow,
            border: Border(bottom: BorderSide(color: colorScheme.outlineVariant)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Collection',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _searchController,
                textInputAction: TextInputAction.search,
                onSubmitted: _submitSearch,
                decoration: InputDecoration(
                  hintText: 'Search heroes',
                  prefixIcon: const Icon(Icons.search),
                  filled: true,
                  fillColor: colorScheme.surfaceContainerHighest.withValues(alpha: 0.35),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: FutureBuilder<List<HeroModel>>(
            future: _collectionFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return const Center(child: CircularProgressIndicator());
              }

              final heroes = snapshot.data ?? <HeroModel>[];
              if (heroes.isEmpty) {
                return const Center(child: Text('No heroes found.'));
              }

              return Consumer<DeckProvider>(
                builder: (context, deck, _) {
                  final deckSize = deck.deck.take(_maxDeckSize).length;
                  final deckFull = deckSize >= _maxDeckSize;

                  return GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.72,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                    ),
                    itemCount: heroes.length,
                    itemBuilder: (context, index) {
                      final hero = heroes[index];
                      final inDeck = deck.isInDeck(hero);
                      final canAdd = !inDeck && !deckFull;

                      return Stack(
                        children: [
                          Positioned.fill(
                            child: HeroCard(
                              hero: hero,
                              onTap: () => Navigator.pushNamed(
                                context,
                                RouteNames.heroDetail,
                                arguments: hero,
                              ),
                            ),
                          ),
                          Positioned(
                            right: 8,
                            top: 8,
                            child: IconButton.filled(
                              style: IconButton.styleFrom(
                                backgroundColor: inDeck
                                    ? colorScheme.primary
                                    : canAdd
                                        ? colorScheme.secondary
                                        : colorScheme.surfaceContainerHighest,
                                foregroundColor: inDeck || canAdd
                                    ? colorScheme.onPrimary
                                    : colorScheme.onSurfaceVariant,
                              ),
                              onPressed: inDeck
                                  ? null
                                  : canAdd
                                      ? () {
                                          deck.addHero(hero);
                                          _syncSlots(deck.deck);
                                          setState(() {});
                                        }
                                      : null,
                              icon: Icon(inDeck ? Icons.check : Icons.add),
                            ),
                          ),
                        ],
                      );
                    },
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDeckPanel(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Consumer<DeckProvider>(
      builder: (context, deck, _) {
        _syncSlots(deck.deck);
        final ordered = _orderedDeck(deck.deck);
        final deckSize = ordered.length;
        final isReady = deckSize == _maxDeckSize;

        final badgeColor = deckSize >= 3
            ? colorScheme.primary
            : deckSize > 0
                ? colorScheme.secondary
                : colorScheme.outlineVariant;

        return Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 16, 8, 10),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: colorScheme.outlineVariant)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'Your Deck',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          '$deckSize / $_maxDeckSize',
                          style: theme.textTheme.labelLarge?.copyWith(
                            color: colorScheme.onPrimary,
                          ),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        tooltip: 'Clear Deck',
                        onPressed: ordered.isEmpty
                            ? null
                            : () {
                                deck.clearDeck();
                                _slotOrder
                                  ..clear()
                                  ..addAll(List<int?>.filled(_maxDeckSize, null));
                                setState(() {});
                              },
                        icon: const Icon(Icons.clear_all),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  LinearProgressIndicator(
                    value: deckSize / _maxDeckSize,
                    minHeight: 8,
                    borderRadius: BorderRadius.circular(999),
                    backgroundColor: colorScheme.surfaceContainerHighest,
                  ),
                ],
              ),
            ),
            Expanded(
              child: ReorderableListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _maxDeckSize,
                onReorder: (oldIndex, newIndex) {
                  setState(() {
                    if (newIndex > oldIndex) {
                      newIndex -= 1;
                    }
                    final moved = _slotOrder.removeAt(oldIndex);
                    _slotOrder.insert(newIndex, moved);
                  });
                },
                itemBuilder: (context, index) {
                  final heroId = _slotOrder[index];
                  final hero = heroId == null
                      ? null
                      : deck.deck.where((h) => h.id == heroId).cast<HeroModel?>().firstOrNull;

                  if (hero == null) {
                    return _EmptyDeckSlot(
                      key: ValueKey('empty_$index'),
                      index: index,
                    );
                  }

                  final alignment = _alignmentFor(hero);
                  final accent = switch (alignment) {
                    _HeroAlignment.good => colorScheme.primary,
                    _HeroAlignment.bad => colorScheme.error,
                    _HeroAlignment.neutral => colorScheme.outline,
                  };

                  return Card(
                    key: ValueKey('hero_${hero.id}_$index'),
                    elevation: 1,
                    color: colorScheme.surfaceContainerLow,
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border(left: BorderSide(color: accent, width: 5)),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(
                            imageUrl: hero.imageUrl,
                            width: 60,
                            height: 80,
                            fit: BoxFit.cover,
                            errorWidget: (_, __, ___) => Container(
                              width: 60,
                              height: 80,
                              color: colorScheme.surfaceContainerHighest,
                              child: const Icon(Icons.broken_image_outlined),
                            ),
                          ),
                        ),
                        title: Text(hero.name, maxLines: 1, overflow: TextOverflow.ellipsis),
                        subtitle: Text('ATK ${_attackFor(hero)}  •  HP ${_maxHpFor(hero)}'),
                        trailing: IconButton(
                          icon: Icon(Icons.close, color: colorScheme.error),
                          onPressed: () {
                            deck.removeHero(hero);
                            setState(() {
                              _slotOrder[index] = null;
                            });
                          },
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 14),
              child: Column(
                children: [
                  Text(
                    'Build a full team of $_maxDeckSize heroes to battle.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: ordered.isEmpty
                          ? null
                          : () => _showSaveDialog(context, deck, ordered),
                      child: const Text('Save Deck'),
                    ),
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/saved-decks'),
                      child: const Text('View Saved Decks'),
                    ),
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: isReady
                          ? () => Navigator.pushNamed(
                                context,
                                RouteNames.battle,
                                arguments: ordered,
                              )
                          : null,
                      child: const Text('⚔ Start Battle'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  int _attackFor(HeroModel hero) {
    return ((hero.strength + hero.power + hero.combat) / 3).round();
  }

  int _maxHpFor(HeroModel hero) {
    return 100 + hero.durability ~/ 2;
  }

  _HeroAlignment _alignmentFor(HeroModel hero) {
    final name = hero.name.toLowerCase();
    if (name.contains('superman') ||
        name.contains('captain america') ||
        name.contains('wonder woman') ||
        name.contains('spider-man') ||
        name.contains('batman')) {
      return _HeroAlignment.good;
    }
    if (name.contains('hulk') || name.contains('wolverine')) {
      return _HeroAlignment.neutral;
    }
    return _HeroAlignment.bad;
  }
}

enum _HeroAlignment { good, bad, neutral }

class _EmptyDeckSlot extends StatelessWidget {
  final int index;

  const _EmptyDeckSlot({super.key, required this.index});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      key: key,
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: CustomPaint(
        painter: _DashedBorderPainter(color: colorScheme.outline),
        child: const SizedBox(
          height: 92,
          child: Center(child: Text('Empty')),
        ),
      ),
    );
  }
}

class _DashedBorderPainter extends CustomPainter {
  final Color color;

  const _DashedBorderPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4;

    const dash = 7.0;
    const gap = 5.0;

    void drawDashedLine(Offset start, Offset end) {
      final total = (end - start).distance;
      final direction = (end - start) / total;
      double drawn = 0;
      while (drawn < total) {
        final s = start + direction * drawn;
        final e = start + direction * (drawn + dash).clamp(0, total);
        canvas.drawLine(s, e, paint);
        drawn += dash + gap;
      }
    }

    drawDashedLine(const Offset(0, 0), Offset(size.width, 0));
    drawDashedLine(Offset(size.width, 0), Offset(size.width, size.height));
    drawDashedLine(Offset(size.width, size.height), Offset(0, size.height));
    drawDashedLine(Offset(0, size.height), const Offset(0, 0));
  }

  @override
  bool shouldRepaint(covariant _DashedBorderPainter oldDelegate) {
    return oldDelegate.color != color;
  }
}

extension<T> on Iterable<T> {
  T? get firstOrNull => isEmpty ? null : first;
}