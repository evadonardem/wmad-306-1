import 'package:dio/dio.dart';
import '../models/hero_model.dart';

class SuperheroApiService {
  // Get your token from: https://superheroapi.com/
  // Sign up for free and replace YOUR_ACCESS_TOKEN with your actual token
  static const String _accessToken = '10223274926122333';
  final Dio _dio = Dio(BaseOptions(baseUrl: 'https://superheroapi.com/api/'));

  Future<List<HeroModel>> searchHeroes(String query) async {
    try {
      final response = await _dio.get('$_accessToken/search/$query');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic> && data['response'] == 'success') {
          final results = data['results'] as List<dynamic>?;
          if (results == null) return [];

          return results
              .whereType<Map<String, dynamic>>()
              .map((heroJson) => HeroModel.fromJson(heroJson))
              .toList();
        }
        return [];
      }

      throw Exception('Failed to load heroes: ${response.statusMessage}');
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }
}