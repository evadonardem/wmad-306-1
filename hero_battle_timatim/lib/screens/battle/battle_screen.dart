// Battle screen with a clean duel layout and subtle feedback.

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});
  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  Future<void> _attack() async {
    final battle = context.read<BattleProvider>();
    final player = context.read<PlayerProvider>();
    if (!battle.canAct) return;
    await battle.playerAttack(player);
  }

  Future<void> _openSwapSheet() async {
    final battle = context.read<BattleProvider>();
    final deck = context.read<DeckProvider>();
    if (!battle.canAct) return;

    final active = battle.player;
    final candidates = deck.deck
        .where((h) => active == null || h.id != active.id)
        .toList();

    if (candidates.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No bench heroes available.')),
      );
      return;
    }

    final picked = await showModalBottomSheet<HeroModel>(
      context: context,
      backgroundColor: Theme.of(context).cardColor,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSpacing.radius)),
      ),
      builder: (ctx) => _SwapSheet(candidates: candidates),
    );
    if (picked != null && mounted) {
      battle.swapHero(picked);
    }
  }

  void _continueBattle(BattleProvider battle, DeckProvider deck) {
    if (deck.deck.isEmpty) return;
    final player = deck.deck.first;
    final ai = deck.deck.length > 1 ? deck.deck.last : player;
    battle.continueBattle(player, ai);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Consumer<BattleProvider>(
          builder: (context, battle, child) => Text(battle.player == null ? 'Battle' : 'Round ${battle.rounds}'),
        ),
      ),
      body: Consumer<BattleProvider>(
        builder: (context, battle, _) {
          final player = battle.player;
          final ai = battle.ai;
          if (player == null || ai == null) {
            return Center(
              child: Text(
                'No active battle.',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            );
          }

          Widget content = SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                children: [
                  _PhaseBanner(battle: battle),
                  const SizedBox(height: AppSpacing.medium),
                  _CombatantCard(
                    hero: ai,
                    hp: battle.aiHp,
                    maxHp: battle.aiMaxHp,
                    label: 'Opponent',
                    flipped: true,
                    isAttacking: battle.phase == BattlePhase.aiTurn,
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  _CombatantCard(
                    hero: player,
                    hp: battle.playerHp,
                    maxHp: battle.playerMaxHp,
                    label: 'You',
                    flipped: false,
                    isAttacking: battle.phase == BattlePhase.playerTurn,
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  Expanded(child: _BattleLog(log: battle.log)),
                  const SizedBox(height: AppSpacing.medium),
                  _ActionBar(
                    battle: battle,
                    onAttack: _attack,
                    onSwap: _openSwapSheet,
                  ),
                ],
              ),
            ),
          );

          if (battle.lastDamage > 30 && battle.rounds > 0 && !battle.isOver) {
            content = content.animate().shake(duration: 260.ms, hz: 8, offset: const Offset(3, 0));
          }

          return Stack(
            children: [
              content,
              if (battle.phase == BattlePhase.ended)
                _ResultOverlay(
                  battle: battle,
                  onContinue: () => _continueBattle(battle, context.read<DeckProvider>()),
                  onExit: () => Navigator.pop(context),
                ),
            ],
          );
        },
      ),
    );
  }
}

class _PhaseBanner extends StatelessWidget {
  final BattleProvider battle;
  const _PhaseBanner({required this.battle});

  Color get accent {
    switch (battle.phase) {
      case BattlePhase.playerTurn:
        return AppColors.primary;
      case BattlePhase.aiTurn:
        return AppColors.danger;
      case BattlePhase.ended:
        return battle.playerWon ? AppColors.primary : AppColors.danger;
      case BattlePhase.waiting:
        return AppColors.textMedium;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.medium,
          vertical: AppSpacing.small,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'ROUND ${battle.rounds}',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppColors.textMedium,
                    fontWeight: FontWeight.w700,
                  ),
            ),
            Text(
              battle.phaseLabel,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: accent,
                    fontWeight: FontWeight.w800,
                  ),
            ).animate().fadeIn(duration: 220.ms).slide(begin: const Offset(0.12, 0)),
          ],
        ),
      ),
    );
  }
}

class _CombatantCard extends StatelessWidget {
  final HeroModel hero;
  final int hp;
  final int maxHp;
  final String label;
  final bool flipped;
  final bool isAttacking;

  const _CombatantCard({
    required this.hero,
    required this.hp,
    required this.maxHp,
    required this.label,
    required this.flipped,
    required this.isAttacking,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: AppColors.surfaceSoft,
                  foregroundImage: NetworkImage(hero.imageUrl),
                ),
                const SizedBox(width: AppSpacing.medium),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(label, style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 4),
                      Text(hero.name, style: Theme.of(context).textTheme.titleLarge),
                    ],
                  ),
                ),
                if (isAttacking)
                  Chip(
                    label: const Text('ATTACK'),
                    backgroundColor: const Color.fromRGBO(75, 109, 255, 0.12),
                    labelStyle: const TextStyle(color: AppColors.primary),
                  ),
              ],
            ),
            const SizedBox(height: AppSpacing.medium),
            HpBar(
              currentHp: hp,
              maxHp: maxHp,
              label: 'HP',
              flipped: flipped,
            ),
          ],
        ),
      ),
    );
  }
}

class _BattleLog extends StatelessWidget {
  final List<String> log;
  const _BattleLog({required this.log});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Battle log', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.small),
            Expanded(
              child: ListView.separated(
                itemCount: log.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final item = log[index];
                  final latest = index == log.length - 1;
                  return Text(
                    item,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: latest ? AppColors.primary : AppColors.textMedium,
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
}

class _ActionBar extends StatelessWidget {
  final BattleProvider battle;
  final VoidCallback onAttack;
  final Future<void> Function() onSwap;

  const _ActionBar({
    required this.battle,
    required this.onAttack,
    required this.onSwap,
  });

  @override
  Widget build(BuildContext context) {
    final disabled = !battle.canAct;
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: disabled ? null : onAttack,
            icon: const Icon(Icons.bolt),
            label: const Text('Attack'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.small),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: disabled ? null : () => onSwap(),
            icon: const Icon(Icons.swap_horiz),
            label: const Text('Swap'),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
            ),
          ),
        ),
      ],
    );
  }
}

class _ResultOverlay extends StatelessWidget {
  final BattleProvider battle;
  final VoidCallback onContinue;
  final VoidCallback onExit;

  const _ResultOverlay({
    required this.battle,
    required this.onContinue,
    required this.onExit,
  });

  @override
  Widget build(BuildContext context) {
    final accent = battle.playerWon ? AppColors.primary : AppColors.danger;
    return Positioned.fill(
      child: Container(
        color: Theme.of(context).scaffoldBackgroundColor.withAlpha((0.92 * 255).round()),
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Center(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.large),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    battle.playerWon ? 'Victory' : 'Defeat',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: accent,
                          fontSize: 26,
                        ),
                  ),
                  const SizedBox(height: AppSpacing.small),
                  Text(
                    battle.playerWon
                        ? '${battle.player?.name} defeated ${battle.ai?.name}'
                        : '${battle.ai?.name} defeated ${battle.player?.name}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: AppSpacing.large),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: onExit,
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: AppColors.border),
                          ),
                          child: const Text('Exit'),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.small),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: onContinue,
                          child: const Text('Continue'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ).animate().fadeIn(duration: 200.ms),
        ),
      ),
    );
  }
}

class _SwapSheet extends StatelessWidget {
  final List<HeroModel> candidates;
  const _SwapSheet({required this.candidates});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 48,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.medium),
            Text('Choose a hero', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.small),
            ...candidates.map((hero) => Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(hero.imageUrl),
                      backgroundColor: AppColors.surfaceSoft,
                    ),
                    title: Text(hero.name),
                    subtitle: Text('HP ${hero.maxHp} • ATK ${hero.attack}'),
                    onTap: () => Navigator.pop(context, hero),
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
