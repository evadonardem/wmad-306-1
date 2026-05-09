import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';
import '../services/prefs_service.dart';

class HeroSearchProvider extends ChangeNotifier {
  /// Auto-load and execute last search on app start
  Future<void> loadLastSearch() async {
    final lastQuery = await PrefsService.getLastSearch();
    if (lastQuery != null && lastQuery.isNotEmpty) {
      await searchHeroes(lastQuery);
    }
  }

  String _query = '';
  List<HeroModel> _results = [];
  bool _isLoading = false;

  String get query => _query;
  List<HeroModel> get results => List.unmodifiable(_results);
  bool get isLoading => _isLoading;

  Future<void> searchHeroes(String query) async {
    _isLoading = true;
    notifyListeners();

    _query = query;

    final api = SuperheroApiService();
    final fetchedResults = await api.searchHeroes(query);

    _results = fetchedResults;

    await PrefsService.saveLastSearch(query); // ✅ FIXED

    _isLoading = false;
    notifyListeners();
  }
}
