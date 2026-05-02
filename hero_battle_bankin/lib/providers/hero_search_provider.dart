import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';
import '../services/prefs_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  final SuperheroApiService _api = SuperheroApiService(apiToken: '7905a60ab03c8c9260b99f2c57de7d16');
  final PrefsService _prefs = PrefsService();

  List<HeroModel> _searchResults = [];
  bool _isLoading = false;
  String _lastQuery = '';
  HeroRarity? _selectedRarity; // Filter State

  List<HeroModel> get searchResults => _searchResults;
  bool get isLoading => _isLoading;
  String get lastQuery => _lastQuery;
  HeroRarity? get selectedRarity => _selectedRarity;

  /// Returns results filtered by the chosen rarity
  List<HeroModel> get filteredResults {
    if (_selectedRarity == null) return _searchResults;
    return _searchResults.where((h) => h.rarity == _selectedRarity).toList();
  }

  void setRarityFilter(HeroRarity? rarity) {
    _selectedRarity = rarity;
    notifyListeners();
  }

  Future<void> loadLastSearch() async {
    final query = await _prefs.loadLastSearch();
    if (query != null && query.isNotEmpty) {
      _lastQuery = query;
      await searchHeroes(_lastQuery);
    }
  }

  Future<void> searchHeroes(String query) async {
    if (query.isEmpty) return;

    _isLoading = true;
    _lastQuery = query;
    _selectedRarity = null; // Reset filter on new search
    notifyListeners();

    try {
      _searchResults = await _api.searchHeroes(query);
      await _prefs.saveLastSearch(query); 
    } catch (e) {
      _searchResults = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  void clearSearch() {
    _searchResults = [];
    _selectedRarity = null;
    notifyListeners();
  }
}