import 'package:shared_preferences/shared_preferences.dart';

/// Wraps SharedPreferences so no other file imports that package directly.
class PrefsService {
  static const _keyAlias = 'alias';
  static const _keyDarkMode = 'dark_mode';
  static const _keyLastSearch = 'last_search';

  Future<String?> loadAlias() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyAlias);
  }

  Future<void> saveAlias(String value) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyAlias, value);
  }

  Future<bool> loadDarkMode() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyDarkMode) ?? true;
  }

  Future<void> saveDarkMode(bool value) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyDarkMode, value);
  }

  Future<String?> loadLastSearch() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyLastSearch);
  }

  Future<void> saveLastSearch(String query) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyLastSearch, query);
  }
}
