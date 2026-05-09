import 'package:flutter/material.dart';
import '../services/prefs_service.dart';

class ThemeProvider extends ChangeNotifier {
  bool _isDark = true;
  bool get isDark => _isDark;

  Future<void> loadTheme() async {
    _isDark = await PrefsService.getThemeMode();
    notifyListeners();
  }

  Future<void> setTheme(bool isDark) async {
    _isDark = isDark;
    await PrefsService.saveThemeMode(isDark);
    notifyListeners();
  }
}
