import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyPlayerName = 'player_name';
  static const _keyThemeDark = 'theme_dark';
  static const _keyLastSearch = 'last_search';
  static const _keyOnboarded = 'onboarded';

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
    return p.getBool(_keyThemeDark) ?? true;
  }

  Future<void> saveThemeDark(bool value) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyThemeDark, value);
  }

  Future<String?> loadLastSearch() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyLastSearch);
  }

  Future<void> saveLastSearch(String query) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyLastSearch, query);
  }

  Future<bool> isOnboarded() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyOnboarded) ?? false;
  }

  Future<void> setOnboarded() async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyOnboarded, true);
  }
}