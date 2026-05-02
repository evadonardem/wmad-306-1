import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
    String _normalizeToken(String rawToken) {
      var token = rawToken.trim();

      if (token.contains('/api/')) {
        final uri = Uri.tryParse(token);
        if (uri != null) {
          final segments = uri.pathSegments;
          final apiIndex = segments.indexOf('api');
          if (apiIndex != -1 && apiIndex + 1 < segments.length) {
            token = segments[apiIndex + 1];
          }
        } else {
          token = token.split('/api/').last;
        }
      }

      token = token.split('/').first;
      token = token.split('?').first;
      return token.trim();
    }

  static const String _keyPlayerName = 'player_name';
  static const String _keyThemeDark = 'theme_dark';
  static const String _keyLastSearch = 'last_search';
  static const String _keyOnboarded = 'onboarded';
  static const String _keyApiToken = 'api_token';

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

  Future<String?> loadApiToken() async {
    final p = await SharedPreferences.getInstance();
    final token = p.getString(_keyApiToken);
    if (token == null || token.trim().isEmpty) return null;
    return _normalizeToken(token);
  }

  Future<void> saveApiToken(String token) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_keyApiToken, _normalizeToken(token));
  }
}