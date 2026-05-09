import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../models/warrior_model.dart';
import '../../providers/combat_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/vitality_bar.dart';
import '../../widgets/warrior_image.dart';

class ArenaScreen extends StatelessWidget {
  const ArenaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Arena'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.menu_book_rounded),
            tooltip: 'Battle log',
            onPressed: () => _showLog(context),
          ),
        ],
      ),
      body: Consumer<CombatProvider>(
        builder: (context, combat, _) {
          if (combat.playerWarrior == null || combat.rivalWarrior == null) {
            return const Center(child: Text('No match loaded.'));
          }

          if (combat.isDone) return _ResultPanel(combat: combat);

          return Column(
            children: [
              _MatchupBanner(combat: combat),
              const Divider(height: 1),
              Expanded(child: _CombatLog(log: combat.log.take(6).toList())),
              const Divider(height: 1),
              _ActionBar(combat: combat),
            ],
          );
        },
      ),
    );
  }

  void _showLog(BuildContext context) {
    final combat = context.read<CombatProvider>();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.55,
        builder: (_, ctrl) => ListView.builder(
          controller: ctrl,
          itemCount: combat.log.length,
          padding: const EdgeInsets.symmetric(vertical: 12),
          itemBuilder: (_, i) => _LogTile(line: combat.log[i]),
        ),
      ),
    );
  }
}

class _MatchupBanner extends StatelessWidget {
  final CombatProvider combat;

  const _MatchupBanner({required this.combat});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final pw = combat.playerWarrior!;
    final rw = combat.rivalWarrior!;

    return Container(
      color: cs.surfaceContainerHigh,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Player side
          Expanded(
            child: _WarriorPanel(
              warrior: pw,
              currentVitality: combat.playerVitality,
              label: 'YOU',
              labelColor: cs.primary,
              isActive: combat.playerTurn,
            ),
          ),
          // VS badge
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'VS',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: cs.tertiary,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Turn ${combat.turn}',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
                Text(
                  '${combat.playerRemaining} vs ${combat.rivalRemaining}',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ),
          ),
          // Rival side
          Expanded(
            child: _WarriorPanel(
              warrior: rw,
              currentVitality: combat.rivalVitality,
              label: 'RIVAL',
              labelColor: cs.error,
              isActive: !combat.playerTurn,
            ),
          ),
        ],
      ),
    );
  }
}

class _WarriorPanel extends StatelessWidget {
  final WarriorModel warrior;
  final int currentVitality;
  final String label;
  final Color labelColor;
  final bool isActive;

  const _WarriorPanel({
    required this.warrior,
    required this.currentVitality,
    required this.label,
    required this.labelColor,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: isActive
                ? Border.all(color: labelColor, width: 2.5)
                : null,
          ),
          child: WarriorImage(url: warrior.imageUrl, size: 72),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: Theme.of(context)
              .textTheme
              .labelSmall
              ?.copyWith(color: labelColor, fontWeight: FontWeight.bold),
        ),
        Text(
          warrior.name,
          style: Theme.of(context).textTheme.bodySmall,
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        VitalityBar(current: currentVitality, max: warrior.vitality),
      ],
    );
  }
}

class _CombatLog extends StatelessWidget {
  final List<LogLine> log;

  const _CombatLog({required this.log});

  @override
  Widget build(BuildContext context) {
    if (log.isEmpty) {
      return const Center(child: Text('Awaiting combat…'));
    }
    return ListView.builder(
      reverse: false,
      padding: const EdgeInsets.all(12),
      itemCount: log.length,
      itemBuilder: (_, i) => _LogTile(line: log[i]),
    );
  }
}

class _LogTile extends StatelessWidget {
  final LogLine line;

  const _LogTile({required this.line});

  IconData _icon(LogTag tag) {
    switch (tag) {
      case LogTag.strike:
        return Icons.bolt_rounded;
      case LogTag.ultimate:
        return Icons.auto_awesome_rounded;
      case LogTag.parry:
        return Icons.shield_rounded;
      case LogTag.win:
        return Icons.emoji_events_rounded;
      case LogTag.loss:
        return Icons.sentiment_dissatisfied_rounded;
      case LogTag.victory:
        return Icons.military_tech_rounded;
      case LogTag.defeat:
        return Icons.flag_rounded;
      case LogTag.error:
        return Icons.warning_amber_rounded;
      default:
        return Icons.info_outline_rounded;
    }
  }

  Color _color(BuildContext context, LogTag tag) {
    final cs = Theme.of(context).colorScheme;
    switch (tag) {
      case LogTag.strike:
        return cs.primary;
      case LogTag.ultimate:
        return Colors.amber;
      case LogTag.parry:
        return Colors.cyan;
      case LogTag.win:
        return Colors.teal;
      case LogTag.loss:
        return cs.error;
      case LogTag.victory:
        return Colors.amber;
      case LogTag.defeat:
        return cs.error;
      case LogTag.error:
        return Colors.orange;
      default:
        return cs.onSurfaceVariant;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color(context, line.tag);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3, horizontal: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(_icon(line.tag), size: 16, color: color),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              line.text,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: color,
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 250.ms);
  }
}

class _ActionBar extends StatelessWidget {
  final CombatProvider combat;

  const _ActionBar({required this.combat});

  @override
  Widget build(BuildContext context) {
    final canAct = combat.playerTurn &&
        !combat.isDone &&
        !combat.busy &&
        !combat.awaitingStart;

    if (combat.awaitingStart) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: FilledButton.icon(
          icon: const Icon(Icons.play_arrow_rounded),
          label: const Text('Start Match'),
          onPressed: () => combat.beginPreparedMatch(),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      child: Row(
        children: [
          Expanded(
            child: FilledButton.icon(
              icon: const Icon(Icons.bolt_rounded),
              label: const Text('Strike'),
              onPressed: canAct
                  ? () => combat.playerStrike(useUltimate: false)
                  : null,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: FilledButton.tonal(
              onPressed: canAct && !combat.ultimateUsed
                  ? () => combat.playerStrike(useUltimate: true)
                  : null,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.auto_awesome_rounded),
                  const SizedBox(width: 6),
                  Text(combat.ultimateUsed ? 'Ultimate ✓' : 'Ultimate'),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: OutlinedButton.icon(
              icon: const Icon(Icons.shield_rounded),
              label: const Text('Parry'),
              onPressed: canAct ? () => combat.playerParry() : null,
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultPanel extends StatelessWidget {
  final CombatProvider combat;

  const _ResultPanel({required this.combat});

  @override
  Widget build(BuildContext context) {
    final won = combat.playerWon == true;
    final cs = Theme.of(context).colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              won ? Icons.military_tech_rounded : Icons.flag_rounded,
              size: 80,
              color: won ? Colors.amber : cs.error,
            )
                .animate()
                .scale(duration: 400.ms, curve: Curves.elasticOut),
            const SizedBox(height: 16),
            Text(
              won ? 'Victory!' : 'Defeat',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                color: won ? Colors.amber : cs.error,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Turns played: ${combat.turn}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FilledButton.icon(
                  icon: const Icon(Icons.home_rounded),
                  label: const Text('Home'),
                  onPressed: () => Navigator.pushNamedAndRemoveUntil(
                    context,
                    Routes.home,
                    (_) => false,
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  icon: const Icon(Icons.history_edu_rounded),
                  label: const Text('History'),
                  onPressed: () => Navigator.pushReplacementNamed(
                    context,
                    Routes.history,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

