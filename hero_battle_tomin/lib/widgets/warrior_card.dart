import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/warrior_model.dart';
import '../providers/squad_provider.dart';
import '../router/app_router.dart';
import 'warrior_image.dart';
import 'stat_chip.dart';

class WarriorCard extends StatelessWidget {
  final WarriorModel warrior;

  const WarriorCard({super.key, required this.warrior});

  Color _alignmentColor(BuildContext context, String alignment) {
    final cs = Theme.of(context).colorScheme;
    switch (alignment.toLowerCase()) {
      case 'good':
        return Colors.teal;
      case 'bad':
        return cs.error;
      default:
        return cs.secondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final squad = context.watch<SquadProvider>();
    final inSquad = squad.contains(warrior.id);
    final cs = Theme.of(context).colorScheme;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () =>
            Navigator.pushNamed(context, Routes.warriorDetail, arguments: warrior),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Portrait
              WarriorImage(url: warrior.imageUrl, size: 64),
              const SizedBox(width: 12),
              // Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            warrior.name,
                            style: Theme.of(context)
                                .textTheme
                                .titleSmall
                                ?.copyWith(fontWeight: FontWeight.bold),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: _alignmentColor(context, warrior.alignment)
                                .withAlpha(40),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            warrior.alignment.toUpperCase(),
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                  color: _alignmentColor(
                                    context,
                                    warrior.alignment,
                                  ),
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      warrior.publisher,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: cs.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Stat chips (different from original's row layout)
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: [
                        StatChip(label: 'VIT', value: warrior.vitality),
                        StatChip(label: 'STR', value: warrior.strike),
                        StatChip(label: 'ULT', value: warrior.ultimatePower),
                        StatChip(label: 'AGI', value: warrior.agility),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Add/remove button
              IconButton(
                tooltip: inSquad ? 'Remove from squad' : 'Add to squad',
                icon: Icon(
                  inSquad
                      ? Icons.remove_circle_rounded
                      : Icons.add_circle_rounded,
                  color: inSquad ? cs.error : cs.primary,
                ),
                onPressed: () {
                  if (inSquad) {
                    squad.removeWarrior(warrior.id);
                  } else if (!squad.isFull) {
                    squad.addWarrior(warrior);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Squad is full (max 5 warriors).'),
                      ),
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
