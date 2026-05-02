import 'package:flutter/foundation.dart';
import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  PlayerProvider({PrefsService? prefs}) : _prefs = prefs ?? PrefsService();

  final PrefsService _prefs;
  String _playerName = 'Hero';
  bool _isDarkTheme = false;
  int _totalWins = 0;
  bool _isOnboarded = false;

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;
  bool get isOnboarded => _isOnboarded;

  Future<bool> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    _isOnboarded = await _prefs.isOnboarded();
    notifyListeners();
    return _isOnboarded;
  }

  Future<void> updatePlayerName(String name) async {
    final normalized = name.trim();
    if (normalized.isEmpty) return;
    _playerName = normalized;
    await _prefs.savePlayerName(normalized);
    notifyListeners();
  }

  Future<void> setPlayerName(String name) {
    return updatePlayerName(name);
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }

  Future<void> setThemeDark(bool value) async {
    _isDarkTheme = value;
    await _prefs.saveThemeDark(value);
    notifyListeners();
  }

  Future<void> setOnboarded(bool value) async {
    _isOnboarded = value;
    await _prefs.setOnboarded(value);
    notifyListeners();
  }

  void incrementWins() {
    _totalWins++;
    notifyListeners();
  }
}
