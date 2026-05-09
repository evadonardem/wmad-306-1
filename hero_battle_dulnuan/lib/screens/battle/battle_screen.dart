import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../engine/battle_engine.dart';
import '../../widgets/stat_row.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> with TickerProviderStateMixin {
  HeroModel? _selectedHero1;
  HeroModel? _selectedHero2;
  HeroModel? _winner;
  bool _battleInProgress = false;
  late AnimationController _fadeController;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  void _startBattle() {
    if (_selectedHero1 == null || _selectedHero2 == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select two heroes to battle')),
      );
      return;
    }

    setState(() => _battleInProgress = true);
    _fadeController.reset();

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        final winner = BattleEngine.calculateBattle(_selectedHero1!, _selectedHero2!);
        setState(() {
          _winner = winner;
          _battleInProgress = false;
        });
        _fadeController.forward();

        // Record battle
        final battleRecord = context.read<BattleProvider>().startBattle(
          _selectedHero1!,
          _selectedHero2!,
        );

        // Increment wins if selected hero won
        if (winner.name == _selectedHero1!.name) {
          context.read<PlayerProvider>().incrementWins();
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle Arena')),
      body: Consumer<DeckProvider>(
        builder: (context, deck, _) {
          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),
                // Hero 1 Selection
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hero 1',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_selectedHero1 != null)
                        _buildHeroDisplay(_selectedHero1!, () {
                          setState(() => _selectedHero1 = null);
                        })
                      else
                        _buildHeroSelector(deck.deck, (hero) {
                          setState(() => _selectedHero1 = hero);
                        }),
                    ],
                  ),
                ),
                const SizedBox(height: 30),
                // VS Text
                if (_selectedHero1 != null && _selectedHero2 != null)
                  const Text(
                    'VS',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  )
                else
                  const SizedBox(height: 20),
                const SizedBox(height: 30),
                // Hero 2 Selection
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hero 2',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_selectedHero2 != null)
                        _buildHeroDisplay(_selectedHero2!, () {
                          setState(() => _selectedHero2 = null);
                        })
                      else
                        _buildHeroSelector(deck.deck, (hero) {
                          if (hero.name != _selectedHero1?.name) {
                            setState(() => _selectedHero2 = hero);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Cannot select same hero twice')),
                            );
                          }
                        }),
                    ],
                  ),
                ),
                const SizedBox(height: 30),
                // Battle Result
                if (_winner != null)
                  FadeTransition(
                    opacity: _fadeController,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.green, width: 2),
                            ),
                            child: Column(
                              children: [
                                const Icon(Icons.celebration, size: 40, color: Colors.green),
                                const SizedBox(height: 12),
                                Text(
                                  '${_winner!.name} Wins!',
                                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                    color: Colors.green,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _selectedHero1 = null;
                                _selectedHero2 = null;
                                _winner = null;
                              });
                            },
                            child: const Text('Battle Again'),
                          ),
                        ],
                      ),
                    ),
                  )
                else if (_battleInProgress)
                  const Column(
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text('Battle in progress...'),
                    ],
                  ),
                const SizedBox(height: 30),
              ],
            ),
          );
        },
      ),
      floatingActionButton: !_battleInProgress && _selectedHero1 != null && _selectedHero2 != null
          ? FloatingActionButton.extended(
              onPressed: _startBattle,
              icon: const Icon(Icons.swords),
              label: const Text('Start Battle'),
            )
          : null,
    );
  }

  Widget _buildHeroDisplay(HeroModel hero, VoidCallback onRemove) {
    return Card(
      child: ListTile(
        leading: CachedNetworkImage(
          imageUrl: hero.imageUrl,
          width: 50,
          height: 50,
          fit: BoxFit.cover,
          placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
          errorWidget: (context, url, error) => const Icon(Icons.error),
        ),
        title: Text(hero.name),
        subtitle: Text('Power: ${hero.power}'),
        trailing: IconButton(
          icon: const Icon(Icons.close),
          onPressed: onRemove,
        ),
      ),
    );
  }

  Widget _buildHeroSelector(List<HeroModel> heroes, Function(HeroModel) onSelect) {
    if (heroes.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Text(
              'No heroes in deck. Add heroes from roster.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ),
      );
    }
    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: heroes.length,
        itemBuilder: (context, index) {
          final hero = heroes[index];
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () => onSelect(hero),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: CachedNetworkImage(
                      imageUrl: hero.imageUrl,
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                      errorWidget: (context, url, error) => const Icon(Icons.error),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    hero.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
