import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/battle_provider.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<BattleProvider>().loadHistory();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<BattleProvider>();
    final history = provider.history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Battle History'),
        actions: [
          IconButton(
            onPressed: history.isEmpty ? null : provider.clearHistory,
            icon: const Icon(Icons.delete_forever_rounded),
          ),
        ],
      ),
      body: history.isEmpty
          ? const Center(child: Text('No battle history yet.'))
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: history.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = history[index];
                return Card(
                  child: ListTile(
                    title: Text('${item.heroAName} vs ${item.heroBName}'),
                    subtitle: Text(
                      'Winner: ${item.winnerHeroName}\n'
                      '${item.createdAt.toLocal()}',
                    ),
                    isThreeLine: true,
                  ),
                );
              },
            ),
    );
  }
}
