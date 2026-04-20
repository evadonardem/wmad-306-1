import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  static late SharedPreferences _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static String get playerName => _prefs.getString('playerName') ?? 'Player';
  static set playerName(String value) => _prefs.setString('playerName', value);

  static bool get isDarkTheme => _prefs.getBool('isDarkTheme') ?? false;
  static set isDarkTheme(bool value) => _prefs.setBool('isDarkTheme', value);

  static String get lastSearch => _prefs.getString('lastSearch') ?? '';
  static set lastSearch(String value) => _prefs.setString('lastSearch', value);
}
