import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/combat_provider.dart';
import '../../providers/squad_provider.dart';
import '../../router/app_router.dart';
import '../../services/api_service.dart';
import '../../models/warrior_model.dart';
import '../../widgets/warrior_image.dart';
import '../../widgets/stat_chip.dart';
import '../../services/storage_service.dart';

class SquadScreen extends StatelessWidget {
  const SquadScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final squad = context.watch<SquadProvider>();
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Squad'),
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.save_rounded),
            label: const Text('Save'),
            onPressed: squad.rosterSize == 0
                ? null
                : () => _saveSquadDialog(context, squad),
          ),
          TextButton.icon(
            icon: const Icon(Icons.folder_open_rounded),
            label: const Text('Load'),
            onPressed: () => Navigator.pushNamed(context, Routes.savedSquads),
          ),
        ],
      ),
      body: squad.rosterSize == 0
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.group_off_rounded,
                    size: 64,
                    color: cs.onSurfaceVariant,
                  ),
                  const SizedBox(height: 12),
                  const Text('No warriors in squad.'),
                  const SizedBox(height: 8),
                  FilledButton.icon(
                    icon: const Icon(Icons.search),
                    label: const Text('Browse Warriors'),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: squad.rosterSize,
                    itemBuilder: (_, i) {
                      final w = squad.roster[i];
                      return _WarriorRow(warrior: w, onRemove: () {
                        squad.removeWarrior(w.id);
                      });
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.delete_outline_rounded),
                          label: const Text('Clear Squad'),
                          onPressed: () => squad.clearRoster(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton.icon(
                          icon: const Icon(Icons.sports_kabaddi_rounded),
                          label: const Text('Enter Arena'),
                          onPressed: () => _launchArena(context, squad),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Future<void> _launchArena(BuildContext context, SquadProvider squad) async {
    final api = ApiService();
    try {
      // Build AI rival team
      final rival = await api.fetchRandomRoster(count: squad.rosterSize);
      if (!context.mounted) return;
      final combat = context.read<CombatProvider>();
      combat.startMatch(player: squad.roster, rival: rival);
      Navigator.pushNamed(context, Routes.arena);
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not load rival squad. Try again.')),
      );
    }
  }

  Future<void> _saveSquadDialog(
    BuildContext context,
    SquadProvider squad,
  ) async {
    final ctrl = TextEditingController();
    final label = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Name your squad'),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'e.g. Iron Legion'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, ctrl.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (label == null || label.isEmpty) return;
    try {
      await StorageService().saveSquad(label, squad.roster);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('"$label" saved!')),
        );
      }
    } on DuplicateSquadException {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('That squad already exists.')),
        );
      }
    }
  }
}

class _WarriorRow extends StatelessWidget {
  final WarriorModel warrior;
  final VoidCallback onRemove;

  const _WarriorRow({required this.warrior, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            WarriorImage(url: warrior.imageUrl, size: 56),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    warrior.name,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
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
            IconButton(
              icon: const Icon(Icons.remove_circle_outline_rounded),
              color: Theme.of(context).colorScheme.error,
              onPressed: onRemove,
            ),
          ],
        ),
      ),
    );
  }
}
