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

  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    _totalWins = await _prefs.loadTotalWins();
    notifyListeners();
  }

  Future<void> updatePlayerName(String name) async {
    final trimmed = name.trim();
    if (trimmed.isEmpty) return;
    _playerName = trimmed;
    await _prefs.savePlayerName(trimmed);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }

  Future<void> incrementWins() async {
    _totalWins++;
    await _prefs.saveTotalWins(_totalWins);
    notifyListeners();
  }
}
