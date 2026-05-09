import 'package:flutter/foundation.dart';

import '../models/dog.dart';
import '../services/api_service.dart';

enum LoadState { idle, loading, ready, error }

/// Holds the gallery list, the active filter set, and the search query.
/// Filtering is purely client-side so the "Perfect Match" animation can
/// rearrange cards without re-hitting the network.
class DogsProvider extends ChangeNotifier {
  DogsProvider(this._api);

  final ApiService _api;

  LoadState _state = LoadState.idle;
  LoadState get state => _state;

  String? _error;
  String? get error => _error;

  List<DogSummary> _all = const [];
  List<String> _filters = const [];
  final Set<String> _activeFilters = <String>{};
  String _query = '';

  List<String> get filters => _filters;
  Set<String> get activeFilters => _activeFilters;
  String get query => _query;

  /// Visible dogs after applying search + active filters.
  List<DogSummary> get visible {
    Iterable<DogSummary> out = _all;
    if (_query.trim().isNotEmpty) {
      final q = _query.toLowerCase();
      out = out.where((d) =>
          d.name.toLowerCase().contains(q) ||
          d.breed.toLowerCase().contains(q));
    }
    for (final f in _activeFilters) {
      out = out.where((d) => _matches(d, f));
    }
    return out.toList(growable: false);
  }

  /// All loaded dogs (used by detail look-ups for the hero image).
  List<DogSummary> get all => _all;

  Future<void> load({bool refresh = false}) async {
    if (_state == LoadState.loading) return;
    _state = LoadState.loading;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait<dynamic>([
        _api.fetchDogs(),
        if (_filters.isEmpty) _api.fetchFilters(),
      ]);
      _all = results.first as List<DogSummary>;
      if (results.length > 1) _filters = results.last as List<String>;
      _state = LoadState.ready;
    } catch (e) {
      _error = e.toString();
      _state = LoadState.error;
    }
    notifyListeners();
  }

  void toggleFilter(String filter) {
    if (_activeFilters.contains(filter)) {
      _activeFilters.remove(filter);
    } else {
      _activeFilters.add(filter);
    }
    notifyListeners();
  }

  void clearFilters() {
    if (_activeFilters.isEmpty) return;
    _activeFilters.clear();
    notifyListeners();
  }

  void setQuery(String q) {
    if (q == _query) return;
    _query = q;
    notifyListeners();
  }

  DogSummary? findById(String id) {
    for (final d in _all) {
      if (d.id == id) return d;
    }
    return null;
  }

  bool _matches(DogSummary d, String filter) {
    switch (filter) {
      case 'Small':
      case 'Medium':
      case 'Large':
        return d.size == filter;
      case 'Puppy':
        return d.isPuppy;
      case 'Senior':
        return d.isSenior;
      case 'Calm':
        return _traitMatches(d.primaryTrait,
            const ['calm', 'gentle', 'quiet', 'docile']);
      case 'Energetic':
        return _traitMatches(d.primaryTrait,
            const ['energetic', 'active', 'lively', 'playful']);
      case 'Good with kids':
        // We don't carry the goodWithKids flag in the summary; approximate
        // with friendliness-style traits and small/medium size.
        return d.size != 'Large' &&
            _traitMatches(d.primaryTrait,
                const ['friendly', 'gentle', 'affectionate', 'loyal', 'sweet']);
      default:
        return true;
    }
  }

  bool _traitMatches(String trait, List<String> needles) {
    final t = trait.toLowerCase();
    return needles.any(t.contains);
  }
}
