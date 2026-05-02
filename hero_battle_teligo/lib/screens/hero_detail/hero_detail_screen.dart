import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;
  const HeroDetailScreen({super.key, required this.hero});

  Color get _alignmentColor => hero.alignment == 'good'
      ? const Color(0xFF4ADE80)
      : hero.alignment == 'bad'
          ? const Color(0xFFF87171)
          : const Color(0xFFFBBF24);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero image app bar
          SliverAppBar(
            expandedHeight: 260,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Hero image
                  hero.imageUrl.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: hero.imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Container(
                            color: const Color(0xFF1A0A2E),
                            child: const Center(
                              child: CircularProgressIndicator(color: Color(0xFF7B2FBE)),
                            ),
                          ),
                          errorWidget: (_, __, ___) => Container(
                            color: const Color(0xFF1A0A2E),
                            child: const Center(
                              child: Text('🦸', style: TextStyle(fontSize: 80)),
                            ),
                          ),
                        )
                      : Container(
                          color: const Color(0xFF1A0A2E),
                          child: const Center(
                            child: Text('🦸', style: TextStyle(fontSize: 80)),
                          ),
                        ),
                  // Gradient overlay bottom
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Color(0xFF0D0D1A)],
                        stops: [0.5, 1.0],
                      ),
                    ),
                  ),
                  // Hero name overlay
                  Positioned(
                    bottom: 16, left: 16, right: 16,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          hero.name,
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFE2D9F3),
                          ),
                        ),
                        if (hero.fullName.isNotEmpty)
                          Text(
                            hero.fullName,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF9370DB)),
                          ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            if (hero.publisher.isNotEmpty)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1A1A2E),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
                                ),
                                child: Text(
                                  hero.publisher,
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF9370DB)),
                                ),
                              ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: hero.alignment == 'good'
                                    ? const Color(0xFF0F2D1F)
                                    : hero.alignment == 'bad'
                                        ? const Color(0xFF2D0F0F)
                                        : const Color(0xFF2D1F00),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                hero.alignment[0].toUpperCase() + hero.alignment.substring(1),
                                style: TextStyle(fontSize: 11, color: _alignmentColor, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Derived game stats
                  const Text(
                    'GAME STATS',
                    style: TextStyle(fontSize: 11, color: Color(0xFF666666), letterSpacing: 2),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _statChip('HP', '${hero.maxHp}', const Color(0xFF4ADE80), const Color(0xFF0F2D1F)),
                      const SizedBox(width: 10),
                      _statChip('ATK', '${hero.attack}', const Color(0xFFA855F7), const Color(0xFF1A0A2E)),
                      const SizedBox(width: 10),
                      _statChip('S.ATK', '${hero.specialAttack}', const Color(0xFF60A5FA), const Color(0xFF0A1A2E)),
                      const SizedBox(width: 10),
                      _statChip('DEF', '${hero.defense}', const Color(0xFFFBBF24), const Color(0xFF2D1F00)),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Power stats
                  const Text(
                    'POWER STATS',
                    style: TextStyle(fontSize: 11, color: Color(0xFF666666), letterSpacing: 2),
                  ),
                  const SizedBox(height: 12),
                  StatRow(label: 'Intelligence', value: hero.powerStats.intelligence, color: const Color(0xFF60A5FA)),
                  StatRow(label: 'Strength', value: hero.powerStats.strength, color: const Color(0xFFF87171)),
                  StatRow(label: 'Speed', value: hero.powerStats.speed, color: const Color(0xFFFBBF24)),
                  StatRow(label: 'Durability', value: hero.powerStats.durability, color: const Color(0xFF4ADE80)),
                  StatRow(label: 'Power', value: hero.powerStats.power, color: const Color(0xFFA855F7)),
                  StatRow(label: 'Combat', value: hero.powerStats.combat, color: const Color(0xFFF87171)),

                  const SizedBox(height: 24),

                  // Add to deck button
                  Consumer<DeckProvider>(
                    builder: (context, deck, _) {
                      final inDeck = deck.contains(hero);
                      return Column(
                        children: [
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: inDeck
                                  ? () => deck.removeHero(hero)
                                  : deck.isFull
                                      ? null
                                      : () {
                                          deck.addHero(hero);
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text('${hero.name} added to deck!'),
                                              backgroundColor: const Color(0xFF7B2FBE),
                                              behavior: SnackBarBehavior.floating,
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                            ),
                                          );
                                        },
                              icon: Icon(inDeck ? Icons.remove_circle_outline : Icons.add_circle_outline),
                              label: Text(
                                inDeck ? 'Remove from Deck' : deck.isFull ? 'Deck Full (5/5)' : 'Add to Deck',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: inDeck
                                    ? const Color(0xFF1A1A2E)
                                    : deck.isFull
                                        ? const Color(0xFF1A1A2E)
                                        : const Color(0xFF7B2FBE),
                                foregroundColor: inDeck
                                    ? const Color(0xFFA855F7)
                                    : deck.isFull
                                        ? const Color(0xFF666666)
                                        : Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  side: BorderSide(
                                    color: inDeck ? const Color(0xFF7B2FBE) : Colors.transparent,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          if (deck.isReady) ...[
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                onPressed: () => Navigator.pushNamed(context, RouteNames.battle),
                                icon: const Icon(Icons.sports_martial_arts_rounded, color: Color(0xFFF87171)),
                                label: const Text(
                                  'Go to Battle!',
                                  style: TextStyle(color: Color(0xFFF87171), fontWeight: FontWeight.w600),
                                ),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  side: const BorderSide(color: Color(0xFFF87171)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                            ),
                          ],
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statChip(String label, String value, Color textColor, Color bgColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: textColor.withOpacity(0.3), width: 0.5),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textColor)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF666666), letterSpacing: 0.5)),
          ],
        ),
      ),
    );
  }
}
