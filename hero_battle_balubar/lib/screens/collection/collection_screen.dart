import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/hero_search_provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/widgets/hero_card.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen>
    with SingleTickerProviderStateMixin {
  List<HeroModel> _heroes = [];
  bool _isLoading = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadAllHeroes());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadAllHeroes() async {
    setState(() => _isLoading = true);
    final heroSearch = context.read<HeroSearchProvider>();
    _heroes = await heroSearch.getRandomHeroes(count: 20);
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Cards'),
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
          const SizedBox(width: 8),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.purple,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.grey[500],
          tabs: const [
            Tab(
              icon: Icon(Icons.lock_open, size: 18),
              text: 'Unlocked',
            ),
            Tab(
              icon: Icon(Icons.lock, size: 18),
              text: 'Locked',
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Consumer<PlayerProvider>(
              builder: (context, playerProvider, _) {
                final unlocked = _heroes.where((h) {
                  final rarity = h.getRarity();
                  if (rarity.index < CardRarity.rare.index) return true;
                  return playerProvider.isHeroUnlocked(h.id);
                }).toList();

                final locked = _heroes.where((h) {
                  final rarity = h.getRarity();
                  if (rarity.index < CardRarity.rare.index) return false;
                  return !playerProvider.isHeroUnlocked(h.id);
                }).toList();

                unlocked.sort((a, b) => a.powerstats.totalPower
                    .compareTo(b.powerstats.totalPower));
                locked.sort((a, b) => a.powerstats.totalPower
                    .compareTo(b.powerstats.totalPower));

                return TabBarView(
                  controller: _tabController,
                  children: [
                    _buildCardGrid(unlocked, playerProvider, false),
                    _buildCardGrid(locked, playerProvider, true),
                  ],
                );
              },
            ),
    );
  }

  Widget _buildCardGrid(
      List<HeroModel> heroes, PlayerProvider playerProvider, bool isLockedTab) {
    if (heroes.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isLockedTab ? Icons.lock_open : Icons.collections_bookmark,
              color: Colors.grey[600],
              size: 64,
            ),
            const SizedBox(height: 16),
            Text(
              isLockedTab
                  ? 'No locked cards!'
                  : 'No unlocked cards yet',
              style: TextStyle(
                color: Colors.grey[400],
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isLockedTab
                  ? 'You\'ve unlocked everything here.'
                  : 'Buy cards from the Shop to unlock them.',
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            '${heroes.length} cards',
            style: TextStyle(
              color: Colors.grey[400],
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: heroes.length,
            itemBuilder: (context, index) {
              final hero = heroes[index];
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
                    ? () =>
                        _showUnlockDialog(hero, cost, playerProvider)
                    : null,
              );
            },
          ),
        ),
      ],
    );
  }

  void _showUnlockDialog(
      HeroModel hero, int cost, PlayerProvider playerProvider) {
    final canAfford = playerProvider.canUnlock(cost);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).cardTheme.color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.lock_open, color: Colors.amber, size: 24),
            const SizedBox(width: 8),
            Expanded(
              child: Text('Unlock ${hero.name}',
                  style: const TextStyle(fontSize: 18)),
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
              Text(
                'Win more battles to earn coins!',
                style: TextStyle(color: Colors.orange[300], fontSize: 12),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child:
                const Text('Cancel', style: TextStyle(color: Colors.grey)),
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
