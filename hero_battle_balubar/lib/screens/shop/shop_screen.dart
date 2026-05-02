import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/hero_search_provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/widgets/hero_card.dart';
import 'package:hero_battle/services/prefs_service.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  final TextEditingController _searchController = TextEditingController();
  final PrefsService _prefs = PrefsService();

  @override
  void initState() {
    super.initState();
    _loadHeroes();
    _loadLastSearch();
  }

  void _loadHeroes() {
    Future.microtask(() {
      if (!mounted) return;
      context.read<HeroSearchProvider>().getRandomHeroes(count: 8);
    });
  }

  void _loadLastSearch() async {
    final lastQuery = await _prefs.loadLastSearch();
    if (lastQuery != null && lastQuery.isNotEmpty && mounted) {
      _searchController.text = lastQuery;
      context.read<HeroSearchProvider>().searchHeroes(lastQuery);
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
        title: const Text('Shop'),
        actions: [
          Consumer<PlayerProvider>(
            builder: (context, player, _) => Container(
              margin: const EdgeInsets.symmetric(vertical: 12),
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(20),
                border:
                    Border.all(color: Colors.amber.withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.monetization_on,
                      color: Colors.amber, size: 18),
                  const SizedBox(width: 4),
                  Text(
                    '${player.coins}',
                    style: const TextStyle(
                      color: Colors.amber,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.refresh, color: Colors.grey[400]),
            onPressed: _loadHeroes,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(child: _buildShopGrid()),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
              color: Colors.purple.withValues(alpha: 0.3), width: 2),
          gradient: LinearGradient(colors: [
            Colors.purple.withValues(alpha: 0.1),
            Colors.blue.withValues(alpha: 0.05),
          ]),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: TextField(
            controller: _searchController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Search heroes...',
              hintStyle: TextStyle(color: Colors.grey[500]),
              border: InputBorder.none,
              prefixIcon: const Icon(Icons.search, color: Colors.purple),
              suffixIcon: _searchController.text.isNotEmpty
                  ? GestureDetector(
                      onTap: () {
                        _searchController.clear();
                        context.read<HeroSearchProvider>().clearSearch();
                        _prefs.saveLastSearch('');
                        setState(() {});
                      },
                      child: const Icon(Icons.clear, color: Colors.purple),
                    )
                  : null,
            ),
            onChanged: (value) {
              setState(() {});
            },
            onSubmitted: (value) {
              if (value.isNotEmpty) {
                _prefs.saveLastSearch(value);
                context.read<HeroSearchProvider>().searchHeroes(value);
              }
            },
          ),
        ),
      ),
    );
  }

  Widget _buildShopGrid() {
    return Consumer2<HeroSearchProvider, PlayerProvider>(
      builder: (context, heroProvider, playerProvider, _) {
        final heroes = heroProvider.hasSearchResults
            ? heroProvider.searchResults
            : heroProvider.allHeroes;

        if (heroProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (heroProvider.errorMessage != null) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(heroProvider.errorMessage!,
                  style: const TextStyle(color: Colors.red)),
            ),
          );
        }

        if (heroes.isEmpty) {
          return Center(
            child: Text('No heroes found',
                style: TextStyle(color: Colors.grey[400], fontSize: 16)),
          );
        }

        final sorted = List<HeroModel>.from(heroes);
        sorted.sort((a, b) {
          final aLocked = a.getRarity().index >= CardRarity.rare.index &&
              !playerProvider.isHeroUnlocked(a.id);
          final bLocked = b.getRarity().index >= CardRarity.rare.index &&
              !playerProvider.isHeroUnlocked(b.id);
          if (aLocked != bLocked) return aLocked ? 1 : -1;
          return a.powerstats.totalPower.compareTo(b.powerstats.totalPower);
        });

        return GridView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.7,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: sorted.length,
          itemBuilder: (context, index) {
            final hero = sorted[index];
            final rarity = hero.getRarity();
            final needsUnlock = rarity.index >= CardRarity.rare.index;
            final isLocked =
                needsUnlock && !playerProvider.isHeroUnlocked(hero.id);
            final cost =
                playerProvider.unlockCost(hero.powerstats.totalPower);

            return HeroCard(
              hero: hero,
              isLocked: isLocked,
              unlockCost: cost,
              onTap: isLocked
                  ? () => _showUnlockDialog(hero, cost, playerProvider)
                  : null,
            );
          },
        );
      },
    );
  }

  void _showUnlockDialog(
      HeroModel hero, int cost, PlayerProvider playerProvider) {
    final canAfford = playerProvider.canUnlock(cost);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).cardTheme.color,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.lock_open, color: Colors.amber, size: 24),
            const SizedBox(width: 8),
            Expanded(
              child: Text('Unlock ${hero.name}',
                  style:
                      const TextStyle(fontSize: 18)),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'This ${hero.getRarity().displayName} hero costs $cost coins to unlock.',
              style: TextStyle(color: Colors.grey[300], fontSize: 14),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.monetization_on,
                    color: Colors.amber, size: 20),
                const SizedBox(width: 6),
                Text(
                  'Your balance: ${playerProvider.coins}',
                  style: TextStyle(
                    color: canAfford ? Colors.amber : Colors.red,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            if (!canAfford) ...[
              const SizedBox(height: 12),
              Text('Win more battles to earn coins!',
                  style:
                      TextStyle(color: Colors.orange[300], fontSize: 12)),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel',
                style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: canAfford
                ? () {
                    playerProvider.unlockHero(hero.id, cost);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('${hero.name} unlocked!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  }
                : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              disabledBackgroundColor: Colors.grey[700],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.monetization_on, size: 16),
                const SizedBox(width: 4),
                Text('$cost',
                    style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
