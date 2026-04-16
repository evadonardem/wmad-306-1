import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/breed.dart';

class DogApiService {
  static const String _baseUrl = 'https://dog.ceo/api';

  // Fetch all breeds and their sub-breeds
  static Future<List<Breed>> fetchBreeds() async {
    final response = await http.get(Uri.parse('$_baseUrl/breeds/list/all'));

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final Map<String, dynamic> message = data['message'];

      List<Breed> breeds = [];
      message.forEach((breedName, subBreedsList) {
        breeds.add(Breed(
          name: breedName,
          subBreeds: List<String>.from(subBreedsList),
        ));
      });
      return breeds;
    } else {
      throw Exception('Failed to load breeds');
    }
  }

  // Fetch a random image for a specific breed (and optional sub-breed)
  static Future<String> fetchRandomImage(String breed, {String? subBreed}) async {
    final url = subBreed != null
        ? '$_baseUrl/breed/$breed/$subBreed/images/random'
        : '$_baseUrl/breed/$breed/images/random';

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['message']; // Returns the image URL string
    } else {
      throw Exception('Failed to load image');
    }
  }
}