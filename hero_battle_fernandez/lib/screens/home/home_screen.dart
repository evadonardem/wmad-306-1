import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../router/app_router.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _api = SuperheroApiService(apiToken: kApiToken);
  final _searchController = TextEditingController();
  late Future<List<HeroModel>> _heroesFuture;

  @override
  void initState() {
    super.initState();
    _heroesFuture = _loadInitialHeroes();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<List<HeroModel>> _loadInitialHeroes() async {
    final searchProvider = context.read<HeroSearchProvider>();
    final lastQuery = await searchProvider.loadLastSearch();

    if (mounted && lastQuery.isNotEmpty) {
      _searchController.text = lastQuery;
      return searchProvider.search(lastQuery, _api);
    }

    return _loadRandomHeroes();
  }

  Future<List<HeroModel>> _loadRandomHeroes() async {
    try {
      return await _api.fetchRandomHeroes(count: 20);
    } catch (_) {
      return fallbackHeroes;
    }
  }

  void _submitSearch(String value) {
    final query = value.trim();
    final searchProvider = context.read<HeroSearchProvider>();
    setState(() {
      _heroesFuture = query.isEmpty
          ? searchProvider.search('', _api).then((_) => _loadRandomHeroes())
          : searchProvider.search(query, _api);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          IconButton(
            tooltip: 'Battle history',
            icon: const Icon(Icons.history),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
          ),
          IconButton(
            tooltip: 'Profile',
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
          Consumer<DeckProvider>(
            builder: (context, deck, _) => Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  tooltip: 'Deck',
                  icon: const Icon(Icons.style),
                  onPressed: () =>
                      Navigator.pushNamed(context, RouteNames.deckBuilder),
                ),
                if (deck.deckSize > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: CircleAvatar(
                      radius: 8,
                      child: Text(
                        '${deck.deckSize}',
                        style: const TextStyle(fontSize: 10),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                labelText: 'Search heroes',
                hintText: 'Try Batman, Thor, Spider-Man',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      tooltip: 'Search',
                      icon: const Icon(Icons.arrow_forward),
                      onPressed: () => _submitSearch(_searchController.text),
                    ),
                    IconButton(
                      tooltip: 'Clear search',
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        _submitSearch('');
                      },
                    ),
                  ],
                ),
                border: const OutlineInputBorder(),
              ),
              onSubmitted: _submitSearch,
            ),
          ),
          Consumer<HeroSearchProvider>(
            builder: (context, search, _) {
              if (!search.hasQuery && !search.isLoading) {
                return const SizedBox.shrink();
              }
              return Padding(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    search.isLoading
                        ? 'Searching...'
                        : search.error ?? 'Results for "${search.query}"',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              );
            },
          ),
          Expanded(
            child: FutureBuilder<List<HeroModel>>(
              future: _heroesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }

                final heroes = snapshot.data ?? [];
                if (heroes.isEmpty) {
                  return const Center(child: Text('No heroes found.'));
                }

                return GridView.builder(
                  padding: const EdgeInsets.only(bottom: 12),
                  itemCount: heroes.length,
                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                    maxCrossAxisExtent: 220,
                    childAspectRatio: 0.68,
                  ),
                  itemBuilder: (context, index) =>
                      HeroCard(hero: heroes[index]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
