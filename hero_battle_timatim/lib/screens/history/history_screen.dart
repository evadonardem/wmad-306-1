// Exercise 2 — Battle History from SQLite (FutureBuilder).

import 'package:flutter/material.dart';

import '../../models/battle_record.dart';
import '../../services/database_service.dart';
import '../../theme/app_theme.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});
  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late final Future<List<BattleRecord>> _future;

  @override
  void initState() {
    super.initState();
    _future = DatabaseService().loadHistory();
  }

  String _fmt(String iso) {
    try {
      final d = DateTime.parse(iso).toLocal();
      String two(int n) => n.toString().padLeft(2, '0');
      return '${d.year}-${two(d.month)}-${two(d.day)} ${two(d.hour)}:${two(d.minute)}';
    } catch (_) {
      return iso;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle History')),
      body: FutureBuilder<List<BattleRecord>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (snap.hasError) {
            return Center(
              child: Text(
                'Error: ${snap.error}',
                style: TextStyle(color: AppColors.danger),
              ),
            );
          }
          final records = snap.data ?? const [];
          if (records.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.large),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.history,
                      color: AppColors.primary,
                      size: 64,
                    ),
                    const SizedBox(height: AppSpacing.medium),
                    Text(
                      'No battles yet',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: AppSpacing.small),
                    Text(
                      'Win a fight to see it logged here.',
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.medium),
            itemCount: records.length,
            itemBuilder: (_, i) {
              final r = records[i];
              final color = r.playerWon ? AppColors.success : AppColors.danger;
              return Card(
                margin: const EdgeInsets.only(bottom: AppSpacing.small),
                child: ListTile(
                  leading: Icon(
                    r.playerWon ? Icons.emoji_events : Icons.close,
                    color: color,
                    size: 32,
                  ),
                  title: Text(
                    '${r.playerHero} vs ${r.aiHero}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  subtitle: Text(
                    '${r.playerWon ? "WIN" : "LOSS"} • ${r.roundsPlayed} rounds • ${_fmt(r.playedAt)}',
                    style: Theme.of(context).textTheme.bodySmall,
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
