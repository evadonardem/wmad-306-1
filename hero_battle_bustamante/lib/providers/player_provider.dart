import 'package:flutter/foundation.dart';
import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();

  String _playerName = 'Hero';
  bool _isDarkTheme = true;
  int _totalWins = 0;
  int _totalLosses = 0;
  String _lastSearch = '';

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;
  int get totalLosses => _totalLosses;
  int get totalBattles => _totalWins + _totalLosses;
  String get lastSearch => _lastSearch;

  /// Call once from SplashScreen after app starts.
  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    _totalWins = await _prefs.loadTotalWins();
    _totalLosses = await _prefs.loadTotalLosses();
    _lastSearch = await _prefs.loadLastSearch();
    notifyListeners();
  }

  Future<void> setPlayerName(String name) async {
    _playerName = name.trim().isEmpty ? 'Hero' : name.trim();
    await _prefs.savePlayerName(_playerName);
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

  Future<void> incrementLosses() async {
    _totalLosses++;
    await _prefs.saveTotalLosses(_totalLosses);
    notifyListeners();
  }

  Future<void> setLastSearch(String query) async {
    _lastSearch = query;
    await _prefs.saveLastSearch(query);
  }
}
