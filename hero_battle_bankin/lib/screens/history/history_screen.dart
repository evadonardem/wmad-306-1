import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../providers/battle_provider.dart';
import '../../models/battle_record.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Watch the history list in the provider
    final history = context.watch<BattleProvider>().history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Battle Records'),
        centerTitle: true,
      ),
      body: history.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: history.length,
              itemBuilder: (context, index) {
                final record = history[index];
                return _buildHistoryCard(context, record);
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.history, size: 80, color: Colors.grey),
          SizedBox(height: 16),
          Text(
            'No battles fought yet...',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(BuildContext context, BattleRecord record) {
    // Determine color based on outcome
    final statusColor = record.playerWon ? Colors.green : Colors.red;
    final statusIcon = record.playerWon ? Icons.emoji_events : Icons.close;
    final outcomeText = record.playerWon ? 'VICTORY' : 'DEFEAT';
    
    // Parse the ISO string back to a date for formatting
    final date = DateTime.tryParse(record.playedAt) ?? DateTime.now();

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: statusColor.withOpacity(0.2),
          child: Icon(statusIcon, color: statusColor),
        ),
        title: Text(
          '${record.playerHero} vs ${record.aiHero}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          'Rounds: ${record.roundsPlayed} • ${DateFormat('MMM dd, yyyy - hh:mm a').format(date)}',
          style: const TextStyle(fontSize: 12),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: statusColor,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            outcomeText,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
          ),
        ),
      ),
    );
  }
}