import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../providers/deck_provider.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart';
import '../../router/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final SuperheroApiService _apiService = SuperheroApiService();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadPopularHeroes();
  }

  Future<void> _loadPopularHeroes() async {
    setState(() => _isLoading = true);
    try {
      final heroes = await _apiService.searchHeroes('a');
      if (mounted) {
        context.read<HeroSearchProvider>().setHeroes(heroes);
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _searchHeroes(String query) async {
    if (query.isEmpty) {
      _loadPopularHeroes();
      return;
    }
    setState(() => _isLoading = true);
    try {
      final heroes = await _apiService.searchHeroes(query);
      if (mounted) {
        context.read<HeroSearchProvider>().setHeroes(heroes);
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.style),
                onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
              ),
              Consumer<DeckProvider>(
                builder: (context, deck, _) {
                  if (deck.deck.isEmpty) return const SizedBox();
                  return Positioned(
                    right: 6,
                    top: 6,
                    child: CircleAvatar(
                      radius: 8,
                      backgroundColor: Colors.red,
                      child: Text(
                        '${deck.deck.length}',
                        style: const TextStyle(fontSize: 10, color: Colors.white)
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: _searchHeroes,
              decoration: InputDecoration(
                hintText: 'Search heroes...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _loadPopularHeroes();
                        },
                      )
                    : null,
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Consumer<HeroSearchProvider>(
                    builder: (context, heroProvider, _) {
                      if (heroProvider.heroes.isEmpty) {
                        return const Center(
                          child: Text('No heroes found. Try searching!'),
                        );
                      }
                      return GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.75,
                        ),
                        itemCount: heroProvider.heroes.length,
                        itemBuilder: (context, index) {
                          final hero = heroProvider.heroes[index];
                          return HeroCard(
                            hero: hero,
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                RouteNames.heroDetail,
                                arguments: hero,
                              );
                            },
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          if (deck.deck.length < 2) {
            return FloatingActionButton.extended(
              onPressed: null,
              backgroundColor: Colors.grey,
              icon: const Icon(Icons.swords),
              label: const Text('Select ${2 - deck.deck.length} more'),
            );
          }
          return FloatingActionButton.extended(
            onPressed: () => Navigator.pushNamed(context, RouteNames.battle),
            icon: const Icon(Icons.swords),
            label: const Text('Start Battle'),
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}