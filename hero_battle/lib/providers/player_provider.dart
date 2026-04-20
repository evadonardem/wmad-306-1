import 'package:flutter/material.dart';
import '../services/preferences_service.dart';

class PlayerProvider extends ChangeNotifier {
  String _name = PreferencesService.playerName;
  bool _isDarkTheme = PreferencesService.isDarkTheme;

  String get name => _name;
  bool get isDarkTheme => _isDarkTheme;

  void setName(String name) {
    _name = name;
    PreferencesService.playerName = name;
    notifyListeners();
  }

  void toggleTheme(bool value) {
    _isDarkTheme = value;
    PreferencesService.isDarkTheme = _isDarkTheme;
    notifyListeners();
  }
}
