import 'dart:convert';
import 'package:http/http.dart' as http;

const String superheroApiToken = "<YOUR_SUPERHERO_API_TOKEN>";
const String superheroApiBaseUrl = "https://superheroapi.com/api";

class SuperHeroService {
  Future<String?> fetchHeroImage(int id) async {
    final response = await http.get(
      Uri.parse("$superheroApiBaseUrl/$superheroApiToken/$id/image"),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['response'] == 'success') {
        return data['url']; // actual image URL
      }
    }
    return null; // fallback if failed
  }
}
