import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_image.dart';
import '../../widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  final _api = SuperheroApiService(apiToken: kApiToken);
  final _random = Random();
  Future<List<HeroModel>>? _opponentsFuture;
  HeroModel? _selectedHero;
  bool _battleStarted = false;
  bool _winRecorded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _opponentsFuture ??= _loadOpponents(context.read<DeckProvider>().deckSize);
  }

  Future<List<HeroModel>> _loadOpponents(int count) async {
    final targetCount = count.clamp(1, DeckProvider.maxDeckSize);
    try {
      return await _api.fetchRandomHeroes(count: targetCount);
    } catch (_) {
      final shuffled = [...fallbackHeroes]..shuffle(_random);
      return shuffled.take(targetCount).toList();
    }
  }

  Future<void> _handleAttack(BattleProvider battle, bool special) async {
    await battle.playerAttack(special: special);
    if (!mounted) return;
    if (battle.isComplete && battle.playerWon == true && !_winRecorded) {
      _winRecorded = true;
      await context.read<PlayerProvider>().incrementWins();
    }
  }

  Future<void> _handleDefend(BattleProvider battle) async {
    await battle.playerDefend();
    if (!mounted) return;
    if (battle.isComplete && battle.playerWon == true && !_winRecorded) {
      _winRecorded = true;
      await context.read<PlayerProvider>().incrementWins();
    }
  }

  Future<void> _handlePlay(BattleProvider battle) async {
    battle.playPreparedBattle();
    if (!mounted) return;
    if (battle.isComplete && battle.playerWon == true && !_winRecorded) {
      _winRecorded = true;
      await context.read<PlayerProvider>().incrementWins();
    }
    await battle.saveRecordIfComplete();
  }

  @override
  Widget build(BuildContext context) {
    final deck = context.watch<DeckProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Battle')),
      body: deck.deck.isEmpty
          ? const Center(child: Text('Build a deck before starting a battle.'))
          : FutureBuilder<List<HeroModel>>(
              future: _opponentsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }

                final opponents = snapshot.data ?? [];
                if (opponents.isEmpty) {
                  return const Center(child: Text('No opponents found.'));
                }
                final selectedHero = _selectedHero ?? deck.deck.first;

                return Consumer<BattleProvider>(
                  builder: (context, battle, _) {
                    if (!_battleStarted) {
                      return _BattleSetup(
                        deck: deck.deck,
                        selectedHero: selectedHero,
                        opponents: opponents,
                        onHeroChanged: (hero) =>
                            setState(() => _selectedHero = hero),
                        onStart: () {
                          final battleProvider = context.read<BattleProvider>();
                          battleProvider.prepareTeamBattle(
                            playerTeam: _playerTeamWithSelected(
                              deck.deck,
                              selectedHero,
                            ),
                            aiTeam: opponents,
                          );
                          setState(() {
                            _battleStarted = true;
                            _winRecorded = false;
                          });
                        },
                      );
                    }

                    return _BattleBoard(
                      battle: battle,
                      onPlay: () => _handlePlay(battle),
                      onAttack: () => _handleAttack(battle, false),
                      onDefend: () => _handleDefend(battle),
                      onSpecial: () => _handleAttack(battle, true),
                      onNewOpponent: () {
                        setState(() {
                          _battleStarted = false;
                          _winRecorded = false;
                          _opponentsFuture = _loadOpponents(deck.deckSize);
                        });
                      },
                    );
                  },
                );
              },
            ),
    );
  }

  List<HeroModel> _playerTeamWithSelected(
    List<HeroModel> deck,
    HeroModel selectedHero,
  ) {
    return [selectedHero, ...deck.where((hero) => hero.id != selectedHero.id)];
  }
}

class _BattleSetup extends StatelessWidget {
  const _BattleSetup({
    required this.deck,
    required this.selectedHero,
    required this.opponents,
    required this.onHeroChanged,
    required this.onStart,
  });

  final List<HeroModel> deck;
  final HeroModel selectedHero;
  final List<HeroModel> opponents;
  final ValueChanged<HeroModel> onHeroChanged;
  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Choose your fighter',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        ...deck.indexed.map(
          (entry) =>
              _HeroChoiceCard(
                    hero: entry.$2,
                    selected: entry.$2.id == selectedHero.id,
                    onTap: () => onHeroChanged(entry.$2),
                  )
                  .animate(delay: (50 * entry.$1).ms)
                  .fadeIn(duration: 220.ms)
                  .slideX(begin: -0.08, end: 0, curve: Curves.easeOut),
        ),
        const SizedBox(height: 20),
        Text(
          'Computer Team (${opponents.length})',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        ...opponents.map(
          (opponent) => Card(
            child: ListTile(
              leading: ClipOval(
                child: SizedBox(
                  width: 40,
                  height: 40,
                  child: HeroImage(hero: opponent, iconSize: 22),
                ),
              ),
              title: Text(opponent.name),
              subtitle: Text('HP ${opponent.maxHp} - ATK ${opponent.attack}'),
            ),
          ),
        ),
        const SizedBox(height: 20),
        FilledButton.icon(
              onPressed: onStart,
              icon: const Icon(Icons.sports_mma),
              label: const Text('Start Battle'),
            )
            .animate()
            .fadeIn(duration: 250.ms)
            .scale(begin: const Offset(0.96, 0.96), end: const Offset(1, 1)),
      ],
    );
  }
}

class _HeroChoiceCard extends StatelessWidget {
  const _HeroChoiceCard({
    required this.hero,
    required this.selected,
    required this.onTap,
  });

  final HeroModel hero;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return AnimatedScale(
      duration: const Duration(milliseconds: 160),
      scale: selected ? 1.02 : 1,
      child: Card(
        color: selected ? scheme.primaryContainer : null,
        child: ListTile(
          onTap: onTap,
          leading: ClipOval(
            child: SizedBox(
              width: 44,
              height: 44,
              child: HeroImage(hero: hero, iconSize: 22),
            ),
          ),
          title: Text(hero.name),
          subtitle: Text('HP ${hero.maxHp} - ATK ${hero.attack}'),
          trailing: selected
              ? Icon(Icons.check_circle, color: scheme.primary)
              : const Icon(Icons.radio_button_unchecked),
        ),
      ),
    );
  }
}

class _BattleBoard extends StatelessWidget {
  const _BattleBoard({
    required this.battle,
    required this.onPlay,
    required this.onAttack,
    required this.onDefend,
    required this.onSpecial,
    required this.onNewOpponent,
  });

  final BattleProvider battle;
  final VoidCallback onPlay;
  final VoidCallback onAttack;
  final VoidCallback onDefend;
  final VoidCallback onSpecial;
  final VoidCallback onNewOpponent;

  @override
  Widget build(BuildContext context) {
    final playerHero = battle.playerHero;
    final aiHero = battle.aiHero;

    if (playerHero == null || aiHero == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.warning_amber, size: 42),
              const SizedBox(height: 12),
              const Text('Battle data could not be loaded.'),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: onNewOpponent,
                icon: const Icon(Icons.refresh),
                label: const Text('New Battle'),
              ),
            ],
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _Battleground(
          playerHero: playerHero,
          aiHero: aiHero,
          playerTurn: battle.playerTurn,
          actionInProgress: battle.actionInProgress,
        ),
        const SizedBox(height: 18),
        if (battle.isComplete) ...[
          _MatchResultBanner(playerWon: battle.playerWon == true)
              .animate()
              .fadeIn(duration: 240.ms)
              .scale(
                begin: const Offset(0.94, 0.94),
                end: const Offset(1, 1),
                curve: Curves.easeOutBack,
              ),
          const SizedBox(height: 18),
        ],
        HpBar(
          label:
              '${playerHero.name} (${battle.playerActiveNumber}/${battle.playerTeam.length})',
          current: battle.playerHp,
          max: playerHero.maxHp,
        ),
        const SizedBox(height: 18),
        HpBar(
          label:
              '${aiHero.name} (${battle.aiActiveNumber}/${battle.aiTeam.length})',
          current: battle.aiHp,
          max: aiHero.maxHp,
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            Expanded(
              child: _TeamCount(
                label: 'Your team',
                count: battle.playerRemaining,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _TeamCount(label: 'Computer', count: battle.aiRemaining),
            ),
          ],
        ),
        const SizedBox(height: 18),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          transitionBuilder: (child, animation) {
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(scale: animation, child: child),
            );
          },
          child: Text(
            _battleStatusText(battle),
            key: ValueKey(
              '${battle.isComplete}-${battle.playerTurn}-${battle.rounds}-${battle.playerWon}',
            ),
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ),
        const SizedBox(height: 12),
        if (battle.awaitingPlay)
          FilledButton.icon(
                onPressed: onPlay,
                icon: const Icon(Icons.play_arrow),
                label: const Text('Play'),
              )
              .animate()
              .fadeIn(duration: 180.ms)
              .scale(
                begin: const Offset(0.96, 0.96),
                end: const Offset(1, 1),
                curve: Curves.easeOutBack,
              )
        else
          Row(
            children: [
              Expanded(
                child: AnimatedScale(
                  duration: const Duration(milliseconds: 120),
                  scale: battle.actionInProgress ? 0.97 : 1,
                  child: FilledButton(
                    onPressed:
                        battle.isComplete ||
                            !battle.playerTurn ||
                            battle.actionInProgress
                        ? null
                        : onAttack,
                    child: const Text('Attack'),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: AnimatedScale(
                  duration: const Duration(milliseconds: 120),
                  scale: battle.actionInProgress ? 0.97 : 1,
                  child: FilledButton.tonalIcon(
                    onPressed:
                        battle.isComplete ||
                            !battle.playerTurn ||
                            battle.actionInProgress
                        ? null
                        : onDefend,
                    icon: const Icon(Icons.shield),
                    label: const Text('Defend'),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: AnimatedScale(
                  duration: const Duration(milliseconds: 120),
                  scale: battle.actionInProgress ? 0.97 : 1,
                  child: FilledButton.tonal(
                    onPressed:
                        battle.isComplete ||
                            !battle.playerTurn ||
                            battle.specialUsedThisBattle ||
                            battle.actionInProgress
                        ? null
                        : onSpecial,
                    child: Text(
                      battle.specialUsedThisBattle ? 'Special Used' : 'Special',
                    ),
                  ),
                ),
              ),
            ],
          ),
        if (battle.isComplete) ...[
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: onNewOpponent,
            icon: const Icon(Icons.refresh),
            label: const Text('New Battle'),
          ),
        ],
        const SizedBox(height: 20),
        Text('Battle Log', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          child: Column(
            key: ValueKey(battle.log.map((entry) => entry.message).join('|')),
            crossAxisAlignment: CrossAxisAlignment.start,
            children: battle.log.indexed
                .map(
                  (entry) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: _BattleLogTile(entry: entry.$2)
                        .animate(delay: (25 * entry.$1).ms)
                        .fadeIn(duration: 180.ms)
                        .slideY(begin: -0.15, end: 0),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }

  String _battleStatusText(BattleProvider battle) {
    if (battle.awaitingPlay) {
      return 'Battle ready';
    }

    if (battle.isComplete) {
      return battle.playerWon == true
          ? 'You won in ${battle.rounds} rounds.'
          : 'You lost in ${battle.rounds} rounds.';
    }

    return battle.playerTurn ? 'Your turn' : 'Opponent turn';
  }
}

class _Battleground extends StatelessWidget {
  const _Battleground({
    required this.playerHero,
    required this.aiHero,
    required this.playerTurn,
    required this.actionInProgress,
  });

  final HeroModel playerHero;
  final HeroModel aiHero;
  final bool playerTurn;
  final bool actionInProgress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: _BattleHeroPortrait(
              hero: playerHero,
              active: playerTurn,
              alignRight: false,
            ),
          ),
          AnimatedScale(
            duration: const Duration(milliseconds: 180),
            scale: actionInProgress ? 1.16 : 1,
            child: Text(
              'VS',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: scheme.primary,
              ),
            ),
          ),
          Expanded(
            child: _BattleHeroPortrait(
              hero: aiHero,
              active: !playerTurn,
              alignRight: true,
            ),
          ),
        ],
      ),
    );
  }
}

class _BattleHeroPortrait extends StatelessWidget {
  const _BattleHeroPortrait({
    required this.hero,
    required this.active,
    required this.alignRight,
  });

  final HeroModel hero;
  final bool active;
  final bool alignRight;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return AnimatedSlide(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOut,
      offset: active ? Offset(alignRight ? -0.06 : 0.06, 0) : Offset.zero,
      child: AnimatedScale(
        duration: const Duration(milliseconds: 220),
        scale: active ? 1.05 : 0.96,
        child: Column(
          crossAxisAlignment: alignRight
              ? CrossAxisAlignment.end
              : CrossAxisAlignment.start,
          children: [
            Container(
              width: 86,
              height: 86,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: active ? scheme.primary : scheme.outlineVariant,
                  width: active ? 3 : 1,
                ),
              ),
              clipBehavior: Clip.antiAlias,
              child: HeroImage(hero: hero, iconSize: 34),
            ),
            const SizedBox(height: 6),
            Text(
              hero.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: alignRight ? TextAlign.right : TextAlign.left,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

class _MatchResultBanner extends StatelessWidget {
  const _MatchResultBanner({required this.playerWon});

  final bool playerWon;

  @override
  Widget build(BuildContext context) {
    final color = playerWon ? Colors.green : Colors.red;
    final text = playerWon ? 'VICTORY' : 'DEFEAT';
    final icon = playerWon ? Icons.emoji_events : Icons.sentiment_dissatisfied;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.16),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 8),
          Text(
            text,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class _BattleLogTile extends StatelessWidget {
  const _BattleLogTile({required this.entry});

  final BattleLogEntry entry;

  @override
  Widget build(BuildContext context) {
    final (icon, color) = _styleFor(entry.type);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 8),
        Expanded(child: Text(entry.message)),
      ],
    );
  }

  (IconData, Color) _styleFor(BattleLogType type) {
    return switch (type) {
      BattleLogType.attack => (Icons.flash_on, Colors.orange),
      BattleLogType.special => (Icons.auto_awesome, Colors.amber),
      BattleLogType.defend => (Icons.shield, Colors.lightBlue),
      BattleLogType.roundWin => (Icons.check_circle, Colors.green),
      BattleLogType.roundLoss => (Icons.cancel, Colors.red),
      BattleLogType.victory => (Icons.emoji_events, Colors.green),
      BattleLogType.defeat => (Icons.sentiment_dissatisfied, Colors.red),
      BattleLogType.error => (Icons.warning, Colors.deepOrange),
      BattleLogType.info => (Icons.info_outline, Colors.blueGrey),
    };
  }
}

class _TeamCount extends StatelessWidget {
  const _TeamCount({required this.label, required this.count});

  final String label;
  final int count;

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text('$label: $count left'),
      avatar: const Icon(Icons.groups, size: 18),
    );
  }
}
