import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../models/battle_record.dart';
import '../../services/database_service.dart';
import '../../theme/cyber_theme.dart';

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
    _loadHistory();
  }

  void _loadHistory() {
    _historyFuture = DatabaseService().loadBattleHistory();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'BATTLE HISTORY',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            letterSpacing: 2,
            fontSize: 16,
            color: cs.onSurface,
          ),
        ),
      ),
      body: FutureBuilder<List<BattleRecord>>(
        future: _historyFuture,
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                strokeWidth: 3,
                color: cs.primary,
              ),
            );
          }
          if (snap.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: cs.error.withValues(alpha: 0.1),
                    ),
                    child: Icon(Icons.error_outline_rounded,
                        size: 36, color: cs.error.withValues(alpha: 0.7)),
                  ),
                  const SizedBox(height: 16),
                  Text('Error: ${snap.error}',
                      style: TextStyle(
                          color: cs.onSurface.withValues(alpha: 0.6))),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: () => setState(() => _loadHistory()),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final records = snap.data ?? [];
          if (records.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: cs.primaryContainer.withValues(alpha: 0.3),
                    ),
                    child: Icon(Icons.history_rounded,
                        size: 44,
                        color: cs.primary.withValues(alpha: 0.4)),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'No battles fought yet',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: cs.onSurface.withValues(alpha: 0.6),
                        ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Win your first battle!',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: cs.onSurface.withValues(alpha: 0.35),
                        ),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: records.length,
            itemBuilder: (_, i) {
              final r = records[i];
              return _HistoryTile(record: r)
                  .animate()
                  .fadeIn(
                      duration: 300.ms,
                      delay: Duration(milliseconds: (i * 50).clamp(0, 500)))
                  .slideY(begin: 0.04);
            },
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────

class _HistoryTile extends StatelessWidget {
  final BattleRecord record;
  const _HistoryTile({required this.record});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final won = record.playerWon;
    final resultColor = won ? CyberColors.success : CyberColors.error;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 5),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            _smallAvatar(record.playerHeroImage, cs),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${record.playerHeroName} vs ${record.aiHeroName}',
                    style: Theme.of(context)
                        .textTheme
                        .titleSmall
                        ?.copyWith(fontWeight: FontWeight.w700),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${record.rounds} rounds  •  ${_formatDate(record.playedAt)}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: cs.onSurface.withValues(alpha: 0.45),
                        ),
                  ),
                ],
              ),
            ),
            _smallAvatar(record.aiHeroImage, cs),
            const SizedBox(width: 10),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(
                color: resultColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: resultColor.withValues(alpha: 0.25)),
              ),
              child: Text(
                won ? 'WIN' : 'LOSS',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 11,
                  color: resultColor,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _smallAvatar(String imageUrl, ColorScheme cs) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: imageUrl.isNotEmpty
          ? CachedNetworkImage(
              imageUrl: imageUrl,
              width: 42,
              height: 50,
              fit: BoxFit.cover,
              errorWidget: (x, y, z) => Container(
                width: 42,
                height: 50,
                color: cs.surfaceContainerHighest,
                child: Icon(Icons.person_rounded,
                    size: 20, color: cs.onSurface.withValues(alpha: 0.3)),
              ),
            )
          : Container(
              width: 42,
              height: 50,
              color: cs.surfaceContainerHighest,
              child: Icon(Icons.person_rounded,
                  size: 20, color: cs.onSurface.withValues(alpha: 0.3)),
            ),
    );
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso);
      return '${dt.day}/${dt.month}/${dt.year} '
          '${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}
