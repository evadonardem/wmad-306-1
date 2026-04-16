import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';

enum SearchState { idle, loading, success, empty, error }

enum PowerTier { all, weak, average, strong, legendary }

class HeroSearchProvider extends ChangeNotifier {
  final SuperheroApiService _api = SuperheroApiService();

  List<HeroModel> _allHeroes = [];
  List<HeroModel> _filteredHeroes = [];
  SearchState _state = SearchState.idle;
  String _query = '';
  String _errorMessage = '';
  bool _isFeatured = false;

  // Filters
  String? _alignmentFilter;
  String? _publisherFilter;
  PowerTier _powerTier = PowerTier.all;

  // ── Universe showcase ──
  Map<String, List<HeroModel>> _showcaseData = {};
  bool _showcaseLoading = false;
  bool _showcaseLoaded = false;
  String? _showcaseError;

  Map<String, List<HeroModel>> get showcaseData => _showcaseData;
  bool get showcaseLoading => _showcaseLoading;
  bool get showcaseLoaded => _showcaseLoaded;
  String? get showcaseError => _showcaseError;

  /// Hero IDs grouped by universe/category for the home showcase.
  static const Map<String, List<int>> universeHeroIds = {
    'MARVEL': [620, 346, 149, 659],         // Spider-Man, Iron Man, Captain America, Thor
    'DC': [69, 644, 720, 263],              // Batman, Superman, Wonder Woman, Flash
    'FAN FAVORITES': [717, 213, 332, 106],  // Wolverine, Deadpool, Hulk, Black Panther
    'VILLAINS': [655, 370, 687, 423],       // Thanos, Joker, Venom, Magneto
  };

  /// Universe display metadata: (icon codepoint, color hex).
  static const Map<String, (int, int)> universeMeta = {
    'MARVEL': (0xe55f, 0xFFE53935),        // shield, red
    'DC': (0xe3ab, 0xFF1E88E5),            // flash_on, blue
    'FAN FAVORITES': (0xf06bb, 0xFFFFB300), // star, amber
    'VILLAINS': (0xe3c4, 0xFFAB47BC),      // whatshot, purple
  };

  /// Load showcase heroes for the home page.
  Future<void> loadShowcase() async {
    if (_showcaseLoaded || _showcaseLoading) return;
    _showcaseLoading = true;
    _showcaseError = null;
    notifyListeners();

    try {
      final allIds = universeHeroIds.values.expand((ids) => ids).toList();
      final heroes = await _api.fetchHeroesByIds(allIds);
      final heroMap = {for (var h in heroes) h.id: h};

      _showcaseData = {};
      for (final entry in universeHeroIds.entries) {
        _showcaseData[entry.key] = entry.value
            .map((id) => heroMap[id])
            .whereType<HeroModel>()
            .toList();
      }
      _showcaseLoaded = true;
    } catch (e) {
      _showcaseError = 'Failed to load showcase heroes.';
    }
    _showcaseLoading = false;
    notifyListeners();
  }

  List<HeroModel> get results => _filteredHeroes;
  List<HeroModel> get allHeroes => _allHeroes;
  SearchState get state => _state;
  String get query => _query;
  String get errorMessage => _errorMessage;
  bool get isFeatured => _isFeatured;
  String? get alignmentFilter => _alignmentFilter;
  String? get publisherFilter => _publisherFilter;
  PowerTier get powerTier => _powerTier;

  List<String> get availablePublishers {
    final pubs = _allHeroes
        .map((h) => h.publisher)
        .where((p) => p.isNotEmpty && p != 'Unknown')
        .toSet()
        .toList();
    pubs.sort();
    return pubs;
  }

  bool get hasActiveFilters =>
      _alignmentFilter != null ||
      _publisherFilter != null ||
      _powerTier != PowerTier.all;

  String _categoryLabel = '';
  String get categoryLabel => _categoryLabel;

  /// Load heroes by category using the search API (single request, no crash).
  Future<void> loadCategory(String keyword, {String label = ''}) async {
    _state = SearchState.loading;
    _isFeatured = true;
    _query = '';
    _categoryLabel = label.isNotEmpty ? label : keyword;
    notifyListeners();

    try {
      _allHeroes = await _api.searchHeroes(keyword);
      _applyFilters();
      _state = _filteredHeroes.isEmpty ? SearchState.empty : SearchState.success;
    } catch (e) {
      _allHeroes = [];
      _filteredHeroes = [];
      _state = SearchState.error;
      _errorMessage = 'Failed to load heroes.';
    }
    notifyListeners();
  }

  /// Trigger a search by name.
  Future<void> search(String query) async {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return;

    _query = trimmed;
    _isFeatured = false;
    _state = SearchState.loading;
    _errorMessage = '';
    notifyListeners();

    try {
      _allHeroes = await _api.searchHeroes(trimmed);
      _applyFilters();
      _state = _filteredHeroes.isEmpty ? SearchState.empty : SearchState.success;
    } catch (e) {
      _allHeroes = [];
      _filteredHeroes = [];
      _state = SearchState.error;
      _errorMessage = 'Search failed. Please try again.';
    }
    notifyListeners();
  }

  void setAlignmentFilter(String? alignment) {
    _alignmentFilter = alignment;
    _applyAndNotify();
  }

  void setPublisherFilter(String? publisher) {
    _publisherFilter = publisher;
    _applyAndNotify();
  }

  void setPowerTier(PowerTier tier) {
    _powerTier = tier;
    _applyAndNotify();
  }

  void clearFilters() {
    _alignmentFilter = null;
    _publisherFilter = null;
    _powerTier = PowerTier.all;
    _applyAndNotify();
  }

  void backToHome() {
    _query = '';
    _categoryLabel = '';
    _isFeatured = false;
    _allHeroes = [];
    _filteredHeroes = [];
    _state = SearchState.idle;
    clearFilters();
  }

  void clear() {
    _allHeroes = [];
    _filteredHeroes = [];
    _state = SearchState.idle;
    _query = '';
    _errorMessage = '';
    _isFeatured = false;
    notifyListeners();
  }

  void _applyAndNotify() {
    _applyFilters();
    if (_allHeroes.isNotEmpty) {
      _state = _filteredHeroes.isEmpty ? SearchState.empty : SearchState.success;
    }
    notifyListeners();
  }

  void _applyFilters() {
    _filteredHeroes = _allHeroes.where((hero) {
      if (_alignmentFilter != null && hero.alignment != _alignmentFilter) {
        return false;
      }
      if (_publisherFilter != null && hero.publisher != _publisherFilter) {
        return false;
      }
      if (_powerTier != PowerTier.all) {
        final total =
            hero.hp + hero.attack + hero.defense + hero.specialAttack + hero.speed;
        switch (_powerTier) {
          case PowerTier.weak:
            if (total >= 300) return false;
          case PowerTier.average:
            if (total < 300 || total >= 500) return false;
          case PowerTier.strong:
            if (total < 500 || total >= 700) return false;
          case PowerTier.legendary:
            if (total < 700) return false;
          case PowerTier.all:
            break;
        }
      }
      return true;
    }).toList();
  }
}
