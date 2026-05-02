import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/deck_battle_provider.dart';
import '../../providers/player_provider.dart';
import '../../theme/cyber_theme.dart';
import '../../widgets/hp_bar.dart';

class DeckBattleScreen extends StatefulWidget {
  final List<HeroModel> playerDeck;
  const DeckBattleScreen({super.key, required this.playerDeck});

  @override
  State<DeckBattleScreen> createState() => _DeckBattleScreenState();
}

class _DeckBattleScreenState extends State<DeckBattleScreen>
    with TickerProviderStateMixin {
  late DeckBattleProvider _provider;
  late AnimationController _pulseController;
  late AnimationController _shakeController;
  late Animation<double> _shakeAnim;
  final ScrollController _logScroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _provider = DeckBattleProvider();
    _provider.addListener(_onStateChange);
    _provider.startWar(widget.playerDeck);

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _shakeAnim = Tween<double>(begin: 0, end: 8).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.elasticIn),
    );
  }

  void _onStateChange() {
    if (_provider.phase == DeckBattlePhase.warResult) {
      final pp = context.read<PlayerProvider>();
      if (_provider.warWon == true) {
        pp.incrementWins();
      } else {
        pp.incrementLosses();
      }
    }
    // Shake on damage
    if (_provider.phase == DeckBattlePhase.fighting && !_provider.playerTurn) {
      _shakeController.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _provider.removeListener(_onStateChange);
    _provider.dispose();
    _pulseController.dispose();
    _shakeController.dispose();
    _logScroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _provider,
      child: Consumer<DeckBattleProvider>(
        builder: (context, bp, _) {
          return Scaffold(
            body: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Theme.of(context).colorScheme.surface,
                    Theme.of(context).colorScheme.surface.withValues(alpha: 0.95),
                    CyberColors.background.withValues(alpha: 0.3),
                  ],
                ),
              ),
              child: SafeArea(child: _buildBody(bp)),
            ),
          );
        },
      ),
    );
  }

  Widget _buildBody(DeckBattleProvider bp) {
    switch (bp.phase) {
      case DeckBattlePhase.loading:
        return _buildLoadingPhase(bp);
      case DeckBattlePhase.matchupIntro:
        return _buildMatchupIntro(bp);
      case DeckBattlePhase.fighting:
        return _buildFightingPhase(bp);
      case DeckBattlePhase.matchupResult:
        return _buildMatchupResult(bp);
      case DeckBattlePhase.warResult:
        return _buildWarResult(bp);
    }
  }

  // ═══════════════════════════════════════════════════════
  // LOADING PHASE
  // ═══════════════════════════════════════════════════════
  Widget _buildLoadingPhase(DeckBattleProvider bp) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 80,
            height: 80,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              color: CyberColors.cyan,
            ),
          ).animate(onPlay: (c) => c.repeat()).shimmer(
                duration: 1500.ms,
                color: CyberColors.cyan.withValues(alpha: 0.3),
              ),
          const SizedBox(height: 24),
          Text(
            bp.statusMessage,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: CyberColors.cyan,
                  fontWeight: FontWeight.bold,
                ),
          ).animate().fadeIn().then().shimmer(duration: 2000.ms),
          const SizedBox(height: 16),
          Text(
            'Assembling AI deck...',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════
  // MATCHUP INTRO
  // ═══════════════════════════════════════════════════════
  Widget _buildMatchupIntro(DeckBattleProvider bp) {
    final player = bp.currentPlayerHero;
    final ai = bp.currentAiHero;

    return Column(
      children: [
        _buildScoreBar(bp),
        const Spacer(),
        // VS Intro
        Text(
          'MATCH ${bp.matchupIndex + 1}',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: CyberColors.cyan,
                letterSpacing: 4,
                fontWeight: FontWeight.w900,
              ),
        ).animate().fadeIn(duration: 400.ms),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildIntroCard(player, 'YOU', CyberColors.cyan)
                .animate()
                .slideX(begin: -1, duration: 500.ms, curve: Curves.easeOutBack),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'VS',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: CyberColors.magenta,
                      shadows: [
                        Shadow(color: CyberColors.magenta.withValues(alpha: 0.8), blurRadius: 20),
                      ],
                    ),
              ).animate().scale(delay: 300.ms, duration: 400.ms, curve: Curves.elasticOut),
            ),
            _buildIntroCard(ai, 'AI', CyberColors.error)
                .animate()
                .slideX(begin: 1, duration: 500.ms, curve: Curves.easeOutBack),
          ],
        ),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(24),
          child: SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: CyberColors.cyan,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 8,
                shadowColor: CyberColors.cyan.withValues(alpha: 0.5),
              ),
              onPressed: bp.startMatchup,
              child: Text('FIGHT!',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: Colors.black,
                        letterSpacing: 3,
                      )),
            ),
          ).animate().slideY(begin: 1, delay: 600.ms, duration: 400.ms),
        ),
      ],
    );
  }

  Widget _buildIntroCard(HeroModel hero, String label, Color accent) {
    return Column(
      children: [
        Container(
          width: 130,
          height: 170,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: accent, width: 2),
            boxShadow: [
              BoxShadow(color: accent.withValues(alpha: 0.4), blurRadius: 16, spreadRadius: 2),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: CachedNetworkImage(
              imageUrl: hero.imageUrl,
              fit: BoxFit.cover,
              placeholder: (_, __) => Container(color: accent.withValues(alpha: 0.1)),
              errorWidget: (_, __, ___) => Icon(Icons.person, size: 48, color: accent),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          hero.name,
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        Text(label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: accent,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2,
                )),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCORE BAR
  // ═══════════════════════════════════════════════════════
  Widget _buildScoreBar(DeckBattleProvider bp) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _scoreChip('YOU', bp.playerWins, CyberColors.cyan),
          // Match dots
          Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(bp.totalMatchups, (i) {
              Color dotColor;
              if (i < bp.matchupIndex) {
                // Past matchups
                if (i < bp.playerWins + bp.aiWins) {
                  // Determine who won this matchup
                  dotColor = CyberColors.cyan.withValues(alpha: 0.3);
                } else {
                  dotColor = Colors.grey;
                }
              } else if (i == bp.matchupIndex) {
                dotColor = CyberColors.magenta;
              } else {
                dotColor = Theme.of(context).colorScheme.outline.withValues(alpha: 0.3);
              }
              return Container(
                width: 12,
                height: 12,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: dotColor,
                  boxShadow: i == bp.matchupIndex
                      ? [BoxShadow(color: CyberColors.magenta.withValues(alpha: 0.6), blurRadius: 8)]
                      : null,
                ),
              );
            }),
          ),
          _scoreChip('AI', bp.aiWins, CyberColors.error),
        ],
      ),
    );
  }

  Widget _scoreChip(String label, int wins, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(label,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                )),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: color.withValues(alpha: 0.4)),
          ),
          child: Text(
            '$wins',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w900,
                ),
          ),
        ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════
  // FIGHTING PHASE
  // ═══════════════════════════════════════════════════════
  Widget _buildFightingPhase(DeckBattleProvider bp) {
    return Column(
      children: [
        _buildScoreBar(bp),
        const SizedBox(height: 8),
        // Battle Arena
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // AI Panel (top)
                _buildFighterPanel(
                  hero: bp.currentAiHero,
                  hp: bp.aiHp,
                  maxHp: bp.aiMaxHp,
                  accent: CyberColors.error,
                  label: 'AI',
                  isActive: !bp.playerTurn,
                  isTop: true,
                ),
                // VS / Round indicator
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              CyberColors.magenta.withValues(alpha: 0.2),
                              CyberColors.cyan.withValues(alpha: 0.2),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: CyberColors.magenta.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Text(
                          '⚔️ ROUND ${bp.round}',
                          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.5,
                              ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Player Panel (bottom)
                AnimatedBuilder(
                  animation: _shakeAnim,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(_shakeAnim.value * sin(_shakeController.value * pi * 4), 0),
                      child: child,
                    );
                  },
                  child: _buildFighterPanel(
                    hero: bp.currentPlayerHero,
                    hp: bp.playerHp,
                    maxHp: bp.playerMaxHp,
                    accent: CyberColors.cyan,
                    label: 'YOU',
                    isActive: bp.playerTurn,
                    isTop: false,
                  ),
                ),
                const SizedBox(height: 8),
                // Battle Log
                Expanded(child: _buildBattleLog(bp)),
              ],
            ),
          ),
        ),
        // Action Buttons
        _buildActionButtons(bp),
      ],
    );
  }

  Widget _buildFighterPanel({
    required HeroModel hero,
    required int hp,
    required int maxHp,
    required Color accent,
    required String label,
    required bool isActive,
    required bool isTop,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive ? accent.withValues(alpha: 0.6) : Colors.transparent,
          width: 2,
        ),
        boxShadow: isActive
            ? [BoxShadow(color: accent.withValues(alpha: 0.2), blurRadius: 12)]
            : null,
      ),
      child: Row(
        children: [
          // Hero avatar
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: accent.withValues(alpha: 0.5), width: 1.5),
              boxShadow: [
                BoxShadow(color: accent.withValues(alpha: 0.3), blurRadius: 8),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: CachedNetworkImage(
                imageUrl: hero.imageUrl,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: accent.withValues(alpha: 0.1)),
                errorWidget: (_, __, ___) => Icon(Icons.person, color: accent),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: accent.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(label,
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                color: accent,
                                fontWeight: FontWeight.w800,
                                fontSize: 10,
                              )),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        hero.name,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                HpBar(current: hp, max: maxHp, height: 12),
              ],
            ),
          ),
          // Turn indicator
          if (isActive)
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: accent.withValues(alpha: 0.15),
              ),
              child: Icon(Icons.play_arrow_rounded, color: accent, size: 20),
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                  begin: const Offset(1, 1),
                  end: const Offset(1.2, 1.2),
                  duration: 600.ms,
                ),
        ],
      ),
    );
  }

  Widget _buildBattleLog(DeckBattleProvider bp) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_logScroll.hasClients) {
        _logScroll.animateTo(
          _logScroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.15),
        ),
      ),
      child: ListView.builder(
        controller: _logScroll,
        itemCount: bp.log.length,
        padding: EdgeInsets.zero,
        itemBuilder: (context, i) {
          final entry = bp.log[i];
          final isPlayerAction = entry.contains(bp.currentPlayerHero.name) && !entry.contains('wins');
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Text(
              entry,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: entry.contains('🏆')
                        ? CyberColors.success
                        : entry.contains('💀')
                            ? CyberColors.error
                            : entry.contains('🛡')
                                ? CyberColors.cyan
                                : isPlayerAction
                                    ? CyberColors.cyan.withValues(alpha: 0.9)
                                    : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
                    fontWeight: entry.contains('⚔️') ? FontWeight.bold : null,
                    fontSize: 12,
                  ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildActionButtons(DeckBattleProvider bp) {
    final canAct = bp.phase == DeckBattlePhase.fighting && bp.playerTurn && !bp.busy;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.4),
        border: Border(
          top: BorderSide(
            color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.1),
          ),
        ),
      ),
      child: Row(
        children: [
          // Attack
          Expanded(
            flex: 3,
            child: _actionButton(
              label: 'ATTACK',
              icon: Icons.flash_on_rounded,
              color: CyberColors.cyan,
              onPressed: canAct ? bp.playerAttack : null,
            ),
          ),
          const SizedBox(width: 8),
          // Special
          Expanded(
            flex: 3,
            child: _actionButton(
              label: 'SPECIAL',
              icon: Icons.auto_awesome,
              color: CyberColors.magenta,
              onPressed: canAct ? bp.playerSpecialAttack : null,
            ),
          ),
          const SizedBox(width: 8),
          // Defend
          Expanded(
            flex: 2,
            child: _actionButton(
              label: 'DEFEND',
              icon: Icons.shield_rounded,
              color: CyberColors.neonGreen,
              onPressed: canAct ? bp.playerDefend : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionButton({
    required String label,
    required IconData icon,
    required Color color,
    VoidCallback? onPressed,
  }) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: onPressed != null ? color.withValues(alpha: 0.15) : Colors.grey.withValues(alpha: 0.1),
        foregroundColor: onPressed != null ? color : Colors.grey,
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: onPressed != null ? color.withValues(alpha: 0.5) : Colors.grey.withValues(alpha: 0.2),
          ),
        ),
        elevation: 0,
      ),
      onPressed: onPressed,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 22),
          const SizedBox(height: 2),
          Text(label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 1,
              )),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════
  // MATCHUP RESULT
  // ═══════════════════════════════════════════════════════
  Widget _buildMatchupResult(DeckBattleProvider bp) {
    final won = bp.matchupWon == true;
    final accent = won ? CyberColors.success : CyberColors.error;
    final hero = won ? bp.currentPlayerHero : bp.currentAiHero;

    return Column(
      children: [
        _buildScoreBar(bp),
        const Spacer(),
        // Winner showcase
        Container(
          width: 160,
          height: 200,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: accent, width: 3),
            boxShadow: [
              BoxShadow(color: accent.withValues(alpha: 0.5), blurRadius: 30, spreadRadius: 4),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(17),
            child: CachedNetworkImage(
              imageUrl: hero.imageUrl,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Icon(Icons.person, size: 64, color: accent),
            ),
          ),
        )
            .animate()
            .scale(begin: const Offset(0.5, 0.5), duration: 500.ms, curve: Curves.elasticOut),
        const SizedBox(height: 16),
        Text(
          won ? 'VICTORY!' : 'DEFEATED',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w900,
                color: accent,
                letterSpacing: 4,
                shadows: [Shadow(color: accent.withValues(alpha: 0.6), blurRadius: 20)],
              ),
        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3),
        const SizedBox(height: 8),
        Text(
          '${hero.name} ${won ? "dominates" : "prevails"}!',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
              ),
        ),
        const SizedBox(height: 8),
        Text(
          'Score: ${bp.playerWins} - ${bp.aiWins}',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(24),
          child: SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: bp.isWarOver ? CyberColors.magenta : CyberColors.cyan,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 8,
              ),
              onPressed: bp.nextMatchup,
              child: Text(
                bp.isWarOver ? 'SEE FINAL RESULTS' : 'NEXT MATCH →',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: Colors.black,
                      letterSpacing: 2,
                    ),
              ),
            ),
          ).animate().slideY(begin: 0.5, delay: 500.ms, duration: 400.ms),
        ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════
  // WAR RESULT (CINEMATIC)
  // ═══════════════════════════════════════════════════════
  Widget _buildWarResult(DeckBattleProvider bp) {
    final won = bp.warWon == true;
    final accent = won ? CyberColors.success : CyberColors.error;

    return Stack(
      children: [
        // Animated background particles
        ...List.generate(20, (i) {
          final rng = Random(i);
          return Positioned(
            left: rng.nextDouble() * MediaQuery.of(context).size.width,
            top: rng.nextDouble() * MediaQuery.of(context).size.height,
            child: Container(
              width: 4 + rng.nextDouble() * 6,
              height: 4 + rng.nextDouble() * 6,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: (won ? CyberColors.cyan : CyberColors.error)
                    .withValues(alpha: 0.3 + rng.nextDouble() * 0.4),
              ),
            )
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .fadeIn(duration: Duration(milliseconds: 800 + rng.nextInt(1200)))
                .moveY(
                  begin: 0,
                  end: -20 - rng.nextDouble() * 40,
                  duration: Duration(milliseconds: 2000 + rng.nextInt(2000)),
                ),
          );
        }),
        // Content
        Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Trophy / Skull icon
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [accent, accent.withValues(alpha: 0.3)],
                  ),
                  boxShadow: [
                    BoxShadow(color: accent.withValues(alpha: 0.6), blurRadius: 40, spreadRadius: 10),
                  ],
                ),
                child: Icon(
                  won ? Icons.emoji_events_rounded : Icons.dangerous_rounded,
                  size: 56,
                  color: Colors.white,
                ),
              )
                  .animate()
                  .scale(
                    begin: const Offset(0, 0),
                    end: const Offset(1, 1),
                    duration: 800.ms,
                    curve: Curves.elasticOut,
                  ),
              const SizedBox(height: 24),
              Text(
                won ? 'WAR WON!' : 'WAR LOST',
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: accent,
                      letterSpacing: 6,
                      shadows: [
                        Shadow(color: accent.withValues(alpha: 0.8), blurRadius: 30),
                        Shadow(color: accent.withValues(alpha: 0.4), blurRadius: 60),
                      ],
                    ),
              ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.5),
              const SizedBox(height: 16),
              // Final score
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
                  border: Border.all(color: accent.withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _finalScoreColumn('YOU', bp.playerWins, CyberColors.cyan),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Text('–',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3),
                              )),
                    ),
                    _finalScoreColumn('AI', bp.aiWins, CyberColors.error),
                  ],
                ),
              ).animate().fadeIn(delay: 700.ms).scale(begin: const Offset(0.8, 0.8)),
              const SizedBox(height: 32),
              // Hero roster recap
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(bp.playerDeck.length, (i) {
                  final didPlay = i < bp.matchupIndex;
                  return Container(
                    width: 48,
                    height: 48,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: didPlay ? CyberColors.cyan.withValues(alpha: 0.5) : Colors.grey.withValues(alpha: 0.3),
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Opacity(
                        opacity: didPlay ? 1.0 : 0.3,
                        child: CachedNetworkImage(
                          imageUrl: bp.playerDeck[i].imageUrl,
                          fit: BoxFit.cover,
                          errorWidget: (_, __, ___) => const Icon(Icons.person, size: 24),
                        ),
                      ),
                    ),
                  );
                }),
              ).animate().fadeIn(delay: 1000.ms),
              const SizedBox(height: 40),
              // Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: accent.withValues(alpha: 0.15),
                      foregroundColor: accent,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                        side: BorderSide(color: accent.withValues(alpha: 0.4)),
                      ),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.home_rounded),
                    label: const Text('HOME', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1)),
                  ),
                  const SizedBox(width: 16),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: CyberColors.cyan,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 8,
                      shadowColor: CyberColors.cyan.withValues(alpha: 0.5),
                    ),
                    onPressed: () {
                      // Restart war with same deck
                      _provider.startWar(widget.playerDeck);
                    },
                    icon: const Icon(Icons.replay_rounded),
                    label: const Text('REMATCH', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1)),
                  ),
                ],
              ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3),
            ],
          ),
        ),
      ],
    );
  }

  Widget _finalScoreColumn(String label, int score, Color color) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(label,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2,
                )),
        const SizedBox(height: 4),
        Text(
          '$score',
          style: Theme.of(context).textTheme.displayMedium?.copyWith(
                fontWeight: FontWeight.w900,
                color: color,
                shadows: [Shadow(color: color.withValues(alpha: 0.6), blurRadius: 16)],
              ),
        ),
      ],
    );
  }
}
