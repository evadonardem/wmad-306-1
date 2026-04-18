import 'package:flutter/material.dart';

import '../../models/battle_record.dart';
import '../../services/database_service.dart';

class BattleHistoryScreen extends StatefulWidget {
  const BattleHistoryScreen({super.key});

  @override
  State<BattleHistoryScreen> createState() => _BattleHistoryScreenState();
}

class _BattleHistoryScreenState extends State<BattleHistoryScreen> {
  late Future<List<BattleRecord>> _historyFuture;

  @override
  void initState() {
    super.initState();
    _historyFuture = DatabaseService().loadHistory();
  }

  void _refreshHistory() {
    setState(() {
      _historyFuture = DatabaseService().loadHistory();
    });
  }

  String _formatDate(String value) {
    final parsed = DateTime.tryParse(value);
    if (parsed == null) return value;

    final month = parsed.month.toString().padLeft(2, '0');
    final day = parsed.day.toString().padLeft(2, '0');
    final hour = parsed.hour.toString().padLeft(2, '0');
    final minute = parsed.minute.toString().padLeft(2, '0');
    return '${parsed.year}-$month-$day $hour:$minute';
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
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text('Error: ${snapshot.error}'),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: _refreshHistory,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final records = snapshot.data ?? const <BattleRecord>[];
          if (records.isEmpty) {
            return const Center(
              child: Text(
                'No battle history yet. Start a battle to create one.',
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: records.length,
            separatorBuilder: (_, index) => const SizedBox(height: 8),
            itemBuilder: (_, index) {
              final record = records[index];
              final resultColor = record.isDraw
                  ? Colors.grey
                  : record.isVictory
                  ? Colors.green
                  : Colors.red;
              final resultIcon = record.isVictory
                  ? Icons.emoji_events
                  : record.isDraw
                  ? Icons.balance
                  : Icons.close;

              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: resultColor.withValues(alpha: 0.15),
                    child: Icon(resultIcon, color: resultColor),
                  ),
                  title: Text(
                    record.overallResultLabel,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: resultColor,
                    ),
                  ),
                  subtitle: Text(
                    '${record.playerHero} vs ${record.aiHero}\n'
                    'Rounds: ${record.roundsPlayed} • ${_formatDate(record.playedAt)}',
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
