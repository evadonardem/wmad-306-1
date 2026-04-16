import 'dart:math';

import 'package:flutter/material.dart';

import '../app_store.dart';
import '../battle_engine.dart';
import '../hero_api.dart';
import '../models.dart';

class BattlePage extends StatefulWidget {
  const BattlePage({super.key, required this.store});

  final AppStore store;

  @override
  State<BattlePage> createState() => _BattlePageState();
}

class _BattlePageState extends State<BattlePage> {
  HeroModel? _playerHero;
  HeroModel? _aiHero;
  int _playerHp = 0;
  int _aiHp = 0;
  int _playerMaxHp = 0;
  int _aiMaxHp = 0;
  int _round = 0;
  bool _loading = true;
  bool _fighting = false;
  bool _finished = false;
  bool _playerWon = false;
  final List<String> _log = [];

  @override
  void initState() {
    super.initState();
    _startBattle();
  }

  Future<void> _startBattle() async {
    if (widget.store.deck.isEmpty) {
      if (!mounted) return;
      Navigator.of(context).pop();
      return;
    }
    setState(() {
      _loading = true;
      _fighting = false;
      _finished = false;
      _round = 0;
      _log.clear();
    });

    final random = Random();
    final player = widget.store.deck[random.nextInt(widget.store.deck.length)];
    final aiId = random.nextInt(731) + 1;

    try {
      final ai = await HeroApi.fetchHero(aiId);
      final playerHp = heroMaxHp(player);
      final aiHp = heroMaxHp(ai);
      if (!mounted) return;
      setState(() {
        _playerHero = player;
        _aiHero = ai;
        _playerHp = playerHp;
        _aiHp = aiHp;
        _playerMaxHp = playerHp;
        _aiMaxHp = aiHp;
        _log.add('Battle begins: ${player.name} vs ${ai.name}!');
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  void _fightRound() {
    if (_loading || _fighting || _finished || _playerHero == null || _aiHero == null) {
      return;
    }
    setState(() {
      _fighting = true;
    });

    final result = resolveRound(_playerHero!, _aiHero!, _playerHp, _aiHp);
    final round = _round + 1;
    final nextLog = [
      ..._log,
      '--- Round $round ---',
      ...result.messages,
    ];

    final done = result.newPlayerHp <= 0 || result.newAiHp <= 0;
    final playerWon = result.newAiHp <= 0;

    setState(() {
      _round = round;
      _playerHp = result.newPlayerHp;
      _aiHp = result.newAiHp;
      _log
        ..clear()
        ..addAll(nextLog);
      _fighting = false;
      _finished = done;
      _playerWon = playerWon;
      if (done) {
        _log.add(playerWon ? 'VICTORY!' : 'DEFEAT!');
      }
    });

    if (done && _playerHero != null && _aiHero != null) {
      widget.store.addBattleRecord(
        playerHero: _playerHero!.name,
        aiHero: _aiHero!.name,
        playerWon: playerWon,
        roundsPlayed: round,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    final player = _playerHero;
    final ai = _aiHero;
    if (player == null || ai == null) {
      return const Scaffold(body: Center(child: Text('Unable to start battle')));
    }

    return Scaffold(
      appBar: AppBar(title: Text('Battle - Round $_round')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _BattleHeroCard(
              title: widget.store.playerName,
              hero: player,
              hp: _playerHp,
              maxHp: _playerMaxHp,
            ),
            const SizedBox(height: 12),
            const Text('VS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 24)),
            const SizedBox(height: 12),
            _BattleHeroCard(
              title: 'AI Opponent',
              hero: ai,
              hp: _aiHp,
              maxHp: _aiMaxHp,
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                ),
                child: ListView.builder(
                  itemCount: _log.length,
                  itemBuilder: (context, index) => Text(_log[index]),
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (_finished)
              Row(
                children: [
                  Expanded(
                    child: FilledButton(
                      onPressed: _startBattle,
                      child: const Text('Rematch'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Home'),
                    ),
                  ),
                ],
              )
            else
              FilledButton(
                onPressed: _fighting ? null : _fightRound,
                child: Text(_fighting ? 'Fighting...' : 'Fight Round'),
              ),
            if (_finished)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  _playerWon ? 'VICTORY!' : 'DEFEATED!',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _BattleHeroCard extends StatelessWidget {
  const _BattleHeroCard({
    required this.title,
    required this.hero,
    required this.hp,
    required this.maxHp,
  });

  final String title;
  final HeroModel hero;
  final int hp;
  final int maxHp;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundImage: hero.imageUrl.isEmpty ? null : NetworkImage(hero.imageUrl),
            child: hero.imageUrl.isEmpty ? const Icon(Icons.shield) : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.labelMedium),
                Text(hero.name, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 4),
                LinearProgressIndicator(value: maxHp == 0 ? 0 : hp / maxHp),
                const SizedBox(height: 4),
                Text('HP: $hp / $maxHp'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
