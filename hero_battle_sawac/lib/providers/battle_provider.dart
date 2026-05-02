import 'package:flutter/foundation.dart';

import '../engine/battle_engine.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';
import '../models/player_stats.dart';
import '../services/database_service.dart';

class BattleProvider extends ChangeNotifier {
	BattleProvider({BattleEngine? engine, DatabaseService? database})
			: _engine = engine ?? BattleEngine(),
				_database = database ?? DatabaseService.instance;

	final BattleEngine _engine;
	final DatabaseService _database;

	bool _isLoading = false;
	BattleRecord? _lastBattle;
	List<BattleRecord> _history = [];

	bool get isLoading => _isLoading;
	BattleRecord? get lastBattle => _lastBattle;
	List<BattleRecord> get history => List.unmodifiable(_history);

	PlayerStats get playerStats {
		const playerId = 'player-hero';
		final total = _history.length;
		final wins = _history.where((h) => h.winnerHeroId == playerId).length;
		return PlayerStats(
			totalBattles: total,
			totalWins: wins,
			totalLosses: total - wins,
		);
	}

	Future<void> loadHistory() async {
		try {
			_history = await _database.getBattleHistory();
		} catch (_) {
			_history = [];
		}
		notifyListeners();
	}

	Future<BattleRecord> battle(HeroModel heroA, HeroModel heroB) async {
		_isLoading = true;
		notifyListeners();

		final outcome = _engine.fight(heroA, heroB);
		final record = BattleRecord(
			heroAId: heroA.id,
			heroAName: heroA.name,
			heroBId: heroB.id,
			heroBName: heroB.name,
			heroAScore: outcome.heroAScore,
			heroBScore: outcome.heroBScore,
			winnerHeroId: outcome.winner.id,
			winnerHeroName: outcome.winner.name,
			createdAt: DateTime.now(),
			log: outcome.log,
		);

		try {
			await _database.insertBattle(record);
			await loadHistory();
		} catch (_) {
			_history = [record, ..._history];
		}
		_lastBattle = _history.isEmpty ? record : _history.first;

		_isLoading = false;
		notifyListeners();
		return _lastBattle!;
	}

	Future<void> clearHistory() async {
		try {
			await _database.clearBattleHistory();
		} catch (_) {}
		_history = [];
		_lastBattle = null;
		notifyListeners();
	}
}
