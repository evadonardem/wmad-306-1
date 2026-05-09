import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  /// 🔹 KEYS
  static const _keySelectedPlayer = "selected_player";
  static const _keyOnboarded = "onboarded";
  static const _keyPlayerName = "player_name";
  static const _keyThemeDark = "theme_dark";
  static const _keyLastSearch = "last_search";

  /// 🔹 PLAYER ID
  static Future<void> savePlayer(int id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keySelectedPlayer, id);
  }

  static Future<int?> getPlayer() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keySelectedPlayer);
  }

  /// 🔹 ONBOARDING
  static Future<void> setOnboarded() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyOnboarded, true);
  }

  static Future<bool> isOnboarded() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyOnboarded) ?? false;
  }

  /// 🔹 PLAYER NAME (optional)
  static Future<void> savePlayerName(String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyPlayerName, name);
  }

  static Future<String?> getPlayerName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyPlayerName);
  }

  /// 🔹 THEME
  static Future<void> saveThemeMode(bool isDark) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyThemeDark, isDark);
  }

  static Future<bool> getThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyThemeDark) ?? false;
  }

  /// 🔹 LAST SEARCH
  static Future<void> saveLastSearch(String query) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyLastSearch, query);
  }

  static Future<String?> getLastSearch() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyLastSearch);
  }
}
