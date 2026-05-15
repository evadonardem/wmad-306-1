// Manual §5.2 — Singleton sqflite helper.
//
// Platform support:
//   • Android / iOS  → native sqflite plugin (default databaseFactory).
//   • macOS / Linux / Windows → sqflite_common_ffi backend (must be wired
//     up before any openDatabase call, otherwise:
//       "Bad state: databaseFactory not initialized").
//
// Call DatabaseService.init() once from main() after
// WidgetsFlutterBinding.ensureInitialized().

import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
// sqflite_ffi re-exports the sqflite_common types we need (Database,
// openDatabase, getDatabasesPath, databaseFactory). On Android/iOS the native
// `sqflite` plugin is still wired up automatically via Flutter plugin
// registration — no Dart import is needed for that.
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import '../models/battle_record.dart';
import '../models/hero_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  /// Wires up the correct sqflite backend for the current platform.
  /// Both FFI calls are idempotent — safe to call on every database access.
  /// On iOS/Android this is a no-op (native plugin auto-registers).
  static void init() {
    if (kIsWeb) return;
    if (Platform.isMacOS || Platform.isLinux || Platform.isWindows) {
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
      if (kDebugMode) {
        // Visible in `flutter run` console — confirms the FFI wiring ran.
        debugPrint(
          '[DatabaseService] FFI backend wired for ${Platform.operatingSystem}',
        );
      }
    }
  }

  Database? _db;

  Future<Database> get database async {
    // Run init on EVERY call — both ops are idempotent and this guarantees
    // the factory is set even if main() was bypassed by hot-reload.
    init();
    _db ??= await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    final dbPath = await getDatabasesPath();
    return openDatabase(
      join(dbPath, 'hero_battle.db'),
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE decks (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT NOT NULL,
            heroes  TEXT NOT NULL,
            created TEXT NOT NULL
          )
        ''');
        await db.execute('''
          CREATE TABLE battle_history (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            player_hero   TEXT NOT NULL,
            ai_hero       TEXT NOT NULL,
            player_won    INTEGER NOT NULL,
            rounds_played INTEGER NOT NULL,
            played_at     TEXT NOT NULL
          )
        ''');
      },
    );
  }

  // ── Deck CRUD ──────────────────────────────────────────────────────────
  Future<int> saveDeck(String name, List<HeroModel> heroes) async {
    final db = await database;
    return db.insert('decks', {
      'name': name,
      'heroes': jsonEncode(heroes.map((h) => h.toJson()).toList()),
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

  /// Convenience: rebuild a deck's hero list from its stored JSON column.
  List<HeroModel> decodeDeckHeroes(String heroesJson) {
    final list = (jsonDecode(heroesJson) as List).cast<Map<String, dynamic>>();
    return list.map(HeroModel.fromStoredJson).toList();
  }

  // ── Battle History ─────────────────────────────────────────────────────
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
