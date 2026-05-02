import 'package:flutter/material.dart';
import '../../models/battle_record.dart';
import '../../services/database_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late final Future<List<BattleRecord>> _historyFuture;

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
          final history = snapshot.data!;
          if (history.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No battles yet'),
                  SizedBox(height: 8),
                  Text('Start a battle to see results here',
                      style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          final wins = history.where((r) => r.playerWon).length;
          final losses = history.length - wins;

          return Column(
            children: [
              // Stats header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: Theme.of(context).colorScheme.primaryContainer,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _statBox('Total', '${history.length}',
                        Theme.of(context).colorScheme.onPrimaryContainer),
                    _statBox('Wins', '$wins', Colors.green),
                    _statBox('Losses', '$losses', Colors.red),
                    _statBox(
                      'Win Rate',
                      history.isEmpty
                          ? '-'
                          : '${(wins / history.length * 100).toStringAsFixed(0)}%',
                      Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ],
                ),
              ),

              // History list
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(12),
                  itemCount: history.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, i) {
                    final record = history[i];
                    return _BattleRecordTile(record: record);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _statBox(String label, String value, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontSize: 22, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}

class _BattleRecordTile extends StatelessWidget {
  final BattleRecord record;

  const _BattleRecordTile({required this.record});

  @override
  Widget build(BuildContext context) {
    final date = DateTime.tryParse(record.playedAt);
    final dateStr = date != null
        ? '${date.month}/${date.day}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}'
        : record.playedAt;

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: record.playerWon ? Colors.green : Colors.red,
          child: Icon(
            record.playerWon ? Icons.emoji_events : Icons.close,
            color: Colors.white,
          ),
        ),
        title: Text(
          '${record.playerHero} vs ${record.aiHero}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          '${record.playerWon ? "Victory" : "Defeat"} • ${record.roundsPlayed} rounds • $dateStr',
        ),
        trailing: Text(
          record.playerWon ? 'WIN' : 'LOSS',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: record.playerWon ? Colors.green : Colors.red,
          ),
        ),
      ),
    );
  }
}
