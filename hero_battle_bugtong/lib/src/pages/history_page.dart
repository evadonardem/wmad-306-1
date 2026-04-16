import 'package:flutter/material.dart';

import '../app_store.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({super.key, required this.store});

  final AppStore store;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: store,
      builder: (context, _) {
        final history = store.history;
        final wins = history.where((r) => r.playerWon).length;
        final losses = history.length - wins;
        final winRate = history.isEmpty ? 0 : (wins / history.length * 100).round();

        return Scaffold(
          appBar: AppBar(title: const Text('Battle History')),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(child: _HistoryStat(label: 'Total', value: '${history.length}')),
                    const SizedBox(width: 8),
                    Expanded(child: _HistoryStat(label: 'Wins', value: '$wins')),
                    const SizedBox(width: 8),
                    Expanded(child: _HistoryStat(label: 'Losses', value: '$losses')),
                    const SizedBox(width: 8),
                    Expanded(child: _HistoryStat(label: 'Win %', value: '$winRate%')),
                  ],
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: history.isEmpty
                      ? const Center(child: Text('No battles yet.'))
                      : ListView.separated(
                          itemCount: history.length,
                          separatorBuilder: (_, index) => const SizedBox(height: 8),
                          itemBuilder: (context, index) {
                            final record = history[index];
                            return ListTile(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              tileColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                              leading: CircleAvatar(
                                child: Text(record.playerWon ? 'W' : 'L'),
                              ),
                              title: Text('${record.playerHero} vs ${record.aiHero}'),
                              subtitle: Text(
                                '${record.roundsPlayed} rounds · ${record.playedAt.toLocal()}',
                              ),
                              trailing: Text(record.playerWon ? 'WIN' : 'LOSS'),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _HistoryStat extends StatelessWidget {
  const _HistoryStat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
      ),
      child: Column(
        children: [
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
