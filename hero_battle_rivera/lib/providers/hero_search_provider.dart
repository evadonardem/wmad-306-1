import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/prefs_service.dart';
import '../services/superhero_api_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  HeroSearchProvider({
    SuperheroApiService? apiService,
    PrefsService? prefsService,
  }) : _apiService = apiService ?? SuperheroApiService.fromRuntime(),
       _prefsService = prefsService ?? PrefsService();

  final SuperheroApiService _apiService;
  final PrefsService _prefsService;

  String _query = 'batman';
  bool _isLoading = false;
  String? _errorMessage;
  List<HeroModel> _results = const [];
  bool _loadedInitialQuery = false;

  String get query => _query;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<HeroModel> get results => List.unmodifiable(_results);

  void setResults({required List<HeroModel> results, String? query}) {
    final normalized = query?.trim();
    if (normalized != null && normalized.isNotEmpty) {
      _query = normalized;
    }

    _results = List<HeroModel>.from(results);
    _errorMessage = null;
    _isLoading = false;
    notifyListeners();
  }

  void setError(String message) {
    _errorMessage = message;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadInitialQuery() async {
    if (_loadedInitialQuery) return;
    _query = await _prefsService.loadLastSearch() ?? 'batman';
    _loadedInitialQuery = true;
    notifyListeners();
  }

  Future<List<HeroModel>> search({String? query}) async {
    final nextQuery = (query ?? _query).trim();
    _query = nextQuery.isEmpty ? 'batman' : nextQuery;
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    await _prefsService.saveLastSearch(_query);

    try {
      final heroes = await _apiService.searchHeroes(_query);
      _results = heroes;
      return heroes;
    } on SuperheroApiException catch (e) {
      _errorMessage = e.message;
      rethrow;
    } catch (e) {
      _errorMessage = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
