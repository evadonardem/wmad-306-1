import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('PrefsService', () {
    late PrefsService service;

    setUp(() {
      SharedPreferences.setMockInitialValues({});
      service = PrefsService();
    });

    test('saves and loads breed favorites', () async {
      await service.saveFavorite('husky');
      await service.saveFavorite('beagle');
      await service.saveFavorite('husky');

      final favorites = await service.loadFavorites();

      expect(favorites, ['beagle', 'husky']);
    });

    test('removes a breed favorite', () async {
      await service.saveFavorite('husky');
      await service.saveFavorite('beagle');

      await service.removeFavorite('husky');
      final favorites = await service.loadFavorites();

      expect(favorites, ['beagle']);
    });

    test('saves and removes photo favorites', () async {
      await service.savePhotoFavorite('husky', 'https://example.com/1.jpg');
      await service.savePhotoFavorite('beagle', 'https://example.com/2.jpg');
      await service.savePhotoFavorite('husky', 'https://example.com/1.jpg');

      var photos = await service.loadPhotoFavorites();
      expect(photos.length, 2);
      expect(photos.first.imageUrl, 'https://example.com/2.jpg');

      await service.removePhotoFavorite('https://example.com/2.jpg');
      photos = await service.loadPhotoFavorites();

      expect(photos.length, 1);
      expect(photos.first.imageUrl, 'https://example.com/1.jpg');
    });

    test('stores and loads last search term', () async {
      await service.saveLastSearch('hus');

      final term = await service.loadLastSearch();

      expect(term, 'hus');
    });
  });
}
