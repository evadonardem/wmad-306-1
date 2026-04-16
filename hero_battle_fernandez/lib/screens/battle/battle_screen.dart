import 'dart:math';

import 'package:flutter/material.dart';
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
  late Future<HeroModel> _opponentFuture;
  HeroModel? _selectedHero;
  bool _battleStarted = false;
  bool _winRecorded = false;

  @override
  void initState() {
    super.initState();
    _opponentFuture = _loadOpponent();
  }

  Future<HeroModel> _loadOpponent() async {
    try {
      final heroes = await _api.fetchRandomHeroes(count: 1);
      return heroes.first;
    } catch (_) {
      return fallbackHeroes[_random.nextInt(fallbackHeroes.length)];
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

  @override
  Widget build(BuildContext context) {
    final deck = context.watch<DeckProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Battle')),
      body: deck.deck.isEmpty
          ? const Center(child: Text('Build a deck before starting a battle.'))
          : FutureBuilder<HeroModel>(
              future: _opponentFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }

                final opponent = snapshot.data!;
                final selectedHero = _selectedHero ?? deck.deck.first;

                return Consumer<BattleProvider>(
                  builder: (context, battle, _) {
                    if (!_battleStarted) {
                      return _BattleSetup(
                        deck: deck.deck,
                        selectedHero: selectedHero,
                        opponent: opponent,
                        onHeroChanged: (hero) =>
                            setState(() => _selectedHero = hero),
                        onStart: () async {
                          final battleProvider = context.read<BattleProvider>();
                          battleProvider.startBattle(
                            playerHero: selectedHero,
                            aiHero: opponent,
                          );
                          setState(() {
                            _battleStarted = true;
                            _winRecorded = false;
                          });
                          await battleProvider.saveRecordIfComplete();
                        },
                      );
                    }

                    return _BattleBoard(
                      battle: battle,
                      onAttack: () => _handleAttack(battle, false),
                      onSpecial: () => _handleAttack(battle, true),
                      onNewOpponent: () {
                        setState(() {
                          _battleStarted = false;
                          _winRecorded = false;
                          _opponentFuture = _loadOpponent();
                        });
                      },
                    );
                  },
                );
              },
            ),
    );
  }
}

class _BattleSetup extends StatelessWidget {
  const _BattleSetup({
    required this.deck,
    required this.selectedHero,
    required this.opponent,
    required this.onHeroChanged,
    required this.onStart,
  });

  final List<HeroModel> deck;
  final HeroModel selectedHero;
  final HeroModel opponent;
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
        ...deck.map(
          (hero) => _HeroChoiceCard(
            hero: hero,
            selected: hero.id == selectedHero.id,
            onTap: () => onHeroChanged(hero),
          ),
        ),
        const SizedBox(height: 20),
        Text('Opponent', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        Card(
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
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed: onStart,
          icon: const Icon(Icons.sports_mma),
          label: const Text('Start Battle'),
        ),
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

    return Card(
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
    );
  }
}

class _BattleBoard extends StatelessWidget {
  const _BattleBoard({
    required this.battle,
    required this.onAttack,
    required this.onSpecial,
    required this.onNewOpponent,
  });

  final BattleProvider battle;
  final VoidCallback onAttack;
  final VoidCallback onSpecial;
  final VoidCallback onNewOpponent;

  @override
  Widget build(BuildContext context) {
    final playerHero = battle.playerHero!;
    final aiHero = battle.aiHero!;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        HpBar(
          label: playerHero.name,
          current: battle.playerHp,
          max: playerHero.maxHp,
        ),
        const SizedBox(height: 18),
        HpBar(label: aiHero.name, current: battle.aiHp, max: aiHero.maxHp),
        const SizedBox(height: 18),
        Text(
          battle.isComplete
              ? battle.playerWon == true
                    ? 'You won in ${battle.rounds} rounds.'
                    : 'You lost in ${battle.rounds} rounds.'
              : battle.playerTurn
              ? 'Your turn'
              : 'Opponent turn',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
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
            const SizedBox(width: 8),
            Expanded(
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
          ],
        ),
        if (battle.isComplete) ...[
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: onNewOpponent,
            icon: const Icon(Icons.refresh),
            label: const Text('New Opponent'),
          ),
        ],
        const SizedBox(height: 20),
        Text('Battle Log', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        ...battle.log.map(
          (entry) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(entry),
          ),
        ),
      ],
    );
  }
}
