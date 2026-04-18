import 'package:flutter/foundation.dart';
import '../services/prefs_service.dart';

class PlayerProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();
  
  String _playerName = 'Hero';
  bool _isDarkTheme = true;
  int _totalWins = 0;

  // NEW: Economy and Leveling Variables
  int _level = 1;
  int _exp = 0;
  int _coins = 500; // Start with some pocket money

  // --- GETTERS ---
  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;
  int get level => _level;
  int get exp => _exp;
  int get coins => _coins; // NEW
  
  int get expToNextLevel => _level * 100;

  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();
    // Coins would normally be loaded from Prefs here as well
    notifyListeners();
  }

  // NEW: Economy Methods
  void earnCoins(int amount) {
    _coins += amount;
    notifyListeners();
  }

  bool spendCoins(int amount) {
    if (_coins >= amount) {
      _coins -= amount;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> updatePlayerName(String name) async {
    if (name.trim().isEmpty) return;
    _playerName = name;
    await _prefs.savePlayerName(name);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }

  /// Wins now grant 50 XP AND 100 Coins
  void incrementWins() {
    _totalWins++;
    _addExp(50); 
    earnCoins(100); // Reward for victory
    notifyListeners();
  }

  void _addExp(int amount) {
    _exp += amount;
    while (_exp >= expToNextLevel) {
      _exp -= expToNextLevel;
      _level++;
    }
  }
}