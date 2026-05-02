import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/battle_record.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../services/database_service.dart';

class PlayerProfileScreen extends StatefulWidget {
  const PlayerProfileScreen({super.key});

  @override
  State<PlayerProfileScreen> createState() => _PlayerProfileScreenState();
}

class _PlayerProfileScreenState extends State<PlayerProfileScreen> {
  late final TextEditingController _nameController;
  late Future<List<BattleRecord>> _historyFuture;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final player = context.read<PlayerProvider>();
    _nameController = TextEditingController(text: player.playerName);
    _historyFuture = DatabaseService().loadHistory();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    final player = context.read<PlayerProvider>();
    final wasOnboarded = player.isOnboarded;
    final name = _nameController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your player name.')),
      );
      return;
    }

    setState(() => _isSaving = true);
    await player.setPlayerName(name);

    if (!wasOnboarded) {
      await player.setOnboarded(true);
    }

    if (!mounted) return;

    setState(() => _isSaving = false);

    if (wasOnboarded) {
      Navigator.pop(context);
    } else {
      Navigator.pushReplacementNamed(context, RouteNames.home);
    }
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

  Color _resultColor(BattleRecord record) {
    if (record.isDraw) {
      return const Color(0xFF64748B);
    }
    return record.isVictory ? const Color(0xFF2563EB) : const Color(0xFFDC2626);
  }

  String _normalizePlayerName(String value) {
    return value.trim().toLowerCase();
  }

  List<BattleRecord> _filterRecordsForPlayer({
    required List<BattleRecord> records,
    required String playerName,
  }) {
    final normalizedPlayerName = _normalizePlayerName(playerName);
    if (normalizedPlayerName.isEmpty) {
      return records;
    }

    final playerRecords = records
        .where(
          (record) =>
              _normalizePlayerName(record.playerName) == normalizedPlayerName,
        )
        .toList(growable: false);
    if (playerRecords.isNotEmpty) {
      return playerRecords;
    }

    // Fallback for legacy rows saved before player_name was populated.
    final legacyUnnamedRecords = records
        .where((record) => _normalizePlayerName(record.playerName).isEmpty)
        .toList(growable: false);
    if (legacyUnnamedRecords.isNotEmpty) {
      return legacyUnnamedRecords;
    }

    // If the user renamed their profile, keep previously saved history visible.
    return records;
  }

  Widget _buildSummaryCard(BuildContext context, List<BattleRecord> records) {
    final total = records.length;
    final wins = records.where((record) => record.isVictory).length;
    final losses = records.where((record) => record.isDefeat).length;
    final draws = records.where((record) => record.isDraw).length;
    final winRate = total == 0 ? 0.0 : (wins / total) * 100;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Battle Summary',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            Text(
              'Global Win Rate: ${winRate.toStringAsFixed(1)}%',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
                color: const Color(0xFF2563EB),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: <Widget>[
                Chip(label: Text('Battles: $total')),
                Chip(label: Text('Wins: $wins')),
                Chip(label: Text('Defeats: $losses')),
                Chip(label: Text('Draws: $draws')),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryItem(BuildContext context, BattleRecord record) {
    final color = _resultColor(record);
    final playerDeckHeroes = record.playerDeckHeroes.isEmpty
        ? (record.playerHero.isEmpty
              ? const <String>[]
              : <String>[record.playerHero])
        : record.playerDeckHeroes;
    final opponentDeckHeroes = record.opponentDeckHeroes.isEmpty
        ? (record.aiHero.isEmpty ? const <String>[] : <String>[record.aiHero])
        : record.opponentDeckHeroes;

    final matchResults = record.matchResults.isEmpty
        ? <String>['No detailed match log available.']
        : record.matchResults;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.7), width: 1.1),
        color: color.withValues(alpha: 0.06),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(
                record.isVictory
                    ? Icons.emoji_events
                    : record.isDraw
                    ? Icons.balance
                    : Icons.close,
                color: color,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  record.overallResultLabel,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
              ),
              Text(
                _formatDate(record.playedAt),
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Your Deck: ${record.playerDeckName}',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          Text(playerDeckHeroes.join(', ')),
          const SizedBox(height: 8),
          Text(
            'Opponent: ${record.opponentName.isEmpty ? 'Unknown Opponent' : record.opponentName}',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          Text('Deck: ${record.opponentDeckName}'),
          Text(opponentDeckHeroes.join(', ')),
          const SizedBox(height: 10),
          Text(
            'Match Results',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          ...matchResults.map(
            (result) => Padding(
              padding: const EdgeInsets.only(bottom: 2),
              child: Text('• $result'),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Overall: ${record.overallResultLabel} • Matches: ${record.roundsPlayed}',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  Widget _buildHistorySection(
    BuildContext context, {
    required String playerName,
  }) {
    return FutureBuilder<List<BattleRecord>>(
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
                Text('Error loading history: ${snapshot.error}'),
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

        final allRecords = snapshot.data ?? const <BattleRecord>[];
        final records = _filterRecordsForPlayer(
          records: allRecords,
          playerName: playerName,
        );
        final displayPlayerName = playerName.trim().isEmpty
            ? 'Player'
            : playerName.trim();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text(
              'Saved Battle History',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 2),
            Text(
              'Showing records for $displayPlayerName',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            _buildSummaryCard(context, records),
            const SizedBox(height: 10),
            Expanded(
              child: records.isEmpty
                  ? Center(
                      child: Text(
                        'No saved battle history for $displayPlayerName yet. Play a battle first.',
                        textAlign: TextAlign.center,
                      ),
                    )
                  : ListView.separated(
                      itemCount: records.length,
                      separatorBuilder: (_, index) =>
                          const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final record = records[index];
                        return _buildHistoryItem(context, record);
                      },
                    ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final player = context.watch<PlayerProvider>();
    final isOnboarded = player.isOnboarded;
    final playerName = player.playerName;

    return Scaffold(
      appBar: AppBar(title: const Text('Player Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text(
              isOnboarded ? 'Update your profile' : 'Welcome to Hero Battle',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _nameController,
              textInputAction: TextInputAction.done,
              decoration: const InputDecoration(
                labelText: 'Player Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Dark Theme'),
              value: player.isDarkTheme,
              onChanged: (_) => context.read<PlayerProvider>().toggleTheme(),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: _buildHistorySection(context, playerName: playerName),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: _isSaving ? null : _saveProfile,
              icon: _isSaving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.check),
              label: Text(isOnboarded ? 'Save Changes' : 'Start Playing'),
            ),
          ],
        ),
      ),
    );
  }
}
