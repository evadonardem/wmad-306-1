import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const String keyPlayerName = 'player_name';
  static const String keyThemeDark = 'theme_dark';
  static const String keyOnboarded = 'onboarded';

  Future<String?> loadPlayerName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(keyPlayerName);
  }

  Future<bool> loadThemeDark() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(keyThemeDark) ?? true;
  }

  Future<bool> isOnboarded() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(keyOnboarded) ?? false;
  }
}
