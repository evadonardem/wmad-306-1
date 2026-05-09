import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/breed.dart';

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
            subBreeds: List<String>.from(e.value as List),
          ),
        )
        .toList()
      ..sort((a, b) => a.name.compareTo(b.name));
  }

  Future<Uint8List> fetchRandomImageBytes(String breedName) async {
    final uri = Uri.parse('$_base/breed/$breedName/images/random');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load image');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    final String imageUrl = data['message'] as String;
    final imageResponse = await http.get(Uri.parse(imageUrl));

    if (imageResponse.statusCode != 200) {
      throw Exception('Failed to load image bytes');
    }

    if (kIsWeb) {
      debugPrint('DogApiService.fetchRandomImageBytes - breed: $breedName');
      debugPrint('Image URL: $imageUrl');
      debugPrint('Image bytes length: ${imageResponse.bodyBytes.length}');
    }

    return imageResponse.bodyBytes;
  }
}
