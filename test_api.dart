import 'lib/services/superhero_api_service.dart';
import 'dart:async';

Future<void> main() async {
  // print('Fetching Batman (id=70)...');
  final hero = await SuperheroApiService.fetchHeroById(70);
  if (hero != null) {
    // print('Success! Hero: \\${hero.name}');
    // print('Image: \\${hero.imageUrl}');
  } else {
    // print('Failed to fetch hero.');
  }
}
