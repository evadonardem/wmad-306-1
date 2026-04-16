import 'package:flutter/material.dart';

import '../../models/battle_record.dart';
import '../../services/database_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late Future<List<BattleRecord>> _historyFuture;

  @override
  void initState() {
    super.initState();
    _historyFuture = DatabaseService().loadHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle History')),
      body: FutureBuilder<List<BattleRecord>>(
        future: _historyFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final records = snapshot.data ?? [];
          if (records.isEmpty) {
            return const Center(child: Text('No battles recorded yet.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: records.length,
            separatorBuilder: (context, index) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final record = records[index];
              final playedAt = DateTime.tryParse(record.playedAt);
              final date = playedAt?.toLocal().toString().split('.').first;
              final result = record.playerWon ? 'Win' : 'Loss';

              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Icon(
                      record.playerWon ? Icons.emoji_events : Icons.close,
                    ),
                  ),
                  title: Text(
                    '$result: ${record.playerHero} vs ${record.aiHero}',
                  ),
                  subtitle: Text(
                    '${record.roundsPlayed} rounds${date == null ? '' : ' - $date'}',
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
