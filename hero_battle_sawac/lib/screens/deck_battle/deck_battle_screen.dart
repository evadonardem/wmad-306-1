import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../widgets/hero_portrait.dart';

enum BattleMove { attack, defend, block, buff }

class DeckBattleScreen extends StatefulWidget {
  final SavedDeck playerDeck;

  const DeckBattleScreen({
    super.key,
    required this.playerDeck,
  });

  @override
  State<DeckBattleScreen> createState() => _DeckBattleScreenState();
}

class _DeckBattleScreenState extends State<DeckBattleScreen> {
  final Random _rng = Random();

  late SavedDeck computerDeck;
  HeroModel? selectedPlayerHero;
  HeroModel? selectedComputerHero;

  bool _roundInitialized = false;
  bool _isBattling = false;
  bool _roundResolved = false;
  bool _showImpactFlash = false;

  double _playerBattleHp = 1.0;
  double _computerBattleHp = 1.0;
  double _playerCurrentHp = 100;
  double _computerCurrentHp = 100;
  double _playerMaxHp = 100;
  double _computerMaxHp = 100;

  int _playerBuffStacks = 0;
  int _computerBuffStacks = 0;
  int _playerDefendCooldown = 0;
  int _playerBlockCooldown = 0;
  int _playerBuffCooldown = 0;
  int _computerDefendCooldown = 0;
  int _computerBlockCooldown = 0;
  int _computerBuffCooldown = 0;

  String _battleNarration = 'Pick your hero to begin the duel.';
  final List<String> _battleLog = [];

  int roundNumber = 1;
  int playerWins = 0;
  int computerWins = 0;

  final usedPlayerHeroes = <String>{};
  final usedComputerHeroes = <String>{};

  @override
  void initState() {
    super.initState();
    final deckProvider = context.read<DeckProvider>();
    final savedDecks = deckProvider.savedDecks;

    if (savedDecks.isNotEmpty) {
      computerDeck = savedDecks[DateTime.now().millisecond % savedDecks.length];
    } else {
      computerDeck = SavedDeck(
        id: 'computer_deck',
        name: 'Computer Deck',
        heroes: deckProvider.deck,
        createdAt: DateTime.now(),
      );
    }
  }

  void _appendBattleLog(String message) {
    _battleLog.insert(0, message);
    if (_battleLog.length > 8) {
      _battleLog.removeRange(8, _battleLog.length);
    }
  }

  String _pickMoveName(HeroModel hero, int phase) {
    final stats = hero.powerstats;
    final topScore = [
      stats.strength,
      stats.speed,
      stats.intelligence,
      stats.power,
      stats.combat,
      stats.durability,
    ].reduce((a, b) => a > b ? a : b);

    List<String> pool;
    if (topScore == stats.strength) {
      pool = const ['Titan Slam', 'Seismic Crush', 'Omega Uppercut'];
    } else if (topScore == stats.speed) {
      pool = const ['Blink Strike', 'Sonic Dash', 'Phantom Rush'];
    } else if (topScore == stats.intelligence) {
      pool = const ['Mind Break', 'Logic Trap', 'Neural Lock'];
    } else if (topScore == stats.power) {
      pool = const ['Nova Burst', 'Plasma Wave', 'Stellar Pulse'];
    } else if (topScore == stats.combat) {
      pool = const ['Meteor Strike', 'Dragon Combo', 'Vanguard Cut'];
    } else {
      pool = const ['Iron Wall', 'Aegis Crash', 'Fortress Drive'];
    }

    return pool[phase % pool.length];
  }

  String _topStatKey(HeroModel hero) {
    final stats = hero.powerstats;
    final entries = <String, int>{
      'strength': stats.strength,
      'speed': stats.speed,
      'intelligence': stats.intelligence,
      'power': stats.power,
      'combat': stats.combat,
      'durability': stats.durability,
    }.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    return entries.first.key;
  }

  String _effectivenessCallout(HeroModel attacker, HeroModel defender) {
    const strongAgainst = <String, Set<String>>{
      'strength': {'durability', 'combat'},
      'speed': {'intelligence', 'power'},
      'intelligence': {'strength', 'power'},
      'power': {'speed', 'durability'},
      'combat': {'speed', 'intelligence'},
      'durability': {'combat', 'power'},
    };

    const weakAgainst = <String, Set<String>>{
      'strength': {'speed', 'intelligence'},
      'speed': {'strength', 'combat'},
      'intelligence': {'speed', 'durability'},
      'power': {'intelligence', 'combat'},
      'combat': {'durability', 'power'},
      'durability': {'strength', 'intelligence'},
    };

    final atkType = _topStatKey(attacker);
    final defType = _topStatKey(defender);

    if (strongAgainst[atkType]!.contains(defType)) {
      return "It's super effective!";
    }

    if (weakAgainst[atkType]!.contains(defType)) {
      return "It's not very effective...";
    }

    return 'A clean hit.';
  }

  double _baseDamage(HeroModel hero, int buffStacks) {
    final stats = hero.powerstats;
    final value = (8 +
            (stats.strength * 0.18) +
            (stats.combat * 0.16) +
            (stats.power * 0.14) +
            (buffStacks * 4))
        .clamp(8, 46);
    return value.toDouble();
  }

  BattleMove _chooseComputerMove() {
    final options = [
      BattleMove.attack,
      BattleMove.attack,
      if (_computerMoveCooldown(BattleMove.defend) == 0) BattleMove.defend,
      if (_computerMoveCooldown(BattleMove.block) == 0) BattleMove.block,
      if (_computerMoveCooldown(BattleMove.buff) == 0 && _computerBuffStacks < 3) BattleMove.buff,
    ];
    return options[_rng.nextInt(options.length)];
  }

  String _moveLabel(BattleMove move) {
    switch (move) {
      case BattleMove.attack:
        return 'Attack';
      case BattleMove.defend:
        return 'Defend';
      case BattleMove.block:
        return 'Block';
      case BattleMove.buff:
        return 'Buff';
    }
  }

  int _cooldownForMove(BattleMove move) {
    switch (move) {
      case BattleMove.attack:
        return 0;
      case BattleMove.defend:
        return 1;
      case BattleMove.block:
        return 2;
      case BattleMove.buff:
        return 2;
    }
  }

  int _playerMoveCooldown(BattleMove move) {
    switch (move) {
      case BattleMove.attack:
        return 0;
      case BattleMove.defend:
        return _playerDefendCooldown;
      case BattleMove.block:
        return _playerBlockCooldown;
      case BattleMove.buff:
        return _playerBuffCooldown;
    }
  }

  int _computerMoveCooldown(BattleMove move) {
    switch (move) {
      case BattleMove.attack:
        return 0;
      case BattleMove.defend:
        return _computerDefendCooldown;
      case BattleMove.block:
        return _computerBlockCooldown;
      case BattleMove.buff:
        return _computerBuffCooldown;
    }
  }

  void _setMoveCooldown(bool isPlayer, BattleMove move) {
    final cd = _cooldownForMove(move);
    if (cd == 0) {
      return;
    }
    if (isPlayer) {
      switch (move) {
        case BattleMove.attack:
          break;
        case BattleMove.defend:
          _playerDefendCooldown = cd;
          break;
        case BattleMove.block:
          _playerBlockCooldown = cd;
          break;
        case BattleMove.buff:
          _playerBuffCooldown = cd;
          break;
      }
      return;
    }

    switch (move) {
      case BattleMove.attack:
        break;
      case BattleMove.defend:
        _computerDefendCooldown = cd;
        break;
      case BattleMove.block:
        _computerBlockCooldown = cd;
        break;
      case BattleMove.buff:
        _computerBuffCooldown = cd;
        break;
    }
  }

  void _tickCooldowns() {
    _playerDefendCooldown = max(0, _playerDefendCooldown - 1);
    _playerBlockCooldown = max(0, _playerBlockCooldown - 1);
    _playerBuffCooldown = max(0, _playerBuffCooldown - 1);
    _computerDefendCooldown = max(0, _computerDefendCooldown - 1);
    _computerBlockCooldown = max(0, _computerBlockCooldown - 1);
    _computerBuffCooldown = max(0, _computerBuffCooldown - 1);
  }

  String _playerMoveButtonLabel(BattleMove move) {
    final cd = _playerMoveCooldown(move);
    if (cd > 0) {
      return '${_moveLabel(move)} ($cd)';
    }
    return _moveLabel(move);
  }

  void _initializeRoundCombat() {
    if (selectedPlayerHero == null || selectedComputerHero == null) {
      return;
    }

    final playerStats = selectedPlayerHero!.powerstats;
    final computerStats = selectedComputerHero!.powerstats;

    _playerMaxHp = (70 + (playerStats.durability * 0.7) + (playerStats.power * 0.2)).clamp(80, 170).toDouble();
    _computerMaxHp = (70 + (computerStats.durability * 0.7) + (computerStats.power * 0.2)).clamp(80, 170).toDouble();

    _playerCurrentHp = _playerMaxHp;
    _computerCurrentHp = _computerMaxHp;
    _playerBattleHp = 1.0;
    _computerBattleHp = 1.0;
    _playerBuffStacks = 0;
    _computerBuffStacks = 0;
    _playerDefendCooldown = 0;
    _playerBlockCooldown = 0;
    _playerBuffCooldown = 0;
    _computerDefendCooldown = 0;
    _computerBlockCooldown = 0;
    _computerBuffCooldown = 0;
    _roundInitialized = true;
    _roundResolved = false;

    _battleLog
      ..clear()
      ..add('Round $roundNumber started.')
      ..add('${selectedPlayerHero!.name} vs ${selectedComputerHero!.name}');

    _battleNarration = 'Choose a move: attack, defend, block, or buff.';
  }

  void _selectPlayerHero(HeroModel hero) {
    setState(() {
      selectedPlayerHero = hero;
      selectedComputerHero = null;
      _roundInitialized = false;
      _roundResolved = false;
      _battleNarration = '${hero.name} enters the arena.';
      _battleLog
        ..clear()
        ..add('Round $roundNumber: ${hero.name} enters the arena.');
    });

    Future.delayed(const Duration(milliseconds: 300), _autoSelectComputerHero);
  }

  void _autoSelectComputerHero() {
    if (_isBattling) {
      return;
    }

    final available = computerDeck.heroes.where((h) => !usedComputerHeroes.contains(h.id)).toList();
    if (available.isEmpty || selectedPlayerHero == null) {
      return;
    }

    final random = DateTime.now().millisecond % available.length;
    setState(() {
      selectedComputerHero = available[random];
      _battleNarration = '${selectedComputerHero!.name} answered the challenge!';
      _appendBattleLog('${selectedComputerHero!.name} accepted the duel.');
      _initializeRoundCombat();
    });
  }

  Future<void> _animateHpBars({
    required double playerTarget,
    required double computerTarget,
  }) async {
    final startPlayer = _playerBattleHp;
    final startComputer = _computerBattleHp;
    const steps = 12;

    for (var i = 1; i <= steps; i++) {
      if (!mounted) {
        return;
      }
      final t = i / steps;
      setState(() {
        _playerBattleHp = startPlayer + ((playerTarget - startPlayer) * t);
        _computerBattleHp = startComputer + ((computerTarget - startComputer) * t);
      });
      await Future.delayed(const Duration(milliseconds: 40));
    }
  }

  Future<void> _executeTurn(BattleMove playerMove) async {
    if (!_roundInitialized || _isBattling || _roundResolved || selectedPlayerHero == null || selectedComputerHero == null) {
      return;
    }

    _tickCooldowns();

    if (_playerMoveCooldown(playerMove) > 0) {
      setState(() {
        _battleNarration = '${_moveLabel(playerMove)} is on cooldown.';
      });
      return;
    }

    final playerHero = selectedPlayerHero!;
    final computerHero = selectedComputerHero!;
    final computerMove = _chooseComputerMove();

    final playerMoveName = _pickMoveName(playerHero, roundNumber + _battleLog.length);
    final computerMoveName = _pickMoveName(computerHero, roundNumber + _battleLog.length + 3);

    setState(() {
      _isBattling = true;
      _showImpactFlash = false;
      _battleNarration = '${playerHero.name} chose ${_moveLabel(playerMove)}!';
      _appendBattleLog('${playerHero.name}: ${_moveLabel(playerMove)} | ${computerHero.name}: ${_moveLabel(computerMove)}');
    });

    await Future.delayed(const Duration(milliseconds: 260));
    if (!mounted) {
      return;
    }

    double playerIncoming = 0;
    double computerIncoming = 0;

    final playerActsFirst = playerHero.powerstats.speed == computerHero.powerstats.speed
        ? _rng.nextBool()
        : playerHero.powerstats.speed > computerHero.powerstats.speed;
    final actionOrder = playerActsFirst
        ? <bool>[true, false]
        : <bool>[false, true];

    for (final isPlayerAttacker in actionOrder) {
      final attacker = isPlayerAttacker ? playerHero : computerHero;
      final defender = isPlayerAttacker ? computerHero : playerHero;
      final attackerMove = isPlayerAttacker ? playerMove : computerMove;
      final defenderMove = isPlayerAttacker ? computerMove : playerMove;
      final moveName = isPlayerAttacker ? playerMoveName : computerMoveName;

      if (attackerMove == BattleMove.attack) {
        var damage = _baseDamage(attacker, isPlayerAttacker ? _playerBuffStacks : _computerBuffStacks);
        final critChance = (0.08 + (attacker.powerstats.speed / 500)).clamp(0.08, 0.28);
        final isCrit = _rng.nextDouble() < critChance;
        if (isCrit) {
          damage *= 1.6;
          _appendBattleLog('Critical hit by ${attacker.name}!');
        }

        if (defenderMove == BattleMove.defend) {
          damage *= 0.55;
          _appendBattleLog('${defender.name} defended and softened the hit.');
        }

        if (defenderMove == BattleMove.block) {
          final successChance = (0.45 + (defender.powerstats.combat / 250)).clamp(0.45, 0.82);
          final blocked = _rng.nextDouble() <= successChance;
          damage *= blocked ? 0.2 : 1.05;
          _appendBattleLog(blocked ? '${defender.name} blocked the attack!' : '${defender.name} failed to block.');
        }

        if (isPlayerAttacker) {
          computerIncoming += damage;
        } else {
          playerIncoming += damage;
        }

        setState(() {
          _showImpactFlash = true;
          _battleNarration = '${attacker.name} used $moveName!';
        });
        _appendBattleLog(_effectivenessCallout(attacker, defender));
      } else if (attackerMove == BattleMove.buff) {
        if (isPlayerAttacker) {
          _playerBuffStacks = (_playerBuffStacks + 1).clamp(0, 3);
          _playerCurrentHp = (_playerCurrentHp + 4).clamp(0, _playerMaxHp);
          _appendBattleLog('${playerHero.name} buffed attack and recovered a little HP.');
        } else {
          _computerBuffStacks = (_computerBuffStacks + 1).clamp(0, 3);
          _computerCurrentHp = (_computerCurrentHp + 4).clamp(0, _computerMaxHp);
          _appendBattleLog('${computerHero.name} buffed attack and recovered a little HP.');
        }
        setState(() {
          _battleNarration = '${attacker.name} powered up!';
        });
      } else if (attackerMove == BattleMove.defend) {
        _appendBattleLog('${attacker.name} braces for incoming damage.');
      } else if (attackerMove == BattleMove.block) {
        _appendBattleLog('${attacker.name} prepares to block.');
      }

      await Future.delayed(const Duration(milliseconds: 220));
      if (!mounted) {
        return;
      }
    }

    _setMoveCooldown(true, playerMove);
    _setMoveCooldown(false, computerMove);

    _playerCurrentHp = (_playerCurrentHp - playerIncoming).clamp(0, _playerMaxHp);
    _computerCurrentHp = (_computerCurrentHp - computerIncoming).clamp(0, _computerMaxHp);

    await _animateHpBars(
      playerTarget: (_playerCurrentHp / _playerMaxHp).clamp(0, 1).toDouble(),
      computerTarget: (_computerCurrentHp / _computerMaxHp).clamp(0, 1).toDouble(),
    );

    if (!mounted) {
      return;
    }

    _showImpactFlash = false;

    if (_playerCurrentHp <= 0 || _computerCurrentHp <= 0) {
      final playerWon = _playerCurrentHp > _computerCurrentHp;
      final winnerName = playerWon ? playerHero.name : computerHero.name;

      setState(() {
        usedPlayerHeroes.add(playerHero.id);
        usedComputerHeroes.add(computerHero.id);
        if (playerWon) {
          playerWins++;
        } else {
          computerWins++;
        }

        _isBattling = false;
        _roundResolved = true;
        _battleNarration = '$winnerName wins Round $roundNumber!';
        _appendBattleLog('Round over: $winnerName wins.');
      });
      return;
    }

    setState(() {
      _isBattling = false;
      _battleNarration = 'Choose your next action!';
      _appendBattleLog(
        'HP ${playerHero.name} ${_playerCurrentHp.toStringAsFixed(0)} | ${computerHero.name} ${_computerCurrentHp.toStringAsFixed(0)}',
      );
    });
  }

  void _continueToNextRound() {
    final allPlayersUsed = usedPlayerHeroes.length == widget.playerDeck.heroes.length;
    final allComputerUsed = usedComputerHeroes.length == computerDeck.heroes.length;

    if (allPlayersUsed || allComputerUsed) {
      _showDeckBattleResult();
      return;
    }

    setState(() {
      roundNumber++;
      selectedPlayerHero = null;
      selectedComputerHero = null;
      _roundInitialized = false;
      _roundResolved = false;
      _isBattling = false;
      _showImpactFlash = false;
      _playerBattleHp = 1.0;
      _computerBattleHp = 1.0;
      _playerCurrentHp = 100;
      _computerCurrentHp = 100;
      _playerMaxHp = 100;
      _computerMaxHp = 100;
      _playerBuffStacks = 0;
      _computerBuffStacks = 0;
      _playerDefendCooldown = 0;
      _playerBlockCooldown = 0;
      _playerBuffCooldown = 0;
      _computerDefendCooldown = 0;
      _computerBlockCooldown = 0;
      _computerBuffCooldown = 0;
      _battleNarration = 'Round $roundNumber begins. Choose your hero.';
      _battleLog
        ..clear()
        ..add('Round $roundNumber begins. Choose your hero.');
    });
  }

  void _showDeckBattleResult() {
    final isDraw = playerWins == computerWins;
    final playerWon = playerWins > computerWins;
    final resultText = isDraw
        ? "It's a draw!"
        : playerWon
            ? '${widget.playerDeck.name} wins the deck battle!'
            : 'Computer Deck wins the deck battle!';

    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Deck Battle Complete'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              resultText,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
            ),
            const SizedBox(height: 16),
            Text(
              'Final Score: ${widget.playerDeck.name} $playerWins - $computerWins Computer Deck',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              Navigator.pop(context);
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  List<HeroModel> get availablePlayerHeroes =>
      widget.playerDeck.heroes.where((h) => !usedPlayerHeroes.contains(h.id)).toList();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accentColor = const Color(0xFFD4AF37);

    return Scaffold(
      appBar: AppBar(
        title: Text('Deck Battle - Round $roundNumber'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1F2937) : const Color(0xFFF3E8D8),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: accentColor.withValues(alpha: 0.3),
                width: 1.5,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      Text(
                        widget.playerDeck.name,
                        style: const TextStyle(fontWeight: FontWeight.w700),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$playerWins',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: accentColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 60, child: VerticalDivider()),
                Expanded(
                  child: Column(
                    children: [
                      const Text('Computer Deck', style: TextStyle(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Text(
                        '$computerWins',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: accentColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          LayoutBuilder(
            builder: (context, constraints) {
              final twoColumns = constraints.maxWidth >= 980;

              Widget playerDeckPanel = Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF111827) : const Color(0xFFE9DCC8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: accentColor.withValues(alpha: 0.3),
                    width: 1.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose Your Hero (${widget.playerDeck.name})',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 120,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: availablePlayerHeroes.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final hero = availablePlayerHeroes[index];
                          final isSelected = selectedPlayerHero?.id == hero.id;
                          return GestureDetector(
                            onTap: () => _selectPlayerHero(hero),
                            child: Container(
                              width: 82,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected ? accentColor : Colors.transparent,
                                  width: 3,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Expanded(
                                    child: ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
                                      child: HeroPortrait(
                                        hero: hero,
                                        fit: BoxFit.cover,
                                        padding: EdgeInsets.zero,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isSelected ? accentColor : Colors.grey,
                                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(10)),
                                    ),
                                    child: Text(
                                      hero.name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                        color: isDark ? Colors.black : Colors.white,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                              .animate(delay: (80 * index).ms)
                              .fadeIn(duration: 200.ms)
                              .slideX(begin: -0.3, end: 0, duration: 200.ms);
                        },
                      ),
                    ),
                  ],
                ),
              );

              Widget computerDeckPanel = Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF111827) : const Color(0xFFE9DCC8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: accentColor.withValues(alpha: 0.3),
                    width: 1.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Computer Deck (${computerDeck.name})',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 120,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: computerDeck.heroes.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final hero = computerDeck.heroes[index];
                          final isUsed = usedComputerHeroes.contains(hero.id);
                          final isCurrent = selectedComputerHero?.id == hero.id;
                          return Opacity(
                            opacity: isUsed ? 0.4 : 1.0,
                            child: Container(
                              width: 72,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: isCurrent
                                      ? accentColor
                                      : isUsed
                                          ? Colors.grey
                                          : accentColor.withValues(alpha: 0.6),
                                  width: isCurrent ? 3 : 2,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Expanded(
                                    child: ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                                      child: HeroPortrait(
                                        hero: hero,
                                        fit: BoxFit.cover,
                                        padding: EdgeInsets.zero,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: isUsed ? Colors.grey : accentColor,
                                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(6)),
                                    ),
                                    child: Text(
                                      hero.name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                        color: isDark ? Colors.black : Colors.white,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );

              if (twoColumns) {
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: playerDeckPanel),
                    const SizedBox(width: 12),
                    Expanded(child: computerDeckPanel),
                  ],
                );
              }

              return Column(
                children: [
                  playerDeckPanel,
                  const SizedBox(height: 12),
                  computerDeckPanel,
                ],
              );
            },
          ),
          const SizedBox(height: 20),

          if (selectedPlayerHero != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF111827) : const Color(0xFFE9DCC8),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: accentColor.withValues(alpha: 0.35), width: 1.5),
              ),
              child: Column(
                children: [
                  Text(
                    'Battle Arena',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 10),
                  Stack(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: SizedBox(
                                    height: 120,
                                    child: HeroPortrait(
                                      hero: selectedPlayerHero!,
                                      fit: BoxFit.cover,
                                      padding: EdgeInsets.zero,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  selectedPlayerHero!.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontWeight: FontWeight.w700),
                                ),
                                const SizedBox(height: 6),
                                LinearProgressIndicator(
                                  value: _playerBattleHp,
                                  minHeight: 8,
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'HP ${_playerCurrentHp.toStringAsFixed(0)} / ${_playerMaxHp.toStringAsFixed(0)}',
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                                Text(
                                  'Buff x$_playerBuffStacks',
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            width: 42,
                            height: 42,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: accentColor.withValues(alpha: 0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: accentColor, width: 1.2),
                            ),
                            child: const Text('VS', style: TextStyle(fontWeight: FontWeight.w900)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: selectedComputerHero != null
                                ? Column(
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: SizedBox(
                                          height: 120,
                                          child: HeroPortrait(
                                            hero: selectedComputerHero!,
                                            fit: BoxFit.cover,
                                            padding: EdgeInsets.zero,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        selectedComputerHero!.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.w700),
                                      ),
                                      const SizedBox(height: 6),
                                      LinearProgressIndicator(
                                        value: _computerBattleHp,
                                        minHeight: 8,
                                        borderRadius: BorderRadius.circular(999),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'HP ${_computerCurrentHp.toStringAsFixed(0)} / ${_computerMaxHp.toStringAsFixed(0)}',
                                        style: Theme.of(context).textTheme.labelSmall,
                                      ),
                                      Text(
                                        'Buff x$_computerBuffStacks',
                                        style: Theme.of(context).textTheme.labelSmall,
                                      ),
                                    ],
                                  )
                                : Container(
                                    height: 170,
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: Colors.grey.withValues(alpha: 0.18),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: accentColor.withValues(alpha: 0.35)),
                                    ),
                                    child: const Text(
                                      'Computer choosing...',
                                      style: TextStyle(fontWeight: FontWeight.w700),
                                    ),
                                  ),
                          ),
                        ],
                      ),
                      if (_showImpactFlash)
                        Positioned.fill(
                          child: IgnorePointer(
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF0B1220) : const Color(0xFFFFF8EE),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: accentColor.withValues(alpha: 0.25)),
                    ),
                    child: Text(
                      _battleNarration,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                  if (_battleLog.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF0A1323) : const Color(0xFFFFF7EB),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: accentColor.withValues(alpha: 0.2)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: _battleLog
                            .take(4)
                            .map(
                              (entry) => Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Text(
                                  '- $entry',
                                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                FilledButton.tonalIcon(
                  onPressed: (!_isBattling && !_roundResolved && _roundInitialized)
                      ? () => _executeTurn(BattleMove.attack)
                      : null,
                  icon: const Icon(Icons.flash_on_rounded),
                  label: Text(_playerMoveButtonLabel(BattleMove.attack)),
                ),
                FilledButton.tonalIcon(
                  onPressed: (!_isBattling && !_roundResolved && _roundInitialized && _playerMoveCooldown(BattleMove.defend) == 0)
                      ? () => _executeTurn(BattleMove.defend)
                      : null,
                  icon: const Icon(Icons.shield_rounded),
                  label: Text(_playerMoveButtonLabel(BattleMove.defend)),
                ),
                FilledButton.tonalIcon(
                  onPressed: (!_isBattling && !_roundResolved && _roundInitialized && _playerMoveCooldown(BattleMove.block) == 0)
                      ? () => _executeTurn(BattleMove.block)
                      : null,
                  icon: const Icon(Icons.pan_tool_alt_rounded),
                  label: Text(_playerMoveButtonLabel(BattleMove.block)),
                ),
                FilledButton.tonalIcon(
                  onPressed: (!_isBattling && !_roundResolved && _roundInitialized && _playerMoveCooldown(BattleMove.buff) == 0)
                      ? () => _executeTurn(BattleMove.buff)
                      : null,
                  icon: const Icon(Icons.auto_awesome_rounded),
                  label: Text(_playerMoveButtonLabel(BattleMove.buff)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (_roundResolved)
              FilledButton.icon(
                onPressed: _continueToNextRound,
                icon: const Icon(Icons.skip_next_rounded),
                label: const Text('Next Round'),
              ),
            if (_isBattling)
              const Padding(
                padding: EdgeInsets.only(top: 10),
                child: LinearProgressIndicator(minHeight: 6),
              ),
            const SizedBox(height: 10),
            Text(
              'Heroes used: Player ${usedPlayerHeroes.length}/${widget.playerDeck.heroes.length} | Computer ${usedComputerHeroes.length}/${computerDeck.heroes.length}',
              style: Theme.of(context).textTheme.labelSmall,
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
