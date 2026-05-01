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

  Future<String> fetchRandomImage(String breedName) async {
    final uri = Uri.parse('$_base/breed/$breedName/images/random');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load image');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    return data['message'] as String;
  }
}
