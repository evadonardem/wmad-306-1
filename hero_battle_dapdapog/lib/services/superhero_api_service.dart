import 'dart:math';

import 'package:dio/dio.dart';
import 'package:hero_battle/models/hero_model.dart';

class SuperheroApiService {
	static const String _baseUrl = 'https://superheroapi.com/api.php';
	static const String _token = String.fromEnvironment('SUPERHERO_API_TOKEN');
	static const List<int> _heroIds = [
		70,
		644,
		720,
		263,
		620,
		346,
		659,
		332,
		149,
		107,
		226,
		717,
	];

	final Dio _dio = Dio(
		BaseOptions(
			connectTimeout: const Duration(seconds: 10),
			receiveTimeout: const Duration(seconds: 10),
		),
	);

	List<HeroModel>? _cache;

	Future<List<HeroModel>> fetchHeroes({String query = ''}) async {
		final heroes = await _loadHeroes();
		final normalized = query.trim().toLowerCase();
		if (normalized.isEmpty) {
			return List<HeroModel>.unmodifiable(heroes);
		}

		return heroes
				.where((hero) => hero.name.toLowerCase().contains(normalized))
				.toList(growable: false);
	}

	Future<HeroModel> getRandomHero({Set<int> excludeIds = const {}}) async {
		final heroes = await _loadHeroes();
		final pool = heroes.where((hero) => !excludeIds.contains(hero.id)).toList();
		if (pool.isEmpty) {
			return heroes[Random().nextInt(heroes.length)];
		}
		return pool[Random().nextInt(pool.length)];
	}

	Future<HeroModel?> getHeroById(int id) async {
		final heroes = await _loadHeroes();
		for (final hero in heroes) {
			if (hero.id == id) {
				return hero;
			}
		}
		return null;
	}

	Future<List<HeroModel>> _loadHeroes() async {
		if (_cache != null && _cache!.isNotEmpty) {
			return _cache!;
		}

		if (_token.isEmpty) {
			return _fallbackHeroes;
		}

		final futures = _heroIds.map((id) async {
			final response = await _dio.get<Map<String, dynamic>>('$_baseUrl/$_token/$id');
			final data = response.data;
			if (data == null || data['response'] != 'success') {
				return null;
			}

			final powerStats = data['powerstats'] as Map<String, dynamic>? ?? {};
			final image = data['image'] as Map<String, dynamic>? ?? {};

			return HeroModel(
				id: int.tryParse('${data['id']}') ?? id,
				name: (data['name'] as String?)?.trim().isNotEmpty == true
						? data['name'] as String
						: 'Hero #$id',
				imageUrl: (image['url'] as String?) ?? '',
				intelligence: _toPower(powerStats['intelligence']),
				strength: _toPower(powerStats['strength']),
				speed: _toPower(powerStats['speed']),
				durability: _toPower(powerStats['durability']),
				power: _toPower(powerStats['power']),
				combat: _toPower(powerStats['combat']),
			);
		});

		final results = await Future.wait(futures);
		final heroes = results.whereType<HeroModel>().toList(growable: false);
		if (heroes.isNotEmpty) {
			_cache = heroes;
			return heroes;
		}

		return _fallbackHeroes;
	}

	static int _toPower(dynamic value) {
		return int.tryParse('${value ?? 0}') ?? 0;
	}

	static final List<HeroModel> _fallbackHeroes = [
		const HeroModel(
			id: 70,
			name: 'Batman',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/70-batman.jpg',
			intelligence: 100,
			strength: 26,
			speed: 27,
			durability: 50,
			power: 47,
			combat: 100,
		),
		const HeroModel(
			id: 644,
			name: 'Superman',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/644-superman.jpg',
			intelligence: 94,
			strength: 100,
			speed: 100,
			durability: 100,
			power: 100,
			combat: 85,
		),
		const HeroModel(
			id: 720,
			name: 'Wonder Woman',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/720-wonder-woman.jpg',
			intelligence: 88,
			strength: 100,
			speed: 79,
			durability: 100,
			power: 100,
			combat: 100,
		),
		const HeroModel(
			id: 263,
			name: 'Flash',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/263-flash.jpg',
			intelligence: 88,
			strength: 48,
			speed: 100,
			durability: 60,
			power: 100,
			combat: 64,
		),
		const HeroModel(
			id: 620,
			name: 'Spider-Man',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/620-spider-man.jpg',
			intelligence: 90,
			strength: 55,
			speed: 67,
			durability: 75,
			power: 74,
			combat: 85,
		),
		const HeroModel(
			id: 346,
			name: 'Iron Man',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/346-iron-man.jpg',
			intelligence: 100,
			strength: 85,
			speed: 58,
			durability: 85,
			power: 100,
			combat: 64,
		),
		const HeroModel(
			id: 659,
			name: 'Thor',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/659-thor.jpg',
			intelligence: 69,
			strength: 100,
			speed: 83,
			durability: 100,
			power: 100,
			combat: 100,
		),
		const HeroModel(
			id: 332,
			name: 'Hulk',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/332-hulk.jpg',
			intelligence: 88,
			strength: 100,
			speed: 63,
			durability: 100,
			power: 98,
			combat: 85,
		),
		const HeroModel(
			id: 149,
			name: 'Captain America',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/149-captain-america.jpg',
			intelligence: 69,
			strength: 19,
			speed: 38,
			durability: 55,
			power: 60,
			combat: 100,
		),
		const HeroModel(
			id: 107,
			name: 'Black Widow',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/107-black-widow.jpg',
			intelligence: 75,
			strength: 13,
			speed: 33,
			durability: 30,
			power: 36,
			combat: 100,
		),
		const HeroModel(
			id: 226,
			name: 'Doctor Strange',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/226-doctor-strange.jpg',
			intelligence: 100,
			strength: 10,
			speed: 12,
			durability: 84,
			power: 100,
			combat: 60,
		),
		const HeroModel(
			id: 717,
			name: 'Wolverine',
			imageUrl: 'https://akabab.github.io/superhero-api/api/images/md/717-wolverine.jpg',
			intelligence: 63,
			strength: 32,
			speed: 50,
			durability: 100,
			power: 89,
			combat: 100,
		),
	];
}
