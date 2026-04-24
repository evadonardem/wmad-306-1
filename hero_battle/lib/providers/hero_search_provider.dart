import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  HeroSearchProvider({SuperheroApiService? apiService})
    : _api = apiService ?? SuperheroApiService();

  final SuperheroApiService _api;

  String _query = '';
  bool _isSearching = false;
  bool _isLoadingHero = false;
  String? _error;
  List<HeroSummary> _results = const <HeroSummary>[];
  HeroDetail? _selectedHero;

  String get query => _query;
  bool get isSearching => _isSearching;
  bool get isLoadingHero => _isLoadingHero;
  String? get error => _error;
  List<HeroSummary> get results => _results;
  HeroDetail? get selectedHero => _selectedHero;

  void clearPickedHeroes() {
    _selectedHero = null;
    _results = const <HeroSummary>[];
    notifyListeners();
  }

  Future<void> search(String value) async {
    _query = value;
    _error = null;
    final trimmed = value.trim();

    if (trimmed.isEmpty) {
      _results = const <HeroSummary>[];
      notifyListeners();
      return;
    }

    _isSearching = true;
    notifyListeners();
    try {
      _results = await _api.searchHeroes(trimmed);
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isSearching = false;
      notifyListeners();
    }
  }

  Future<void> loadHero(String heroId) async {
    _isLoadingHero = true;
    _error = null;
    notifyListeners();
    try {
      _selectedHero = await _api.fetchHeroDeepDive(heroId);
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoadingHero = false;
      notifyListeners();
    }
  }

  Future<void> loadRandomHero() async {
    _isLoadingHero = true;
    _error = null;
    notifyListeners();
    try {
      _selectedHero = await _api.fetchRandomHero();
      final hero = _selectedHero;
      if (hero != null) {
        final maybeExisting = _results.any((h) => h.id == hero.id);
        if (!maybeExisting) {
          _results = <HeroSummary>[
            HeroSummary(id: hero.id, name: hero.name, imageUrl: hero.imageUrl),
            ..._results,
          ];
        }
      }
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoadingHero = false;
      notifyListeners();
    }
  }
}
