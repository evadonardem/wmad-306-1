import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite/sqlite_api.dart';
import 'package:path/path.dart';

import '../models/hero_model.dart';
import '../models/battle_record.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Database? _db;

  Future<Database> get db async {
    if (_db != null) return _db!;
    _db = await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'hero_battle.db');

    return await openDatabase(path, version: 1, onCreate: _onCreate);
  }

  Future<void> _onCreate(Database db, int version) async {
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
  }

  // ==============================
  // 🟢 DECK METHODS
  // ==============================

  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    final dbClient = await db;

    final heroesJson = jsonEncode(heroes.map((h) => h.toJson()).toList());

    return await dbClient.insert('decks', {
      'name': name,
      'heroes': heroesJson,
      'created': DateTime.now().toIso8601String(),
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    final dbClient = await db;

    final rows = await dbClient.query('decks', orderBy: 'created DESC');

    return rows.map((row) {
      List<HeroModel> heroes = [];

      try {
        final decoded = jsonDecode(row['heroes'] as String);
        heroes = (decoded as List).map((h) => HeroModel.fromJson(h)).toList();
      } catch (e) {
        print("❌ Error decoding heroes JSON: $e");
      }

      return {...row, 'heroesList': heroes};
    }).toList();
  }

  Future<void> deleteDeck(int id) async {
    final dbClient = await db;

    await dbClient.delete('decks', where: 'id = ?', whereArgs: [id]);
  }

  // ==============================
  // 🔴 BATTLE METHODS
  // ==============================

  Future<void> saveBattleRecord(BattleRecord record) async {
    final dbClient = await db;

    try {
      await dbClient.insert(
        'battle_history',
        record.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
      print("❌ INSERT ERROR: $e");
      print("📦 DATA: ${record.toMap()}");
      rethrow;
    }
  }

  Future<List<BattleRecord>> loadHistory() async {
    final dbClient = await db;

    final rows = await dbClient.query(
      'battle_history',
      orderBy: 'played_at DESC',
    );

    try {
      return rows.map((row) => BattleRecord.fromMap(row)).toList();
    } catch (e) {
      print("❌ LOAD HISTORY ERROR: $e");
      print("📦 RAW DATA: $rows");
      return [];
    }
  }

  // ==============================
  // ⚙️ UTIL
  // ==============================

  Future<void> clearHistory() async {
    final dbClient = await db;
    await dbClient.delete('battle_history');
  }

  Future<void> close() async {
    final dbClient = await db;
    await dbClient.close();
  }
}
