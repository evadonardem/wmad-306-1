import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/prefs_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  final PrefsService _prefs = PrefsService();
  String _lastSearchQuery = '';
  List<HeroModel> _searchResults = [];

  String get lastSearchQuery => _lastSearchQuery;
  List<HeroModel> get searchResults => _searchResults;

  Future<void> loadLastSearch() async {
    _lastSearchQuery = await _prefs.loadLastSearch() ?? '';
    notifyListeners();
  }

  Future<void> saveSearchQuery(String query) async {
    _lastSearchQuery = query;
    await _prefs.saveLastSearch(query);
    notifyListeners();
  }

  void setSearchResults(List<HeroModel> results) {
    _searchResults = results;
    notifyListeners();
  }

  void clearSearch() {
    _searchResults = [];
    notifyListeners();
  }
}