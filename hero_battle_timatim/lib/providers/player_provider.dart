// Manual §5.3 — Player profile + theme preference. Default theme is dark
// (Neon Noir). Theme + name persist via PrefsService.

import 'package:flutter/foundation.dart';

import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();

  String _playerName = 'Hero';
  bool _isDarkTheme = true; // Neon Noir default per spec.
  int _totalWins = 0;

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;

  /// Called once from SplashScreen.
  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    notifyListeners();
  }

  Future<void> updatePlayerName(String name) async {
    _playerName = name;
    await _prefs.savePlayerName(name);
    notifyListeners();
  }

  /// Exercise 3 — flips dark/light and persists.
  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }

  void incrementWins() {
    _totalWins++;
    notifyListeners();
  }
}
