import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const String _keyPlayerName = 'player_name';
  static const String _keyThemeDark = 'theme_dark';
  static const String _keyOnboarded = 'onboarded';
  static const String _keyTotalWins = 'total_wins';
  static const String _keyLastSearch = 'last_search';

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

  Future<int> loadTotalWins() async {
    final p = await SharedPreferences.getInstance();
    return p.getInt(_keyTotalWins) ?? 0;
  }

  Future<String> loadLastSearch() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyLastSearch) ?? '';
  }

  Future<void> savePlayerName(String name) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyPlayerName, name);
  }

  Future<void> saveThemeDark(bool value) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyThemeDark, value);
  }

  Future<void> saveOnboarded(bool value) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyOnboarded, value);
  }

  Future<void> saveTotalWins(int value) async {
    final p = await SharedPreferences.getInstance();
    await p.setInt(_keyTotalWins, value);
  }

  Future<void> saveLastSearch(String value) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyLastSearch, value);
  }
}
