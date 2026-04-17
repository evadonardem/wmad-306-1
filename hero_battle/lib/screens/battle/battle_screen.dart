import 'dart:math';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/providers/battle_provider.dart';
import 'package:hero_battle/providers/hero_search_provider.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/engine/battle_engine.dart';
import 'package:hero_battle/widgets/hp_bar.dart';
import 'package:hero_battle/widgets/action_button.dart';
import 'package:hero_battle/widgets/hero_image_widget.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';

enum _BattlePhase { pickDeck, matchmaking, fighting }

class BattleScreen extends StatefulWidget {
  final HeroModel? playerHero;
  final bool isRanked;

  const BattleScreen({super.key, this.playerHero, this.isRanked = false});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late AnimationController _playerAttackController;
  late AnimationController _opponentAttackController;
  late AnimationController _flashController;
  _BattlePhase _phase = _BattlePhase.pickDeck;
  HeroModel? _selectedPlayerHero;
  Deck? _selectedDeck;
  List<HeroModel> _availablePlayerHeroes = [];
  List<HeroModel> _opponentDeck = [];
  bool _isLoading = false;
  bool _playerAttacking = false;
  bool _opponentAttacking = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _playerAttackController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _opponentAttackController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _flashController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    if (widget.playerHero != null) {
      _selectedPlayerHero = widget.playerHero;
      _phase = _BattlePhase.matchmaking;
      WidgetsBinding.instance.addPostFrameCallback((_) => _autoMatchmake());
    }
    // Otherwise stay on pickDeck phase — no loading needed yet
  }

  void _selectDeck(Deck deck) {
    _selectedDeck = deck;
    _availablePlayerHeroes = List.of(deck.heroes);
    // Auto-pick strongest hero as lead
    _availablePlayerHeroes.sort((a, b) => b.powerstats.totalPower.compareTo(a.powerstats.totalPower));
    _selectedPlayerHero = _availablePlayerHeroes.first;
    setState(() => _phase = _BattlePhase.matchmaking);
    _autoMatchmake();
  }

  Future<void> _autoMatchmake() async {
    setState(() => _isLoading = true);
    if (!mounted) return;
    final heroSearch = context.read<HeroSearchProvider>();
    final deckSize = _availablePlayerHeroes.isNotEmpty ? _availablePlayerHeroes.length : 1;
    final opponents = await heroSearch.getRandomHeroes(count: deckSize);
    if (!mounted) return;
    if (opponents.isNotEmpty) {
      _isLoading = false;
      _opponentDeck = opponents;
      // Sort opponent deck by power (strongest lead)
      _opponentDeck.sort((a, b) => b.powerstats.totalPower.compareTo(a.powerstats.totalPower));
      _startBattle(_opponentDeck.first);
    } else {
      // Retry once if no opponent found
      final retry = await heroSearch.getRandomHeroes(count: deckSize);
      if (!mounted) return;
      _isLoading = false;
      if (retry.isNotEmpty) {
        _opponentDeck = retry;
        _opponentDeck.sort((a, b) => b.powerstats.totalPower.compareTo(a.powerstats.totalPower));
        _startBattle(_opponentDeck.first);
      } else {
        setState(() => _phase = _BattlePhase.pickDeck);
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    _playerAttackController.dispose();
    _opponentAttackController.dispose();
    _flashController.dispose();
    super.dispose();
  }

  void _playPlayerAttackAnim() {
    _playerAttacking = true;
    _playerAttackController.forward(from: 0.0).then((_) {
      _playerAttacking = false;
      _flashController.forward(from: 0.0);
    });
  }

  void _playOpponentAttackAnim() {
    _opponentAttacking = true;
    _opponentAttackController.forward(from: 0.0).then((_) {
      _opponentAttacking = false;
      _flashController.forward(from: 0.0);
    });
  }

  void _startBattle(HeroModel opponentHero) {
    context.read<BattleProvider>().startBattle(
          _selectedPlayerHero!,
          opponentHero,
          playerDeck: _availablePlayerHeroes,
          opponentDeck: _opponentDeck,
        );
    setState(() {
      _phase = _BattlePhase.fighting;
    });
    _animationController.forward();
  }

  void _resetToStart() {
    setState(() {
      _phase = _BattlePhase.pickDeck;
      _selectedPlayerHero = null;
      _selectedDeck = null;
      _availablePlayerHeroes = [];
      _opponentDeck = [];
      _rewardGiven = false;
    });
    context.read<BattleProvider>().resetBattle();
  }

  @override
  Widget build(BuildContext context) {
    switch (_phase) {
      case _BattlePhase.pickDeck:
        return _buildDeckSelection();
      case _BattlePhase.matchmaking:
        return _buildMatchmaking();
      case _BattlePhase.fighting:
        if (_isLoading) {
          return Scaffold(
            appBar: AppBar(title: const Text('Battle Arena')),
            body: const Center(child: CircularProgressIndicator()),
          );
        }
        return _buildBattleView();
    }
  }

  // ── Matchmaking screen ───────────────────────────────────────────────

  Widget _buildMatchmaking() {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle Arena')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(
              width: 60,
              height: 60,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation(Colors.purple),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Finding Opponent...',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              _selectedDeck != null
                  ? 'Deck: ${_selectedDeck!.name} • ${_availablePlayerHeroes.length} heroes'
                  : 'Preparing battle...',
              style: TextStyle(color: Colors.grey[400], fontSize: 14),
            ),
            if (_selectedPlayerHero != null) ...[
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: HeroImageWidget(
                      hero: _selectedPlayerHero!,
                      width: 60,
                      height: 70,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Text('VS', style: TextStyle(color: Colors.orange, fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(width: 16),
                  Container(
                    width: 60,
                    height: 70,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      color: Colors.grey.withValues(alpha: 0.2),
                      border: Border.all(color: Colors.grey.withValues(alpha: 0.4)),
                    ),
                    child: const Icon(Icons.help_outline, color: Colors.grey, size: 30),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  // ── Phase 0: Pick your deck ──────────────────────────────────────────

  Widget _buildDeckSelection() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose Your Deck'),
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deckProvider, _) {
          if (deckProvider.decks.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.dashboard_customize,
                      color: Colors.grey[600], size: 64),
                  const SizedBox(height: 16),
                  Text('No decks available',
                      style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 18,
                          fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Build a deck first to start battling!',
                      style:
                          TextStyle(color: Colors.grey[600], fontSize: 14)),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple),
                    child: const Text('Go Back'),
                  ),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: deckProvider.decks.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final deck = deckProvider.decks[index];
              final isActive = deckProvider.activeDeck?.id == deck.id;
              return _buildDeckOption(deck, isActive);
            },
          );
        },
      ),
    );
  }

  Widget _buildDeckOption(Deck deck, bool isActive) {
    return GestureDetector(
      onTap: () => _selectDeck(deck),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isActive
                ? Colors.purple
                : Colors.grey.withValues(alpha: 0.3),
            width: isActive ? 2 : 1,
          ),
          color: Theme.of(context).cardTheme.color,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (isActive)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 2),
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: Colors.purple.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                          color: Colors.purple.withValues(alpha: 0.5)),
                    ),
                    child: const Text('ACTIVE',
                        style: TextStyle(
                            color: Colors.purple,
                            fontSize: 10,
                            fontWeight: FontWeight.bold)),
                  ),
                Expanded(
                  child: Text(
                    deck.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text('${deck.heroes.length} heroes',
                    style:
                        TextStyle(color: Colors.grey[400], fontSize: 12)),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_ios,
                    color: Colors.grey, size: 16),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 70,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: deck.heroes.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final hero = deck.heroes[i];
                  final rarity = hero.getRarity();
                  final rarityColor =
                      Color(int.parse('0xFF${rarity.color}'));
                  return Container(
                    width: 50,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: rarityColor, width: 1.5),
                      color: Theme.of(context).scaffoldBackgroundColor,
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(7),
                      child: HeroImageWidget(
                        hero: hero,
                        width: 50,
                        height: 70,
                        borderRadius: BorderRadius.circular(7),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Battle ────────────────────────────────────────────────────────────

  Widget _buildBattleView() {
    return Consumer<BattleProvider>(
      builder: (context, bp, _) {
        if (bp.battleState == null) {
          return Scaffold(
            body: const Center(child: CircularProgressIndicator()),
          );
        }

        final bs = bp.battleState!;

        return Scaffold(
          appBar: AppBar(
            title: Row(
              children: [
                if (widget.isRanked) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 6, vertical: 2),
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                          color: Colors.red.withValues(alpha: 0.5)),
                    ),
                    child: const Text('RANKED',
                        style: TextStyle(
                            color: Colors.red,
                            fontSize: 10,
                            fontWeight: FontWeight.bold)),
                  ),
                ],
                Text('Turn ${bs.turnCount}'),
              ],
            ),
            automaticallyImplyLeading: false,
            actions: [
              IconButton(
                  icon: const Icon(Icons.list_alt), onPressed: _showBattleLog),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Opponent deck bar at top
                if (bs.opponentDeck.length > 1) ...[
                  _buildOpponentBenchBar(bs),
                  const SizedBox(height: 12),
                ],
                _buildBattleArena(bs),
                const SizedBox(height: 16),
                if (bp.needsSwap)
                  _buildForceSwapPanel(bs, bp)
                else if (!bs.isBattleReallyOver)
                  _buildActionButtons(bp)
                else
                  _buildBattleResult(bs),
                // Bench heroes bar at bottom — tap to swap
                if (bs.playerDeck.length > 1) ...[
                  const SizedBox(height: 16),
                  _buildBenchBar(bs, bp),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBattleArena(BattleState bs) {
    return Column(
      children: [
        // Opponent (top)
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Column(children: [
            _buildAnimatedHero(
              hero: bs.opponentHero,
              shakeController: _opponentAttackController,
              flashController: _flashController,
              isTarget: _playerAttacking,
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: 160,
              child: HPBar(
                currentHP: bs.opponentHealth,
                maxHP: bs.opponentHero.powerstats.health,
                heroName: bs.opponentHero.name,
                isPlayer: false,
              ),
            ),
          ]),
        ]),

        // VS indicator
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.purple, width: 2),
              gradient: LinearGradient(colors: [
                Colors.purple.withValues(alpha: 0.3),
                Colors.blue.withValues(alpha: 0.2),
              ]),
            ),
            child: const Icon(Icons.whatshot, color: Colors.orange, size: 32),
          ),
        ),

        // Player (bottom)
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Column(children: [
            SizedBox(
              width: 160,
              child: HPBar(
                currentHP: bs.playerHealth,
                maxHP: bs.playerHero.powerstats.health,
                heroName: bs.playerHero.name,
                isPlayer: true,
              ),
            ),
            const SizedBox(height: 12),
            _buildAnimatedHero(
              hero: bs.playerHero,
              shakeController: _playerAttackController,
              flashController: _flashController,
              isTarget: _opponentAttacking,
            ),
          ]),
        ]),
      ],
    );
  }

  Widget _buildAnimatedHero({
    required HeroModel hero,
    required AnimationController shakeController,
    required AnimationController flashController,
    required bool isTarget,
  }) {
    return AnimatedBuilder(
      animation: Listenable.merge([shakeController, flashController]),
      builder: (context, child) {
        // Shake when this hero is being hit (isTarget)
        double offsetX = 0;
        if (isTarget && shakeController.isAnimating) {
          offsetX = sin(shakeController.value * pi * 6) * 8;
        }
        // Lunge forward when attacking (not target)
        double offsetY = 0;
        if (!isTarget && shakeController.isAnimating) {
          final v = shakeController.value;
          offsetY = v < 0.5 ? -v * 30 : -(1 - v) * 30;
        }
        // Flash red when hit
        final showFlash =
            isTarget && flashController.isAnimating && flashController.value < 0.5;

        return Transform.translate(
          offset: Offset(offsetX, offsetY),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: HeroImageWidget(
                  hero: hero,
                  width: 120,
                  height: 140,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              if (showFlash)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.red.withValues(alpha: 0.4),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildActionButtons(BattleProvider bp) {
    final allActions = bp.getAllActions();

    return Column(
      children: [
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 2.0,
          ),
          itemCount: allActions.length,
          itemBuilder: (context, index) {
            final action = allActions[index];
            final cd = bp.getCooldown(action.name);
            final isOnCooldown = cd > 0;
            return Stack(
              children: [
                ActionButton(
                  label: action.name,
                  description: isOnCooldown
                      ? 'Cooldown: $cd turn${cd > 1 ? 's' : ''}'
                      : action.description,
                  icon: _iconFor(action.name),
                  isEnabled: !isOnCooldown,
                  onPressed: () {
                    _playPlayerAttackAnim();
                    bp.executePlayerAction(action);
                    // Opponent responded instantly — play their animation
                    Future.delayed(const Duration(milliseconds: 300), () {
                      if (mounted) _playOpponentAttackAnim();
                    });
                  },
                ),
                if (isOnCooldown)
                  Positioned(
                    top: 4,
                    right: 4,
                    child: Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.8),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$cd',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }

  // ── Bench heroes bar (shows all deck heroes with HP) ──────────────

  Widget _buildBenchBar(BattleState bs, BattleProvider bp) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Colors.purple.withValues(alpha: 0.1),
        border: Border.all(color: Colors.purple.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Your Deck', style: TextStyle(color: Colors.purple, fontSize: 11, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          SizedBox(
            height: 56,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: bs.playerDeck.length,
              separatorBuilder: (_, _) => const SizedBox(width: 6),
              itemBuilder: (context, i) {
                final hero = bs.playerDeck[i];
                final hp = bs.deckHealthMap[hero.id] ?? 0;
                final maxHp = hero.powerstats.health;
                final isActive = hero.id == bs.playerHero.id;
                final isDead = hp <= 0;
                final canSwap = !isActive && !isDead && !bs.isBattleReallyOver && !bp.needsSwap;
                return GestureDetector(
                  onTap: canSwap
                      ? () {
                          bp.swapHero(hero);
                        }
                      : null,
                  child: Container(
                  width: 46,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isActive ? Colors.green : (isDead ? Colors.red.withValues(alpha: 0.5) : (canSwap ? Colors.cyan : Colors.grey.withValues(alpha: 0.3))),
                      width: isActive ? 2 : (canSwap ? 1.5 : 1),
                    ),
                  ),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(7),
                        child: Opacity(
                          opacity: isDead ? 0.3 : 1.0,
                          child: HeroImageWidget(hero: hero, width: 46, height: 46, borderRadius: BorderRadius.circular(7)),
                        ),
                      ),
                      // HP overlay
                      Positioned(
                        bottom: 0,
                        left: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 1),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.7),
                            borderRadius: const BorderRadius.only(
                              bottomLeft: Radius.circular(7),
                              bottomRight: Radius.circular(7),
                            ),
                          ),
                          child: Text(
                            isDead ? 'KO' : '$hp/$maxHp',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: isDead ? Colors.red : Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      if (isActive)
                        Positioned(
                          top: 1,
                          right: 1,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.green,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.star, color: Colors.white, size: 8),
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
  }

  // ── Opponent deck bar (shows opponent's deck heroes with HP) ──────

  Widget _buildOpponentBenchBar(BattleState bs) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Colors.red.withValues(alpha: 0.08),
        border: Border.all(color: Colors.red.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Enemy Deck', style: TextStyle(color: Colors.red, fontSize: 11, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          SizedBox(
            height: 56,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: bs.opponentDeck.length,
              separatorBuilder: (_, _) => const SizedBox(width: 6),
              itemBuilder: (context, i) {
                final hero = bs.opponentDeck[i];
                final hp = bs.opponentDeckHealthMap[hero.id] ?? 0;
                final maxHp = hero.powerstats.health;
                final isActive = hero.id == bs.opponentHero.id;
                final isDead = hp <= 0;
                return Container(
                  width: 46,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isActive ? Colors.red : (isDead ? Colors.grey.withValues(alpha: 0.3) : Colors.orange.withValues(alpha: 0.4)),
                      width: isActive ? 2 : 1,
                    ),
                  ),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(7),
                        child: Opacity(
                          opacity: isDead ? 0.3 : 1.0,
                          child: HeroImageWidget(hero: hero, width: 46, height: 46, borderRadius: BorderRadius.circular(7)),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        left: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 1),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.7),
                            borderRadius: const BorderRadius.only(
                              bottomLeft: Radius.circular(7),
                              bottomRight: Radius.circular(7),
                            ),
                          ),
                          child: Text(
                            isDead ? 'KO' : '$hp/$maxHp',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: isDead ? Colors.red : Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      if (isActive)
                        Positioned(
                          top: 1,
                          right: 1,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.whatshot, color: Colors.white, size: 8),
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ── Forced swap panel (when active hero is KO'd) ────────────────────

  Widget _buildForceSwapPanel(BattleState bs, BattleProvider bp) {
    final bench = bs.benchHeroes;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red, width: 2),
        gradient: LinearGradient(colors: [
          Colors.red.withValues(alpha: 0.15),
          Colors.red.withValues(alpha: 0.05),
        ]),
      ),
      child: Column(
        children: [
          const Icon(Icons.warning_amber, color: Colors.red, size: 36),
          const SizedBox(height: 8),
          Text('${bs.playerHero.name} was knocked out!',
              style: const TextStyle(color: Colors.red, fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Choose a hero to send in!',
              style: TextStyle(color: Colors.white70, fontSize: 13)),
          const SizedBox(height: 16),
          ...bench.map((hero) => _buildSwapHeroTile(hero, bs, bp)),
        ],
      ),
    );
  }

  Widget _buildSwapHeroTile(HeroModel hero, BattleState bs, BattleProvider bp) {
    final hp = bs.deckHealthMap[hero.id] ?? 0;
    final maxHp = hero.powerstats.health;
    final hpPct = hp / maxHp;
    final hpColor = hpPct > 0.5 ? Colors.green : (hpPct > 0.25 ? Colors.orange : Colors.red);

    return GestureDetector(
      onTap: () {
        bp.swapHero(hero);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: Theme.of(context).cardTheme.color,
          border: Border.all(color: Colors.cyan.withValues(alpha: 0.4)),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: HeroImageWidget(hero: hero, width: 44, height: 44, borderRadius: BorderRadius.circular(8)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(hero.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 4),
                  // Mini HP bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: hpPct,
                      backgroundColor: Colors.grey.withValues(alpha: 0.3),
                      valueColor: AlwaysStoppedAnimation(hpColor),
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Text('$hp/$maxHp', style: TextStyle(color: hpColor, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            const Icon(Icons.swap_horiz, color: Colors.cyan, size: 20),
          ],
        ),
      ),
    );
  }

  IconData _iconFor(String name) {
    final n = name.toLowerCase();
    if (n.contains('strike') || n.contains('blow') || n.contains('combo') ||
        n.contains('punch') || n.contains('hit') || n.contains('jab') ||
        n.contains('assault')) {
      return Icons.flash_on;
    }
    if (n.contains('blast') || n.contains('nova') || n.contains('bolt') ||
        n.contains('wave') || n.contains('crush') || n.contains('barrage') ||
        n.contains('rush') || n.contains('technique')) {
      return Icons.bolt;
    }
    if (n.contains('dash') || n.contains('ambush') || n.contains('counter') ||
        n.contains('shot')) {
      return Icons.speed;
    }
    if (n.contains('recover') || n.contains('heal') || n.contains('will') ||
        n.contains('regeneration') || n.contains('retreat') || n.contains('wind') ||
        n.contains('drain')) {
      return Icons.healing;
    }
    return Icons.sports_martial_arts;
  }

  bool _rewardGiven = false;

  Widget _buildBattleResult(BattleState bs) {
    final win = bs.isPlayerWin;
    final color = win ? Colors.green : Colors.red;
    final coinReward = win ? (widget.isRanked ? 40 : 30) : 5;
    final rpChange = widget.isRanked ? (win ? '+25 RP' : '-15 RP') : null;

    // Award coins once and save battle record
    if (!_rewardGiven) {
      _rewardGiven = true;
      final playerProvider = context.read<PlayerProvider>();
      if (win) {
        playerProvider.addBattleWinReward(isRanked: widget.isRanked);
      } else {
        playerProvider.addBattleLossReward(isRanked: widget.isRanked);
      }
      // Save battle record to SQLite
      DatabaseService().insertBattleRecord(
        playerHeroJson: jsonEncode(bs.playerHero.toJson()),
        opponentHeroJson: jsonEncode(bs.opponentHero.toJson()),
        winnerJson: jsonEncode(bs.winner.toJson()),
        playerHealth: bs.playerHealth,
        opponentHealth: bs.opponentHealth,
        turns: bs.turnCount,
        battleType: widget.isRanked ? 'ranked' : 'quick',
      );
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color, width: 2),
        gradient: LinearGradient(colors: [
          color.withValues(alpha: 0.15),
          color.withValues(alpha: 0.05),
        ]),
      ),
      child: Column(
        children: [
          Icon(
            win ? Icons.emoji_events : Icons.sentiment_dissatisfied,
            color: color,
            size: 48,
          ),
          const SizedBox(height: 12),
          Text(win ? 'Victory!' : 'Defeat',
              style: TextStyle(
                  color: color, fontSize: 28, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Battle ended in ${bs.turnCount} turns',
              style: TextStyle(color: Colors.grey[400], fontSize: 14)),
          const SizedBox(height: 12),
          // Rewards row
          Wrap(
            spacing: 8,
            runSpacing: 8,
            alignment: WrapAlignment.center,
            children: [
              // Coin reward
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border:
                      Border.all(color: Colors.amber.withValues(alpha: 0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.monetization_on,
                        color: Colors.amber, size: 18),
                    const SizedBox(width: 4),
                    Text('+$coinReward coins',
                        style: const TextStyle(
                            color: Colors.amber,
                            fontSize: 14,
                            fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              // Rank points
              if (rpChange != null)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: (win ? Colors.green : Colors.red)
                        .withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                        color: (win ? Colors.green : Colors.red)
                            .withValues(alpha: 0.4)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.military_tech,
                          color: win ? Colors.green : Colors.red, size: 18),
                      const SizedBox(width: 4),
                      Text(rpChange,
                          style: TextStyle(
                              color: win ? Colors.green : Colors.red,
                              fontSize: 14,
                              fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purple,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('Back to Home'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _resetToStart,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('New Battle'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showBattleLog() {
    final bs = context.read<BattleProvider>().battleState;
    if (bs == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Battle Log',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: bs.battleLog.length,
                itemBuilder: (context, i) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(bs.battleLog[i],
                      style: TextStyle(color: Colors.grey[300], fontSize: 12)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
