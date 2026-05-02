import 'package:flutter/foundation.dart';
import '../models/player_stats.dart';
import '../services/database_service.dart';
import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();
  String _playerName = 'Hero';
  bool _isDarkTheme = true;
  int _totalWins = 0;

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;

  // Call once from SplashScreen after app starts.
  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    notifyListeners();
  }

  Future<void> loadTotalWinsFromHistory() async {
    try {
      final history = await DatabaseService().loadHistory();
      _totalWins = PlayerStats.fromHistory(history).wins;
      notifyListeners();
    } catch (_) {
      // Keep existing total wins if history cannot be loaded.
    }
  }

  Future<void> updatePlayerName(String name) async {
    if (name.trim().isEmpty) return;
    _playerName = name.trim();
    await _prefs.savePlayerName(_playerName);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }

  void incrementWins() {
    _totalWins++;
    notifyListeners();
  }

  void setTotalWins(int wins) {
    _totalWins = wins;
    notifyListeners();
  }
}