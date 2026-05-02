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
    
    // fake delay to show splash screen
    await Future.delayed(const Duration(seconds: 5));
    
    notifyListeners();
  }

  void incrementWins() {
    _totalWins++;

    notifyListeners();
  }
}
