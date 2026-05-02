import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
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
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _runSearch() async {
    await context.read<HeroSearchProvider>().search(_searchController.text);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: <Color>[
              scheme.primaryContainer.withValues(alpha: 0.15),
              scheme.secondaryContainer.withValues(alpha: 0.08),
              scheme.surface,
            ],
            stops: const <double>[0.0, 0.45, 1.0],
          ),
        ),
        child: SafeArea(
          child: Consumer<HeroSearchProvider>(
            builder: (context, heroState, _) {
              return LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth >= 980;
                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        _Headline(heroState: heroState),
                        const SizedBox(height: 18),
                        _SearchPanel(
                          controller: _searchController,
                          isSearching: heroState.isSearching,
                          isLoadingHero: heroState.isLoadingHero,
                          onSearch: _runSearch,
                          onRandom: heroState.loadRandomHero,
                        ),
                        const SizedBox(height: 18),
                        Row(
                          children: <Widget>[
                            Expanded(
                              child: Text(
                                'Picked Heroes',
                                style: Theme.of(context).textTheme.titleMedium
                                    ?.copyWith(
                                      fontWeight: FontWeight.w700,
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurface,
                                    ),
                              ),
                            ),
                            OutlinedButton.icon(
                              onPressed: heroState.results.isEmpty &&
                                      heroState.selectedHero == null
                                  ? null
                                  : heroState.clearPickedHeroes,
                              icon: const Icon(Icons.clear_all),
                              label: const Text('Clear Hero'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _ResultsStrip(heroes: heroState.results, onPick: heroState.loadHero),
                        const SizedBox(height: 18),
                        if (heroState.error != null)
                          _ErrorBanner(message: heroState.error!),
                        if (heroState.isLoadingHero)
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            child: Center(child: CircularProgressIndicator()),
                          ),
                        if (heroState.selectedHero != null &&
                            !heroState.isLoadingHero)
                          _HeroDetailBoard(
                            hero: heroState.selectedHero!,
                            isWide: isWide,
                          ),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}

class _Headline extends StatelessWidget {
  const _Headline({required this.heroState});

  final HeroSearchProvider heroState;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final count = heroState.results.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Hero Atlas Console',
          style: theme.textTheme.headlineLarge?.copyWith(
            fontWeight: FontWeight.w800,
            letterSpacing: 0.6,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Search the universe, inspect every stat group, and deep-dive into superhero intelligence profiles.',
          style: theme.textTheme.bodyLarge?.copyWith(
            color: theme.colorScheme.onSurface.withValues(alpha: 0.88),
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: <Widget>[
            Chip(
              avatar: const Icon(Icons.api, size: 18),
              label: const Text(
                'API Groups: Full + Powerstats + Bio + Appearance + Work + Connections',
              ),
              backgroundColor: theme.colorScheme.primaryContainer,
            ),
            Chip(
              avatar: const Icon(Icons.groups_2_outlined, size: 18),
              label: Text('Loaded Results: $count'),
            ),
          ],
        ),
      ],
    );
  }
}

class _SearchPanel extends StatelessWidget {
  const _SearchPanel({
    required this.controller,
    required this.isSearching,
    required this.isLoadingHero,
    required this.onSearch,
    required this.onRandom,
  });

  final TextEditingController controller;
  final bool isSearching;
  final bool isLoadingHero;
  final Future<void> Function() onSearch;
  final Future<void> Function() onRandom;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      elevation: 2,
      color: theme.colorScheme.surface.withValues(alpha: 0.95),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Search Heroes',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
                color: theme.colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: <Widget>[
                Expanded(
                  child: TextField(
                    controller: controller,
                    textInputAction: TextInputAction.search,
                    style: TextStyle(
                      color: theme.colorScheme.onSurface,
                      fontWeight: FontWeight.w600,
                    ),
                    cursorColor: theme.colorScheme.primary,
                    onSubmitted: (_) => onSearch(),
                    decoration: InputDecoration(
                      hintText:
                          'Type a hero name (e.g. batman, storm, wonder woman)',
                      hintStyle: TextStyle(
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.62),
                      ),
                      filled: true,
                      fillColor: theme.colorScheme.surface,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: theme.colorScheme.outline.withValues(alpha: 0.45),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: theme.colorScheme.primary,
                          width: 1.6,
                        ),
                      ),
                      prefixIcon: Icon(
                        Icons.search,
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                FilledButton.icon(
                  onPressed: isSearching ? null : onSearch,
                  icon: isSearching
                      ? const SizedBox(
                          height: 16,
                          width: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.travel_explore),
                  label: const Text('Search'),
                ),
                const SizedBox(width: 10),
                OutlinedButton.icon(
                  onPressed: isLoadingHero ? null : onRandom,
                  icon: const Icon(Icons.casino_outlined),
                  label: const Text('Random'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ResultsStrip extends StatelessWidget {
  const _ResultsStrip({required this.heroes, required this.onPick});

  final List<HeroSummary> heroes;
  final Future<void> Function(String heroId) onPick;

  @override
  Widget build(BuildContext context) {
    if (heroes.isEmpty) {
      return const SizedBox.shrink();
    }

    return SizedBox(
      height: 150,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: heroes.length,
        separatorBuilder: (_, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final hero = heroes[index];
          return InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () => onPick(hero.id),
            child: Ink(
              width: 220,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: HeroPortraitCard(
                  imageUrl: hero.imageUrl,
                  title: hero.name,
                  heroId: hero.id,
                  subtitle: '#${hero.id}',
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _HeroDetailBoard extends StatelessWidget {
  const _HeroDetailBoard({required this.hero, required this.isWide});

  final HeroDetail hero;
  final bool isWide;

  @override
  Widget build(BuildContext context) {
    final identityFacts = <String, String>{
      'Publisher': hero.biography['publisher'] ?? 'Unknown',
      'Full Name': hero.biography['full-name'] ?? 'Unknown',
      'First Appearance': hero.biography['first-appearance'] ?? 'Unknown',
      'Place of Birth': hero.biography['place-of-birth'] ?? 'Unknown',
      'Alignment': hero.biography['alignment'] ?? 'Unknown',
    };

    final leftColumn = <Widget>[
      _HeroBanner(hero: hero),
      const SizedBox(height: 12),
      _InfoGrid(title: 'Biography', map: identityFacts),
      const SizedBox(height: 12),
      _InfoGrid(title: 'Appearance', map: hero.appearance),
      const SizedBox(height: 12),
      _BattlePrompt(hero: hero),
    ];

    final rightColumn = <Widget>[
      _PowerStatsPanel(stats: hero.powerstats),
      const SizedBox(height: 12),
      _InfoGrid(title: 'Work', map: hero.work),
      const SizedBox(height: 12),
      _InfoGrid(title: 'Connections', map: hero.connections),
    ];

    if (!isWide) {
      return Column(children: <Widget>[...leftColumn, ...rightColumn]);
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Expanded(child: Column(children: leftColumn)),
        const SizedBox(width: 12),
        Expanded(child: Column(children: rightColumn)),
      ],
    );
  }
}

class _HeroBanner extends StatelessWidget {
  const _HeroBanner({required this.hero});

  final HeroDetail hero;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      elevation: 2,
      color: theme.colorScheme.surface.withValues(alpha: 0.95),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: <Widget>[
            SizedBox(
              width: 120,
              height: 140,
              child: HeroPortraitCard(
                imageUrl: hero.imageUrl,
                title: hero.name,
                heroId: hero.id,
                subtitle: 'ID #${hero.id}',
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    hero.name,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Hero ID #${hero.id}',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    hero.biography['aliases'] ?? 'No aliases provided',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(
                        alpha: 0.85,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BattlePrompt extends StatelessWidget {
  const _BattlePrompt({required this.hero});

  final HeroDetail hero;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      elevation: 2,
      color: theme.colorScheme.primaryContainer.withValues(alpha: 0.65),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Battle Arena',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: theme.colorScheme.onPrimaryContainer,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Open the fight screen to draw a rival and see a round-by-round matchup using the heroes\' actual powerstats.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onPrimaryContainer.withValues(alpha: 0.88),
              ),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed(
                  RouteNames.battle,
                  arguments: hero,
                );
              },
              icon: const Icon(Icons.bolt),
              label: const Text('Open battle arena'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PowerStatsPanel extends StatelessWidget {
  const _PowerStatsPanel({required this.stats});

  final Map<String, String> stats;

  @override
  Widget build(BuildContext context) {
    final parsed = stats.entries.toList();
    return Card(
      elevation: 2,
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.95),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Powerstats',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 10),
            ...parsed.map((entry) {
              final score = int.tryParse(entry.value) ?? 0;
              final normalized = score.clamp(0, 100) / 100;
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      '${entry.key}: ${entry.value}',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 5),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(99),
                      child: LinearProgressIndicator(
                        value: normalized,
                        minHeight: 10,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class _InfoGrid extends StatelessWidget {
  const _InfoGrid({required this.title, required this.map});

  final String title;
  final Map<String, String> map;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.95),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 10),
            ...map.entries.map(
              (entry) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    SizedBox(
                      width: 140,
                      child: Text(
                        entry.key,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        entry.value,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.errorContainer,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        message,
        style: TextStyle(color: Theme.of(context).colorScheme.onErrorContainer),
      ),
    );
  }
}
