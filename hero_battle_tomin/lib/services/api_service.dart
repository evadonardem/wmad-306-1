import 'package:dio/dio.dart';
import '../models/warrior_model.dart';

const String kApiToken = String.fromEnvironment(
  'SUPERHERO_API_TOKEN',
  defaultValue: '0967911829e579ab0829149ea1fd85b5',
);

class ApiService {
  ApiService({String? token})
    : _token = token ?? kApiToken,
      _dio = Dio(
        BaseOptions(
          baseUrl: 'https://superheroapi.com/api/',
          connectTimeout: const Duration(seconds: 12),
          receiveTimeout: const Duration(seconds: 12),
        ),
      );

  final String _token;
  final Dio _dio;

  Future<WarriorModel> fetchById(int id) async {
    final res = await _dio.get('$_token/$id');
    _checkResponse(res);
    return WarriorModel.fromJson(res.data as Map<String, dynamic>);
  }

  Future<List<WarriorModel>> searchWarriors(String name) async {
    if (name.trim().isEmpty) return [];
    final res = await _dio.get(
      '$_token/search/${Uri.encodeComponent(name.trim())}',
    );
    _checkResponse(res);
    final data = res.data as Map<String, dynamic>;
    final results = data['results'] as List<dynamic>? ?? [];
    return results
        .map((j) => WarriorModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  Future<List<WarriorModel>> fetchRandomRoster({int count = 20}) async {
    final ids = List.generate(731, (i) => i + 1)..shuffle();
    final warriors = <WarriorModel>[];
    for (final id in ids) {
      if (warriors.length >= count) break;
      try {
        warriors.add(await fetchById(id));
      } catch (_) {}
    }
    if (warriors.isEmpty) {
      throw StateError('Could not load warriors from the API.');
    }
    return warriors;
  }

  void _checkResponse(Response res) {
    if (res.statusCode == null ||
        res.statusCode! < 200 ||
        res.statusCode! >= 300) {
      throw DioException.badResponse(
        statusCode: res.statusCode ?? 500,
        requestOptions: res.requestOptions,
        response: res,
      );
    }
    final d = res.data;
    if (d is Map<String, dynamic> && d['response'] == 'error') {
      throw StateError(d['error'] as String? ?? 'API error');
    }
  }
}
