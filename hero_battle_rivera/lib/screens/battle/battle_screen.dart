import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/battle_record.dart';
import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';
import '../../services/superhero_api_service.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

enum _ArenaPhase {
  idle,
  loadingOpponent,
  matchOverlay,
  selectingCard,
  resolvingRound,
  finished,
}

class _BattleScreenState extends State<BattleScreen> {
  static const Color _arenaTextColor = Color(0xFFEAF4FF);
  static const Color _arenaMutedTextColor = Color(0xFFC7DBF8);

  static const List<String> _opponentNames = <String>[
    'Vortex Unit',
    'Steel Phantom',
    'Crimson Nova',
    'Omega Sentinel',
    'Neon Warden',
    'Cipher Titan',
    'Red Specter',
  ];

  final Random _random = Random();
  final SuperheroApiService _api = SuperheroApiService.fromRuntime();

  List<_BattleCardState> _playerCards = <_BattleCardState>[];
  List<_BattleCardState> _opponentCards = <_BattleCardState>[];
  final Set<int> _revealedOpponentCards = <int>{};

  _ArenaPhase _phase = _ArenaPhase.idle;
  String _statusText =
      'Pick a saved deck in Deck Builder, then start a battle.';
  String _lastBattleResult = '';
  String _lastBattleSummary = '';
  String _opponentName = '';
  String _activePlayerDeckName = 'Saved Deck';
  int? _activePlayerDeckId;

  int _matchNumber = 0;
  int? _selectedPlayerIndex;
  int? _selectedOpponentIndex;
  final List<String> _matchResultsLog = <String>[];

  bool _isStarting = false;
  bool _isRestoringReadyDeck = false;
  bool _didAttemptReadyDeckRestore = false;
  int _flowId = 0;

  bool get _playerHasRemaining => _playerCards.any((card) => !card.isDefeated);
  bool get _opponentHasRemaining =>
      _opponentCards.any((card) => !card.isDefeated);

  int get _playerRemainingCount =>
      _playerCards.where((card) => !card.isDefeated).length;

  int get _opponentRemainingCount =>
      _opponentCards.where((card) => !card.isDefeated).length;

  @override
  void initState() {
    super.initState();

    try {
      // Defensive reset so a stale provider flag does not keep Start Battle disabled.
      context.read<BattleProvider>().endBattle();
    } catch (_) {
      // Ignore provider access issues during startup.
    }

    _restoreReadyDeckIfNeeded();
  }

  @override
  void dispose() {
    _flowId += 1;
    try {
      context.read<BattleProvider>().endBattle();
    } catch (_) {
      // Ignore provider access issues during teardown.
    }
    super.dispose();
  }

  Future<void> _restoreReadyDeckIfNeeded() async {
    if (_didAttemptReadyDeckRestore) {
      return;
    }

    _didAttemptReadyDeckRestore = true;
    final deckProvider = context.read<DeckProvider>();
    if (deckProvider.hasReadyBattleDeck) {
      final name = deckProvider.readyBattleDeckName ?? 'Saved Deck';
      _statusText = 'Ready deck "$name" selected. Press Start Battle.';
      return;
    }

    setState(() {
      _isRestoringReadyDeck = true;
      _statusText = 'Checking saved decks...';
    });

    try {
      final rows = await DatabaseService().loadDecks();
      if (!mounted || rows.isEmpty || deckProvider.hasReadyBattleDeck) {
        return;
      }

      final latestDeck = rows.first;
      final heroes = _decodeDeckHeroes(latestDeck['heroes']);
      if (heroes.isEmpty) {
        return;
      }

      final name = (latestDeck['name'] ?? 'Saved Deck').toString();
      deckProvider.setReadyBattleDeck(
        name: name,
        heroes: heroes,
        id: latestDeck['id'] as int?,
      );

      if (!mounted) {
        return;
      }

      setState(() {
        _statusText =
            'Ready deck "$name" loaded from saved decks. Press Start Battle.';
      });
    } catch (_) {
      // Leave manual deck selection as the fallback behavior.
    } finally {
      if (mounted) {
        setState(() {
          _isRestoringReadyDeck = false;
        });
      }
    }
  }

  List<HeroModel> _decodeDeckHeroes(dynamic rawJson) {
    if (rawJson is! String || rawJson.trim().isEmpty) {
      return const <HeroModel>[];
    }

    try {
      final decoded = jsonDecode(rawJson);
      if (decoded is List) {
        return decoded
            .whereType<Map>()
            .map(Map<String, dynamic>.from)
            .map(HeroModel.fromJson)
            .toList(growable: false);
      }
    } catch (_) {
      return const <HeroModel>[];
    }

    return const <HeroModel>[];
  }

  Future<void> _startBattle() async {
    final deckProvider = context.read<DeckProvider>();
    final battleProvider = context.read<BattleProvider>();
    final readyDeck = deckProvider.readyBattleDeck;

    if (readyDeck.isEmpty || _isStarting) {
      return;
    }

    final runId = ++_flowId;
    final readyDeckName = deckProvider.readyBattleDeckName;
    final readyDeckId = deckProvider.readyBattleDeckId;

    setState(() {
      _isStarting = true;
      _phase = _ArenaPhase.loadingOpponent;
      _statusText = 'Generating a random opponent...';
      _lastBattleResult = '';
      _lastBattleSummary = '';
      _activePlayerDeckId = readyDeckId;
      _activePlayerDeckName =
          readyDeckName == null || readyDeckName.trim().isEmpty
          ? 'Saved Deck'
          : readyDeckName;
    });

    battleProvider.startBattle();

    try {
      final playerCards = readyDeck
          .map((hero) => _BattleCardState(hero: hero))
          .toList(growable: false);

      final opponentHeroes = await _buildOpponentDeck(
        count: playerCards.length,
        playerDeck: readyDeck,
      );

      if (!mounted || runId != _flowId) {
        return;
      }

      setState(() {
        _isStarting = false;
        _playerCards = playerCards;
        _opponentCards = opponentHeroes
            .map((hero) => _BattleCardState(hero: hero))
            .toList(growable: false);
        _opponentName = _opponentNames[_random.nextInt(_opponentNames.length)];
        _revealedOpponentCards.clear();
        _matchResultsLog.clear();
        _matchNumber = 0;
        _selectedPlayerIndex = null;
        _selectedOpponentIndex = null;
        _statusText = 'Opponent ready. Battle is about to begin.';
      });

      await _queueNextMatch(runId);
    } catch (e) {
      if (!mounted || runId != _flowId) {
        return;
      }

      setState(() {
        _isStarting = false;
        _phase = _ArenaPhase.idle;
        _statusText = 'Failed to start battle: $e';
      });
      battleProvider.endBattle();
    }
  }

  Future<List<HeroModel>> _buildOpponentDeck({
    required int count,
    required List<HeroModel> playerDeck,
  }) async {
    if (count <= 0) return const <HeroModel>[];

    try {
      final fetched = await _api.fetchRandomHeroes(count: count);
      if (fetched.length >= count) {
        return fetched.take(count).toList(growable: false);
      }

      if (fetched.isNotEmpty) {
        final filled = List<HeroModel>.from(fetched);
        var i = 0;
        while (filled.length < count) {
          final fallback = playerDeck[i % playerDeck.length];
          filled.add(
            fallback.copyWith(id: '${fallback.id}-mirror-${filled.length}'),
          );
          i += 1;
        }
        return filled;
      }
    } catch (_) {
      // If API is unavailable, mirror from player's deck as a deterministic fallback.
    }

    final shuffled = List<HeroModel>.from(playerDeck)..shuffle(_random);
    return List<HeroModel>.generate(count, (index) {
      final source = shuffled[index % shuffled.length];
      return source.copyWith(id: '${source.id}-ai-$index');
    }, growable: false);
  }

  int _pickOpponentCardIndex() {
    final topCandidates = <int>[];
    var highestAttack = -1;

    for (var i = 0; i < _opponentCards.length; i++) {
      final card = _opponentCards[i];
      if (card.isDefeated) continue;

      final attack = card.attack;
      if (attack > highestAttack) {
        highestAttack = attack;
        topCandidates
          ..clear()
          ..add(i);
      } else if (attack == highestAttack) {
        topCandidates.add(i);
      }
    }

    if (topCandidates.isEmpty) {
      return -1;
    }

    return topCandidates[_random.nextInt(topCandidates.length)];
  }

  Future<void> _queueNextMatch(int runId) async {
    if (!mounted || runId != _flowId) {
      return;
    }

    if (!_playerHasRemaining || !_opponentHasRemaining) {
      await _finishBattle(runId);
      return;
    }

    final opponentIndex = _pickOpponentCardIndex();
    if (opponentIndex < 0) {
      await _finishBattle(runId);
      return;
    }

    setState(() {
      _matchNumber += 1;
      _selectedPlayerIndex = null;
      _selectedOpponentIndex = opponentIndex;
      _phase = _ArenaPhase.matchOverlay;
      _statusText = 'Match $_matchNumber is starting...';
    });

    await Future<void>.delayed(const Duration(milliseconds: 1200));

    if (!mounted || runId != _flowId) {
      return;
    }

    if (!_playerHasRemaining || !_opponentHasRemaining) {
      await _finishBattle(runId);
      return;
    }

    setState(() {
      _phase = _ArenaPhase.selectingCard;
      _statusText = 'Match $_matchNumber: Pick one of your remaining cards.';
    });
  }

  void _selectPlayerCard(int index) {
    if (_phase != _ArenaPhase.selectingCard) {
      return;
    }

    if (index < 0 || index >= _playerCards.length) {
      return;
    }

    final playerCard = _playerCards[index];
    if (playerCard.isDefeated) {
      return;
    }

    final opponentIndex = _selectedOpponentIndex;
    if (opponentIndex == null || opponentIndex < 0) {
      return;
    }

    if (opponentIndex >= _opponentCards.length ||
        _opponentCards[opponentIndex].isDefeated) {
      return;
    }

    final runId = _flowId;

    setState(() {
      _selectedPlayerIndex = index;
      _revealedOpponentCards.add(opponentIndex);
      _phase = _ArenaPhase.resolvingRound;
    });

    _resolveRound(runId);
  }

  Future<void> _resolveRound(int runId) async {
    if (!mounted || runId != _flowId) {
      return;
    }

    final playerIndex = _selectedPlayerIndex;
    final opponentIndex = _selectedOpponentIndex;
    if (playerIndex == null || opponentIndex == null) {
      return;
    }

    final playerCard = _playerCards[playerIndex];
    final opponentCard = _opponentCards[opponentIndex];

    final playerDamageTaken = max(1, opponentCard.attack);
    final opponentDamageTaken = max(1, playerCard.attack);

    playerCard.applyDamage(playerDamageTaken);
    opponentCard.applyDamage(opponentDamageTaken);

    final roundSummary = _buildRoundSummary(
      matchNumber: _matchNumber,
      playerCard: playerCard,
      opponentCard: opponentCard,
    );

    final events = <String>[
      '${playerCard.hero.name} hit ${opponentCard.hero.name} for $opponentDamageTaken.',
      '${opponentCard.hero.name} hit ${playerCard.hero.name} for $playerDamageTaken.',
    ];

    if (playerCard.isDefeated) {
      events.add('${playerCard.hero.name} was defeated.');
    }
    if (opponentCard.isDefeated) {
      events.add('${opponentCard.hero.name} was defeated.');
    }

    setState(() {
      _matchResultsLog.add(roundSummary);
      _statusText = events.join(' ');
    });

    await Future<void>.delayed(const Duration(milliseconds: 1400));

    if (!mounted || runId != _flowId) {
      return;
    }

    if (!_playerHasRemaining || !_opponentHasRemaining) {
      await _finishBattle(runId);
      return;
    }

    await _queueNextMatch(runId);
  }

  Future<void> _finishBattle(int runId) async {
    final battleProvider = context.read<BattleProvider>();
    final playerProvider = context.read<PlayerProvider>();
    final normalizedPlayerName = playerProvider.playerName.trim().isEmpty
        ? 'Hero'
        : playerProvider.playerName.trim();

    final playerWon = _playerHasRemaining && !_opponentHasRemaining;
    final draw = !_playerHasRemaining && !_opponentHasRemaining;

    final selectedPlayer = _selectedPlayerIndex;
    final selectedOpponent = _selectedOpponentIndex;

    final playerHeroName =
        selectedPlayer != null &&
            selectedPlayer >= 0 &&
            selectedPlayer < _playerCards.length
        ? _playerCards[selectedPlayer].hero.name
        : (_playerCards.isEmpty ? 'Unknown' : _playerCards.first.hero.name);

    final aiHeroName =
        selectedOpponent != null &&
            selectedOpponent >= 0 &&
            selectedOpponent < _opponentCards.length
        ? _opponentCards[selectedOpponent].hero.name
        : (_opponentCards.isEmpty ? 'Unknown' : _opponentCards.first.hero.name);

    final playerDeckHeroes = _playerCards
        .map((card) => card.hero.name)
        .toList(growable: false);
    final opponentDeckHeroes = _opponentCards
        .map((card) => card.hero.name)
        .toList(growable: false);

    final overallResult = draw
        ? 'draw'
        : playerWon
        ? 'victory'
        : 'defeat';

    try {
      final record = BattleRecord(
        playerHero: playerHeroName,
        aiHero: aiHeroName,
        playerWon: playerWon,
        roundsPlayed: _matchNumber,
        playedAt: DateTime.now().toIso8601String(),
        playerName: normalizedPlayerName,
        opponentName: _opponentName,
        playerDeckName: _activePlayerDeckName,
        playerDeckId: _activePlayerDeckId,
        opponentDeckName: '$_opponentName Deck',
        playerDeckHeroes: playerDeckHeroes,
        opponentDeckHeroes: opponentDeckHeroes,
        matchResults: List<String>.from(_matchResultsLog),
        overallResult: overallResult,
      );

      await DatabaseService().saveBattleRecord(record);
    } catch (_) {
      // Battle history persistence failure should not block battle completion.
    }

    if (playerWon) {
      playerProvider.incrementWins();
    }

    final finalText = draw
        ? 'Draw after $_matchNumber matches. Both teams were eliminated.'
        : playerWon
        ? 'Victory! You won in $_matchNumber matches with surviving cards.'
        : 'Defeat. $_opponentName won in $_matchNumber matches.';

    if (!mounted || runId != _flowId) {
      battleProvider.endBattle();
      return;
    }

    setState(() {
      _phase = _ArenaPhase.finished;
      _selectedPlayerIndex = null;
      _selectedOpponentIndex = null;
      _statusText = finalText;
      _lastBattleResult = overallResult;
      _lastBattleSummary = finalText;
    });

    battleProvider.endBattle();
  }

  String get _resultOverlayTitle {
    switch (_lastBattleResult) {
      case 'victory':
        return 'Victory';
      case 'defeat':
        return 'Defeat';
      case 'draw':
        return 'Draw';
      default:
        return 'Battle Complete';
    }
  }

  Color get _resultOverlayColor {
    switch (_lastBattleResult) {
      case 'victory':
        return const Color(0xFF22C55E);
      case 'defeat':
        return const Color(0xFFEF4444);
      case 'draw':
        return const Color(0xFF94A3B8);
      default:
        return const Color(0xFF38BDF8);
    }
  }

  IconData get _resultOverlayIcon {
    switch (_lastBattleResult) {
      case 'victory':
        return Icons.emoji_events;
      case 'defeat':
        return Icons.close;
      case 'draw':
        return Icons.balance;
      default:
        return Icons.flag;
    }
  }

  Future<void> _leaveBattleArena() async {
    context.read<BattleProvider>().endBattle();
    await Navigator.pushNamedAndRemoveUntil(
      context,
      RouteNames.home,
      (route) => false,
    );
  }

  Widget _buildResultOverlay() {
    final accent = _resultOverlayColor;
    final summary = _lastBattleSummary.isEmpty ? _statusText : _lastBattleSummary;

    return Positioned.fill(
      child: ColoredBox(
        color: Colors.black.withValues(alpha: 0.8),
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 380),
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: const Color(0xFF071225),
              border: Border.all(color: accent.withValues(alpha: 0.8)),
              boxShadow: <BoxShadow>[
                BoxShadow(
                  color: accent.withValues(alpha: 0.28),
                  blurRadius: 22,
                  spreadRadius: 0.6,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Icon(_resultOverlayIcon, size: 54, color: accent),
                const SizedBox(height: 10),
                Text(
                  _resultOverlayTitle,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: accent,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  summary,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: _arenaTextColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: _isStarting ? null : _startBattle,
                        icon: const Icon(Icons.skip_next),
                        label: const Text('Next Battle'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _leaveBattleArena,
                        icon: const Icon(Icons.dashboard_customize),
                        label: const Text('Dashboard'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _buildRoundSummary({
    required int matchNumber,
    required _BattleCardState playerCard,
    required _BattleCardState opponentCard,
  }) {
    if (playerCard.isDefeated && opponentCard.isDefeated) {
      return 'Match $matchNumber: Draw - ${playerCard.hero.name} and ${opponentCard.hero.name} were both defeated.';
    }

    if (opponentCard.isDefeated) {
      return 'Match $matchNumber: Victory - ${playerCard.hero.name} defeated ${opponentCard.hero.name}.';
    }

    if (playerCard.isDefeated) {
      return 'Match $matchNumber: Defeat - ${opponentCard.hero.name} defeated ${playerCard.hero.name}.';
    }

    if (playerCard.currentHp > opponentCard.currentHp) {
      return 'Match $matchNumber: Advantage - ${playerCard.hero.name} led with ${playerCard.currentHp} HP vs ${opponentCard.currentHp} HP.';
    }

    if (playerCard.currentHp < opponentCard.currentHp) {
      return 'Match $matchNumber: Pressure - ${opponentCard.hero.name} led with ${opponentCard.currentHp} HP vs ${playerCard.currentHp} HP.';
    }

    return 'Match $matchNumber: Even - both cards stood at ${playerCard.currentHp} HP.';
  }

  bool _isOpponentCardVisible(int index) {
    if (_phase == _ArenaPhase.finished) {
      return true;
    }

    if (_revealedOpponentCards.contains(index)) {
      return true;
    }

    return _phase == _ArenaPhase.resolvingRound &&
        _selectedOpponentIndex == index;
  }

  Color _sideAccent(bool isPlayerSide) {
    return isPlayerSide ? const Color(0xFF38BDF8) : const Color(0xFFFB7185);
  }

  Widget _buildArenaSide({
    required bool isPlayerSide,
    required String name,
    required List<_BattleCardState> cards,
  }) {
    final accent = _sideAccent(isPlayerSide);
    final remaining = cards.where((card) => !card.isDefeated).length;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: isPlayerSide ? Alignment.topLeft : Alignment.topRight,
          end: isPlayerSide ? Alignment.bottomRight : Alignment.bottomLeft,
          colors: <Color>[
            Colors.white.withValues(alpha: 0.08),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: accent.withValues(alpha: 0.35),
                child: Icon(
                  isPlayerSide ? Icons.person : Icons.smart_toy,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: _arenaTextColor,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Cards Remaining: $remaining',
                      style: const TextStyle(
                        color: _arenaMutedTextColor,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              itemCount: cards.length,
              separatorBuilder: (_, index) => const SizedBox(height: 8),
              itemBuilder: (_, index) {
                final card = cards[index];
                final hidden = !isPlayerSide && !_isOpponentCardVisible(index);
                final selectable =
                    isPlayerSide &&
                    _phase == _ArenaPhase.selectingCard &&
                    !card.isDefeated;

                final selected = isPlayerSide
                    ? _selectedPlayerIndex == index
                    : _selectedOpponentIndex == index &&
                          (_phase == _ArenaPhase.resolvingRound ||
                              _phase == _ArenaPhase.finished);

                return _BattleCardTile(
                  card: card,
                  accent: accent,
                  textColor: _arenaTextColor,
                  mutedTextColor: _arenaMutedTextColor,
                  hidden: hidden,
                  selected: selected,
                  selectable: selectable,
                  onTap: selectable ? () => _selectPlayerCard(index) : null,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildArenaBoard(String playerName) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Stack(
        children: <Widget>[
          Row(
            children: <Widget>[
              Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: <Color>[Color(0xFF0A3A70), Color(0xFF052341)],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topRight,
                      end: Alignment.bottomLeft,
                      colors: <Color>[Color(0xFF6B1020), Color(0xFF310711)],
                    ),
                  ),
                ),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Expanded(
                child: _buildArenaSide(
                  isPlayerSide: true,
                  name: playerName,
                  cards: _playerCards,
                ),
              ),
              Container(width: 2, color: Colors.white.withValues(alpha: 0.3)),
              Expanded(
                child: _buildArenaSide(
                  isPlayerSide: false,
                  name: _opponentName,
                  cards: _opponentCards,
                ),
              ),
            ],
          ),
          if (_phase == _ArenaPhase.matchOverlay)
            Positioned.fill(
              child: ColoredBox(
                color: Colors.black.withValues(alpha: 0.72),
                child: Center(
                  child: Text(
                    'Match $_matchNumber',
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ),
          if (_phase == _ArenaPhase.finished) _buildResultOverlay(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = context.watch<DeckProvider>();
    final playerProvider = context.watch<PlayerProvider>();
    final isArenaBusy =
        _phase != _ArenaPhase.idle && _phase != _ArenaPhase.finished;

    final canStart =
      deckProvider.hasReadyBattleDeck &&
      !_isStarting &&
      !_isRestoringReadyDeck &&
      _phase == _ArenaPhase.idle;

    final buttonLabel = _isRestoringReadyDeck
        ? 'Loading Deck...'
        : 'Start Battle';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Battle Arena'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: <Widget>[
            if (!deckProvider.hasReadyBattleDeck)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Text(
                  _isRestoringReadyDeck
                      ? 'Loading your latest saved deck...'
                      : 'Pick a saved deck in Deck Builder first. Only saved decks can enter the arena.',
                  textAlign: TextAlign.center,
                ),
              ),
            if (deckProvider.hasReadyBattleDeck)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Text(
                  'Ready Deck: ${deckProvider.readyBattleDeckName ?? 'Saved Deck'} (${deckProvider.readyBattleDeckSize} cards)',
                  textAlign: TextAlign.center,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                ),
              ),
            Expanded(
              child: _playerCards.isEmpty || _opponentCards.isEmpty
                  ? Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Theme.of(context)
                            .colorScheme
                            .surfaceContainerHigh
                            .withValues(alpha: 0.45),
                      ),
                      child: Center(
                        child: Text(
                          _isStarting
                              ? 'Preparing arena...'
                              : 'Press Start Battle to generate your random opponent.',
                          textAlign: TextAlign.center,
                        ),
                      ),
                    )
                  : _buildArenaBoard(playerProvider.playerName),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                color: Theme.of(
                  context,
                ).colorScheme.surfaceContainerHigh.withValues(alpha: 0.6),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text(_statusText, textAlign: TextAlign.center),
                  if (_phase != _ArenaPhase.idle)
                    Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Text(
                        'Match: $_matchNumber  •  ${playerProvider.playerName}: $_playerRemainingCount  •  $_opponentName: $_opponentRemainingCount',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            if (_phase != _ArenaPhase.finished)
              FilledButton.icon(
                onPressed: canStart ? _startBattle : null,
                icon: Icon(
                  _isStarting || _isRestoringReadyDeck || isArenaBusy
                      ? Icons.hourglass_top
                      : Icons.play_arrow,
                ),
                label: Text(_isStarting ? 'Preparing...' : buttonLabel),
              ),
          ],
        ),
      ),
    );
  }
}

class _BattleCardState {
  _BattleCardState({required this.hero}) : currentHp = _safeHp(hero.baseHp);

  final HeroModel hero;
  int currentHp;

  static int _safeHp(int hp) {
    return hp < 1 ? 1 : hp;
  }

  int get maxHp => _safeHp(hero.baseHp);
  int get attack => hero.attackPower < 1 ? 1 : hero.attackPower;
  bool get isDefeated => currentHp <= 0;

  void applyDamage(int damage) {
    final nextHp = currentHp - damage;
    currentHp = nextHp < 0 ? 0 : nextHp;
  }
}

class _BattleCardTile extends StatelessWidget {
  const _BattleCardTile({
    required this.card,
    required this.accent,
    required this.textColor,
    required this.mutedTextColor,
    required this.hidden,
    required this.selected,
    required this.selectable,
    required this.onTap,
  });

  final _BattleCardState card;
  final Color accent;
  final Color textColor;
  final Color mutedTextColor;
  final bool hidden;
  final bool selected;
  final bool selectable;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final ratio = card.maxHp == 0 ? 0.0 : card.currentHp / card.maxHp;

    if (hidden) {
      return Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
          color: Colors.black.withValues(alpha: 0.25),
        ),
        child: Row(
          children: <Widget>[
            Icon(Icons.help_outline, color: mutedTextColor),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Unrevealed Card',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: textColor, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      );
    }

    final imageProvider = card.hero.imageUrl.isEmpty
        ? null
        : NetworkImage(card.hero.imageUrl) as ImageProvider<Object>?;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Ink(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: selected
                  ? accent
                  : Colors.white.withValues(alpha: selectable ? 0.48 : 0.2),
              width: selected ? 1.8 : 1,
            ),
            color: Colors.black.withValues(alpha: 0.22),
            boxShadow: selected
                ? <BoxShadow>[
                    BoxShadow(
                      color: accent.withValues(alpha: 0.35),
                      blurRadius: 16,
                      spreadRadius: 0.6,
                    ),
                  ]
                : null,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Row(
                children: <Widget>[
                  CircleAvatar(
                    radius: 17,
                    backgroundImage: imageProvider,
                    child: imageProvider == null
                        ? const Icon(Icons.shield)
                        : null,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      card.hero.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: card.isDefeated
                            ? mutedTextColor.withValues(alpha: 0.6)
                            : textColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(99),
                child: LinearProgressIndicator(
                  value: ratio.clamp(0.0, 1.0),
                  minHeight: 8,
                  color: card.isDefeated ? Colors.grey : accent,
                  backgroundColor: Colors.white.withValues(alpha: 0.15),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                children: <Widget>[
                  Text(
                    'HP ${card.currentHp}/${card.maxHp}',
                    style: TextStyle(
                      color: card.isDefeated ? mutedTextColor : textColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'ATK ${card.attack}',
                    style: TextStyle(
                      color: card.isDefeated ? mutedTextColor : textColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              if (card.isDefeated)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    'Defeated',
                    textAlign: TextAlign.right,
                    style: TextStyle(
                      color: mutedTextColor,
                      fontWeight: FontWeight.w700,
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
