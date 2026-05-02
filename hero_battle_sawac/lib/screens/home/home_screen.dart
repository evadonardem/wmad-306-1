import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/hero_card.dart';
import '../../widgets/hero_portrait.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  late FocusNode _searchFocus;
  bool _showDeckComposer = false;
  bool _searchExpanded = false;

  @override
  void initState() {
    super.initState();
    _searchFocus = FocusNode();
    _searchFocus.addListener(_onSearchFocusChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HeroSearchProvider>().loadCatalog();
    });
  }

  void _onSearchFocusChanged() {
    if (_searchFocus.hasFocus && !_searchExpanded) {
      setState(() {
        _searchExpanded = true;
      });
    }
  }

  void _expandSearchPanel() {
    if (_searchExpanded) {
      _searchFocus.requestFocus();
      return;
    }

    setState(() {
      _searchExpanded = true;
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _searchFocus.requestFocus();
      }
    });
  }

  void _collapseSearchPanel() {
    _searchFocus.unfocus();
    if (!_searchExpanded) {
      return;
    }
    setState(() {
      _searchExpanded = false;
    });
  }

  Future<void> _saveDeckWithName(BuildContext context, DeckProvider deckProvider) async {
    if (deckProvider.count != DeckProvider.maxDeckSize) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Complete a 5-hero deck before saving.'),
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
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Name New Deck'),
              content: TextField(
                controller: controller,
                autofocus: true,
                maxLength: 28,
                decoration: InputDecoration(
                  labelText: 'Deck name',
                  hintText: 'Ex: Shadow Vanguard',
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
            );
          },
        );
      },
    );

    controller.dispose();
    return result;
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocus.removeListener(_onSearchFocusChanged);
    _searchFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final searchProvider = context.watch<HeroSearchProvider>();
    final deckProvider = context.watch<DeckProvider>();
    final playerProvider = context.watch<PlayerProvider>();
    final heroes = searchProvider.results;
    final playerName = playerProvider.playerName.trim().isEmpty
      ? 'Hero'
      : playerProvider.playerName.trim();
    final backgroundColors = isDark
      ? const [Color(0xFF111827), Color(0xFF0F172A), Color(0xFF0B1120)]
      : const [Color(0xFFF8F2E8), Color(0xFFFFFCF8), Color(0xFFF0E4D4)];
    final headerText = isDark ? const Color(0xFFE5E7EB) : const Color(0xFF18212F);
    final subText = isDark ? const Color(0xFF9CA3AF) : const Color(0xFF64748B);
    final panelBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);
    final controlColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFF2E8DA);
    final deckBottomPadding = _showDeckComposer ? 250.0 : 20.0;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: backgroundColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                playerName,
                                style: theme.textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w900,
                                  color: headerText,
                                ),
                              ),
                              Text(
                                'Welcome back, $playerName. Search. Filter. Assemble your legends.',
                                style: theme.textTheme.bodyMedium?.copyWith(color: subText),
                              ),
                            ],
                          ),
                        ),
                        InkWell(
                          borderRadius: BorderRadius.circular(14),
                          onTap: () {
                            setState(() => _showDeckComposer = !_showDeckComposer);
                          },
                          child: Ink(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: controlColor,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: panelBorder),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  _showDeckComposer ? Icons.close : Icons.add_rounded,
                                  color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                                  size: 18,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Deck ${deckProvider.count}/${DeckProvider.maxDeckSize}',
                                  style: TextStyle(
                                    color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          tooltip: 'Deck Builder',
                          onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                          icon: const Icon(Icons.inventory_2_rounded),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          onPressed: () => Navigator.pushNamed(context, RouteNames.history),
                          icon: const Icon(Icons.history_edu_rounded),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
                          icon: const Icon(Icons.person_rounded),
                        ),
                      ],
                    ),
                  ),
                  _SearchPanel(
                    controller: _searchController,
                    focusNode: _searchFocus,
                    isExpanded: _searchExpanded,
                    onExpandRequested: _expandSearchPanel,
                    onCollapseRequested: _collapseSearchPanel,
                  ),
                  Expanded(
                    child: GestureDetector(
                      behavior: HitTestBehavior.translucent,
                      onTap: _searchExpanded ? _collapseSearchPanel : null,
                      child: Builder(
                        builder: (context) {
                          if (searchProvider.isLoading && !searchProvider.isCatalogLoaded) {
                            return const Center(child: CircularProgressIndicator());
                          }

                          if (searchProvider.error != null) {
                            return _StateCard(
                              title: 'Failed to fetch heroes',
                              subtitle: searchProvider.error!,
                              icon: Icons.wifi_off_rounded,
                            );
                          }

                          if (heroes.isEmpty) {
                            return const _StateCard(
                              title: 'No matches found',
                              subtitle: 'Adjust filters or try another hero name.',
                              icon: Icons.filter_alt_off_rounded,
                            );
                          }

                          return LayoutBuilder(
                            builder: (context, constraints) {
                              final width = constraints.maxWidth;
                              final crossAxisCount = width >= 1200
                                  ? 4
                                  : width >= 900
                                      ? 3
                                      : width >= 620
                                          ? 2
                                          : 1;

                              return GridView.builder(
                                padding: EdgeInsets.fromLTRB(16, 10, 16, deckBottomPadding),
                                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: crossAxisCount,
                                  crossAxisSpacing: 12,
                                  mainAxisSpacing: 12,
                                  childAspectRatio: 0.74,
                                ),
                                itemCount: heroes.length,
                                itemBuilder: (context, index) {
                                  final hero = heroes[index];
                                  final inDeck = deckProvider.isInDeck(hero);
                                  return HeroCard(
                                    hero: hero,
                                    isInDeck: inDeck,
                                    onTap: () {
                                      Navigator.pushNamed(
                                        context,
                                        RouteNames.heroDetail,
                                        arguments: hero,
                                      );
                                    },
                                    onToggleDeck: () {
                                      if (inDeck) {
                                        deckProvider.removeHero(hero);
                                      } else {
                                        final added = deckProvider.addHero(hero);
                                        if (added) {
                                          setState(() => _showDeckComposer = true);
                                        } else {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                'Deck is full or hero is already added.',
                                              ),
                                            ),
                                          );
                                        }
                                      }
                                    },
                                  )
                                      .animate(delay: (80 * index).ms)
                                      .fadeIn(duration: 280.ms)
                                      .slideY(begin: 0.12, end: 0, duration: 280.ms);
                                },
                              );
                            },
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
              _DeckComposerPanel(
                isOpen: _showDeckComposer,
                deckProvider: deckProvider,
                onClose: () => setState(() => _showDeckComposer = false),
                onSaveDeck: () => _saveDeckWithName(context, deckProvider),
                onOpenDeckBuilder: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DeckComposerPanel extends StatelessWidget {
  const _DeckComposerPanel({
    required this.isOpen,
    required this.deckProvider,
    required this.onClose,
    required this.onSaveDeck,
    required this.onOpenDeckBuilder,
  });

  final bool isOpen;
  final DeckProvider deckProvider;
  final VoidCallback onClose;
  final VoidCallback onSaveDeck;
  final VoidCallback onOpenDeckBuilder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final deck = deckProvider.deck;
    final panelColor = isDark ? const Color(0xFF0B1322) : const Color(0xFFFFFAF2);
    final panelBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);

    return Align(
      alignment: Alignment.bottomCenter,
      child: IgnorePointer(
        ignoring: !isOpen,
        child: AnimatedOpacity(
          opacity: isOpen ? 1 : 0,
          duration: const Duration(milliseconds: 240),
          child: AnimatedSlide(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOutCubic,
            offset: isOpen ? Offset.zero : const Offset(0, 0.4),
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              decoration: BoxDecoration(
                color: panelColor.withValues(alpha: 0.95),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: panelBorder),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.28 : 0.12),
                    blurRadius: 24,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Text(
                        'Deck Composer',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFEADBC7),
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(
                          '${deck.length}/${DeckProvider.maxDeckSize}',
                          style: TextStyle(
                            color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: onClose,
                        icon: const Icon(Icons.keyboard_arrow_down_rounded),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  if (deck.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF111827) : const Color(0xFFF3E8D8),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Text(
                        'Tap + Deck on hero cards and complete 5 heroes to create a new named deck.',
                        textAlign: TextAlign.center,
                      ),
                    )
                  else
                    SizedBox(
                      height: 76,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: deck.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final hero = deck[index];
                          return _DeckHeroTile(
                            hero: hero,
                            onRemove: () => deckProvider.removeHero(hero),
                          )
                              .animate(delay: (70 * index).ms)
                              .fadeIn(duration: 220.ms)
                              .slideX(begin: 0.16, end: 0, duration: 220.ms);
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
                        icon: const Icon(Icons.restart_alt_rounded),
                        label: const Text('Reset'),
                      ),
                      FilledButton.icon(
                        onPressed: deck.length == DeckProvider.maxDeckSize ? onSaveDeck : null,
                        icon: const Icon(Icons.save_rounded),
                        label: const Text('Save Deck'),
                      ),
                      FilledButton.tonalIcon(
                        onPressed: onOpenDeckBuilder,
                        icon: const Icon(Icons.view_carousel_rounded),
                        label: const Text('Deck Builder'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DeckHeroTile extends StatelessWidget {
  const _DeckHeroTile({required this.hero, required this.onRemove});

  final HeroModel hero;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: 68,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF111827) : const Color(0xFFF4EBDD),
        borderRadius: BorderRadius.circular(12),
      ),
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
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(4, 3, 4, 3),
                child: Text(
                  hero.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          Positioned(
            right: 2,
            top: 2,
            child: InkWell(
              onTap: onRemove,
              borderRadius: BorderRadius.circular(99),
              child: Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.56),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close_rounded, size: 12, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SearchPanel extends StatelessWidget {
  const _SearchPanel({
    required this.controller,
    required this.focusNode,
    required this.isExpanded,
    required this.onExpandRequested,
    required this.onCollapseRequested,
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final bool isExpanded;
  final VoidCallback onExpandRequested;
  final VoidCallback onCollapseRequested;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<HeroSearchProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final panelColor = isDark
        ? const Color(0xFF0F172A).withValues(alpha: 0.85)
        : const Color(0xFFFFFBF5).withValues(alpha: 0.96);
    final panelBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOutCubic,
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      padding: EdgeInsets.all(isExpanded ? 12 : 0),
      decoration: BoxDecoration(
        color: panelColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isExpanded ? panelBorder : Colors.transparent),
      ),
      child: isExpanded
          ? Column(
              children: [
                TextField(
                  controller: controller,
                  focusNode: focusNode,
                  style: TextStyle(color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1F2937)),
                  decoration: InputDecoration(
                    hintText: 'Search hero by name',
                    hintStyle: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF94A3A8)),
                    prefixIcon: Icon(Icons.search, color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B)),
                    suffixIcon: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (controller.text.isNotEmpty)
                          IconButton(
                            onPressed: () {
                              controller.clear();
                              context.read<HeroSearchProvider>().setQuery('');
                            },
                            icon: Icon(Icons.clear, color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B)),
                          ),
                        IconButton(
                          tooltip: 'Collapse search',
                          onPressed: onCollapseRequested,
                          icon: Icon(
                            Icons.keyboard_arrow_up_rounded,
                            color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: context.read<HeroSearchProvider>().setQuery,
                    onSubmitted: (_) => context.read<HeroSearchProvider>().searchNow(),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      _DarkDropdown<String>(
                        label: 'Alignment',
                        value: provider.alignment,
                        items: const ['all', 'good', 'bad', 'neutral'],
                        onChanged: (v) {
                          if (v != null) {
                            context.read<HeroSearchProvider>().setAlignment(v);
                          }
                        },
                      ),
                      _DarkDropdown<String>(
                        label: 'Publisher',
                        value: provider.publishers.contains(provider.publisher)
                    ? provider.publisher
                    : 'all',
                items: provider.publishers,
                onChanged: (v) {
                  if (v != null) {
                    context.read<HeroSearchProvider>().setPublisher(v);
                  }
                },
              ),
              _DarkDropdown<HeroSortMode>(
                label: 'Sort',
                value: provider.sortMode,
                items: const [
                  HeroSortMode.nameAsc,
                  HeroSortMode.overallPowerDesc,
                  HeroSortMode.intelligenceDesc,
                ],
                itemBuilder: (mode) => switch (mode) {
                  HeroSortMode.nameAsc => 'Name',
                  HeroSortMode.overallPowerDesc => 'Power',
                  HeroSortMode.intelligenceDesc => 'Intelligence',
                },
                onChanged: (v) {
                  if (v != null) {
                    context.read<HeroSearchProvider>().setSortMode(v);
                  }
                },
              ),
              SizedBox(
                width: 180,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Min power: ${provider.minPower}',
                      style: TextStyle(
                        color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Slider(
                      value: provider.minPower.toDouble(),
                      min: 0,
                      max: 100,
                      divisions: 20,
                      onChanged: (value) {
                        context.read<HeroSearchProvider>().setMinPower(value.round());
                      },
                    ),
                  ],
                ),
              ),
              TextButton.icon(
                onPressed: () {
                  controller.clear();
                  context.read<HeroSearchProvider>().setQuery('');
                  context.read<HeroSearchProvider>().resetFilters();
                },
                icon: Icon(Icons.refresh, color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF475569)),
                label: Text(
                  'Reset',
                  style: TextStyle(color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF475569)),
                ),
              ),
                    ],
                  ),
                ],
              )
          : InkWell(
              onTap: onExpandRequested,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                child: Row(
                  children: [
                    Icon(Icons.search, color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B), size: 20),
                    const SizedBox(width: 10),
                    Text(
                      'Search hero by name',
                      style: TextStyle(
                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF94A3A8),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _DarkDropdown<T> extends StatelessWidget {
  const _DarkDropdown({
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    this.itemBuilder,
  });

  final String label;
  final T value;
  final List<T> items;
  final ValueChanged<T?> onChanged;
  final String Function(T value)? itemBuilder;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF4EBDD),
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButton<T>(
        value: value,
        underline: const SizedBox.shrink(),
        dropdownColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFFFFCF8),
        style: TextStyle(
          color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF1F2937),
          fontWeight: FontWeight.w600,
        ),
        onChanged: onChanged,
        items: items
            .map(
              (item) => DropdownMenuItem<T>(
                value: item,
                child: Text('$label: ${itemBuilder?.call(item) ?? item.toString()}'),
              ),
            )
            .toList(),
      ),
    );
  }
}

class _StateCard extends StatelessWidget {
  const _StateCard({
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 36, color: const Color(0xFF94A3B8)),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                color: Color(0xFFF8FAFC),
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFFCBD5E1)),
            ),
          ],
        ),
      ),
    );
  }
}