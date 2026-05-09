import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/warrior_model.dart';
import '../../providers/squad_provider.dart';
import '../../widgets/warrior_image.dart';
import '../../widgets/stat_chip.dart';

class WarriorDetailScreen extends StatelessWidget {
  final WarriorModel warrior;

  const WarriorDetailScreen({super.key, required this.warrior});

  @override
  Widget build(BuildContext context) {
    final squad = context.watch<SquadProvider>();
    final inSquad = squad.contains(warrior.id);
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: Text(warrior.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Portrait + basic info
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                WarriorImage(url: warrior.imageUrl, size: 110),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        warrior.name,
                        style: Theme.of(context).textTheme.headlineSmall
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      if (warrior.fullName.isNotEmpty)
                        Text(
                          warrior.fullName,
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: cs.onSurfaceVariant),
                        ),
                      const SizedBox(height: 4),
                      Text(warrior.publisher,
                          style: Theme.of(context).textTheme.bodySmall),
                      const SizedBox(height: 8),
                      Chip(
                        label: Text(
                          warrior.alignment.toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        backgroundColor: warrior.alignment == 'good'
                            ? Colors.teal.withAlpha(40)
                            : warrior.alignment == 'bad'
                                ? cs.errorContainer
                                : cs.surfaceContainerHighest,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Combat stats
            Text(
              'Combat Stats',
              style: Theme.of(context).textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                StatChip(label: 'VIT', value: warrior.vitality),
                StatChip(label: 'STRIKE', value: warrior.strike),
                StatChip(label: 'ULTIMATE', value: warrior.ultimatePower),
                StatChip(label: 'RESIST', value: warrior.resistance),
                StatChip(label: 'AGILITY', value: warrior.agility),
              ],
            ),
            const SizedBox(height: 24),
            // Core stats
            Text(
              'Core Attributes',
              style: Theme.of(context).textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _CoreStatRow('Intelligence', warrior.coreStats.intelligence),
            _CoreStatRow('Strength', warrior.coreStats.strength),
            _CoreStatRow('Speed', warrior.coreStats.speed),
            _CoreStatRow('Durability', warrior.coreStats.durability),
            _CoreStatRow('Power', warrior.coreStats.power),
            _CoreStatRow('Combat', warrior.coreStats.combat),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                icon: Icon(
                  inSquad ? Icons.remove_circle_rounded : Icons.add_rounded,
                ),
                label: Text(inSquad ? 'Remove from Squad' : 'Add to Squad'),
                style: inSquad
                    ? FilledButton.styleFrom(
                        backgroundColor: cs.errorContainer,
                        foregroundColor: cs.onErrorContainer,
                      )
                    : null,
                onPressed: () {
                  if (inSquad) {
                    squad.removeWarrior(warrior.id);
                  } else if (squad.isFull) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Squad is full (max 5).')),
                    );
                  } else {
                    squad.addWarrior(warrior);
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CoreStatRow extends StatelessWidget {
  final String name;
  final int value;

  const _CoreStatRow(this.name, this.value);

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 110,
            child: Text(
              name,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: value / 100,
                minHeight: 8,
                backgroundColor: cs.surfaceContainerHighest,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '$value',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}
