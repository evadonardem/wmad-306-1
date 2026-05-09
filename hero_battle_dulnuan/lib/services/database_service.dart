import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;

  DatabaseService._internal();

  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB();
    return _database!;
  }

  Future<Database> _initDB() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'hero_battle.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE battles(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hero1 TEXT,
            hero2 TEXT,
            winner TEXT,
            date TEXT
          )
        ''');
      },
    );
  }

  Future<void> insertBattle(BattleRecord record) async {
    final db = await database;

    await db.insert(
      'battles',
      {
        'hero1': record.hero1.name,
        'hero2': record.hero2.name,
        'winner': record.winner.name,
        'date': record.date.toIso8601String(),
      },
    );
  }

  Future<List<BattleRecord>> getBattles() async {
    final db = await database;
    final result = await db.query('battles');

    return result.map((json) {
      return BattleRecord(
        hero1: HeroModel(
          name: json['hero1'] as String,
          imageUrl: '',
          power: '0',
          intelligence: '0',
          speed: '0',
        ),
        hero2: HeroModel(
          name: json['hero2'] as String,
          imageUrl: '',
          power: '0',
          intelligence: '0',
          speed: '0',
        ),
        winner: HeroModel(
          name: json['winner'] as String,
          imageUrl: '',
          power: '0',
          intelligence: '0',
          speed: '0',
        ),
        date: DateTime.parse(json['date'] as String),
      );
    }).toList();
  }
}