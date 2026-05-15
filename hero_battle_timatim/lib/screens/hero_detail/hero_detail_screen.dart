// Hero detail screen with clean info cards and consistent controls.

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../theme/app_theme.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;
  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final powerStats = hero.powerStats;
    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(AppSpacing.radius),
                child: CachedNetworkImage(
                  imageUrl: hero.imageUrl,
                  height: 320,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => const SizedBox(
                    height: 320,
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  errorWidget: (context, url, error) => const SizedBox(
                    height: 320,
                    child: Center(child: Icon(Icons.broken_image, size: 64)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.medium),
            Text(hero.name, style: Theme.of(context).textTheme.titleLarge),
            if (hero.fullName.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.small),
              Text(hero.fullName, style: Theme.of(context).textTheme.bodyMedium),
            ],
            const SizedBox(height: AppSpacing.small),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                _InfoChip(label: hero.publisher),
                _InfoChip(label: hero.alignment),
              ],
            ),
            const SizedBox(height: AppSpacing.large),
            Text('Power Stats', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.small),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Column(
                  children: [
                    _StatItem(label: 'Intelligence', value: powerStats.intelligence),
                    _StatItem(label: 'Strength', value: powerStats.strength),
                    _StatItem(label: 'Speed', value: powerStats.speed),
                    _StatItem(label: 'Durability', value: powerStats.durability),
                    _StatItem(label: 'Power', value: powerStats.power),
                    _StatItem(label: 'Combat', value: powerStats.combat),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Text('Battle Stats', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.small),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Column(
                  children: [
                    _StatTile(label: 'HP', value: hero.maxHp),
                    _StatTile(label: 'Attack', value: hero.attack),
                    _StatTile(label: 'Defense', value: hero.defense),
                    _StatTile(label: 'Initiative', value: hero.initiative),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Consumer<DeckProvider>(
              builder: (context, deck, _) {
                final inDeck = deck.contains(hero);
                final disabled = !inDeck && deck.isFull;
                return ElevatedButton.icon(
                  onPressed: disabled
                      ? null
                      : () => inDeck
                          ? deck.removeHero(hero)
                          : deck.addHero(hero),
                  icon: Icon(inDeck ? Icons.remove_circle : Icons.add_circle),
                  label: Text(inDeck ? 'Remove from Deck' : 'Add to Deck'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: inDeck ? AppColors.danger : AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(52),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String label;
  const _InfoChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(label.isEmpty ? 'Unknown' : label),
      backgroundColor: AppColors.surfaceSoft,
      labelStyle: const TextStyle(color: AppColors.textHigh),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final int value;
  const _StatItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodyMedium),
          Text('$value', style: Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final String label;
  final int value;
  const _StatTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodyMedium),
          Text(
            '$value',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
          ),
        ],
      ),
    );
  }
}
