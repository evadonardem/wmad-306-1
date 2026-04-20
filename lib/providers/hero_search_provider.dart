import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';
import '../services/preferences_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  List<HeroModel> _results = [];
  bool _isLoading = false;
  String _lastQuery = PreferencesService.lastSearch;

  List<HeroModel> get results => _results;
  bool get isLoading => _isLoading;
  String get lastQuery => _lastQuery;

  Future<void> search(String query) async {
    _isLoading = true;
    notifyListeners();
    _results = await SuperheroApiService.searchHeroesByName(query);
    _isLoading = false;
    _lastQuery = query;
    PreferencesService.lastSearch = query;
    notifyListeners();
  }

  Future<void> loadLastSearch() async {
    if (_lastQuery.isNotEmpty) {
      await search(_lastQuery);
    }
  }
}
