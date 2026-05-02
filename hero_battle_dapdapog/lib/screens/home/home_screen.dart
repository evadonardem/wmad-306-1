import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/router/app_router.dart';
import 'package:hero_battle/services/prefs_service.dart';
import 'package:hero_battle/services/superhero_api_service.dart';
import 'package:hero_battle/widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final PrefsService _prefsService = PrefsService();
  final SuperheroApiService _apiService = SuperheroApiService();

  Future<List<HeroModel>>? _heroesFuture;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final lastSearch = await _prefsService.loadLastSearch();
    if (!mounted) return;

    _searchController.text = lastSearch;
    _heroesFuture = _loadHeroes(lastSearch);
    setState(() {
      _initialized = true;
    });
  }

  Future<List<HeroModel>> _loadHeroes(String query) {
    return _apiService.fetchHeroes(query: query);
  }

  Future<void> _submitSearch(String value) async {
    final query = value.trim();
    await _prefsService.saveLastSearch(query);
    setState(() {
      _heroesFuture = _loadHeroes(query);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    if (!_initialized) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
          IconButton(
            icon: const Icon(Icons.style),
            onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
          ),
          Consumer<DeckProvider>(
            builder: (context, deck, _) {
              return Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.layers),
                    onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                  ),
                  if (deck.deckCount > 0)
                    Positioned(
                      right: 6,
                      top: 6,
                      child: TweenAnimationBuilder<double>(
                        tween: Tween<double>(begin: 0.8, end: 1),
                        duration: 280.ms,
                        curve: Curves.easeOutBack,
                        builder: (context, scale, child) {
                          return Transform.scale(scale: scale, child: child);
                        },
                        child: CircleAvatar(
                          radius: 9,
                          child: Text(
                            '${deck.deckCount}',
                            style: const TextStyle(fontSize: 10),
                          ),
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      ),
      backgroundColor: colorScheme.surface,
      body: Stack(
        children: [
          IgnorePointer(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    colorScheme.primaryContainer.withValues(alpha: 0.18),
                    colorScheme.surface,
                    colorScheme.secondaryContainer.withValues(alpha: 0.10),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: -80,
                    left: -30,
                    child: Container(
                      width: 210,
                      height: 210,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: colorScheme.primary.withValues(alpha: 0.08),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -80,
                    right: -20,
                    child: Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: colorScheme.secondary.withValues(alpha: 0.08),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                Container(
                  margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                  padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
                  decoration: BoxDecoration(
                    color: colorScheme.surface.withValues(alpha: 0.82),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colorScheme.outlineVariant),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Consumer<DeckProvider>(
                        builder: (context, deck, _) {
                          return Text(
                            'Choose your squad: ${deck.deckCount}/${DeckProvider.maxDeckSize}',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _searchController,
                        textInputAction: TextInputAction.search,
                        onSubmitted: _submitSearch,
                        decoration: InputDecoration(
                          hintText: 'Search heroes',
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                          fillColor: colorScheme.surfaceContainerHighest.withValues(alpha: 0.4),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(duration: 240.ms).slideY(begin: -0.08, end: 0),
                Expanded(
                  child: FutureBuilder<List<HeroModel>>(
                    future: _heroesFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState != ConnectionState.done) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      final heroes = snapshot.data ?? <HeroModel>[];
                      if (heroes.isEmpty) {
                        return const Center(child: Text('No heroes found.'));
                      }

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
                          return HeroCard(
                            hero: hero,
                            onTap: () => Navigator.pushNamed(
                              context,
                              RouteNames.heroDetail,
                              arguments: hero,
                            ),
                          )
                              .animate(delay: (30 * (index % 8)).ms)
                              .fadeIn(duration: 260.ms)
                              .slideY(begin: 0.08, end: 0);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}