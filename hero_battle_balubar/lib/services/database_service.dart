import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;

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
          CREATE TABLE saved_decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            heroes TEXT NOT NULL,
            created_at TEXT NOT NULL
          )
        ''');
        await db.execute('''
          CREATE TABLE battle_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_hero TEXT NOT NULL,
            opponent_hero TEXT NOT NULL,
            winner TEXT NOT NULL,
            player_health INTEGER NOT NULL,
            opponent_health INTEGER NOT NULL,
            turns INTEGER NOT NULL,
            battle_type TEXT NOT NULL,
            played_at TEXT NOT NULL
          )
        ''');
      },
    );
  }

  // ── Saved Decks ────────────────────────────────────────────────────

  Future<int> insertDeck(String name, String heroesJson) async {
    final db = await database;
    return db.insert('saved_decks', {
      'name': name,
      'heroes': heroesJson,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getAllDecks() async {
    final db = await database;
    return db.query('saved_decks', orderBy: 'created_at DESC');
  }

  Future<int> deleteDeckById(int id) async {
    final db = await database;
    return db.delete('saved_decks', where: 'id = ?', whereArgs: [id]);
  }

  // ── Battle History ─────────────────────────────────────────────────

  Future<int> insertBattleRecord({
    required String playerHeroJson,
    required String opponentHeroJson,
    required String winnerJson,
    required int playerHealth,
    required int opponentHealth,
    required int turns,
    required String battleType,
  }) async {
    final db = await database;
    return db.insert('battle_history', {
      'player_hero': playerHeroJson,
      'opponent_hero': opponentHeroJson,
      'winner': winnerJson,
      'player_health': playerHealth,
      'opponent_health': opponentHealth,
      'turns': turns,
      'battle_type': battleType,
      'played_at': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getAllBattleRecords() async {
    final db = await database;
    return db.query('battle_history', orderBy: 'played_at DESC');
  }
}
