import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';
import '../services/prefs_service.dart';
import '../constants.dart';

class HeroSearchProvider extends ChangeNotifier {
  final SuperheroApiService _api = SuperheroApiService(apiToken: kApiToken);
  final PrefsService _prefs = PrefsService();

  List<HeroModel> _results = [];
  String _query = '';
  bool _isLoading = false;
  String? _error;

  List<HeroModel> get results => List.unmodifiable(_results);
  String get query => _query;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadLastSearch() async {
    final last = await _prefs.loadLastSearch();
    if (last != null && last.isNotEmpty) {
      _query = last;
      notifyListeners();
      await search(last);
    }
  }

  Future<void> search(String query) async {
    if (query.isEmpty) return;
    _query = query;
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _results = await _api.searchHeroes(query);
      await _prefs.saveLastSearch(query);
    } catch (e) {
      _error = e.toString();
      _results = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearSearch() {
    _results = [];
    _query = '';
    _error = null;
    notifyListeners();
  }
}