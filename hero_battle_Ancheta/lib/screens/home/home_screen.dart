import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../models/hero_model.dart';
import '../../../providers/deck_provider.dart';
import '../../../providers/hero_search_provider.dart';
import '../../../providers/opponent_provider.dart';
import '../../../services/superhero_api_service.dart';
import '../../../services/prefs_service.dart';
import '../../../widgets/hero_card.dart';
import '../../../router/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static const int _pageSize = 8;
  static const int _initialRosterFetchCount = 120;

  late Future<List<HeroModel>> _heroesFuture;
  final _searchController = TextEditingController();
  late SuperheroApiService _api;
  String _activeToken = '';
  int _currentPage = 1;
  bool _isSearching = false;
  List<HeroModel> _searchResults = [];
  late OpponentProvider _opponentProvider;
  late HeroSearchProvider _heroSearchProvider;

  @override
  void initState() {
    super.initState();
    
    // Initialize providers FIRST before any async operations
    _opponentProvider = context.read<OpponentProvider>();
    _heroSearchProvider = context.read<HeroSearchProvider>();
    
    // Initialize with a placeholder future, will be replaced once API is ready
    _heroesFuture = Future.value([]);
    
    // Use post-frame callback to ensure proper timing
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _initializeApi();
      _loadLastSearch();
    });
  }

  Future<void> _initializeApi() async {
    final prefs = PrefsService();
    final token = (await prefs.loadApiToken())?.trim() ?? '';

    // Avoid unnecessary reloads unless token actually changed.
    if (_activeToken == token && mounted) return;

    _activeToken = token;
    _api = SuperheroApiService(apiToken: token);
    
    // Set the heroes future now that API is ready
    if (mounted) {
      setState(() {
        _currentPage = 1;
        _heroesFuture = token.isEmpty
            ? Future.error('Missing API token. Set it in Profile > API Configuration.')
            : _api.fetchRandomHeroes(count: _initialRosterFetchCount);
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // When returning from Profile, token may have changed; refresh API source.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeApi();
    });
  }

  void _loadLastSearch() {
    final lastQuery = _heroSearchProvider.lastSearchQuery;
    if (lastQuery.isNotEmpty) {
      _searchController.text = lastQuery;
    }
  }

  Future<void> _performSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _currentPage = 1;
        _isSearching = false;
        _searchResults = [];
      });
      return;
    }

    setState(() {
      _isSearching = true;
    });

    try {
      final results = await _api.searchHeroes(query);
      if (mounted) {
        await _heroSearchProvider.saveSearchQuery(query);
        setState(() {
          _currentPage = 1;
          _searchResults = results;
          _isSearching = false;
        });
        _heroSearchProvider.setSearchResults(results);
      }
    } catch (e) {
      setState(() {
        _currentPage = 1;
        _isSearching = false;
        _searchResults = [];
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Search failed: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster').animate().fadeIn(duration: 500.ms),
        actions: [
          // Deck badge
          Consumer<DeckProvider>(
            builder: (context, deck, _) {
              return Stack(
                clipBehavior: Clip.none,
                children: [
                  IconButton(
                    icon: const Icon(Icons.style),
                    onPressed: () {
                      Navigator.pushNamed(context, RouteNames.deckBuilder);
                    },
                  ),
                  if (deck.deckSize > 0)
                    Positioned(
                      right: 6,
                      top: 6,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          '${deck.deckSize}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ).animate().scale(duration: 300.ms),
                    ),
                ],
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.pushNamed(context, RouteNames.history);
            },
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(context, RouteNames.profile);
            },
          ),
        ].animate(interval: 100.ms).fadeIn(),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: SearchBar(
              controller: _searchController,
              hintText: 'Search heroes...',
              leading: const Icon(Icons.search),
              trailing: [
                if (_searchController.text.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _searchController.clear();
                      _performSearch('');
                    },
                  ),
              ],
              onSubmitted: _performSearch,
            ).animate().slideY(begin: -0.2, end: 0, duration: 400.ms),
          ),
          Expanded(
            child: _isSearching
                ? const Center(child: CircularProgressIndicator())
                : (_searchController.text.isNotEmpty
                    ? _buildSearchResults()
                    : FutureBuilder<List<HeroModel>>(
                        future: _heroesFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState !=
                              ConnectionState.done) {
                            return const Center(
                              child: CircularProgressIndicator(),
                            );
                          }
                          if (snapshot.hasError) {
                            return Center(
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Text(
                                  'Failed to load heroes from API.\nCheck your token in Profile > API Configuration.\n\nDetails: ${snapshot.error}',
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            );
                          }
                          final heroes = snapshot.data!;
                          return _buildHeroGrid(heroes);
                        },
                      )),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('No heroes found'),
          ],
        ),
      ).animate().fadeIn(duration: 300.ms);
    }
    return _buildHeroGrid(_searchResults);
  }

  Widget _buildHeroGrid(List<HeroModel> heroes) {
    if (heroes.isEmpty) {
      return const Center(
        child: Text('No heroes available'),
      );
    }

    final totalPages = math.max(1, (heroes.length / _pageSize).ceil());
    final currentPage = _currentPage.clamp(1, totalPages);
    final start = (currentPage - 1) * _pageSize;
    final end = math.min(start + _pageSize, heroes.length);
    final visibleHeroes = heroes.sublist(start, end);

    return Column(
      children: [
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: visibleHeroes.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
            ),
            itemBuilder: (context, i) => HeroCard(
              key: ValueKey(visibleHeroes[i].id),
              hero: visibleHeroes[i],
              index: i,
            ),
          ),
        ),
        if (totalPages > 1)
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: currentPage > 1
                        ? () => setState(() => _currentPage = currentPage - 1)
                        : null,
                    icon: const Icon(Icons.chevron_left),
                    label: const Text('Back'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: currentPage < totalPages
                        ? () => setState(() => _currentPage = currentPage + 1)
                        : null,
                    icon: const Icon(Icons.chevron_right),
                    label: const Text('Next'),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}