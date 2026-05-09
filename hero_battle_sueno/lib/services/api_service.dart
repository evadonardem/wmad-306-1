import '../models/hero_model.dart';
import 'superhero_api_service.dart';

class ApiService {
  Future<List<HeroModel>> fetchHeroes() async {
    return await SuperheroApiService().fetchAllHeroes();
  }
}
