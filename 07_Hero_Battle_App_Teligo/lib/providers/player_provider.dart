import 'package:flutter/foundation.dart';
import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();

  String _playerName = 'Hero';
  bool _isDarkTheme = true;
  int _totalWins = 0;
  int _totalBattles = 0;

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;
  int get totalBattles => _totalBattles;
  double get winRate => _totalBattles == 0 ? 0 : (_totalWins / _totalBattles) * 100;

  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    debugPrint('🎨 Theme LOADED: isDark = $_isDarkTheme');
    notifyListeners();
  }

  Future<void> updatePlayerName(String name) async {
    _playerName = name;
    await _prefs.savePlayerName(name);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    debugPrint('🎨 Theme SAVED: isDark = $_isDarkTheme');
    notifyListeners();
  }

  void incrementWins() {
    _totalWins++;
    _totalBattles++;
    notifyListeners();
  }

  void incrementLosses() {
    _totalBattles++;
    notifyListeners();
  }
}