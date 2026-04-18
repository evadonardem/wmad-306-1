import 'package:flutter/foundation.dart';
import '../models/battle_record.dart';
import '../services/database_service.dart';

class BattleProvider extends ChangeNotifier {
  final DatabaseService _db = DatabaseService();
  List<BattleRecord> _history = [];

  List<BattleRecord> get history => _history;

  // --- NEW: RANKING GETTERS ---

  /// Returns a map of Hero names and their win counts in Solo (1v1) matches.
  Map<String, int> get soloRankings {
    Map<String, int> counts = {};
    // Only count 1v1 battles where player won and it wasn't a "Squad" battle
    final soloWins = _history.where((r) => r.playerWon && !r.playerHero.contains('Squad'));
    for (var record in soloWins) {
      counts[record.playerHero] = (counts[record.playerHero] ?? 0) + 1;
    }
    // Sort by wins descending
    var sortedEntries = counts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    return Map.fromEntries(sortedEntries);
  }

  /// Returns total wins for the 5v5 Team mode.
  int get totalTeamWins => 
      _history.where((r) => r.playerWon && r.playerHero.contains('Squad')).length;

  // --- EXISTING METHODS ---

  Future<void> loadHistory() async {
    _history = await _db.loadHistory();
    notifyListeners();
  }

  Future<void> saveBattleRecord(BattleRecord record) async {
    await _db.saveBattleRecord(record);
    await loadHistory(); // Automatically updates history and rankings
  }
}