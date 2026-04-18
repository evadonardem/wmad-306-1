import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const String _keyPlayerName = 'player_name';
  static const String _keyThemeDark = 'theme_dark';
  static const String _keyOnboarded = 'onboarded';
  static const String _keyLastSearch = 'last_search';

  Future<String?> loadPlayerName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyPlayerName);
  }

  Future<void> savePlayerName(String name) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyPlayerName, name);
  }

  Future<bool> loadThemeDark() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyThemeDark) ?? false;
  }

  Future<void> saveThemeDark(bool isDark) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyThemeDark, isDark);
  }

  Future<bool> isOnboarded() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyOnboarded) ?? false;
  }

  Future<void> setOnboarded([bool value = true]) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyOnboarded, value);
  }

  Future<String?> loadLastSearch() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyLastSearch);
  }

  Future<void> saveLastSearch(String query) async {
    final normalized = query.trim();
    if (normalized.isEmpty) return;
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyLastSearch, normalized);
  }
}
