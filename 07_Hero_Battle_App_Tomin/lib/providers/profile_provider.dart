import 'package:flutter/foundation.dart';
import '../services/prefs_service.dart';

class ProfileProvider extends ChangeNotifier {
  final _prefs = PrefsService();

  String _alias = 'Commander';
  bool _darkMode = true;

  String get alias => _alias;
  bool get darkMode => _darkMode;

  /// Call once from SplashScreen after app starts.
  Future<void> loadFromPrefs() async {
    _alias = await _prefs.loadAlias() ?? 'Commander';
    _darkMode = await _prefs.loadDarkMode();
    notifyListeners();
  }

  Future<void> setAlias(String value) async {
    _alias = value.trim().isEmpty ? 'Commander' : value.trim();
    await _prefs.saveAlias(_alias);
    notifyListeners();
  }

  Future<void> toggleDarkMode() async {
    _darkMode = !_darkMode;
    await _prefs.saveDarkMode(_darkMode);
    notifyListeners();
  }
}
