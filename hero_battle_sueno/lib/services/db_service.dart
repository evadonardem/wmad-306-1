import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

import '../models/deck_model.dart';
import '../models/battle_record.dart';

class DBService {
  static Future<void> renameDeck(int id, String newName) async {
    final database = await db;
    await database.update(
      'decks',
      {'name': newName},
      where: 'id=?',
      whereArgs: [id],
    );
  }

  static Database? _db;

  static Future<Database> get db async {
    if (_db != null) return _db!;
    _db = await initDB();
    return _db!;
  }

  static Future<Database> initDB() async {
    final path = join(await getDatabasesPath(), 'game.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        /// 🔥 PLAYERS
        await db.execute('''
        CREATE TABLE players(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          wins INTEGER,
          losses INTEGER
        )
        ''');

        /// 🔥 DECKS
        await db.execute('''
        CREATE TABLE decks(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER,
          name TEXT,
          heroes TEXT
        )
        ''');

        /// 🔥 BATTLES
        await db.execute('''
        CREATE TABLE battles(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER,
          opponent TEXT,
          won INTEGER,
          date TEXT,
          log TEXT
        )
        ''');
      },
    );
  }

  /// PLAYER METHODS
  static Future<List<Map<String, dynamic>>> getPlayers() async {
    final database = await db;
    return database.query('players');
  }

  static Future<int> createPlayer(String name) async {
    final database = await db;

    return database.insert('players', {'name': name, 'wins': 0, 'losses': 0});
  }

  static Future<void> deletePlayer(int id) async {
    final database = await db;

    await database.delete('players', where: 'id=?', whereArgs: [id]);
    await database.delete('decks', where: 'player_id=?', whereArgs: [id]);
    await database.delete('battles', where: 'player_id=?', whereArgs: [id]);
  }

  static Future<void> updatePlayerStats(int id, int wins, int losses) async {
    final database = await db;

    await database.update(
      'players',
      {'wins': wins, 'losses': losses},
      where: 'id=?',
      whereArgs: [id],
    );
  }

  /// DECK METHODS
  static Future<List<DeckModel>> getDecksForPlayer(int playerId) async {
    final database = await db;

    final result = await database.query(
      'decks',
      where: 'player_id=?',
      whereArgs: [playerId],
    );

    return result.map((e) => DeckModel.fromMap(e)).toList();
  }

  static Future<void> insertDeck(DeckModel deck) async {
    final database = await db;
    await database.insert('decks', deck.toMap());
  }

  static Future<void> deleteDeck(int id) async {
    final database = await db;
    await database.delete('decks', where: 'id=?', whereArgs: [id]);
  }

  /// BATTLE METHODS
  static Future<List<BattleRecord>> getBattlesForPlayer(int playerId) async {
    final database = await db;
    final result = await database.query(
      'battles',
      where: 'player_id=?',
      whereArgs: [playerId],
    );
    return result.map((e) => BattleRecord.fromMap(e)).toList();
  }

  static Future<void> insertBattle({
    required int playerId,
    required String result,
    required List<String> log,
  }) async {
    final database = await db;
    print("Saving battle: $log");
    await database.insert('battles', {
      'playerId': playerId,
      'result': result,
      'log': log.join('|'),
      'createdAt': DateTime.now().toIso8601String(),
    });
  }

  static Future<void> deleteBattleHistory(int id) async {
    final database = await db;
    await database.delete('battles', where: 'id=?', whereArgs: [id]);
  }
}

// (Removed duplicate/misplaced static method outside the class)
