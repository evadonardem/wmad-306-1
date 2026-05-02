import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../router/app_router.dart';
import '../../services/superhero_api_service.dart';
import '../../constants.dart';
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final Future<List<HeroModel>> _heroesFuture;
  final _api = SuperheroApiService(apiToken: kApiToken);
  final _searchController = TextEditingController();
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _heroesFuture = _api.fetchRandomHeroes(count: 20);
    // Load last search (Exercise 4)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HeroSearchProvider>().loadLastSearch().then((_) {
        final q = context.read<HeroSearchProvider>().query;
        if (q.isNotEmpty) {
          _searchController.text = q;
          setState(() => _isSearching = true);
        }
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _submitSearch(String query) {
    if (query.trim().isEmpty) return;
    setState(() => _isSearching = true);
    context.read<HeroSearchProvider>().search(query.trim());
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() => _isSearching = false);
    context.read<HeroSearchProvider>().clearSearch();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Hero Roster',
          style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600),
        ),
        actions: [
          // Deck badge
          Consumer<DeckProvider>(
            builder: (_, deck, __) => Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.style_rounded, color: Color(0xFFA855F7)),
                  onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                ),
                if (deck.deckSize > 0)
                  Positioned(
                    right: 6, top: 6,
                    child: Container(
                      width: 16, height: 16,
                      decoration: const BoxDecoration(
                        color: Color(0xFF7B2FBE),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          '${deck.deckSize}',
                          style: const TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.history_rounded, color: Color(0xFF9370DB)),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
          ),
          IconButton(
            icon: const Icon(Icons.person_rounded, color: Color(0xFF9370DB)),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Color(0xFFE2D9F3), fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search heroes...',
                hintStyle: const TextStyle(color: Color(0xFF666666), fontSize: 14),
                prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF666666), size: 20),
                suffixIcon: _isSearching
                    ? IconButton(
                        icon: const Icon(Icons.close_rounded, color: Color(0xFF666666), size: 18),
                        onPressed: _clearSearch,
                      )
                    : null,
                filled: true,
                fillColor: const Color(0xFF1A1A2E),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF2A2A3E), width: 0.5),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF2A2A3E), width: 0.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF7B2FBE), width: 1),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onSubmitted: _submitSearch,
              textInputAction: TextInputAction.search,
            ),
          ),

          // Content
          Expanded(
            child: _isSearching ? _buildSearchResults() : _buildRandomHeroes(),
          ),
        ],
      ),
    );
  }

  Widget _buildRandomHeroes() {
    return FutureBuilder<List<HeroModel>>(
      future: _heroesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(color: Color(0xFF7B2FBE)),
                SizedBox(height: 16),
                Text('Loading heroes...', style: TextStyle(color: Color(0xFF9370DB), fontSize: 14)),
              ],
            ),
          );
        }
        if (snapshot.hasError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, color: Color(0xFFF87171), size: 48),
                const SizedBox(height: 12),
                Text(
                  'Failed to load heroes\n${snapshot.error}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Color(0xFFF87171), fontSize: 13),
                ),
              ],
            ),
          );
        }
        final heroes = snapshot.data!;
        return _buildGrid(heroes);
      },
    );
  }

  Widget _buildSearchResults() {
    return Consumer<HeroSearchProvider>(
      builder: (_, provider, __) {
        if (provider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(color: Color(0xFF7B2FBE)),
          );
        }
        if (provider.error != null) {
          return Center(
            child: Text(
              'Error: ${provider.error}',
              style: const TextStyle(color: Color(0xFFF87171)),
            ),
          );
        }
        if (provider.results.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('🦸', style: TextStyle(fontSize: 48)),
                SizedBox(height: 12),
                Text('No heroes found', style: TextStyle(color: Color(0xFF666666), fontSize: 14)),
              ],
            ),
          );
        }
        return _buildGrid(provider.results);
      },
    );
  }

  Widget _buildGrid(List<HeroModel> heroes) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      itemCount: heroes.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.68,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemBuilder: (_, i) => HeroCard(hero: heroes[i]),
    );
  }
}
