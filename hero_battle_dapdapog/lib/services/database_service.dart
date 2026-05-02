import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import 'package:hero_battle/models/battle_record.dart';
import 'package:hero_battle/models/hero_model.dart';

class DatabaseService {
	static const String _keyDecks = 'saved_decks';
	static const String _keyHistory = 'battle_history';

	Future<List<Map<String, dynamic>>> loadDecks() async {
		final prefs = await SharedPreferences.getInstance();
		final rawDecks = prefs.getStringList(_keyDecks) ?? <String>[];
		return rawDecks
				.map((item) => jsonDecode(item) as Map<String, dynamic>)
				.toList()
			..sort((a, b) => (b['createdAt'] as String).compareTo(a['createdAt'] as String));
	}

	Future<void> saveDeck(String name, List<HeroModel> heroes) async {
		final prefs = await SharedPreferences.getInstance();
		final decks = await loadDecks();
		final nextId = decks.isEmpty
				? 1
				: decks
								.map((deck) => deck['id'] as int)
								.reduce((a, b) => a > b ? a : b) +
						1;

		decks.add({
			'id': nextId,
			'name': name,
			'createdAt': DateTime.now().toIso8601String(),
			'heroes': heroes.map((hero) => hero.toJson()).toList(),
		});

		await prefs.setStringList(
			_keyDecks,
			decks.map(jsonEncode).toList(),
		);
	}

	Future<void> deleteDeck(int id) async {
		final prefs = await SharedPreferences.getInstance();
		final decks = await loadDecks();
		decks.removeWhere((deck) => deck['id'] == id);
		await prefs.setStringList(
			_keyDecks,
			decks.map(jsonEncode).toList(),
		);
	}

	Future<List<BattleRecord>> loadHistory() async {
		final prefs = await SharedPreferences.getInstance();
		final rawHistory = prefs.getStringList(_keyHistory) ?? <String>[];
		final history = rawHistory
				.map((item) => BattleRecord.fromJson(jsonDecode(item) as Map<String, dynamic>))
				.toList();
		history.sort((a, b) => b.createdAt.compareTo(a.createdAt));
		return history;
	}

	Future<void> saveHistory(BattleRecord record) async {
		final prefs = await SharedPreferences.getInstance();
		final history = await loadHistory();
		final nextId = history.isEmpty
				? 1
				: history.map((item) => item.id ?? 0).reduce((a, b) => a > b ? a : b) + 1;
		history.add(record.copyWith(id: nextId));
		await prefs.setStringList(
			_keyHistory,
			history.map((item) => jsonEncode(item.toJson())).toList(),
		);
	}
}
