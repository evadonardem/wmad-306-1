import 'package:flutter/foundation.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/superhero_api_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  final SuperheroApiService _apiService = SuperheroApiService();

  final List<HeroModel> _allHeroes = [];
  List<HeroModel> _searchResults = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<HeroModel> get allHeroes => _allHeroes;
  List<HeroModel> get searchResults => _searchResults;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasSearchResults => _searchResults.isNotEmpty;

  /// Search heroes by name
  Future<void> searchHeroes(String query) async {
    if (query.isEmpty) {
      _searchResults = [];
      notifyListeners();
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await _apiService.searchHeroes(query);
      _searchResults = results;
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Error searching heroes: $e';
      _searchResults = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Get a specific hero by ID
  Future<HeroModel?> getHeroById(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final hero = await _apiService.getHeroById(id);
      _isLoading = false;
      notifyListeners();
      return hero;
    } catch (e) {
      _errorMessage = 'Error fetching hero: $e';
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  /// Get random heroes (for opponent selection)
  Future<List<HeroModel>> getRandomHeroes({int count = 5}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final heroes = await _apiService.getRandomHeroes(count: count);
      _allHeroes.clear();
      _allHeroes.addAll(heroes);
      _isLoading = false;
      notifyListeners();
      return heroes;
    } catch (e) {
      _errorMessage = 'Error fetching random heroes: $e';
      _isLoading = false;
      notifyListeners();
      return [];
    }
  }

  /// Clear search
  void clearSearch() {
    _searchResults = [];
    _errorMessage = null;
    notifyListeners();
  }
}
