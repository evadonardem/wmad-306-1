import 'package:flutter/material.dart';

import '../app_store.dart';
import '../battle_engine.dart';
import '../hero_api.dart';
import '../models.dart';

class HeroDetailPage extends StatefulWidget {
  const HeroDetailPage({super.key, required this.store, required this.heroId});

  final AppStore store;
  final int heroId;

  @override
  State<HeroDetailPage> createState() => _HeroDetailPageState();
}

class _HeroDetailPageState extends State<HeroDetailPage> {
  HeroModel? _hero;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadHero();
  }

  Future<void> _loadHero() async {
    try {
      final hero = await HeroApi.fetchHero(widget.heroId);
      if (!mounted) return;
      setState(() => _hero = hero);
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final hero = _hero;
    if (hero == null) {
      return const Scaffold(body: Center(child: Text('Hero not found')));
    }
    final inDeck = widget.store.containsHero(hero);
    final deckFull = widget.store.deck.length >= AppStore.maxDeck && !inDeck;

    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          AspectRatio(
            aspectRatio: 1.2,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                hero.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, error, stackTrace) => const ColoredBox(
                  color: Colors.black12,
                  child: Center(child: Icon(Icons.shield, size: 64)),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(hero.fullName.isEmpty ? hero.name : hero.fullName),
          const SizedBox(height: 4),
          Text('${hero.publisher} • ${hero.alignment}'),
          const SizedBox(height: 16),
          _StatTile(label: 'Max HP', value: heroMaxHp(hero)),
          _StatTile(label: 'Attack', value: heroAttack(hero)),
          _StatTile(label: 'Special Attack', value: heroSpecialAttack(hero)),
          _StatTile(label: 'Defense', value: heroDefense(hero)),
          _StatTile(label: 'Initiative', value: heroInitiative(hero)),
          const SizedBox(height: 8),
          _StatTile(label: 'Intelligence', value: hero.powerStats.intelligence),
          _StatTile(label: 'Strength', value: hero.powerStats.strength),
          _StatTile(label: 'Speed', value: hero.powerStats.speed),
          _StatTile(label: 'Durability', value: hero.powerStats.durability),
          _StatTile(label: 'Power', value: hero.powerStats.power),
          _StatTile(label: 'Combat', value: hero.powerStats.combat),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: inDeck
                ? () => setState(() => widget.store.removeHero(hero.id))
                : deckFull
                    ? null
                    : () => setState(() => widget.store.addHero(hero)),
            child: Text(inDeck ? 'Remove from Deck' : 'Add to Deck (${widget.store.deck.length}/5)'),
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.label, required this.value});

  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          SizedBox(
            width: 140,
            child: LinearProgressIndicator(value: value / 100),
          ),
          const SizedBox(width: 8),
          SizedBox(width: 28, child: Text('$value')),
        ],
      ),
    );
  }
}
