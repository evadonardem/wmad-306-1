import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:path/path.dart' as p;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';

import '../models/battle_record.dart';

class DatabaseService {
	DatabaseService._();

	static final DatabaseService instance = DatabaseService._();
	static const String _webHistoryKey = 'battle_history_web';

	Database? _db;

	Future<Database> get database async {
		if (_db != null) {
			return _db!;
		}
		_db = await _open();
		return _db!;
	}

	Future<Database> _open() async {
		final root = await getDatabasesPath();
		final path = p.join(root, 'hero_battle.db');

		return openDatabase(
			path,
			version: 1,
			onCreate: (db, version) async {
				await db.execute('''
					CREATE TABLE battle_history (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						hero_a_id TEXT NOT NULL,
						hero_a_name TEXT NOT NULL,
						hero_b_id TEXT NOT NULL,
						hero_b_name TEXT NOT NULL,
						hero_a_score REAL NOT NULL,
						hero_b_score REAL NOT NULL,
						winner_hero_id TEXT NOT NULL,
						winner_hero_name TEXT NOT NULL,
						created_at TEXT NOT NULL,
						log TEXT NOT NULL
					)
				''');

				await db.execute(
					'CREATE INDEX idx_battle_created_at ON battle_history(created_at DESC)',
				);
				await db.execute(
					'CREATE INDEX idx_battle_winner ON battle_history(winner_hero_id)',
				);
			},
		);
	}

	Future<void> insertBattle(BattleRecord record) async {
		if (kIsWeb) {
			final items = await _loadWebHistory();
			items.insert(0, record.toMap());
			await _saveWebHistory(items);
			return;
		}

		final db = await database;
		await db.insert('battle_history', record.toMap());
	}

	Future<List<BattleRecord>> getBattleHistory({int limit = 100}) async {
		if (kIsWeb) {
			final items = await _loadWebHistory();
			return items.take(limit).map(BattleRecord.fromMap).toList();
		}

		final db = await database;
		final rows = await db.query(
			'battle_history',
			orderBy: 'created_at DESC',
			limit: limit,
		);
		return rows.map(BattleRecord.fromMap).toList();
	}

	Future<void> clearBattleHistory() async {
		if (kIsWeb) {
			final prefs = await SharedPreferences.getInstance();
			await prefs.remove(_webHistoryKey);
			return;
		}

		final db = await database;
		await db.delete('battle_history');
	}

	Future<List<Map<String, dynamic>>> _loadWebHistory() async {
		final prefs = await SharedPreferences.getInstance();
		final raw = prefs.getString(_webHistoryKey);
		if (raw == null || raw.isEmpty) {
			return [];
		}

		final decoded = jsonDecode(raw);
		if (decoded is! List) {
			return [];
		}

		return decoded.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList();
	}

	Future<void> _saveWebHistory(List<Map<String, dynamic>> items) async {
		final prefs = await SharedPreferences.getInstance();
		await prefs.setString(_webHistoryKey, jsonEncode(items));
	}
}
