import 'package:flutter/foundation.dart';
import '../models/warrior_model.dart';
import '../services/api_service.dart';
import '../services/prefs_service.dart';

class WarriorSearchProvider extends ChangeNotifier {
  final _prefs = PrefsService();

  String _query = '';
  bool _loading = false;
  String? _error;

  String get query => _query;
  bool get isLoading => _loading;
  bool get hasQuery => _query.isNotEmpty;
  String? get error => _error;

  Future<String> loadLastSearch() async {
    return await _prefs.loadLastSearch() ?? '';
  }

  Future<List<WarriorModel>> search(String query, ApiService api) async {
    _query = query;
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      await _prefs.saveLastSearch(query);
      final results = await api.searchWarriors(query);
      _loading = false;
      notifyListeners();
      return results;
    } catch (e) {
      _error = 'Search failed: ${e.toString()}';
      _loading = false;
      notifyListeners();
      return [];
    }
  }
}
