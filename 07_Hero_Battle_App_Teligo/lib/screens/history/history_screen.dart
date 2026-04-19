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

  String _formatDate(String iso) {
    final dt = DateTime.tryParse(iso);
    if (dt == null) return iso;
    return '${dt.day}/${dt.month}/${dt.year}  ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Battle History', style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600)),
      ),
      body: FutureBuilder<List<BattleRecord>>(
        future: _historyFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF7B2FBE)));
          }

          final records = snapshot.data ?? [];

          if (records.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('⚔️', style: TextStyle(fontSize: 52)),
                  SizedBox(height: 16),
                  Text('No battles yet', style: TextStyle(color: Color(0xFF666666), fontSize: 16, fontWeight: FontWeight.w500)),
                  SizedBox(height: 6),
                  Text('Win or lose — your history will appear here', style: TextStyle(color: Color(0xFF444444), fontSize: 13)),
                ],
              ),
            );
          }

          // Summary stats
          final wins = records.where((r) => r.playerWon).length;
          final losses = records.length - wins;
          final winRate = records.isEmpty ? 0.0 : (wins / records.length) * 100;

          return Column(
            children: [
              // Summary row
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                child: Row(
                  children: [
                    _SummaryChip(label: 'Total', value: '${records.length}', color: const Color(0xFF9370DB)),
                    const SizedBox(width: 10),
                    _SummaryChip(label: 'Wins', value: '$wins', color: const Color(0xFF4ADE80)),
                    const SizedBox(width: 10),
                    _SummaryChip(label: 'Losses', value: '$losses', color: const Color(0xFFF87171)),
                    const SizedBox(width: 10),
                    _SummaryChip(label: 'Win Rate', value: '${winRate.toStringAsFixed(0)}%', color: const Color(0xFFFBBF24)),
                  ],
                ),
              ),

              // Record list
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: records.length,
                  itemBuilder: (_, i) {
                    final record = records[i];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A2E),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: record.playerWon
                              ? const Color(0xFF4ADE80).withOpacity(0.2)
                              : const Color(0xFFF87171).withOpacity(0.2),
                          width: 0.5,
                        ),
                      ),
                      child: Row(
                        children: [
                          // Win/loss icon
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(
                              color: record.playerWon ? const Color(0xFF0F2D1F) : const Color(0xFF2D0F0F),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                record.playerWon ? '🏆' : '💀',
                                style: const TextStyle(fontSize: 18),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                RichText(
                                  text: TextSpan(
                                    children: [
                                      TextSpan(
                                        text: record.playerHero,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFFE2D9F3),
                                        ),
                                      ),
                                      const TextSpan(
                                        text: '  vs  ',
                                        style: TextStyle(fontSize: 11, color: Color(0xFF666666)),
                                      ),
                                      TextSpan(
                                        text: record.aiHero,
                                        style: const TextStyle(fontSize: 13, color: Color(0xFF9370DB)),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '${record.roundsPlayed} rounds  ·  ${_formatDate(record.playedAt)}',
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF555566)),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            record.playerWon ? 'WIN' : 'LOSS',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: record.playerWon ? const Color(0xFF4ADE80) : const Color(0xFFF87171),
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _SummaryChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _SummaryChip({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF666666), letterSpacing: 0.5)),
          ],
        ),
      ),
    );
  }
}
