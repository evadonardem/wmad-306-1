import 'package:flutter/material.dart';
import '../../models/hero_model.dart';

/// A dialog that presents a scenario for each battle round and lets the user pick an action.
class BattleScenarioDialog extends StatelessWidget {
  final HeroModel playerHero;
  final HeroModel enemyHero;
  final int round;
  final void Function(String action) onActionSelected;

  const BattleScenarioDialog({
    super.key,
    required this.playerHero,
    required this.enemyHero,
    required this.round,
    required this.onActionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Round $round: ${playerHero.name} vs ${enemyHero.name}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Choose your action:'),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton.icon(
                icon: const Icon(Icons.flash_on),
                label: const Text('Attack'),
                onPressed: () => onActionSelected('attack'),
              ),
              ElevatedButton.icon(
                icon: const Icon(Icons.shield),
                label: const Text('Defend'),
                onPressed: () => onActionSelected('defend'),
              ),
              ElevatedButton.icon(
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Special'),
                onPressed: () => onActionSelected('special'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
