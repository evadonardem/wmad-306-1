import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../providers/player_provider.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../models/hero_model.dart';
import '../../theme/cyber_theme.dart';
import '../../widgets/hero_card.dart';
import '../../widgets/shimmer_loader.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();
  late HeroSearchProvider _searchProvider;
  bool _filtersExpanded = false;

  @override
  void initState() {
    super.initState();
    _searchProvider = HeroSearchProvider();
    // Load showcase heroes for the home page
    _searchProvider.loadShowcase();
    // Restore last search if present, otherwise show categories (idle)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final lastSearch = context.read<PlayerProvider>().lastSearch;
      if (lastSearch.isNotEmpty) {
        _searchController.text = lastSearch;
        _searchProvider.search(lastSearch);
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchProvider.dispose();
    super.dispose();
  }

  void _onSearch() {
    final query = _searchController.text.trim();
    if (query.isEmpty) return;
    _searchProvider.search(query);
    context.read<PlayerProvider>().setLastSearch(query);
  }

  void _onClearSearch() {
    _searchController.clear();
    context.read<PlayerProvider>().setLastSearch('');
    _searchProvider.backToHome();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return ChangeNotifierProvider.value(
      value: _searchProvider,
      child: Scaffold(
        drawer: _buildDrawer(context),
        floatingActionButton: _buildFightFab(context),
        body: SafeArea(
          top: false,
          child: CustomScrollView(
            slivers: [
              // ── App Bar ──
              SliverAppBar(
                floating: true,
                snap: true,
                pinned: false,
                toolbarHeight: 64,
                backgroundColor: cs.surface,
                surfaceTintColor: Colors.transparent,
                leading: Builder(
                  builder: (ctx) => IconButton(
                    icon: Icon(Icons.menu_rounded, color: cs.onSurface.withValues(alpha: 0.6)),
                    onPressed: () => Scaffold.of(ctx).openDrawer(),
                  ),
                ),
                title: Consumer<HeroSearchProvider>(
                  builder: (_, search, child) {
                    final isSearching = search.isFeatured || search.query.isNotEmpty;
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.bolt_rounded, size: 18, color: cs.primary),
                            const SizedBox(width: 6),
                            Text(
                              'HERO BATTLE',
                              style: GoogleFonts.rajdhani(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 3,
                                color: cs.onSurface,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          isSearching
                              ? search.isFeatured
                                  ? search.categoryLabel
                                  : 'Results for "${search.query}"'
                              : 'Assemble your roster',
                          style: GoogleFonts.rajdhani(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: cs.primary.withValues(alpha: 0.5),
                            letterSpacing: 1.5,
                          ),
                        ),
                      ],
                    );
                  },
                ),
                bottom: PreferredSize(
                  preferredSize: const Size.fromHeight(1),
                  child: Container(
                    height: 1,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          cs.primary.withValues(alpha: 0.15),
                          cs.secondary.withValues(alpha: 0.08),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
                actions: [
                  Consumer<DeckProvider>(
                    builder: (_, deck, child) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Badge(
                        label: Text('${deck.deckSize}'),
                        isLabelVisible: deck.deckSize > 0,
                        backgroundColor: cs.primary,
                        child: IconButton(
                          icon: const Icon(Icons.style_rounded),
                          tooltip: 'Deck Builder',
                          onPressed: () => Navigator.pushNamed(
                              context, RouteNames.deckBuilder),
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // ── Search bar ──
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) => _onSearch(),
                          decoration: InputDecoration(
                            hintText: 'Search heroes by name…',
                            hintStyle: TextStyle(
                              color:
                                  cs.onSurface.withValues(alpha: 0.35),
                            ),
                            prefixIcon: Icon(Icons.search_rounded,
                                color:
                                    cs.primary.withValues(alpha: 0.6)),
                            suffixIcon: Consumer<HeroSearchProvider>(
                              builder: (_, search, child) =>
                                  search.query.isNotEmpty
                                      ? IconButton(
                                          icon: Icon(
                                              Icons.close_rounded,
                                              color: cs.onSurface
                                                  .withValues(
                                                      alpha: 0.5)),
                                          onPressed: _onClearSearch,
                                        )
                                      : IconButton(
                                          icon: Icon(
                                              Icons
                                                  .arrow_forward_rounded,
                                              color: cs.primary),
                                          onPressed: _onSearch,
                                        ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Consumer<HeroSearchProvider>(
                        builder: (_, search, child) => _FilterToggleButton(
                          isExpanded: _filtersExpanded,
                          hasActiveFilters: search.hasActiveFilters,
                          onPressed: () => setState(
                              () => _filtersExpanded = !_filtersExpanded),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // ── Filter panel ──
              SliverToBoxAdapter(
                child: Consumer<HeroSearchProvider>(
                  builder: (_, search, child) => AnimatedCrossFade(
                    firstChild: const SizedBox.shrink(),
                    secondChild: _FilterPanel(
                      provider: search,
                      onChanged: () => setState(() {}),
                    ),
                    crossFadeState: _filtersExpanded
                        ? CrossFadeState.showSecond
                        : CrossFadeState.showFirst,
                    duration: const Duration(milliseconds: 250),
                  ),
                ),
              ),

              // ── Result count + active filter chips ──
              Consumer<HeroSearchProvider>(
                builder: (_, search, child) {
                  if (search.state != SearchState.success &&
                      search.state != SearchState.empty) {
                    return const SliverToBoxAdapter(child: SizedBox.shrink());
                  }
                  return SliverToBoxAdapter(
                    child: Padding(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Text(
                            '${search.results.length} hero${search.results.length == 1 ? '' : 'es'}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color:
                                  cs.onSurface.withValues(alpha: 0.5),
                            ),
                          ),
                          if (search.hasActiveFilters) ...[
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: search.clearFilters,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: cs.error
                                      .withValues(alpha: 0.1),
                                  borderRadius:
                                      BorderRadius.circular(8),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.close_rounded,
                                        size: 12, color: cs.error),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Clear filters',
                                      style: TextStyle(
                                          fontSize: 11,
                                          color: cs.error,
                                          fontWeight:
                                              FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                          const Spacer(),
                          if (!search.isFeatured &&
                              (search.query.isNotEmpty ||
                                  search.state != SearchState.idle))
                            TextButton.icon(
                              onPressed: _onClearSearch,
                              icon: const Icon(Icons.home_rounded,
                                  size: 16),
                              label: const Text('Home',
                                  style: TextStyle(fontSize: 12)),
                              style: TextButton.styleFrom(
                                visualDensity: VisualDensity.compact,
                              ),
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),

              const SliverToBoxAdapter(
                  child: SizedBox(height: 8)),

              // ── Results grid ──
              Consumer<HeroSearchProvider>(
                builder: (_, search, child) {
                  switch (search.state) {
                    case SearchState.idle:
                      return SliverFillRemaining(
                          child: _buildIdleState());
                    case SearchState.loading:
                      return const SliverFillRemaining(
                        child: ShimmerCardGrid(),
                      );
                    case SearchState.empty:
                      return SliverFillRemaining(
                        child: _buildCenterMessage(
                          icon: Icons.search_off_rounded,
                          text: search.hasActiveFilters
                              ? 'No heroes match the current filters'
                              : 'No heroes found for "${search.query}"',
                          action: search.hasActiveFilters
                              ? FilledButton.icon(
                                  onPressed: search.clearFilters,
                                  icon: const Icon(
                                      Icons.filter_alt_off_rounded),
                                  label:
                                      const Text('Clear Filters'),
                                )
                              : null,
                        ),
                      );
                    case SearchState.error:
                      return SliverFillRemaining(
                        child: _buildCenterMessage(
                          icon: Icons.wifi_off_rounded,
                          text: search.errorMessage,
                          action: FilledButton.icon(
                            onPressed: () {
                              if (search.isFeatured &&
                                  search.categoryLabel.isNotEmpty) {
                                search.loadCategory(
                                    search.categoryLabel);
                              } else {
                                _onSearch();
                              }
                            },
                            icon:
                                const Icon(Icons.refresh_rounded),
                            label: const Text('Retry'),
                          ),
                        ),
                      );
                    case SearchState.success:
                      return _buildResponsiveGrid(search);
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResponsiveGrid(HeroSearchProvider search) {
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      sliver: SliverLayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.crossAxisExtent;
          // Responsive column count
          final crossAxisCount = width < 360
              ? 2
              : width < 600
                  ? 2
                  : width < 900
                      ? 3
                      : width < 1200
                          ? 4
                          : 5;
          // Adjust aspect ratio for smaller screens
          final aspectRatio = width < 360 ? 0.55 : 0.60;

          return SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              childAspectRatio: aspectRatio,
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
            ),
            delegate: SliverChildBuilderDelegate(
              (_, i) {
                final hero = search.results[i];
                return HeroCard(
                  hero: hero,
                  onTap: () => Navigator.pushNamed(
                    context,
                    RouteNames.heroDetail,
                    arguments: hero,
                  ),
                );
              },
              childCount: search.results.length,
            ),
          );
        },
      ),
    );
  }

  Widget _buildIdleState() {
    final cs = Theme.of(context).colorScheme;
    return Consumer<HeroSearchProvider>(
      builder: (_, search, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Universe Showcases ──
              if (search.showcaseLoading && !search.showcaseLoaded)
                const Padding(
                  padding: EdgeInsets.only(top: 16),
                  child: ShimmerCardGrid(itemCount: 4),
                )
              else if (search.showcaseLoaded)
                ...HeroSearchProvider.universeHeroIds.keys
                    .map((universe) => _buildUniverseSection(
                          universe,
                          search.showcaseData[universe] ?? [],
                          HeroSearchProvider.universeMeta[universe],
                        ))
              else if (search.showcaseError != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(Icons.wifi_off_rounded,
                            size: 40,
                            color: cs.error.withValues(alpha: 0.5)),
                        const SizedBox(height: 8),
                        Text(search.showcaseError!,
                            style: TextStyle(
                                color: cs.onSurface.withValues(alpha: 0.5))),
                        const SizedBox(height: 12),
                        FilledButton.icon(
                          onPressed: search.loadShowcase,
                          icon: const Icon(Icons.refresh_rounded, size: 16),
                          label: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),

              const SizedBox(height: 16),

              // ── Quick Search ──
              _CategorySectionLabel(label: 'QUICK SEARCH'),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _QuickSearchChip(label: 'Spider', onTap: () => _quickSearch('spider')),
                  _QuickSearchChip(label: 'Iron', onTap: () => _quickSearch('iron')),
                  _QuickSearchChip(label: 'Captain', onTap: () => _quickSearch('captain')),
                  _QuickSearchChip(label: 'Green', onTap: () => _quickSearch('green')),
                  _QuickSearchChip(label: 'Black', onTap: () => _quickSearch('black')),
                  _QuickSearchChip(label: 'Thor', onTap: () => _quickSearch('thor')),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        );
      },
    );
  }

  Widget _buildUniverseSection(
    String title,
    List<HeroModel> heroes,
    (int iconCode, int colorHex)? meta,
  ) {
    if (heroes.isEmpty) return const SizedBox.shrink();
    final color = Color(meta?.$2 ?? 0xFF00D4FF);
    final icon = IconData(meta?.$1 ?? 0xe55f, fontFamily: 'MaterialIcons');

    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Universe Header ──
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  color: color.withValues(alpha: 0.15),
                  border: Border.all(color: color.withValues(alpha: 0.3)),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.rajdhani(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 2,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
              // Accent color bar
              Container(
                height: 2,
                width: 40,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [color, color.withValues(alpha: 0)],
                  ),
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // ── 2×2 Hero Grid ──
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.60,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
            ),
            itemCount: heroes.length,
            itemBuilder: (_, i) => HeroCard(
              hero: heroes[i],
              onTap: () => Navigator.pushNamed(
                context,
                RouteNames.heroDetail,
                arguments: heroes[i],
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 350.ms).slideY(begin: 0.03, end: 0);
  }

  void _quickSearch(String query) {
    _searchController.text = query;
    _searchProvider.search(query);
    context.read<PlayerProvider>().setLastSearch(query);
  }

  Widget _buildCenterMessage(
      {required IconData icon,
      required String text,
      Widget? action}) {
    final cs = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: cs.error.withValues(alpha: 0.1),
              ),
              child: Icon(icon,
                  size: 40,
                  color: cs.error.withValues(alpha: 0.7)),
            ),
            const SizedBox(height: 16),
            Text(text,
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: cs.onSurface.withValues(alpha: 0.6))),
            if (action != null) ...[
              const SizedBox(height: 16),
              action,
            ],
          ],
        ),
      ),
    );
  }

  // ── Fight FAB ──

  Widget _buildFightFab(BuildContext context) {
    final deck = context.watch<DeckProvider>().deck;
    if (deck.isEmpty) return const SizedBox.shrink();

    return FloatingActionButton.extended(
      onPressed: () {
        if (deck.length < 3) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Need at least 3 heroes in your deck! (${deck.length}/5)'),
              backgroundColor: CyberColors.error,
            ),
          );
          return;
        }
        Navigator.pushNamed(context, RouteNames.deckBattle, arguments: deck);
      },
      backgroundColor: CyberColors.magenta,
      foregroundColor: Colors.white,
      icon: const Icon(Icons.local_fire_department_rounded),
      label: Text(
        'FIGHT (${deck.length})',
        style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1),
      ),
    );
  }

  // ── Navigation drawer ──

  Widget _buildDrawer(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Drawer(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  cs.primaryContainer,
                  cs.primary.withValues(alpha: 0.3),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: cs.primary,
                    boxShadow: [
                      BoxShadow(
                        color: cs.primary.withValues(alpha: 0.4),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: const Icon(Icons.bolt,
                      size: 28, color: Colors.white),
                ),
                const SizedBox(height: 16),
                Text(
                  'Hero Battle',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: cs.onPrimaryContainer,
                        letterSpacing: 1,
                      ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Assemble. Fight. Conquer.',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(
                        color: cs.onPrimaryContainer
                            .withValues(alpha: 0.6),
                      ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          _DrawerItem(
            icon: Icons.home_rounded,
            label: 'Hero Roster',
            selected: true,
            onTap: () => Navigator.pop(context),
          ),
          _DrawerItem(
            icon: Icons.style_rounded,
            label: 'Deck Builder',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, RouteNames.deckBuilder);
            },
          ),
          _DrawerItem(
            icon: Icons.history_rounded,
            label: 'Battle History',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, RouteNames.history);
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Divider(
                color: cs.primary.withValues(alpha: 0.12)),
          ),
          _DrawerItem(
            icon: Icons.person_rounded,
            label: 'Profile',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, RouteNames.profile);
            },
          ),
        ],
      ),
    );
  }
}

// ── Filter toggle button ──

class _FilterToggleButton extends StatelessWidget {
  final bool isExpanded;
  final bool hasActiveFilters;
  final VoidCallback onPressed;

  const _FilterToggleButton({
    required this.isExpanded,
    required this.hasActiveFilters,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Material(
      color: isExpanded || hasActiveFilters
          ? cs.primary.withValues(alpha: 0.15)
          : cs.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onPressed,
        child: Container(
          width: 48,
          height: 48,
          alignment: Alignment.center,
          child: Badge(
            isLabelVisible: hasActiveFilters,
            backgroundColor: cs.primary,
            smallSize: 8,
            child: Icon(
              isExpanded
                  ? Icons.filter_alt_off_rounded
                  : Icons.filter_alt_rounded,
              color: hasActiveFilters || isExpanded
                  ? cs.primary
                  : cs.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Filter panel ──

class _FilterPanel extends StatelessWidget {
  final HeroSearchProvider provider;
  final VoidCallback onChanged;

  const _FilterPanel({required this.provider, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border:
            Border.all(color: cs.primary.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Alignment filter
          _FilterSectionLabel(label: 'Alignment'),
          const SizedBox(height: 6),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _FilterChip(
                  label: 'All',
                  selected: provider.alignmentFilter == null,
                  onTap: () {
                    provider.setAlignmentFilter(null);
                    onChanged();
                  },
                ),
                _FilterChip(
                  label: 'Good',
                  selected: provider.alignmentFilter == 'good',
                  color: CyberColors.alignGood,
                  onTap: () {
                    provider.setAlignmentFilter('good');
                    onChanged();
                  },
                ),
                _FilterChip(
                  label: 'Bad',
                  selected: provider.alignmentFilter == 'bad',
                  color: CyberColors.alignBad,
                  onTap: () {
                    provider.setAlignmentFilter('bad');
                    onChanged();
                  },
                ),
                _FilterChip(
                  label: 'Neutral',
                  selected: provider.alignmentFilter == 'neutral',
                  color: CyberColors.alignNeutral,
                  onTap: () {
                    provider.setAlignmentFilter('neutral');
                    onChanged();
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Publisher filter
          _FilterSectionLabel(label: 'Publisher'),
          const SizedBox(height: 6),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _FilterChip(
                  label: 'All',
                  selected: provider.publisherFilter == null,
                  onTap: () {
                    provider.setPublisherFilter(null);
                    onChanged();
                  },
                ),
                ...provider.availablePublishers.map(
                  (pub) => _FilterChip(
                    label: pub,
                    selected: provider.publisherFilter == pub,
                    onTap: () {
                      provider.setPublisherFilter(pub);
                      onChanged();
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Power tier filter
          _FilterSectionLabel(label: 'Power Tier'),
          const SizedBox(height: 6),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: PowerTier.values.map((tier) {
                final label = switch (tier) {
                  PowerTier.all => 'All',
                  PowerTier.weak => 'Weak',
                  PowerTier.average => 'Average',
                  PowerTier.strong => 'Strong',
                  PowerTier.legendary => 'Legendary',
                };
                final color = switch (tier) {
                  PowerTier.all => null,
                  PowerTier.weak => CyberColors.rarityCommon,
                  PowerTier.average => CyberColors.rarityRare,
                  PowerTier.strong => const Color(0xFFFF9800),
                  PowerTier.legendary => CyberColors.rarityLegendary,
                };
                return _FilterChip(
                  label: label,
                  selected: provider.powerTier == tier,
                  color: color,
                  onTap: () {
                    provider.setPowerTier(tier);
                    onChanged();
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterSectionLabel extends StatelessWidget {
  final String label;
  const _FilterSectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 1,
        color: Theme.of(context)
            .colorScheme
            .onSurface
            .withValues(alpha: 0.4),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final Color? color;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final chipColor = color ?? cs.primary;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(
              horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            color: selected
                ? chipColor.withValues(alpha: 0.2)
                : cs.surface.withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: selected
                  ? chipColor.withValues(alpha: 0.6)
                  : cs.onSurface.withValues(alpha: 0.08),
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight:
                  selected ? FontWeight.w700 : FontWeight.w500,
              color: selected
                  ? chipColor
                  : cs.onSurface.withValues(alpha: 0.6),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Drawer item ──

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback? onTap;

  const _DrawerItem({
    required this.icon,
    required this.label,
    this.selected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding:
          const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: ListTile(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12)),
        leading: Icon(icon,
            color: selected
                ? cs.primary
                : cs.onSurface.withValues(alpha: 0.6)),
        title: Text(
          label,
          style: TextStyle(
            fontWeight:
                selected ? FontWeight.w600 : FontWeight.w500,
            color: selected
                ? cs.primary
                : cs.onSurface.withValues(alpha: 0.8),
          ),
        ),
        selected: selected,
        selectedTileColor: cs.primary.withValues(alpha: 0.1),
        onTap: onTap,
      ),
    );
  }
}

// ── Category data ──

class _CategorySectionLabel extends StatelessWidget {
  final String label;
  const _CategorySectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.5,
        color: Theme.of(context)
            .colorScheme
            .onSurface
            .withValues(alpha: 0.35),
      ),
    );
  }
}

class _QuickSearchChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _QuickSearchChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: cs.primaryContainer.withValues(alpha: 0.2),
          border: Border.all(
            color: cs.primary.withValues(alpha: 0.15),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_rounded,
                size: 14,
                color: cs.primary.withValues(alpha: 0.6)),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: cs.onSurface.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}