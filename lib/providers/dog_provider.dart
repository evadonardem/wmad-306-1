import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:flutter/foundation.dart';

class DogProvider extends ChangeNotifier {
  final DogApiService _api = DogApiService();
  final PrefsService _prefs = PrefsService();

  // ── Breeds ──────────────────────────────────────────────────────────────────
  List<Breed> _allBreeds = [];
  List<Breed> get allBreeds => _allBreeds;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  List<Breed> get filteredBreeds {
    if (_searchQuery.isEmpty) return _allBreeds;
    final q = _searchQuery.toLowerCase();
    return _allBreeds.where((b) => b.name.toLowerCase().contains(q)).toList();
  }

  // ── Favorites (per-image) ────────────────────────────────────────────────────
  /// Each entry is "imageUrl|breedName" so we can display breed info in favorites
  final List<Map<String, String>> _favoriteImageList = [];

  /// Quick lookup set of image URLs
  final Set<String> _favoriteImageUrls = {};

  Set<String> get favoriteImages => _favoriteImageUrls;

  List<Map<String, String>> get favoriteImageList =>
      List.unmodifiable(_favoriteImageList);

  bool isImageFavorite(String imageUrl) =>
      _favoriteImageUrls.contains(imageUrl);

  Future<void> toggleImageFavorite(
      String imageUrl, String breedName) async {
    if (_favoriteImageUrls.contains(imageUrl)) {
      _favoriteImageUrls.remove(imageUrl);
      _favoriteImageList
          .removeWhere((e) => e['imageUrl'] == imageUrl);
    } else {
      _favoriteImageUrls.add(imageUrl);
      _favoriteImageList
          .add({'imageUrl': imageUrl, 'breedName': breedName});
    }
    await _prefs.saveFavoriteImages(_favoriteImageList);
    notifyListeners();
  }

  Future<void> clearAllFavorites() async {
    _favoriteImageUrls.clear();
    _favoriteImageList.clear();
    await _prefs.clearFavorites();
    notifyListeners();
  }

  // ── Loading / error ──────────────────────────────────────────────────────────
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  DogProvider() {
    _init();
  }

  Future<void> _init() async {
    _isLoading = true;
    notifyListeners();
    try {
      _allBreeds = await _api.fetchBreeds();
      final saved = await _prefs.loadFavoriteImages();
      _favoriteImageList.clear();
      _favoriteImageUrls.clear();
      for (final entry in saved) {
        final imageUrl = entry['imageUrl'];
        final breedName = entry['breedName'];
        if (imageUrl == null || imageUrl.isEmpty) continue;
        if (breedName == null || breedName.isEmpty) continue;

        _favoriteImageList.add({
          'imageUrl': imageUrl,
          'breedName': breedName,
        });
        _favoriteImageUrls.add(imageUrl);
      }
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refresh() => _init();

  void setSearch(String q) {
    _searchQuery = q;
    notifyListeners();
  }

  // ── Image fetching with cache ────────────────────────────────────────────────
  final Map<String, String?> _imageCache = {};

  Future<String?> fetchRandomImage(Breed breed, {String? sub}) async {
    final key = sub != null ? '${breed.name}/$sub' : breed.name;
    if (_imageCache.containsKey(key)) return _imageCache[key];
    final url = await _api.fetchRandomImage(breed, sub: sub);
    _imageCache[key] = url;
    return url;
  }

  Future<List<String>> fetchImages(Breed breed,
          {String? sub, int count = 10}) =>
      _api.fetchImages(breed, sub: sub, count: count);
}
