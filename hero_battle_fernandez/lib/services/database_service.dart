import 'dart:convert';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DuplicateDeckException implements Exception {
  const DuplicateDeckException();

  @override
  String toString() => 'A saved deck with the same heroes already exists.';
}

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
    return openDatabase(
      join(dbPath, 'hero_battle.db'),
      version: 2,
      onCreate: (db, version) => _createTables(db),
      onUpgrade: (db, oldVersion, newVersion) => _createTables(db),
      onOpen: (db) => _createTables(db),
    );
  }

  Future<void> _createTables(Database db) async {
    await db.execute('''
CREATE TABLE IF NOT EXISTS decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  heroes TEXT NOT NULL,
  created TEXT NOT NULL
)''');
    await db.execute('''
CREATE TABLE IF NOT EXISTS battle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_hero TEXT NOT NULL,
  ai_hero TEXT NOT NULL,
  player_won INTEGER NOT NULL,
  rounds_played INTEGER NOT NULL,
  played_at TEXT NOT NULL
)''');
  }

  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    final db = await database;
    final newDeckKey = _deckKey(heroes);
    final existingDecks = await loadDecks();

    for (final deck in existingDecks) {
      final savedHeroes = tryDecodeDeckHeroes(
        deck['heroes'] as String? ?? '[]',
      );
      if (savedHeroes.isNotEmpty && _deckKey(savedHeroes) == newDeckKey) {
        throw const DuplicateDeckException();
      }
    }

    return db.insert('decks', {
      'name': name,
      'heroes': jsonEncode(heroes.map((hero) => hero.toJson()).toList()),
      'created': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> loadDecks() async {
    final db = await database;
    return db.query('decks', orderBy: 'created DESC');
  }

  Future<void> deleteDeck(int id) async {
    final db = await database;
    await db.delete('decks', where: 'id = ?', whereArgs: [id]);
  }

  List<HeroModel> decodeDeckHeroes(String heroesJson) {
    final decoded = jsonDecode(heroesJson) as List<dynamic>;
    return decoded
        .map((item) => HeroModel.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  List<HeroModel> tryDecodeDeckHeroes(String heroesJson) {
    try {
      return decodeDeckHeroes(heroesJson);
    } catch (_) {
      return [];
    }
  }

  String _deckKey(List<HeroModel> heroes) {
    final ids = heroes.map((hero) => hero.id).toSet().toList()..sort();
    return ids.join('|');
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
