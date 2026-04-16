import 'package:shared_preferences/shared_preferences.dart';

/// Centralised SharedPreferences access for the whole app.
class PrefsService {
  static const String _keyPlayerName = 'player_name';
  static const String _keyThemeDark = 'theme_dark';
  static const String _keyOnboarded = 'onboarded';
  static const String _keyLastSearch = 'last_search';
  static const String _keyTotalWins = 'total_wins';
  static const String _keyTotalLosses = 'total_losses';

  // ── Player name ──
  Future<String?> loadPlayerName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyPlayerName);
  }

  Future<void> savePlayerName(String name) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyPlayerName, name);
  }

  // ── Theme ──
  Future<bool> loadThemeDark() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyThemeDark) ?? true;
  }

  Future<void> saveThemeDark(bool isDark) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyThemeDark, isDark);
  }

  // ── Onboarding ──
  Future<bool> isOnboarded() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_keyOnboarded) ?? false;
  }

  Future<void> setOnboarded(bool value) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_keyOnboarded, value);
  }

  // ── Last search query ──
  Future<String> loadLastSearch() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_keyLastSearch) ?? '';
  }

  Future<void> saveLastSearch(String query) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyLastSearch, query);
  }

  // ── Win / loss counters ──
  Future<int> loadTotalWins() async {
    final p = await SharedPreferences.getInstance();
    return p.getInt(_keyTotalWins) ?? 0;
  }

  Future<void> saveTotalWins(int wins) async {
    final p = await SharedPreferences.getInstance();
    await p.setInt(_keyTotalWins, wins);
  }

  Future<int> loadTotalLosses() async {
    final p = await SharedPreferences.getInstance();
    return p.getInt(_keyTotalLosses) ?? 0;
  }

  Future<void> saveTotalLosses(int losses) async {
    final p = await SharedPreferences.getInstance();
    await p.setInt(_keyTotalLosses, losses);
  }
}
