import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists favorite dog ids to SharedPreferences so they survive restarts.
class FavoritesProvider extends ChangeNotifier {
  static const _key = 'pawmatch.favorites';

  final Set<String> _ids = <String>{};
  bool _hydrated = false;

  bool get isHydrated => _hydrated;
  Set<String> get ids => _ids;
  int get count => _ids.length;

  bool isFavorite(String id) => _ids.contains(id);

  Future<void> hydrate() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getStringList(_key) ?? const <String>[];
    _ids
      ..clear()
      ..addAll(saved);
    _hydrated = true;
    notifyListeners();
  }

  Future<void> toggle(String id) async {
    if (_ids.contains(id)) {
      _ids.remove(id);
    } else {
      _ids.add(id);
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_key, _ids.toList());
    notifyListeners();
  }
}
