import 'package:flutter/foundation.dart';
import 'package:hero_battle/services/prefs_service.dart';

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
    _totalWins = await _prefs.loadTotalWins();
    
    // fake delay to show splash screen
    await Future.delayed(const Duration(seconds: 5));
    
    notifyListeners();
  }

  Future<void> setPlayerName(String value) async {
    _playerName = value.trim().isEmpty ? 'Hero' : value.trim();
    await _prefs.savePlayerName(_playerName);
    notifyListeners();
  }

  Future<void> setDarkTheme(bool value) async {
    _isDarkTheme = value;
    await _prefs.saveThemeDark(value);
    notifyListeners();
  }

  Future<void> toggleTheme(bool value) async => setDarkTheme(value);

  Future<void> incrementWins() async {
    _totalWins++;
    await _prefs.saveTotalWins(_totalWins);
    notifyListeners();
  }
}
