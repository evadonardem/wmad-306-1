import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../constants.dart';
import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/player_provider.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hp_bar.dart';
import '../../router/app_router.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  final _api = SuperheroApiService(apiToken: kApiToken);
  HeroModel? _playerHero;
  HeroModel? _aiHero;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _setupBattle();
  }

  Future<void> _setupBattle() async {
    final deck = context.read<DeckProvider>();
    if (deck.deck.isEmpty) {
      setState(() {
        _error = 'Your deck is empty. Add heroes first!';
        _loading = false;
      });
      return;
    }

    // Pick a random hero from deck as player hero
    final rng = Random();
    final playerHero = deck.deck[rng.nextInt(deck.deck.length)];

    // Fetch a random AI opponent
    try {
      final aiId = rng.nextInt(731) + 1;
      final aiHero = await _api.fetchHero(aiId);

      if (!mounted) return;
      setState(() {
        _playerHero = playerHero;
        _aiHero = aiHero;
        _loading = false;
      });

      context.read<BattleProvider>().startBattle(playerHero, aiHero);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Failed to load opponent: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Summoning opponent...'),
            ],
          ),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Battle')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 8),
              Text(_error!),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    return Consumer<BattleProvider>(
      builder: (context, battle, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Battle'),
            automaticallyImplyLeading: battle.state == BattleState.idle,
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Player hero HP
                _buildHeroSection(
                  context,
                  hero: _playerHero!,
                  label: context.read<PlayerProvider>().playerName,
                  hp: battle.playerHp,
                  maxHp: battle.playerMaxHp,
                  isPlayer: true,
                ),
                const SizedBox(height: 8),
                Center(
                  child: Text(
                    'VS',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.black,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // AI hero HP
                _buildHeroSection(
                  context,
                  hero: _aiHero!,
                  label: 'AI',
                  hp: battle.aiHp,
                  maxHp: battle.aiMaxHp,
                  isPlayer: false,
                ),

                const SizedBox(height: 12),
                Text('Round ${battle.round}',
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),

                // Battle log
                Expanded(
                  child: Card(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount: battle.log.length,
                      reverse: true,
                      itemBuilder: (_, i) {
                        final entry = battle.log[battle.log.length - 1 - i];
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 2),
                          child: Text(entry, style: const TextStyle(fontSize: 12)),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Action buttons
                if (battle.state == BattleState.inProgress)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        await battle.executeRound();
                        if (battle.state == BattleState.finished && battle.playerWon) {
                          context.read<PlayerProvider>().incrementWins();
                        }
                      },
                      icon: const Icon(Icons.flash_on),
                      label: const Text('Fight Round'),
                    ),
                  )
                else if (battle.state == BattleState.finished)
                  Column(
                    children: [
                      Text(
                        battle.playerWon ? 'Victory!' : 'Defeated!',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: battle.playerWon ? Colors.green : Colors.red,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () {
                                battle.reset();
                                Navigator.pushReplacementNamed(
                                    context, RouteNames.battle);
                              },
                              child: const Text('Rematch'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                battle.reset();
                                Navigator.popUntil(
                                    context, ModalRoute.withName(RouteNames.home));
                              },
                              child: const Text('Home'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeroSection(
    BuildContext context, {
    required HeroModel hero,
    required String label,
    required int hp,
    required int maxHp,
    required bool isPlayer,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: hero.imageUrl.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: hero.imageUrl,
                      width: 60,
                      height: 60,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => const SizedBox(
                          width: 60, height: 60, child: CircularProgressIndicator()),
                      errorWidget: (_, __, ___) =>
                          const Icon(Icons.person, size: 60),
                    )
                  : const Icon(Icons.person, size: 60),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: TextStyle(
                        fontSize: 11,
                        color: isPlayer
                            ? Theme.of(context).colorScheme.primary
                            : Colors.red,
                        fontWeight: FontWeight.bold,
                      )),
                  Text(hero.name,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 6),
                  HpBar(current: hp, max: maxHp, label: 'HP'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
