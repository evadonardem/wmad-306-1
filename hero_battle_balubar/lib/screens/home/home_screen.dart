import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/widgets/hero_image_widget.dart';
import 'package:hero_battle/router/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildQuickActionButtons(),
              const SizedBox(height: 24),
              _buildActiveDeckPreview(),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      title: const Text(
        'Hero Battle',
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
      ),
      centerTitle: false,
      actions: [
        // Rank badge
        Consumer<PlayerProvider>(
          builder: (context, player, _) {
            final tier = player.rankTier;
            final tierColor = Color(int.parse('0xFF${tier.color}'));
            return GestureDetector(
              onTap: () =>
                  Navigator.pushNamed(context, RouteNames.leaderboard),
              child: Container(
                margin: const EdgeInsets.symmetric(vertical: 12),
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: tierColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border:
                      Border.all(color: tierColor.withValues(alpha: 0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(tier.icon, color: tierColor, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      tier.displayName,
                      style: TextStyle(
                        color: tierColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(width: 6),
        // Coins
        Consumer<PlayerProvider>(
          builder: (context, player, _) => Container(
            margin: const EdgeInsets.symmetric(vertical: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.amber.withValues(alpha: 0.4)),
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
      elevation: 0,
    );
  }

  // ── Active deck preview ──────────────────────────────────────────────

  Widget _buildActiveDeckPreview() {
    return Consumer<DeckProvider>(
      builder: (context, deckProvider, _) {
        if (!deckProvider.hasActiveDeck) {
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: Colors.grey.withValues(alpha: 0.3), width: 1),
              color: Theme.of(context).cardTheme.color,
            ),
            child: Column(
              children: [
                Icon(Icons.dashboard_customize,
                    color: Colors.grey[500], size: 36),
                const SizedBox(height: 8),
                Text('No deck built yet',
                    style: TextStyle(color: Colors.grey[400], fontSize: 14)),
                const SizedBox(height: 8),
                Text('Build a deck to start battling!',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12)),
              ],
            ),
          );
        }

        final deck = deckProvider.activeDeck!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.shield, color: Colors.purple, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Active Deck: ${deck.name}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text('${deck.heroes.length} heroes',
                    style: TextStyle(color: Colors.grey[400], fontSize: 12)),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 90,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: deck.heroes.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final hero = deck.heroes[index];
                  final rarity = hero.getRarity();
                  final rarityColor =
                      Color(int.parse('0xFF${rarity.color}'));
                  return Container(
                    width: 65,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: rarityColor, width: 2),
                      color: Theme.of(context).scaffoldBackgroundColor,
                    ),
                    child: Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: HeroImageWidget(
                            hero: hero,
                            width: 65,
                            height: 90,
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          left: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.7),
                              borderRadius: const BorderRadius.vertical(
                                  bottom: Radius.circular(8)),
                            ),
                            child: Text(
                              hero.name,
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  // ── Action buttons ───────────────────────────────────────────────────

  Widget _buildQuickActionButtons() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                label: 'Quick Battle',
                icon: Icons.flash_on,
                color: Colors.orange,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.battle);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                label: 'Ranked',
                icon: Icons.military_tech,
                color: Colors.red,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.rankedBattle);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                label: 'Build Deck',
                icon: Icons.dashboard,
                color: Colors.blue,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.deckBuilder);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                label: 'Shop',
                icon: Icons.store,
                color: Colors.amber,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.shop);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                label: 'All Cards',
                icon: Icons.collections_bookmark,
                color: Colors.purple,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.collection);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                label: 'Rank & Stats',
                icon: Icons.leaderboard,
                color: Colors.teal,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.leaderboard);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                label: 'History',
                icon: Icons.history,
                color: Colors.cyan,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.history);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                label: 'Profile',
                icon: Icons.person,
                color: Colors.green,
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.profile);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.5), width: 2),
          gradient: LinearGradient(colors: [
            color.withValues(alpha: 0.2),
            color.withValues(alpha: 0.05),
          ]),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
