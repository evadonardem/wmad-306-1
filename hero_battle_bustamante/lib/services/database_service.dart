import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;
import '../models/battle_record.dart';

/// Singleton service for SQLite operations (decks + battle history).
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
    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, 'hero_battle.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
          )
        ''');
        await db.execute('''
          CREATE TABLE deck_heroes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deckId INTEGER NOT NULL,
            heroData TEXT NOT NULL,
            FOREIGN KEY (deckId) REFERENCES decks(id) ON DELETE CASCADE
          )
        ''');
        await db.execute('''
          CREATE TABLE battle_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playerHeroName TEXT NOT NULL,
            playerHeroImage TEXT NOT NULL,
            aiHeroName TEXT NOT NULL,
            aiHeroImage TEXT NOT NULL,
            playerWon INTEGER NOT NULL,
            rounds INTEGER NOT NULL,
            playedAt TEXT NOT NULL
          )
        ''');
      },
    );
  }

  // ── Deck CRUD ─────────────────────────────────────────

  Future<int> saveDeck(String name, List<Map<String, dynamic>> heroesJson) async {
    final db = await database;
    final deckId = await db.insert('decks', {
      'name': name,
      'createdAt': DateTime.now().toIso8601String(),
    });
    for (final h in heroesJson) {
      await db.insert('deck_heroes', {
        'deckId': deckId,
        'heroData': jsonEncode(h),
      });
    }
    return deckId;
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    final db = await database;
    return db.query('decks', orderBy: 'createdAt DESC');
  }

  Future<List<Map<String, dynamic>>> loadDeckHeroes(int deckId) async {
    final db = await database;
    final rows =
        await db.query('deck_heroes', where: 'deckId = ?', whereArgs: [deckId]);
    return rows
        .map((r) => jsonDecode(r['heroData'] as String) as Map<String, dynamic>)
        .toList();
  }

  Future<void> deleteDeck(int deckId) async {
    final db = await database;
    await db.delete('deck_heroes', where: 'deckId = ?', whereArgs: [deckId]);
    await db.delete('decks', where: 'id = ?', whereArgs: [deckId]);
  }

  // ── Battle History CRUD ───────────────────────────────

  Future<int> insertBattleRecord(BattleRecord record) async {
    final db = await database;
    return db.insert('battle_history', record.toJson());
  }

  Future<List<BattleRecord>> loadBattleHistory() async {
    final db = await database;
    final rows = await db.query('battle_history', orderBy: 'playedAt DESC');
    return rows.map((r) => BattleRecord.fromJson(r)).toList();
  }

  Future<void> clearBattleHistory() async {
    final db = await database;
    await db.delete('battle_history');
  }
}
