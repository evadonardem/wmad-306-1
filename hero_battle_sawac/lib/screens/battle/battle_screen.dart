import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  HeroModel? _heroA;
  HeroModel? _heroB;

  @override
  Widget build(BuildContext context) {
    final deck = context.watch<DeckProvider>().deck;
    final provider = context.watch<BattleProvider>();

    final options = deck;
    _heroA ??= options.isNotEmpty ? options.first : null;
    _heroB ??= options.length > 1 ? options[1] : null;

    return Scaffold(
      appBar: AppBar(title: const Text('Battle Arena')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _HeroPicker(
            label: 'Hero A',
            value: _heroA,
            options: options,
            onChanged: (v) => setState(() => _heroA = v),
          ),
          const SizedBox(height: 10),
          _HeroPicker(
            label: 'Hero B',
            value: _heroB,
            options: options,
            onChanged: (v) => setState(() => _heroB = v),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: provider.isLoading ||
                    _heroA == null ||
                    _heroB == null ||
                    _heroA!.id == _heroB!.id
                ? null
                : () async {
                    final battleProvider = context.read<BattleProvider>();
                    final result = await battleProvider.battle(_heroA!, _heroB!);
                    if (!context.mounted) return;
                    showDialog<void>(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('Battle Result'),
                        content: Text(
                          'Winner: ${result.winnerHeroName}\n\n'
                          '${result.heroAName}: ${result.heroAScore.toStringAsFixed(2)}\n'
                          '${result.heroBName}: ${result.heroBScore.toStringAsFixed(2)}\n\n'
                          '${result.log}',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Close'),
                          ),
                        ],
                      ),
                    );
                  },
            icon: const Icon(Icons.flash_on_rounded),
            label: Text(provider.isLoading ? 'Battling...' : 'Run Battle'),
          ),
          const SizedBox(height: 16),
          const Text(
            'Formula: combat 25%, strength 20%, durability 20%, speed 15%, intelligence 10%, power 10%.',
          ),
        ],
      ),
    );
  }
}

class _HeroPicker extends StatelessWidget {
  const _HeroPicker({
    required this.label,
    required this.value,
    required this.options,
    required this.onChanged,
  });

  final String label;
  final HeroModel? value;
  final List<HeroModel> options;
  final ValueChanged<HeroModel?> onChanged;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<HeroModel>(
      initialValue: value,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
      items: options
          .map(
            (hero) => DropdownMenuItem<HeroModel>(
              value: hero,
              child: Text(hero.name),
            ),
          )
          .toList(),
      onChanged: onChanged,
    );
  }
}
