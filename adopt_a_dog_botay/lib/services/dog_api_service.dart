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

  Future<String> fetchRandomImage(String breed, [String? subBreed]) async {
    final path = subBreed == null
        ? 'breed/$breed/images/random'
        : 'breed/$breed/$subBreed/images/random';
    final uri = Uri.parse('$_base/$path');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load breed image');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    return data['message'] as String;
  }

  Future<String> fetchBreedImage({required String breed, String? subBreed}) {
    return fetchRandomImage(breed, subBreed);
  }
}
