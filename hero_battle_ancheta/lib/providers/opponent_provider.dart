import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';

class OpponentProvider extends ChangeNotifier {
  List<HeroModel> _cachedOpponents = [];
  bool _isLoading = false;
  final int _cacheSize = 3;

  List<HeroModel> get cachedOpponents => _cachedOpponents;
  bool get isLoading => _isLoading;

  Future<void> preloadOpponents(SuperheroApiService api) async {
    if (_cachedOpponents.isNotEmpty || _isLoading) return;

    _isLoading = true;
    notifyListeners();

    try {
      final apiOpponents = await api.fetchRandomHeroes(count: _cacheSize);
      if (apiOpponents.isNotEmpty) {
        _cachedOpponents = apiOpponents;
      }
    } catch (e) {
      debugPrint('Failed to preload opponents: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  HeroModel? getRandomOpponent({String? excludeId}) {
    final availableOpponents = _cachedOpponents;
    final filtered = excludeId != null
        ? availableOpponents.where((h) => h.id != excludeId).toList()
        : availableOpponents;

    if (filtered.isEmpty) {
      if (availableOpponents.isEmpty) return null;
      return availableOpponents.first;
    }
    
    final randomIndex = DateTime.now().millisecondsSinceEpoch % filtered.length;
    return filtered[randomIndex];
  }

  void refillOpponent(HeroModel usedOpponent, SuperheroApiService api) {
    _cachedOpponents.removeWhere((h) => h.id == usedOpponent.id);
    // Load a new opponent in the background
    _loadNewOpponent(api);
  }

  Future<void> _loadNewOpponent(SuperheroApiService api) async {
    try {
      final fetched = await api.fetchRandomHeroes(count: 1);
      if (fetched.isNotEmpty) {
        _cachedOpponents.add(fetched.first);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Failed to load new opponent: $e');
    }
  }

  void clearCache() {
    _cachedOpponents.clear();
    notifyListeners();
  }
}