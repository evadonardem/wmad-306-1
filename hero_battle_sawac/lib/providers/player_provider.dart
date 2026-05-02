import 'package:flutter/foundation.dart';
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

  void incrementWins() {
    _totalWins++;

    notifyListeners();
  }

  Future<void> updatePlayerName(String value) async {
    final sanitized = value.trim();
    if (sanitized.isEmpty) {
      return;
    }

    _playerName = sanitized;
    await _prefs.savePlayerName(_playerName);
    notifyListeners();
  }

  Future<void> setDarkTheme(bool value) async {
    _isDarkTheme = value;
    await _prefs.saveThemeDark(value);
    notifyListeners();
  }
}
