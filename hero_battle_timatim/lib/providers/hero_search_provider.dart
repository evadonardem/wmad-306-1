// App-state for the Home screen search box.
// Stores query + results so the deck badge / other widgets can react.

import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';
import '../services/prefs_service.dart';
import '../services/superhero_api_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();

  String _query = '';
  List<HeroModel> _results = const [];
  bool _isLoading = false;
  String? _error;

  String get query => _query;
  List<HeroModel> get results => _results;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasQuery => _query.trim().isNotEmpty;

  /// Exercise 4 — runs only on submit (never per-keystroke), persists query.
  Future<void> setQuery(SuperheroApiService api, String q) async {
    _query = q.trim();
    await _prefs.saveLastSearch(_query);
    if (_query.isEmpty) {
      _results = const [];
      _error = null;
      _isLoading = false;
      notifyListeners();
      return;
    }
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _results = await api.searchHeroes(_query);
    } catch (e) {
      _results = const [];
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Exercise 4 — restore saved query on app launch and execute it once.
  Future<String?> restore(SuperheroApiService api) async {
    final last = await _prefs.loadLastSearch();
    if (last == null || last.isEmpty) return null;
    await setQuery(api, last);
    return last;
  }

  void clear() {
    _query = '';
    _results = const [];
    _error = null;
    notifyListeners();
  }
}
