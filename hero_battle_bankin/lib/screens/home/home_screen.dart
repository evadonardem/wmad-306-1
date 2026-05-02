import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/hero_search_provider.dart';
import '../../providers/deck_provider.dart';
import '../../models/hero_model.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart'; 
import '../../router/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final Future<List<HeroModel>> _heroesFuture;
  final SuperheroApiService _api = SuperheroApiService(apiToken: '7905a60ab03c8c9260b99f2c57de7d16');
  late final TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _heroesFuture = _api.fetchRandomHeroes(count: 20);
    final lastSearch = context.read<HeroSearchProvider>().lastQuery;
    _searchController = TextEditingController(text: lastSearch);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchProv = context.watch<HeroSearchProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Battle Arena'),
        actions: [
          IconButton(
            icon: const Icon(Icons.emoji_events, color: Colors.amber), 
            tooltip: 'Hall of Fame',
            onPressed: () => Navigator.pushNamed(context, RouteNames.ranking)
          ),
          Consumer<DeckProvider>(
            builder: (context, deck, _) => Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.style),
                  tooltip: 'Deck Builder',
                  onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                ),
                if (deck.deckSize > 0)
                  Positioned(
                    right: 6, top: 6,
                    child: CircleAvatar(
                      radius: 9,
                      backgroundColor: Colors.redAccent,
                      child: Text('${deck.deckSize}', 
                        style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)
                      ),
                    ),
                  ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.history), 
            tooltip: 'Battle History',
            onPressed: () => Navigator.pushNamed(context, RouteNames.history)
          ),
          IconButton(
            icon: const Icon(Icons.groups, color: Colors.amber), 
            tooltip: '5v5 Team Skirmish',
            onPressed: () => Navigator.pushNamed(context, RouteNames.teamBattle)
          ),
          IconButton(
            icon: const Icon(Icons.person), 
            tooltip: 'Profile',
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile)
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search hero name...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onSubmitted: (value) => context.read<HeroSearchProvider>().searchHeroes(value),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    context.read<HeroSearchProvider>().clearSearch();
                  },
                )
              ],
            ),
          ),
          if (searchProv.searchResults.isNotEmpty)
            Container(
              height: 50,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: HeroRarity.values.map((rarity) {
                  final isSelected = searchProv.selectedRarity == rarity;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(rarity.name.toUpperCase()),
                      selected: isSelected,
                      onSelected: (val) => searchProv.setRarityFilter(val ? rarity : null),
                      selectedColor: Colors.amber.withOpacity(0.3),
                    ),
                  );
                }).toList(),
              ),
            ),
          Expanded(
            child: Consumer<HeroSearchProvider>(
              builder: (context, prov, _) {
                if (prov.isLoading) return const Center(child: CircularProgressIndicator());
                if (prov.searchResults.isNotEmpty) {
                  return _buildGrid(prov.filteredResults);
                }
                return FutureBuilder<List<HeroModel>>(
                  future: _heroesFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState != ConnectionState.done) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    return _buildGrid(snapshot.data ?? []);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid(List<HeroModel> heroes) {
    if (heroes.isEmpty) return const Center(child: Text('No heroes found in this category.'));
    
    // We use context.watch here to react whenever stars are upgraded globally
    final deckProv = context.watch<DeckProvider>();

    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.65,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: heroes.length,
      itemBuilder: (context, index) {
        final apiHero = heroes[index];
        
        // --- SYNC WITH GLOBAL VAULT ---
        // Check if we have saved stars for this hero ID
        final int savedStars = deckProv.globalUpgrades[apiHero.id] ?? 0;
        
        // Create a copy of the hero that includes the saved stars
        final displayHero = apiHero.copyWith(stars: savedStars);

        return FlashyHeroCard(hero: displayHero);
      },
    );
  }
}

