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
          (e) => Breed(
            name: e.key, 
            subBreeds: List<String>.from(e.value as List)
          ),
        )
        .toList()
      ..sort((a, b) => a.name.compareTo(b.name));
  }

  Future<String> fetchRandomImage(String breedPath) async {
    final uri = Uri.parse('$_base/breed/$breedPath/images/random');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load image');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    return data['message'] as String;
  }
  
  // Helper to format breed path with sub-breed
  String formatBreedPath(String breed, {String? subBreed}) {
    return subBreed != null ? '$breed/$subBreed' : breed;
  }
}