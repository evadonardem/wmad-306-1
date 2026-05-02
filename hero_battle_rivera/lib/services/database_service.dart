import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart'
    show databaseFactoryFfi, sqfliteFfiInit;

import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DatabaseService {
  DatabaseService._internal();

  static final DatabaseService _instance = DatabaseService._internal();
  static bool _isDatabaseFactoryInitialized = false;

  factory DatabaseService() => _instance;

  Database? _db;

  Future<Database> get database async {
    _db ??= await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    _initializeDatabaseFactoryIfNeeded();

    final dbFilePath = await _resolveDatabasePath();

    return openDatabase(
      dbFilePath,
      version: 3,
      onCreate: (db, version) async {
        await db.execute('''
					CREATE TABLE decks (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						name TEXT NOT NULL,
						heroes TEXT NOT NULL,
						created TEXT NOT NULL
					)
				''');

        await db.execute('''
					CREATE TABLE battle_history (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						player_hero TEXT NOT NULL,
						ai_hero TEXT NOT NULL,
						player_won INTEGER NOT NULL,
						rounds_played INTEGER NOT NULL,
						played_at TEXT NOT NULL,
						player_name TEXT NOT NULL,
						opponent_name TEXT NOT NULL,
						player_deck_name TEXT NOT NULL,
            player_deck_id INTEGER,
						opponent_deck_name TEXT NOT NULL,
						player_deck_heroes TEXT NOT NULL,
						opponent_deck_heroes TEXT NOT NULL,
						match_results TEXT NOT NULL,
						overall_result TEXT NOT NULL
					)
				''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN player_name TEXT NOT NULL DEFAULT ''",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN opponent_name TEXT NOT NULL DEFAULT ''",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN player_deck_name TEXT NOT NULL DEFAULT 'Current Deck'",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN opponent_deck_name TEXT NOT NULL DEFAULT 'Opponent Deck'",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN player_deck_heroes TEXT NOT NULL DEFAULT '[]'",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN opponent_deck_heroes TEXT NOT NULL DEFAULT '[]'",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN match_results TEXT NOT NULL DEFAULT '[]'",
          );
          await db.execute(
            "ALTER TABLE battle_history ADD COLUMN overall_result TEXT NOT NULL DEFAULT ''",
          );
        }

        if (oldVersion < 3) {
          await db.execute(
            'ALTER TABLE battle_history ADD COLUMN player_deck_id INTEGER',
          );
        }
      },
    );
  }

  Future<String> _resolveDatabasePath() async {
    final isDesktop =
        !kIsWeb &&
        (defaultTargetPlatform == TargetPlatform.windows ||
            defaultTargetPlatform == TargetPlatform.linux ||
            defaultTargetPlatform == TargetPlatform.macOS);

    if (isDesktop) {
      final supportDirectory = await getApplicationSupportDirectory();
      final dbDirectory = Directory(join(supportDirectory.path, 'databases'));
      if (!await dbDirectory.exists()) {
        await dbDirectory.create(recursive: true);
      }
      return join(dbDirectory.path, 'hero_battle.db');
    }

    final dbPath = await getDatabasesPath();
    return join(dbPath, 'hero_battle.db');
  }

  void _initializeDatabaseFactoryIfNeeded() {
    if (_isDatabaseFactoryInitialized) {
      return;
    }

    final isDesktop =
        !kIsWeb &&
        (defaultTargetPlatform == TargetPlatform.windows ||
            defaultTargetPlatform == TargetPlatform.linux ||
            defaultTargetPlatform == TargetPlatform.macOS);

    if (isDesktop) {
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
    }

    _isDatabaseFactoryInitialized = true;
  }

  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    final db = await database;

    return db.insert('decks', <String, dynamic>{
      'name': name,
      'heroes': jsonEncode(heroes.map((h) => h.toJson()).toList()),
      'created': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    final db = await database;
    return db.query('decks', orderBy: 'created DESC');
  }

  Future<void> deleteDeck(int id) async {
    final db = await database;
    await db.delete('decks', where: 'id = ?', whereArgs: <Object>[id]);
  }

  Future<void> saveBattleRecord(BattleRecord record) async {
    final db = await database;
    await db.insert('battle_history', record.toMap());
  }

  Future<List<BattleRecord>> loadHistory() async {
    final db = await database;
    final rows = await db.query('battle_history', orderBy: 'played_at DESC');
    return rows.map(BattleRecord.fromMap).toList();
  }
}
