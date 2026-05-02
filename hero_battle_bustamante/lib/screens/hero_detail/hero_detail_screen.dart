import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../router/app_router.dart';
import '../../theme/cyber_theme.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;
  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Collapsing hero image header ──
          SliverAppBar(
            expandedHeight: 360,
            pinned: true,
            backgroundColor: cs.surface,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                hero.name,
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                  color: cs.onSurface,
                  shadows: const [
                    Shadow(blurRadius: 12, color: Colors.black87),
                  ],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  hero.imageUrl.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: hero.imageUrl,
                          fit: BoxFit.cover,
                          errorWidget: (x, y, z) =>
                              Container(color: cs.surfaceContainerHighest),
                        )
                      : Container(color: cs.surfaceContainerHighest),
                  // Gradient overlay
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          cs.surface.withValues(alpha: 0.3),
                          cs.surface,
                        ],
                        stops: const [0.0, 0.6, 1.0],
                      ),
                    ),
                  ),
                  // Alignment badge
                  if (hero.alignment != 'unknown' && hero.alignment.isNotEmpty)
                    Positioned(
                      top: 100,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: hero.alignment == 'good'
                              ? Colors.green.withValues(alpha: 0.85)
                              : hero.alignment == 'bad'
                                  ? Colors.red.withValues(alpha: 0.85)
                                  : Colors.grey.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.3),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: Text(
                          hero.alignment.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // ── Body ──
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Biography section
                  _SectionCard(
                    title: 'BIOGRAPHY',
                    icon: Icons.menu_book_rounded,
                    child: Column(
                      children: [
                        _BioRow(
                            label: 'Full Name',
                            value: hero.fullName.isEmpty ? '—' : hero.fullName),
                        _BioRow(label: 'Publisher', value: hero.publisher),
                        _BioRow(
                            label: 'Alignment',
                            value: hero.alignment,
                            valueColor: hero.alignment == 'good'
                                ? Colors.green
                                : hero.alignment == 'bad'
                                    ? Colors.red
                                    : null),
                      ],
                    ),
                  ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.04),

                  const SizedBox(height: 14),

                  // Power Stats
                  _SectionCard(
                    title: 'POWER STATS',
                    icon: Icons.bar_chart_rounded,
                    child: Column(
                      children: [
                        StatRow(
                            label: 'Intelligence',
                            value: hero.powerstats.intelligence,
                            icon: Icons.psychology_rounded,
                            barColor: CyberColors.intelligence),
                        StatRow(
                            label: 'Strength',
                            value: hero.powerstats.strength,
                            icon: Icons.fitness_center_rounded,
                            barColor: CyberColors.strength),
                        StatRow(
                            label: 'Speed',
                            value: hero.powerstats.speed,
                            icon: Icons.speed_rounded,
                            barColor: CyberColors.speed),
                        StatRow(
                            label: 'Durability',
                            value: hero.powerstats.durability,
                            icon: Icons.shield_rounded,
                            barColor: CyberColors.durability),
                        StatRow(
                            label: 'Power',
                            value: hero.powerstats.power,
                            icon: Icons.bolt_rounded,
                            barColor: CyberColors.power),
                        StatRow(
                            label: 'Combat',
                            value: hero.powerstats.combat,
                            icon: Icons.sports_mma_rounded,
                            barColor: CyberColors.combat),
                      ],
                    ),
                  ).animate().fadeIn(delay: 150.ms, duration: 400.ms).slideX(begin: 0.04),

                  const SizedBox(height: 14),

                  // Game Stats
                  _SectionCard(
                    title: 'GAME STATS',
                    icon: Icons.videogame_asset_rounded,
                    child: Column(
                      children: [
                        StatRow(
                            label: 'HP',
                            value: hero.hp,
                            maxValue: 500,
                            icon: Icons.favorite_rounded,
                            barColor: CyberColors.hp),
                        StatRow(
                            label: 'Attack',
                            value: hero.attack,
                            maxValue: 200,
                            icon: Icons.flash_on_rounded,
                            barColor: CyberColors.attack),
                        StatRow(
                            label: 'Defense',
                            value: hero.defense,
                            maxValue: 150,
                            icon: Icons.shield_outlined,
                            barColor: CyberColors.defense),
                        StatRow(
                            label: 'Special',
                            value: hero.specialAttack,
                            maxValue: 200,
                            icon: Icons.auto_awesome_rounded,
                            barColor: CyberColors.special),
                        StatRow(
                            label: 'Speed',
                            value: hero.speed,
                            maxValue: 100,
                            icon: Icons.speed_rounded,
                            barColor: CyberColors.speed),
                      ],
                    ),
                  ).animate().fadeIn(delay: 300.ms, duration: 400.ms).slideX(begin: -0.04),

                  const SizedBox(height: 90),
                ],
              ),
            ),
          ),
        ],
      ),

      // ── Bottom action bar ──
      bottomNavigationBar: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          final inDeck = deck.containsHero(hero.id);
          return Container(
            decoration: BoxDecoration(
              color: cs.surface,
              border: Border(
                top: BorderSide(
                  color: cs.primary.withValues(alpha: 0.1),
                ),
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                child: Row(
                  children: [
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: () {
                          if (inDeck) {
                            deck.removeHero(hero.id);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                  content:
                                      Text('${hero.name} removed from deck')),
                            );
                          } else {
                            deck.addHero(hero);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(deck.message)),
                            );
                          }
                        },
                        icon: Icon(
                            inDeck
                                ? Icons.remove_circle_rounded
                                : Icons.add_circle_rounded,
                            size: 20),
                        label: Text(
                            inDeck ? 'Remove from Deck' : 'Add to Deck'),
                        style: FilledButton.styleFrom(
                          backgroundColor: inDeck ? cs.error : cs.primary,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    SizedBox(
                      height: 48,
                      child: FilledButton.tonal(
                        onPressed: () => Navigator.pushNamed(
                          context,
                          RouteNames.battle,
                          arguments: hero,
                        ),
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.sports_mma_rounded, size: 20),
                            SizedBox(width: 8),
                            Text('Fight!'),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.icon,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: cs.primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, size: 16, color: cs.primary),
                ),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                        color: cs.primary,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            child,
          ],
        ),
      ),
    );
  }
}

class _BioRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _BioRow({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: cs.onSurface.withValues(alpha: 0.5),
                  ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: valueColor,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
