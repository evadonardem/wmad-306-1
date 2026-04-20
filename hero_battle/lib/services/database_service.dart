import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/deck_model.dart';
import '../models/battle_model.dart';
import '../models/hero_model.dart';
import 'dart:convert';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  static Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'hero_battle.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            heroes TEXT
          )
        ''');
        await db.execute('''
          CREATE TABLE battles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playerDeck TEXT,
            enemyDeck TEXT,
            result TEXT,
            date TEXT
          )
        ''');
      },
    );
  }

  // Decks
  Future<int> insertDeck(DeckModel deck) async {
    final db = await database;
    return await db.insert('decks', {
      'name': deck.name,
      'heroes': jsonEncode(deck.heroes.map((e) => e.toJson()).toList()),
    });
  }

  Future<List<DeckModel>> getDecks() async {
    final db = await database;
    final decks = await db.query('decks');
    return decks.map((e) {
      final heroesJson = e['heroes'] as String;
      final heroesList = (jsonDecode(heroesJson) as List)
          .map((h) => HeroModel.fromJson(h))
          .toList();
      return DeckModel(
        id: e['id'] as int,
        name: e['name'] as String,
        heroes: heroesList,
      );
    }).toList();
  }

  // Battles
  Future<int> insertBattle(BattleModel battle) async {
    final db = await database;
    return await db.insert('battles', {
      'playerDeck': jsonEncode(
        battle.playerDeck.map((e) => e.toJson()).toList(),
      ),
      'enemyDeck': jsonEncode(battle.enemyDeck.map((e) => e.toJson()).toList()),
      'result': battle.result,
      'date': battle.date.toIso8601String(),
    });
  }

  Future<List<BattleModel>> getBattles() async {
    final db = await database;
    final battles = await db.query('battles');
    return battles.map((e) {
      final playerDeckJson = e['playerDeck'] as String;
      final enemyDeckJson = e['enemyDeck'] as String;
      final playerDeckList = (jsonDecode(playerDeckJson) as List)
          .map((h) => HeroModel.fromJson(h))
          .toList();
      final enemyDeckList = (jsonDecode(enemyDeckJson) as List)
          .map((h) => HeroModel.fromJson(h))
          .toList();
      return BattleModel(
        id: e['id'] as int,
        playerDeck: playerDeckList,
        enemyDeck: enemyDeckList,
        result: e['result'] as String,
        date: DateTime.parse(e['date'] as String),
      );
    }).toList();
  }
}
