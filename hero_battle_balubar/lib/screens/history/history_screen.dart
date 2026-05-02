import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';
import 'package:hero_battle/widgets/hero_image_widget.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final DatabaseService _dbService = DatabaseService();
  List<Map<String, dynamic>> _records = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    setState(() => _isLoading = true);
    final records = await _dbService.getAllBattleRecords();
    setState(() {
      _records = records;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Battle History'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _records.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.history, color: Colors.grey[600], size: 64),
                      const SizedBox(height: 16),
                      Text('No battle history',
                          style: TextStyle(
                              color: Colors.grey[400],
                              fontSize: 18,
                              fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('Complete a battle to see it here.',
                          style: TextStyle(
                              color: Colors.grey[600], fontSize: 14)),
                    ],
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _records.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final row = _records[index];
                    return _buildRecordCard(row);
                  },
                ),
    );
  }

  Widget _buildRecordCard(Map<String, dynamic> row) {
    final playerHero = HeroModel.fromJson(
        jsonDecode(row['player_hero'] as String) as Map<String, dynamic>);
    final opponentHero = HeroModel.fromJson(
        jsonDecode(row['opponent_hero'] as String) as Map<String, dynamic>);
    final winner = HeroModel.fromJson(
        jsonDecode(row['winner'] as String) as Map<String, dynamic>);

    final isWin = winner.id == playerHero.id;
    final turns = row['turns'] as int;
    final battleType = row['battle_type'] as String;
    final playedAt = row['played_at'] as String;
    final date = playedAt.substring(0, 10);
    final time = playedAt.length >= 16 ? playedAt.substring(11, 16) : '';

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Theme.of(context).cardTheme.color,
        border: Border.all(
          color: isWin
              ? Colors.green.withValues(alpha: 0.4)
              : Colors.red.withValues(alpha: 0.4),
        ),
      ),
      child: Row(
        children: [
          // Win/Loss indicator
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: (isWin ? Colors.green : Colors.red)
                  .withValues(alpha: 0.15),
              border: Border.all(
                color: isWin ? Colors.green : Colors.red,
                width: 2,
              ),
            ),
            child: Icon(
              isWin ? Icons.check : Icons.close,
              color: isWin ? Colors.green : Colors.red,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          // Hero avatars
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: HeroImageWidget(
              hero: playerHero,
              width: 40,
              height: 40,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 6),
            child: Text('vs',
                style: TextStyle(color: Colors.grey, fontSize: 12)),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: HeroImageWidget(
              hero: opponentHero,
              width: 40,
              height: 40,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(width: 12),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${playerHero.name} vs ${opponentHero.name}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text('$turns rounds',
                        style: TextStyle(
                            color: Colors.grey[400], fontSize: 11)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: battleType == 'ranked'
                            ? Colors.red.withValues(alpha: 0.15)
                            : Colors.orange.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        battleType.toUpperCase(),
                        style: TextStyle(
                          color: battleType == 'ranked'
                              ? Colors.red
                              : Colors.orange,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Date
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(date,
                  style:
                      TextStyle(color: Colors.grey[500], fontSize: 10)),
              Text(time,
                  style:
                      TextStyle(color: Colors.grey[600], fontSize: 10)),
            ],
          ),
        ],
      ),
    );
  }
}
