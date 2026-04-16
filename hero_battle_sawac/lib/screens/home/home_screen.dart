import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HeroSearchProvider>().loadCatalog();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final searchProvider = context.watch<HeroSearchProvider>();
    final deckProvider = context.watch<DeckProvider>();
    final heroes = searchProvider.results;
    final backgroundColors = isDark
      ? const [Color(0xFF111827), Color(0xFF0F172A), Color(0xFF0B1120)]
      : const [Color(0xFFF8F2E8), Color(0xFFFFFCF8), Color(0xFFF0E4D4)];
    final headerText = isDark ? const Color(0xFFE5E7EB) : const Color(0xFF18212F);
    final subText = isDark ? const Color(0xFF9CA3AF) : const Color(0xFF64748B);
    final panelBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);
    final controlColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFF2E8DA);

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
          child: Column(
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
                            'Hero Atlas',
                              style: theme.textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w900,
                                color: headerText,
                                ),
                          ),
                          Text(
                            'Search. Filter. Assemble your legends.',
                              style: theme
                                .textTheme
                                .bodyMedium
                              ?.copyWith(color: subText),
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                      child: Ink(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: controlColor,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: panelBorder),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.style, color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155), size: 18),
                            const SizedBox(width: 8),
                            Text(
                              '${deckProvider.count}/${DeckProvider.maxDeckSize}',
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
              _SearchPanel(controller: _searchController),
              Expanded(
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
                          padding: const EdgeInsets.fromLTRB(16, 10, 16, 20),
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
                                  if (!added) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Deck is full or hero is already added.'),
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
            ],
          ),
        ),
      ),
    );
  }
}

class _SearchPanel extends StatelessWidget {
  const _SearchPanel({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<HeroSearchProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final panelColor = isDark
        ? const Color(0xFF0F172A).withValues(alpha: 0.85)
        : const Color(0xFFFFFBF5).withValues(alpha: 0.96);
    final panelBorder = isDark ? const Color(0xFF334155) : const Color(0xFFD9CCBB);

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: panelColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: panelBorder),
      ),
      child: Column(
        children: [
          TextField(
            controller: controller,
            style: TextStyle(color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1F2937)),
            decoration: InputDecoration(
              hintText: 'Search hero by name',
              hintStyle: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF94A3A8)),
              prefixIcon: Icon(Icons.search, color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B)),
              suffixIcon: controller.text.isEmpty
                  ? null
                  : IconButton(
                      onPressed: () {
                        controller.clear();
                        context.read<HeroSearchProvider>().setQuery('');
                      },
                      icon: Icon(Icons.clear, color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF64748B)),
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