import 'package:flutter/material.dart';

import '../models/hero_model.dart';
import '../router/app_router.dart';
import 'hero_image.dart';

class HeroCard extends StatelessWidget {
  const HeroCard({super.key, required this.hero});

  final HeroModel hero;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final alignment = hero.alignment.trim().isEmpty
        ? 'neutral'
        : hero.alignment.trim().toLowerCase();
    final badgeColor = switch (alignment) {
      'good' => Colors.green,
      'bad' => Colors.red,
      _ => Colors.blueGrey,
    };

    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.all(8),
      color: scheme.surfaceContainerHighest,
      child: InkWell(
        onTap: () => Navigator.pushNamed(
          context,
          RouteNames.heroDetail,
          arguments: hero,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(child: HeroImage(hero: hero)),
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hero.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          alignment.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          hero.publisher,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            LinearProgressIndicator(
              value: hero.powerStats.power.clamp(0, 100) / 100,
              minHeight: 4,
              backgroundColor: scheme.surface,
              color: scheme.primary,
            ),
            Container(
              color: scheme.surface,
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              child: Row(
                children: [
                  Expanded(
                    child: _MiniStat(icon: Icons.flash_on, value: hero.attack),
                  ),
                  Expanded(
                    child: _MiniStat(icon: Icons.shield, value: hero.defense),
                  ),
                  Expanded(
                    child: _MiniStat(
                      icon: Icons.auto_awesome,
                      value: hero.specialAttack,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.icon, required this.value});

  final IconData icon;
  final int value;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14),
        const SizedBox(width: 3),
        Flexible(
          child: Text(
            '$value',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }
}
