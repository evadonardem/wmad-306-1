import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/battle_provider.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/router/app_router.dart';
import 'package:hero_battle/services/superhero_api_service.dart';
import 'package:hero_battle/widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  final SuperheroApiService _heroService = SuperheroApiService();

  bool _bootstrapped = false;
  bool _battleStarted = false;
  bool _winsApplied = false;

  List<HeroModel> _playerTeam = <HeroModel>[];
  Future<List<HeroModel>> _aiFuture = Future<List<HeroModel>>.value(<HeroModel>[]);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_bootstrapped) return;
    _bootstrapped = true;

    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is List<HeroModel>) {
      _playerTeam = args.take(5).toList(growable: false);
    } else {
      _playerTeam = context.read<DeckProvider>().deck.take(5).toList(growable: false);
    }

    if (_playerTeam.isEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Add heroes to your deck first!')),
        );
        Navigator.pop(context);
      });
      return;
    }

    _aiFuture = _fetchRandomHeroes(
      count: _playerTeam.length,
      excludeIds: _playerTeam.map((hero) => hero.id).toSet(),
    );
  }

  Future<List<HeroModel>> _fetchRandomHeroes({
    required int count,
    required Set<int> excludeIds,
  }) async {
    final all = await _heroService.fetchHeroes();
    final pool = all.where((hero) => !excludeIds.contains(hero.id)).toList(growable: false);
    if (pool.isEmpty) {
      return all.take(count).toList(growable: false);
    }
    final shuffled = List<HeroModel>.from(pool)..shuffle(Random());
    return shuffled.take(count).toList(growable: false);
  }

  void _ensureBattleStarted(List<HeroModel> aiTeam) {
    if (_battleStarted) return;
    _battleStarted = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<BattleProvider>().startBattle(_playerTeam, aiTeam);
    });
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              Navigator.pushNamed(context, RouteNames.home);
            }
          },
        ),
        title: const Text('Battlefield'),
      ),
      backgroundColor: colorScheme.surface,
      body: Stack(
        children: [
          IgnorePointer(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    colorScheme.primaryContainer.withValues(alpha: 0.18),
                    colorScheme.surface,
                    colorScheme.errorContainer.withValues(alpha: 0.12),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: -90,
                    right: -40,
                    child: Container(
                      width: 230,
                      height: 230,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: colorScheme.primary.withValues(alpha: 0.09),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -110,
                    left: -20,
                    child: Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: colorScheme.error.withValues(alpha: 0.08),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          FutureBuilder<List<HeroModel>>(
            future: _aiFuture,
            builder: (context, snapshot) {
              if (_playerTeam.isEmpty) {
                return const SizedBox.shrink();
              }

              if (snapshot.connectionState != ConnectionState.done) {
                return Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(),
                      const SizedBox(height: 12),
                      Text(
                        'Finding opponents…',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                );
              }

              final aiTeam = snapshot.data ?? <HeroModel>[];
              if (aiTeam.isEmpty) {
                return const Center(child: Text('Unable to find opponents.'));
              }

              _ensureBattleStarted(aiTeam);

              return Consumer<BattleProvider>(
                builder: (context, battle, _) {
                  if (battle.playerTeam.isEmpty || battle.aiTeam.isEmpty) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (battle.battleOver && battle.playerWon && !_winsApplied) {
                    _winsApplied = true;
                    WidgetsBinding.instance.addPostFrameCallback((_) async {
                      if (!mounted) return;
                      await context.read<PlayerProvider>().incrementWins();
                    });
                  }

                  final aiBench = <int>[];
                  final playerBench = <int>[];

                  for (int i = 0; i < battle.aiTeam.length; i++) {
                    if (i != battle.activeAiIndex && battle.aiHps[i] > 0) {
                      aiBench.add(i);
                    }
                  }
                  for (int i = 0; i < battle.playerTeam.length; i++) {
                    if (i != battle.activePlayerIndex && battle.playerHps[i] > 0) {
                      playerBench.add(i);
                    }
                  }

                  return Column(
                    children: [
                      Expanded(
                        child: ListView(
                          padding: const EdgeInsets.all(12),
                          children: [
                            _BenchRow(
                              title: 'AI BENCH',
                              indices: aiBench,
                              heroes: battle.aiTeam,
                              hps: battle.aiHps,
                            ),
                            const SizedBox(height: 8),
                            _FrontRow(
                              heroes: battle.aiTeam,
                              hps: battle.aiHps,
                              activeIndex: battle.activeAiIndex,
                              isPlayerSide: false,
                            ),
                            const SizedBox(height: 10),
                            _BattlefieldDivider(round: battle.round),
                            const SizedBox(height: 10),
                            _FrontRow(
                              heroes: battle.playerTeam,
                              hps: battle.playerHps,
                              activeIndex: battle.activePlayerIndex,
                              isPlayerSide: true,
                            ),
                            const SizedBox(height: 8),
                            _BenchRow(
                              title: 'PLAYER BENCH',
                              indices: playerBench,
                              heroes: battle.playerTeam,
                              hps: battle.playerHps,
                            ),
                            const SizedBox(height: 10),
                            Container(
                              height: 110,
                              width: double.infinity,
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .surfaceContainerHighest
                                    .withValues(alpha: 0.45),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: _BattleLogView(lines: battle.battleLog),
                            ),
                          ],
                        ),
                      ),
                      SafeArea(
                        top: false,
                        minimum: const EdgeInsets.fromLTRB(12, 8, 12, 12),
                        child: !battle.battleOver
                            ? Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: battle.isPlayerTurn
                                              ? () => context
                                                  .read<BattleProvider>()
                                                  .playerAttack(special: false)
                                              : null,
                                          child: const Text('⚔ Attack'),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: battle.isPlayerTurn
                                              ? () => context
                                                  .read<BattleProvider>()
                                                  .playerAttack(special: true)
                                              : null,
                                          child: const Text('✨ Special'),
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (!battle.isPlayerTurn) ...[
                                    const SizedBox(height: 6),
                                    Text(
                                      'Opponent Turn…',
                                      style: Theme.of(context).textTheme.bodySmall,
                                    ),
                                  ],
                                ],
                              )
                            : Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    battle.playerWon ? 'You Win!' : 'AI Wins!',
                                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                          fontWeight: FontWeight.w800,
                                        ),
                                  ),
                                  const SizedBox(height: 8),
                                  SizedBox(
                                    width: double.infinity,
                                    child: FilledButton(
                                      onPressed: () {
                                        context.read<BattleProvider>().resetBattle();
                                        Navigator.popAndPushNamed(
                                          context,
                                          RouteNames.battle,
                                          arguments: _playerTeam,
                                        );
                                      },
                                      child: const Text('Play Again'),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton(
                                      onPressed: () {
                                        context.read<BattleProvider>().resetBattle();
                                        Navigator.pushNamedAndRemoveUntil(
                                          context,
                                          RouteNames.home,
                                          (route) => false,
                                        );
                                      },
                                      child: const Text('Go Home'),
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ],
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}

class _FrontRow extends StatelessWidget {
  final List<HeroModel> heroes;
  final List<int> hps;
  final int activeIndex;
  final bool isPlayerSide;

  const _FrontRow({
    required this.heroes,
    required this.hps,
    required this.activeIndex,
    required this.isPlayerSide,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List<Widget>.generate(5, (index) {
        final hero = index < heroes.length ? heroes[index] : null;
        final hp = index < hps.length ? hps[index] : 0;
        final maxHp = hero == null ? 100 : 100 + hero.durability ~/ 2;
        final isActive = index == activeIndex && hp > 0;
        final isFaceDown = !isPlayerSide && index != activeIndex && hp > 0;
        final defeated = hero != null && hp <= 0;

        Widget slot = _BattleCardSlot(
          hero: hero,
          hp: hp,
          maxHp: maxHp,
          isActive: isActive,
          isFaceDown: isFaceDown,
          isPlayerSide: isPlayerSide,
          defeated: defeated,
        );

        if (isPlayerSide && isActive) {
          slot = slot
              .animate(onPlay: (controller) => controller.repeat(reverse: true))
              .scaleXY(begin: 1.0, end: 1.02, duration: 1500.ms)
              .shimmer(duration: 1500.ms);
        }

        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: slot,
          ),
        );
      }),
    );
  }
}

class _BenchRow extends StatelessWidget {
  final String title;
  final List<int> indices;
  final List<HeroModel> heroes;
  final List<int> hps;

  const _BenchRow({
    required this.title,
    required this.indices,
    required this.heroes,
    required this.hps,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return SizedBox(
      height: 74,
      child: Row(
        children: [
          SizedBox(
            width: 78,
            child: Text(
              title,
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
            ),
          ),
          Expanded(
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, i) {
                final idx = indices[i];
                return Opacity(
                  opacity: 0.55,
                  child: _BenchHeroCard(
                    hero: heroes[idx],
                    hp: hps[idx],
                    maxHp: 100 + heroes[idx].durability ~/ 2,
                  ),
                );
              },
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemCount: indices.length,
            ),
          ),
        ],
      ),
    );
  }
}

class _BenchHeroCard extends StatelessWidget {
  final HeroModel hero;
  final int hp;
  final int maxHp;

  const _BenchHeroCard({required this.hero, required this.hp, required this.maxHp});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      width: 138,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: CachedNetworkImage(
              imageUrl: hero.imageUrl,
              width: 34,
              height: 50,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => const Icon(Icons.broken_image_outlined),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  hero.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.labelMedium,
                ),
                const SizedBox(height: 4),
                LinearProgressIndicator(
                  value: maxHp == 0 ? 0 : hp / maxHp,
                  minHeight: 5,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BattlefieldDivider extends StatelessWidget {
  final int round;

  const _BattlefieldDivider({required this.round});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      height: 36,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            colorScheme.primary.withValues(alpha: 0.24),
            colorScheme.surface.withValues(alpha: 0),
            colorScheme.primary.withValues(alpha: 0.24),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      alignment: Alignment.center,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.gpp_good, color: colorScheme.primary),
          const SizedBox(width: 8),
          Text(
            'Round $round',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(width: 8),
          Icon(Icons.gpp_good, color: colorScheme.primary),
        ],
      ),
    );
  }
}

class _BattleLogView extends StatelessWidget {
  final List<String> lines;

  const _BattleLogView({required this.lines});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final sliced = lines.reversed.take(4).toList(growable: false);

    return ListView.builder(
      itemCount: sliced.length,
      itemBuilder: (context, index) {
        final line = sliced[index];
        Color color = colorScheme.onSurface;
        final lower = line.toLowerCase();
        if (lower.contains('wins')) {
          color = colorScheme.tertiary;
        } else if (lower.contains('defeats') || lower.contains('defeated')) {
          color = colorScheme.error;
        }

        return Padding(
          padding: const EdgeInsets.only(bottom: 4),
          child: Text(
            line,
            style: TextStyle(
              fontFamily: 'monospace',
              fontSize: 12,
              color: color,
            ),
          ),
        );
      },
    );
  }
}

class _BattleCardSlot extends StatelessWidget {
  final HeroModel? hero;
  final int hp;
  final int maxHp;
  final bool isActive;
  final bool isFaceDown;
  final bool isPlayerSide;
  final bool defeated;

  const _BattleCardSlot({
    required this.hero,
    required this.hp,
    required this.maxHp,
    required this.isActive,
    required this.isFaceDown,
    required this.isPlayerSide,
    required this.defeated,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final glowColor = isPlayerSide ? colorScheme.primary : colorScheme.error;

    if (hero == null) {
      return Container(
        height: 165,
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outlineVariant),
        ),
      );
    }

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 250),
      opacity: isActive ? 1 : 0.55,
      child: AnimatedScale(
        duration: const Duration(milliseconds: 250),
        scale: isActive ? 1 : 0.8,
        child: Container(
          height: 165,
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isActive ? glowColor : colorScheme.outlineVariant,
              width: isActive ? 2 : 1,
            ),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: glowColor.withValues(alpha: 0.35),
                      blurRadius: 10,
                    ),
                  ]
                : null,
          ),
          child: Stack(
            children: [
              Positioned.fill(
                child: isFaceDown
                    ? _FaceDownCard(name: hero!.name)
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: CachedNetworkImage(
                          imageUrl: hero!.imageUrl,
                          fit: BoxFit.cover,
                          errorWidget: (_, __, ___) => Container(
                            color: colorScheme.surfaceContainerHighest,
                            alignment: Alignment.center,
                            child: const Icon(Icons.broken_image_outlined),
                          ),
                        ),
                      ),
              ),
              if (!isFaceDown)
                Positioned(
                  left: 6,
                  right: 6,
                  bottom: 6,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: colorScheme.surface.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          hero!.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                        const SizedBox(height: 4),
                        HpBar(label: 'HP', current: hp, max: maxHp),
                      ],
                    ),
                  ),
                ),
              if (defeated)
                Positioned.fill(
                  child: Container(
                    color: colorScheme.surface.withValues(alpha: 0.6),
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.sentiment_very_dissatisfied,
                      color: colorScheme.error,
                      size: 34,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FaceDownCard extends StatelessWidget {
  final String name;

  const _FaceDownCard({required this.name});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      color: colorScheme.surfaceContainerHighest,
      alignment: Alignment.center,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shield_moon, size: 34, color: colorScheme.onSurfaceVariant),
          const SizedBox(height: 6),
          Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.labelMedium,
          ),
        ],
      ),
    );
  }
}