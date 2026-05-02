import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/player_provider.dart';
import '../../theme/cyber_theme.dart';
import '../../widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  final HeroModel playerHero;
  const BattleScreen({super.key, required this.playerHero});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  late BattleProvider _battleProvider;
  bool _statsRecorded = false;

  @override
  void initState() {
    super.initState();
    _battleProvider = BattleProvider();
    _battleProvider.addListener(_onBattleStateChanged);
    _battleProvider.startBattle(widget.playerHero);
  }

  void _onBattleStateChanged() {
    if (_battleProvider.phase == BattlePhase.finished && !_statsRecorded) {
      _statsRecorded = true;
      final player = context.read<PlayerProvider>();
      if (_battleProvider.playerWon == true) {
        player.incrementWins();
      } else {
        player.incrementLosses();
      }
    }
  }

  @override
  void dispose() {
    _battleProvider.removeListener(_onBattleStateChanged);
    _battleProvider.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return ChangeNotifierProvider.value(
      value: _battleProvider,
      child: Scaffold(
        appBar: AppBar(
          title: Consumer<BattleProvider>(
            builder: (_, bp, child) => Text(
              bp.phase == BattlePhase.fighting
                  ? 'ROUND ${bp.round}'
                  : bp.phase == BattlePhase.finished
                      ? 'BATTLE OVER'
                      : 'PREPARING…',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                letterSpacing: 2,
                fontSize: 16,
                color: cs.onSurface,
              ),
            ),
          ),
        ),
        body: Consumer<BattleProvider>(
          builder: (context, bp, _) {
            if (bp.phase == BattlePhase.setup) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 44,
                      height: 44,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        color: cs.primary,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Finding an opponent…',
                      style: TextStyle(
                        color: cs.onSurface.withValues(alpha: 0.5),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              );
            }

            return Column(
              children: [
                _buildHeroPanels(context, bp),
                Expanded(child: _buildLog(context, bp)),
                if (bp.phase == BattlePhase.fighting)
                  _buildControls(context, bp),
                if (bp.phase == BattlePhase.finished) _buildResult(context, bp),
              ],
            );
          },
        ),
      ),
    );
  }

  // ── Hero vs Hero panels ───────────────────────────────

  Widget _buildHeroPanels(BuildContext context, BattleProvider bp) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.fromLTRB(12, 8, 12, 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: cs.surfaceContainerHighest.withValues(alpha: 0.4),
        border: Border.all(color: cs.primary.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Expanded(
            child: _HeroPanel(
              hero: bp.playerHero!,
              hp: bp.playerHp,
              maxHp: bp.playerMaxHp,
              label: 'YOU',
              isActive: bp.playerTurn && bp.phase == BattlePhase.fighting,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        cs.primary,
                        cs.primary.withValues(alpha: 0.5),
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: cs.primary.withValues(alpha: 0.3),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'VS',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _HeroPanel(
              hero: bp.aiHero!,
              hp: bp.aiHp,
              maxHp: bp.aiMaxHp,
              label: 'AI',
              isActive: !bp.playerTurn && bp.phase == BattlePhase.fighting,
            ),
          ),
        ],
      ),
    );
  }

  // ── Battle log ────────────────────────────────────────

  Widget _buildLog(BuildContext context, BattleProvider bp) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest.withValues(alpha: 0.25),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: cs.primary.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 6),
            child: Row(
              children: [
                Icon(Icons.receipt_long_rounded,
                    size: 14, color: cs.primary.withValues(alpha: 0.5)),
                const SizedBox(width: 6),
                Text(
                  'BATTLE LOG',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                        color: cs.primary.withValues(alpha: 0.5),
                      ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 10),
              itemCount: bp.log.length,
              itemBuilder: (_, i) {
                final idx = bp.log.length - 1 - i;
                final isLatest = i == 0;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Text(
                    bp.log[idx],
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight:
                              isLatest ? FontWeight.w600 : FontWeight.normal,
                          color: isLatest
                              ? cs.onSurface
                              : cs.onSurface.withValues(alpha: 0.5),
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

  // ── Attack controls ───────────────────────────────────

  Widget _buildControls(BuildContext context, BattleProvider bp) {
    final cs = Theme.of(context).colorScheme;
    final canAct = bp.playerTurn && !bp.busy;
    return Container(
      decoration: BoxDecoration(
        color: cs.surface,
        border: Border(top: BorderSide(color: cs.primary.withValues(alpha: 0.1))),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
          child: Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: canAct ? () => bp.playerAttack() : null,
                  icon: const Icon(Icons.flash_on_rounded, size: 20),
                  label: const Text('Attack'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FilledButton.tonal(
                  onPressed: canAct ? () => bp.playerSpecialAttack() : null,
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.auto_awesome_rounded, size: 20),
                      SizedBox(width: 8),
                      Text('Special'),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Result banner ─────────────────────────────────────

  Widget _buildResult(BuildContext context, BattleProvider bp) {
    final cs = Theme.of(context).colorScheme;
    final won = bp.playerWon == true;
    final resultColor = won ? CyberColors.gold : CyberColors.error;

    return Container(
      decoration: BoxDecoration(
        color: cs.surface,
        border: Border(top: BorderSide(color: resultColor.withValues(alpha: 0.2))),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: resultColor.withValues(alpha: 0.15),
                ),
                child: Icon(
                  won ? Icons.emoji_events_rounded : Icons.close_rounded,
                  size: 34,
                  color: resultColor,
                ),
              )
                  .animate()
                  .scale(
                      begin: const Offset(0.5, 0.5),
                      duration: 400.ms,
                      curve: Curves.elasticOut),
              const SizedBox(height: 12),
              Text(
                won ? 'VICTORY!' : 'DEFEAT',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: resultColor,
                      letterSpacing: 3,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                '${bp.round} rounds',
                style: TextStyle(
                  color: cs.onSurface.withValues(alpha: 0.5),
                ),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Back to Roster'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Single hero panel (image + name + HP bar)
// ─────────────────────────────────────────────────────────

class _HeroPanel extends StatelessWidget {
  final HeroModel hero;
  final int hp;
  final int maxHp;
  final String label;
  final bool isActive;

  const _HeroPanel({
    required this.hero,
    required this.hp,
    required this.maxHp,
    required this.label,
    this.isActive = false,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: isActive
            ? Border.all(color: cs.primary, width: 2)
            : Border.all(color: cs.primary.withValues(alpha: 0.08)),
        color: isActive
            ? cs.primary.withValues(alpha: 0.06)
            : Colors.transparent,
      ),
      child: Column(
        children: [
          // Label
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            decoration: BoxDecoration(
              color: isActive
                  ? cs.primary.withValues(alpha: 0.15)
                  : cs.onSurface.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              label,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: isActive ? cs.primary : cs.onSurface.withValues(alpha: 0.5),
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1,
                  ),
            ),
          ),
          const SizedBox(height: 8),
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: hero.imageUrl.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: hero.imageUrl,
                    height: 85,
                    width: 65,
                    fit: BoxFit.cover,
                    errorWidget: (x, y, z) =>
                        const Icon(Icons.person_rounded, size: 32),
                  )
                : const SizedBox(
                    height: 85,
                    width: 65,
                    child: Icon(Icons.person_rounded, size: 32)),
          ),
          const SizedBox(height: 6),
          Text(
            hero.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context)
                .textTheme
                .labelMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          HpBar(current: hp, max: maxHp),
        ],
      ),
    );
  }
}
