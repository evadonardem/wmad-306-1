import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/player.dart';

class PlayerDatabase {
  static final PlayerDatabase instance = PlayerDatabase._init();
  static Database? _database;

  PlayerDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('players.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        wins INTEGER NOT NULL,
        losses INTEGER NOT NULL
      )
    ''');
  }

  Future<Player> create(Player player) async {
    final db = await instance.database;
    await db.insert('players', {
      'name': player.name,
      'wins': player.wins,
      'losses': player.losses,
    });
    return Player(name: player.name, wins: player.wins, losses: player.losses);
  }

  Future<List<Player>> readAllPlayers() async {
    final db = await instance.database;
    final result = await db.query('players');
    return result.map((json) => Player.fromJson(json)).toList();
  }

  Future<int> delete(int id) async {
    final db = await instance.database;
    return await db.delete('players', where: 'id = ?', whereArgs: [id]);
  }

  Future close() async {
    final db = await instance.database;
    db.close();
  }
}
