import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const String _keyPlayerName = 'player_name';
  static const String _keyThemeDark = 'theme_dark';
  static const String _keyOnboarded = 'onboarded';

  Future<String?> loadPlayerName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyPlayerName);
  }

  Future<bool> loadThemeDark() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyThemeDark) ?? true;
  }

  Future<bool> isOnboarded() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyOnboarded) ?? false;
  }
}
