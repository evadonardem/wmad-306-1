import 'dart:convert';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../models/match_record.dart';
import '../models/warrior_model.dart';

class DuplicateSquadException implements Exception {
  @override
  String toString() => 'A squad with these warriors already exists.';
}

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  Database? _db;

  Future<Database> get database async {
    _db ??= await _openDb();
    return _db!;
  }

  Future<Database> _openDb() async {
    final path = await getDatabasesPath();
    return openDatabase(
      join(path, 'realm_clash.db'),
      version: 1,
      onCreate: (db, _) => _buildTables(db),
      onOpen: (db) => _buildTables(db),
    );
  }

  Future<void> _buildTables(Database db) async {
    await db.execute('''
CREATE TABLE IF NOT EXISTS squads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  warriors TEXT NOT NULL,
  created TEXT NOT NULL
)''');
    await db.execute('''
CREATE TABLE IF NOT EXISTS match_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_squad TEXT NOT NULL,
  rival_squad TEXT NOT NULL,
  player_won INTEGER NOT NULL,
  turns_played INTEGER NOT NULL,
  played_at TEXT NOT NULL
)''');
  }

  Future<int> saveSquad(String label, List<WarriorModel> warriors) async {
    final db = await database;
    final newKey = _squadKey(warriors);
    final saved = await loadSquads();
    for (final row in saved) {
      final existing = _tryDecode(row['warriors'] as String? ?? '[]');
      if (existing.isNotEmpty && _squadKey(existing) == newKey) {
        throw DuplicateSquadException();
      }
    }
    return db.insert('squads', {
      'label': label,
      'warriors': jsonEncode(warriors.map((w) => w.toJson()).toList()),
      'created': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> loadSquads() async {
    final db = await database;
    return db.query('squads', orderBy: 'created DESC');
  }

  Future<void> deleteSquad(int id) async {
    final db = await database;
    await db.delete('squads', where: 'id = ?', whereArgs: [id]);
  }

  List<WarriorModel> decodeWarriors(String json) {
    final list = jsonDecode(json) as List<dynamic>;
    return list
        .map((j) => WarriorModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  List<WarriorModel> _tryDecode(String json) {
    try {
      return decodeWarriors(json);
    } catch (_) {
      return [];
    }
  }

  String _squadKey(List<WarriorModel> warriors) {
    final ids = warriors.map((w) => w.id).toSet().toList()..sort();
    return ids.join('|');
  }

  Future<void> saveMatchRecord(MatchRecord record) async {
    final db = await database;
    await db.insert('match_history', record.toMap());
  }

  Future<List<MatchRecord>> loadHistory() async {
    final db = await database;
    final rows = await db.query('match_history', orderBy: 'played_at DESC');
    return rows.map(MatchRecord.fromMap).toList();
  }
}
