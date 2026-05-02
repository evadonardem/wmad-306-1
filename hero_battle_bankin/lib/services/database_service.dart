import 'dart:io';
import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();
  
  Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    String dbPath;
    if (Platform.isWindows || Platform.isLinux) {
      final Directory appDocumentsDir = await getApplicationSupportDirectory();
      dbPath = appDocumentsDir.path;
    } else {
      dbPath = await getDatabasesPath();
    }

    return openDatabase(
      join(dbPath, 'hero_battle_v2.db'), 
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE decks (
            name TEXT PRIMARY KEY, 
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
    );
  }

  // --- DECK METHODS ---
  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    final db = await database;
    return db.insert(
      'decks', 
      {
        'name': name,
        'heroes': jsonEncode(heroes.map((h) => h.toJson()).toList()),
        'created': DateTime.now().toIso8601String(),
      },
      // IMPORTANT: Overwrites the old team data with the new star levels
      conflictAlgorithm: ConflictAlgorithm.replace, 
    );
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    final db = await database;
    return db.query('decks', orderBy: 'created DESC');
  }

  // --- BATTLE RECORDS ---
  Future<void> saveBattleRecord(BattleRecord record) async {
    try {
      final db = await database;
      await db.insert(
        'battle_history', 
        record.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
      print("❌ Error saving battle record: $e");
    }
  }

  Future<List<BattleRecord>> loadHistory() async {
    try {
      final db = await database;
      final List<Map<String, dynamic>> rows = await db.query(
        'battle_history', 
        orderBy: 'played_at DESC'
      );
      return rows.map((row) => BattleRecord.fromMap(row)).toList();
    } catch (e) {
      return [];
    }
  }
}