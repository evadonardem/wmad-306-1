import 'dart:convert';
import 'package:http/http.dart' as http;

class DogApiService {
  static const String _baseUrl = 'https://dog.ceo/api';

  Future<List<String>> getAllBreeds() async {
    final response = await http.get(Uri.parse('$_baseUrl/breeds/list/all'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['message'] as Map).keys.cast<String>().toList()..sort();
    }
    return [];
  }

  Future<String?> getRandomImageByBreed(String breed) async {
    final response =
        await http.get(Uri.parse('$_baseUrl/breed/$breed/images/random'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['message'];
    }
    return null;
  }
}