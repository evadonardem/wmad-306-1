import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';
import '../services/prefs_service.dart';
import '../services/superhero_api_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();

  String _query = '';
  List<HeroModel> _results = [];
  bool _isLoading = false;
  String? _error;

  String get query => _query;
  List<HeroModel> get results => List.unmodifiable(_results);
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasQuery => _query.trim().isNotEmpty;

  Future<String> loadLastSearch() async {
    _query = await _prefs.loadLastSearch() ?? '';
    notifyListeners();
    return _query;
  }

  Future<List<HeroModel>> search(String query, SuperheroApiService api) async {
    _query = query.trim();
    _error = null;
    _isLoading = true;
    notifyListeners();

    await _prefs.saveLastSearch(_query);

    if (_query.isEmpty) {
      _results = [];
      _isLoading = false;
      notifyListeners();
      return _results;
    }

    try {
      _results = await api.searchHeroes(_query);
      if (_results.isEmpty) {
        _error = 'No heroes found for "$_query".';
      }
    } catch (error) {
      final lower = _query.toLowerCase();
      _results = fallbackHeroes
          .where(
            (hero) =>
                hero.name.toLowerCase().contains(lower) ||
                hero.fullName.toLowerCase().contains(lower),
          )
          .toList();
      _error = _results.isEmpty
          ? 'Live search failed, and no local match was found.'
          : 'Live search failed. Showing local matches.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return _results;
  }

  void clear() {
    _query = '';
    _results = [];
    _error = null;
    notifyListeners();
  }
}
