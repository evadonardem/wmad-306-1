import 'package:flutter/material.dart';

import 'package:hero_battle/models/battle_record.dart';
import 'package:hero_battle/services/database_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late Future<List<BattleRecord>> _futureHistory;

  @override
  void initState() {
    super.initState();
    _futureHistory = DatabaseService().loadHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle History')),
      body: FutureBuilder<List<BattleRecord>>(
        future: _futureHistory,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final history = snapshot.data ?? <BattleRecord>[];
          if (history.isEmpty) {
            return const Center(child: Text('No battles recorded yet.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: history.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final record = history[index];
              return Card(
                child: ListTile(
                  title: Text('${record.heroName} vs ${record.opponentName}'),
                  subtitle: Text(
                    'Winner: ${record.winnerName}\n${record.createdAt}',
                  ),
                  isThreeLine: true,
                ),
              );
            },
          );
        },
      ),
    );
  }
}