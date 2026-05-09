import 'package:flutter/material.dart';
import '../../models/match_record.dart';
import '../../services/storage_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late Future<List<MatchRecord>> _future;

  @override
  void initState() {
    super.initState();
    _future = StorageService().loadHistory();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Match History')),
      body: FutureBuilder<List<MatchRecord>>(
        future: _future,
        builder: (_, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          final records = snap.data ?? [];
          if (records.isEmpty) {
            return const Center(child: Text('No matches played yet.'));
          }
          return ListView.builder(
            itemCount: records.length,
            itemBuilder: (_, i) {
              final r = records[i];
              final won = r.playerWon;
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor:
                        won ? Colors.teal.withAlpha(40) : cs.errorContainer,
                    child: Icon(
                      won
                          ? Icons.military_tech_rounded
                          : Icons.flag_rounded,
                      color: won ? Colors.teal : cs.error,
                    ),
                  ),
                  title: Text(
                    won ? 'Victory' : 'Defeat',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: won ? Colors.teal : cs.error,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Your squad: ${r.playerSquad}'),
                      Text('Rival: ${r.rivalSquad}'),
                      Text('Turns: ${r.turnsPlayed}'),
                    ],
                  ),
                  trailing: Text(
                    r.playedAt.substring(0, 10),
                    style: Theme.of(context).textTheme.bodySmall,
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
