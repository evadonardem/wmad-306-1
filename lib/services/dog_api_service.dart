import 'dart:convert';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:http/http.dart' as http;

class DogApiService {
  static const _base = 'https://dog.ceo/api';

  Future<List<Breed>> fetchBreeds() async {
    final uri = Uri.parse('$_base/breeds/list/all');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load breeds');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    final Map<String, dynamic> message = data['message'];

    return message.entries
        .map(
          (e) =>
              Breed(name: e.key, subBreeds: List<String>.from(e.value as List)),
        )
        .toList()
      ..sort((a, b) => a.name.compareTo(b.name));
  }

  /// Fetches a random image URL for the given breed (and optional sub-breed).
  Future<String?> fetchRandomImage(Breed breed, {String? sub}) async {
    final path = breed.apiPath(sub: sub);
    final uri = Uri.parse('$_base/$path/images/random');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      return null;
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    return data['message'] as String;
  }

  /// Fetches multiple random images for a breed.
  Future<List<String>> fetchImages(Breed breed, {String? sub, int count = 6}) async {
    final path = breed.apiPath(sub: sub);
    final uri = Uri.parse('$_base/$path/images/random/$count');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      return [];
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    return List<String>.from(data['message'] as List);
  }
}
