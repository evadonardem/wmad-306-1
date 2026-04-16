import 'package:path/path.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Database? _db;

  Future<Database> get database async {
    _db ??= await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    if (kIsWeb) {
      throw UnsupportedError('Database not supported on web platform');
    }
    
    final isDesktop = Platform.isWindows || Platform.isLinux || Platform.isMacOS;
    final dbPath = isDesktop
        ? await databaseFactoryFfi.getDatabasesPath()
        : await getDatabasesPath();
    
    final dbPath_ = join(dbPath, 'hero_battle.db');
    
    if (isDesktop) {
      return databaseFactoryFfi.openDatabase(
        dbPath_,
        options: OpenDatabaseOptions(
          version: 2,
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
                played_at TEXT NOT NULL
              )
            ''');
          },
        ),
      );
    } else {
      return openDatabase(
        dbPath_,
        version: 2,
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
              played_at TEXT NOT NULL
            )
          ''');
        },
        onUpgrade: (db, oldVersion, newVersion) async {
          if (oldVersion < 2) {
            // Add any migration logic here
          }
        },
      );
    }
  }

  // Deck CRUD
  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    if (kIsWeb) return 0;
    final db = await database;
    return db.insert('decks', {
      'name': name,
      'heroes': jsonEncode(heroes.map((h) => h.toJson()).toList()),
      'created': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    if (kIsWeb) return [];
    final db = await database;
    return db.query('decks', orderBy: 'created DESC');
  }

  Future<Map<String, dynamic>?> loadDeck(int id) async {
    if (kIsWeb) return null;
    final db = await database;
    final results = await db.query('decks', where: 'id = ?', whereArgs: [id]);
    return results.isNotEmpty ? results.first : null;
  }

  Future<int> deleteDeck(int id) async {
    if (kIsWeb) return 0;
    final db = await database;
    return db.delete('decks', where: 'id = ?', whereArgs: [id]);
  }

  // Battle History CRUD
  Future<int> saveBattleRecord(BattleRecord record) async {
    if (kIsWeb) return 0;
    final db = await database;
    return db.insert('battle_history', record.toMap());
  }

  Future<List<BattleRecord>> loadHistory() async {
    if (kIsWeb) return [];
    final db = await database;
    final rows = await db.query('battle_history', orderBy: 'played_at DESC');
    return rows.map(BattleRecord.fromMap).toList();
  }

  Future<void> clearHistory() async {
    if (kIsWeb) return;
    final db = await database;
    await db.delete('battle_history');
  }
}