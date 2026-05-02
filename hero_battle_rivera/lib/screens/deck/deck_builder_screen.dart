import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/battle_record.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';

class DeckBuilderScreen extends StatefulWidget {
  const DeckBuilderScreen({super.key});

  @override
  State<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends State<DeckBuilderScreen> {
  late Future<List<_SavedDeckView>> _savedDecksFuture;

  @override
  void initState() {
    super.initState();
    _savedDecksFuture = _loadSavedDecks();
  }

  Future<List<_SavedDeckView>> _loadSavedDecks() async {
    final playerName = context.read<PlayerProvider>().playerName;
    final database = DatabaseService();
    final rows = await database.loadDecks();
    final history = await database.loadHistory();
    final normalizedPlayerName = _normalizePlayerName(playerName);
    final playerHistory = _historyForPlayer(
      records: history,
      normalizedPlayerName: normalizedPlayerName,
    );

    return rows
        .map((row) => _toDeckView(row, playerHistory))
        .toList(growable: false);
  }

  void _refreshSavedDecks() {
    setState(() {
      _savedDecksFuture = _loadSavedDecks();
    });
  }

  List<HeroModel> _decodeHeroes(dynamic rawJson) {
    if (rawJson is! String || rawJson.isEmpty) {
      return const <HeroModel>[];
    }

    try {
      final decoded = jsonDecode(rawJson);
      if (decoded is List) {
        return decoded
            .whereType<Map>()
            .map(Map<String, dynamic>.from)
            .map(HeroModel.fromJson)
            .toList(growable: false);
      }
    } catch (_) {
      return const <HeroModel>[];
    }

    return const <HeroModel>[];
  }

  String _formatCreatedAt(String raw) {
    final parsed = DateTime.tryParse(raw);
    if (parsed == null) {
      return raw;
    }

    final month = parsed.month.toString().padLeft(2, '0');
    final day = parsed.day.toString().padLeft(2, '0');
    final hour = parsed.hour.toString().padLeft(2, '0');
    final minute = parsed.minute.toString().padLeft(2, '0');
    return '${parsed.year}-$month-$day $hour:$minute';
  }

  String _normalizeDeckName(String value) {
    return value.trim().toLowerCase();
  }

  String _normalizePlayerName(String value) {
    return value.trim().toLowerCase();
  }

  bool _isRecordForPlayer(
    BattleRecord record, {
    required String normalizedPlayerName,
  }) {
    if (normalizedPlayerName.isEmpty) {
      return true;
    }

    return _normalizePlayerName(record.playerName) == normalizedPlayerName;
  }

  List<BattleRecord> _historyForPlayer({
    required List<BattleRecord> records,
    required String normalizedPlayerName,
  }) {
    if (normalizedPlayerName.isEmpty) {
      return records;
    }

    final matched = records
        .where(
          (record) => _isRecordForPlayer(
            record,
            normalizedPlayerName: normalizedPlayerName,
          ),
        )
        .toList(growable: false);
    if (matched.isNotEmpty) {
      return matched;
    }

    final legacyUnnamed = records
        .where((record) => _normalizePlayerName(record.playerName).isEmpty)
        .toList(growable: false);
    if (legacyUnnamed.isNotEmpty) {
      return legacyUnnamed;
    }

    // If player name changed, continue showing previously saved battle stats.
    return records;
  }

  List<String> _normalizeHeroNames(Iterable<String> names) {
    final normalized =
        names
            .map((name) => name.trim().toLowerCase())
            .where((name) => name.isNotEmpty)
            .toSet()
            .toList(growable: false)
          ..sort();
    return normalized;
  }

  bool _sameNormalizedList(List<String> left, List<String> right) {
    if (left.length != right.length) {
      return false;
    }

    for (var index = 0; index < left.length; index++) {
      if (left[index] != right[index]) {
        return false;
      }
    }

    return true;
  }

  bool _matchesDeckLegacyIdentity({
    required BattleRecord record,
    required String normalizedDeckName,
    required List<String> normalizedDeckHeroes,
  }) {
    if (_normalizeDeckName(record.playerDeckName) != normalizedDeckName) {
      return false;
    }

    if (normalizedDeckHeroes.isEmpty) {
      return true;
    }

    final normalizedRecordHeroes = _normalizeHeroNames(record.playerDeckHeroes);
    return _sameNormalizedList(normalizedRecordHeroes, normalizedDeckHeroes);
  }

  _SavedDeckView _toDeckView(
    Map<String, dynamic> row,
    List<BattleRecord> history,
  ) {
    final rawDeckId = row['id'];
    final deckId = rawDeckId is int
        ? rawDeckId
        : rawDeckId is num
        ? rawDeckId.toInt()
        : null;
    final name = (row['name'] ?? 'Untitled Deck').toString();
    final heroes = _decodeHeroes(row['heroes']);
    final normalizedName = _normalizeDeckName(name);
    final normalizedDeckHeroes = _normalizeHeroNames(
      heroes.map((hero) => hero.name),
    );

    final recordsForDeck = history
        .where((record) {
          if (deckId != null && record.playerDeckId != null) {
            return record.playerDeckId == deckId;
          }

          if (record.playerDeckId == null) {
            return _matchesDeckLegacyIdentity(
              record: record,
              normalizedDeckName: normalizedName,
              normalizedDeckHeroes: normalizedDeckHeroes,
            );
          }

          return false;
        })
        .toList(growable: false);

    final totalBattles = recordsForDeck.length;
    final wins = recordsForDeck.where((record) => record.isVictory).length;
    final defeats = recordsForDeck.where((record) => record.isDefeat).length;
    final draws = recordsForDeck.where((record) => record.isDraw).length;
    final winRate = totalBattles == 0 ? 0.0 : (wins / totalBattles) * 100;

    return _SavedDeckView(
      id: deckId,
      name: name,
      created: _formatCreatedAt((row['created'] ?? '').toString()),
      heroes: heroes,
      totalBattles: totalBattles,
      wins: wins,
      defeats: defeats,
      draws: draws,
      winRate: winRate,
    );
  }

  Future<void> _openBattleArena() async {
    await Navigator.pushNamed(context, RouteNames.battle);
    if (!mounted) {
      return;
    }

    _refreshSavedDecks();
  }

  Future<void> _openSavedDeckDetails(_SavedDeckView deck) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (sheetContext) {
        return FractionallySizedBox(
          heightFactor: 0.8,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text(
                  deck.name,
                  textAlign: TextAlign.center,
                  style: Theme.of(
                    sheetContext,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                Text(
                  'Win Rate: ${deck.winRateLabel}',
                  textAlign: TextAlign.center,
                  style: Theme.of(
                    sheetContext,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  deck.totalBattles == 0
                      ? 'No battles recorded for this deck yet.'
                      : 'Total Battles: ${deck.totalBattles} (${deck.resultBreakdown})',
                  textAlign: TextAlign.center,
                  style: Theme.of(sheetContext).textTheme.bodySmall,
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: deck.heroes.isEmpty
                      ? const Center(child: Text('No heroes in this deck.'))
                      : GridView.builder(
                          itemCount: deck.heroes.length,
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 10,
                                mainAxisSpacing: 10,
                                childAspectRatio: 0.92,
                              ),
                          itemBuilder: (context, index) {
                            final hero = deck.heroes[index];
                            final imageProvider = hero.imageUrl.isEmpty
                                ? null
                                : NetworkImage(hero.imageUrl) as ImageProvider;

                            return Card(
                              clipBehavior: Clip.antiAlias,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: <Widget>[
                                  Expanded(
                                    child: imageProvider == null
                                        ? const ColoredBox(
                                            color: Color(0xFF1A243B),
                                            child: Center(
                                              child: Icon(
                                                Icons.shield,
                                                color: Colors.white70,
                                              ),
                                            ),
                                          )
                                        : Image(
                                            image: imageProvider,
                                            fit: BoxFit.cover,
                                          ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(8),
                                    child: Text(
                                      hero.name,
                                      textAlign: TextAlign.center,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleSmall
                                          ?.copyWith(
                                            fontWeight: FontWeight.w700,
                                          ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _saveDeck() async {
    final deckProvider = context.read<DeckProvider>();
    final controller = TextEditingController();

    final deckName = await showDialog<String>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Save Deck'),
          content: TextField(
            controller: controller,
            autofocus: true,
            decoration: const InputDecoration(
              labelText: 'Deck Name',
              border: OutlineInputBorder(),
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                final value = controller.text.trim();
                if (value.isEmpty) {
                  return;
                }
                Navigator.pop(dialogContext, value);
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );

    controller.dispose();
    if (deckName == null) {
      return;
    }

    try {
      final savedId = await deckProvider.saveDeckToDb(deckName);
      deckProvider.setReadyBattleDeck(
        name: deckName,
        heroes: deckProvider.deck,
        id: savedId,
      );
      _refreshSavedDecks();

      if (!mounted) {
        return;
      }

      await _showSaveSuccessAnimation(deckName);

      if (!mounted) {
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Deck "$deckName" saved and marked ready to battle.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e) {
      if (!mounted) {
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_saveErrorMessage(e)),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    }
  }

  String _saveErrorMessage(Object error) {
    final raw = error.toString();

    if (raw.contains('sqlite3_initialize')) {
      return 'SQLite failed to load native libraries. Run flutter pub get, then restart the app.';
    }

    return 'Failed to save deck: $raw';
  }

  Future<void> _showSaveSuccessAnimation(String deckName) async {
    await showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Deck Saved',
      barrierColor: Colors.black.withValues(alpha: 0.5),
      transitionDuration: const Duration(milliseconds: 260),
      pageBuilder: (dialogContext, animation, secondaryAnimation) {
        Future<void>.delayed(const Duration(milliseconds: 1250), () {
          if (dialogContext.mounted) {
            Navigator.of(dialogContext).maybePop();
          }
        });

        final theme = Theme.of(dialogContext);

        return SafeArea(
          child: Center(
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0.84, end: 1),
              duration: const Duration(milliseconds: 520),
              curve: Curves.elasticOut,
              builder: (context, scale, child) {
                return Transform.scale(scale: scale, child: child);
              },
              child: Container(
                constraints: const BoxConstraints(maxWidth: 360),
                margin: const EdgeInsets.symmetric(horizontal: 24),
                padding: const EdgeInsets.fromLTRB(22, 20, 22, 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: theme.colorScheme.surface,
                  border: Border.all(
                    color: theme.colorScheme.primary.withValues(alpha: 0.3),
                  ),
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      color: theme.colorScheme.primary.withValues(alpha: 0.22),
                      blurRadius: 28,
                      spreadRadius: 0.4,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    TweenAnimationBuilder<double>(
                      tween: Tween<double>(begin: 0, end: 1),
                      duration: const Duration(milliseconds: 560),
                      curve: Curves.easeOutBack,
                      builder: (context, value, child) {
                        return Transform.scale(scale: value, child: child);
                      },
                      child: const Icon(
                        Icons.check_circle_rounded,
                        size: 64,
                        color: Color(0xFF22C55E),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Deck Saved!',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '"$deckName" is now in Saved Decks.',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: CurvedAnimation(parent: animation, curve: Curves.easeOut),
          child: child,
        );
      },
    );
  }

  Future<void> _deleteDeck(_SavedDeckView deck) async {
    final id = deck.id;
    if (id == null) {
      return;
    }

    await DatabaseService().deleteDeck(id);
    if (!mounted) {
      return;
    }

    final deckProvider = context.read<DeckProvider>();
    if (deckProvider.isReadyDeckSelected(id)) {
      deckProvider.clearReadyBattleDeck();
    }

    _refreshSavedDecks();
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Saved deck deleted.')));
  }

  Future<void> _confirmDeleteDeck(_SavedDeckView deck) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Delete Saved Deck'),
          content: Text('Delete "${deck.name}" from Saved Decks?'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (confirmed == true) {
      await _deleteDeck(deck);
    }
  }

  Future<void> _setReadyDeck(
    _SavedDeckView deck, {
    bool navigateToBattle = false,
  }) async {
    if (deck.heroes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This saved deck has no heroes.')),
      );
      return;
    }

    final deckProvider = context.read<DeckProvider>();
    deckProvider.setReadyBattleDeck(
      name: deck.name,
      heroes: deck.heroes,
      id: deck.id,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('"${deck.name}" is now ready for battle.')),
    );

    if (navigateToBattle) {
      await _openBattleArena();
    }
  }

  Widget _buildUnsavedDraftSection(DeckProvider deckProvider) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Center(
              child: Text(
                'Picked Heroes',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
              ),
            ),
            const SizedBox(height: 2),
            Center(
              child: Text(
                'Unsaved Draft',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            const SizedBox(height: 10),
            if (deckProvider.count == 0)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Text(
                  'No picked heroes yet. Add heroes from the roster.',
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: deckProvider.deck.length,
                separatorBuilder: (_, index) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final hero = deckProvider.deck[index];
                  final imageProvider = hero.imageUrl.isEmpty
                      ? null
                      : NetworkImage(hero.imageUrl) as ImageProvider;

                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundImage: imageProvider,
                      child: imageProvider == null
                          ? const Icon(Icons.shield)
                          : null,
                    ),
                    title: Text(hero.name),
                    subtitle: Text(
                      'ATK ${hero.attackPower} | HP ${hero.baseHp}',
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () => deckProvider.removeHero(hero),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSavedDecksSection(DeckProvider deckProvider) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Center(
              child: Text(
                'Saved Decks',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
              ),
            ),
            const SizedBox(height: 2),
            Center(
              child: Text(
                'Ready To Battle',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            const SizedBox(height: 10),
            FutureBuilder<List<_SavedDeckView>>(
              future: _savedDecksFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }

                if (snapshot.hasError) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text('Error loading saved decks: ${snapshot.error}'),
                      const SizedBox(height: 10),
                      OutlinedButton.icon(
                        onPressed: _refreshSavedDecks,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Retry'),
                      ),
                    ],
                  );
                }

                final decks = snapshot.data ?? const <_SavedDeckView>[];
                if (decks.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Text(
                      'No saved decks yet. Save a picked deck first.',
                    ),
                  );
                }

                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: decks.length,
                  separatorBuilder: (_, index) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final deck = decks[index];
                    final isSelected = deckProvider.isReadyDeckSelected(
                      deck.id,
                    );
                    final borderColor = isSelected
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.outlineVariant;

                    return Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () => _openSavedDeckDetails(deck),
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: borderColor),
                            color: isSelected
                                ? Theme.of(context).colorScheme.primaryContainer
                                      .withValues(alpha: 0.3)
                                : Colors.transparent,
                          ),
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: <Widget>[
                              SizedBox(
                                height: 138,
                                child: Stack(
                                  children: <Widget>[
                                    Positioned.fill(
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child: _DeckMembersMosaic(
                                          heroes: deck.heroes,
                                        ),
                                      ),
                                    ),
                                    if (isSelected)
                                      Positioned(
                                        top: 8,
                                        left: 8,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(
                                              999,
                                            ),
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary
                                                .withValues(alpha: 0.15),
                                          ),
                                          child: Text(
                                            'READY',
                                            style: Theme.of(context)
                                                .textTheme
                                                .labelSmall
                                                ?.copyWith(
                                                  color: Theme.of(
                                                    context,
                                                  ).colorScheme.primary,
                                                  fontWeight: FontWeight.w900,
                                                  letterSpacing: 0.6,
                                                ),
                                          ),
                                        ),
                                      ),
                                    Positioned(
                                      top: 4,
                                      right: 4,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: Colors.black.withValues(
                                            alpha: 0.3,
                                          ),
                                          shape: BoxShape.circle,
                                        ),
                                        child: IconButton(
                                          icon: const Icon(
                                            Icons.delete_outline,
                                            color: Colors.white,
                                          ),
                                          onPressed: () =>
                                              _confirmDeleteDeck(deck),
                                          tooltip: 'Delete saved deck',
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                deck.name,
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.titleMedium
                                    ?.copyWith(fontWeight: FontWeight.w800),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Win Rate: ${deck.winRateLabel}',
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.bodySmall
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Heroes: ${deck.heroes.length} | Saved: ${deck.created}',
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                              const SizedBox(height: 10),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                alignment: WrapAlignment.center,
                                children: <Widget>[
                                  FilledButton.tonalIcon(
                                    onPressed: () => _setReadyDeck(deck),
                                    icon: const Icon(
                                      Icons.check_circle_outline,
                                    ),
                                    label: Text(
                                      isSelected ? 'Selected' : 'Set Ready',
                                    ),
                                  ),
                                  FilledButton.icon(
                                    onPressed: () => _setReadyDeck(
                                      deck,
                                      navigateToBattle: true,
                                    ),
                                    icon: const Icon(Icons.sports_martial_arts),
                                    label: const Text('Battle'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Deck Builder (${deckProvider.count}/${DeckProvider.maxDeckSize})',
        ),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshSavedDecks,
            tooltip: 'Refresh saved decks',
          ),
          if (deckProvider.count > 0)
            IconButton(
              icon: const Icon(Icons.save_outlined),
              onPressed: _saveDeck,
              tooltip: 'Save picked heroes as a deck',
            ),
          if (deckProvider.count > 0)
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              onPressed: deckProvider.clearDeck,
              tooltip: 'Clear picked heroes',
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: <Widget>[
          Card(
            child: ListTile(
              leading: Icon(
                deckProvider.hasReadyBattleDeck
                    ? Icons.verified
                    : Icons.pending_actions,
              ),
              title: Text(
                deckProvider.hasReadyBattleDeck
                    ? 'Ready Deck: ${deckProvider.readyBattleDeckName ?? 'Saved Deck'}'
                    : 'No ready deck selected',
              ),
              subtitle: Text(
                deckProvider.hasReadyBattleDeck
                    ? '${deckProvider.readyBattleDeckSize} cards will be used in battle.'
                    : 'Pick one from Section 2 to enable Start Battle.',
              ),
            ),
          ),
          const SizedBox(height: 10),
          _buildUnsavedDraftSection(deckProvider),
          const SizedBox(height: 10),
          _buildSavedDecksSection(deckProvider),
          const SizedBox(height: 90),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: deckProvider.hasReadyBattleDeck
            ? _openBattleArena
            : null,
        icon: const Icon(Icons.sports_martial_arts),
        label: const Text('Start Battle'),
      ),
    );
  }
}

class _SavedDeckView {
  const _SavedDeckView({
    required this.id,
    required this.name,
    required this.created,
    required this.heroes,
    required this.totalBattles,
    required this.wins,
    required this.defeats,
    required this.draws,
    required this.winRate,
  });

  final int? id;
  final String name;
  final String created;
  final List<HeroModel> heroes;
  final int totalBattles;
  final int wins;
  final int defeats;
  final int draws;
  final double winRate;

  String get _formattedWinRate {
    final fixed = winRate.toStringAsFixed(1);
    return fixed.endsWith('.0') ? fixed.substring(0, fixed.length - 2) : fixed;
  }

  String get winRateLabel {
    if (totalBattles == 0) {
      return '0% ($wins Wins / $totalBattles Battles)';
    }

    return '$_formattedWinRate% ($wins Wins / $totalBattles Battles)';
  }

  String get resultBreakdown {
    return 'Wins: $wins • Defeats: $defeats • Draws: $draws';
  }

  String get memberLine {
    if (heroes.isEmpty) {
      return 'No heroes';
    }

    return heroes.map((hero) => hero.name).join(', ');
  }
}

class _DeckMembersMosaic extends StatelessWidget {
  const _DeckMembersMosaic({required this.heroes});

  final List<HeroModel> heroes;

  @override
  Widget build(BuildContext context) {
    if (heroes.isEmpty) {
      return const ColoredBox(
        color: Color(0xFF1A243B),
        child: Center(
          child: Icon(Icons.shield, color: Colors.white70, size: 28),
        ),
      );
    }

    final visibleHeroes = heroes.take(4).toList(growable: false);

    return Stack(
      children: <Widget>[
        GridView.builder(
          padding: EdgeInsets.zero,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: visibleHeroes.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 2,
            mainAxisSpacing: 2,
          ),
          itemBuilder: (context, index) {
            final hero = visibleHeroes[index];
            final imageProvider = hero.imageUrl.isEmpty
                ? null
                : NetworkImage(hero.imageUrl) as ImageProvider;

            if (imageProvider == null) {
              return const ColoredBox(
                color: Color(0xFF23345B),
                child: Center(child: Icon(Icons.shield, color: Colors.white70)),
              );
            }

            return Image(image: imageProvider, fit: BoxFit.cover);
          },
        ),
        if (heroes.length > 4)
          Positioned(
            right: 6,
            bottom: 6,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(999),
                color: Colors.black.withValues(alpha: 0.62),
              ),
              child: Text(
                '+${heroes.length - 4}',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
