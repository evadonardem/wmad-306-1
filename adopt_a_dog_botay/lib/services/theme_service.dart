import 'package:flutter/material.dart';

import 'prefs_service.dart';

class ThemeModel extends ChangeNotifier {
  ThemeMode _mode = ThemeMode.system;
  final PrefsService _prefs;

  ThemeModel(this._prefs) {
    _load();
  }

  ThemeMode get mode => _mode;

  Future<void> _load() async {
    final stored = await _prefs.loadThemeMode();
    if (stored == 'light') {
      _mode = ThemeMode.light;
    } else if (stored == 'dark') {
      _mode = ThemeMode.dark;
    } else {
      _mode = ThemeMode.system;
    }
    notifyListeners();
  }

  Future<void> setMode(ThemeMode mode) async {
    _mode = mode;
    final val = mode == ThemeMode.light
        ? 'light'
        : mode == ThemeMode.dark
            ? 'dark'
            : 'system';
    await _prefs.saveThemeMode(val);
    notifyListeners();
  }
}
