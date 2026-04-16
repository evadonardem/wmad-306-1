class HeroModel {
	HeroModel({
		required this.id,
		required this.name,
		required this.imageUrl,
		required this.powerstats,
		required this.biography,
		required this.appearance,
		required this.work,
		required this.connections,
	});

	final String id;
	final String name;
	final String imageUrl;
	final HeroPowerstats powerstats;
	final HeroBiography biography;
	final HeroAppearance appearance;
	final HeroWork work;
	final HeroConnections connections;

	String get fallbackImageUrl =>
			'https://akabab.github.io/superhero-api/api/images/lg/$id-${_slugify(name)}.jpg';

	int get overallPower =>
			((powerstats.intelligence +
									powerstats.strength +
									powerstats.speed +
									powerstats.durability +
									powerstats.power +
									powerstats.combat) /
							6)
					.round();

	factory HeroModel.fromJson(Map<String, dynamic> json) {
		final heroName = _asString(json['name'], fallback: 'Unknown Hero');
		return HeroModel(
			id: _asString(json['id'], fallback: '0'),
			name: heroName,
			imageUrl: _resolveImageUrl(json),
			powerstats:
					HeroPowerstats.fromJson((json['powerstats'] as Map<String, dynamic>?) ?? const {}),
			biography:
					HeroBiography.fromJson(
						(json['biography'] as Map<String, dynamic>?) ?? const {},
						heroName: heroName,
					),
			appearance:
					HeroAppearance.fromJson((json['appearance'] as Map<String, dynamic>?) ?? const {}),
			work: HeroWork.fromJson((json['work'] as Map<String, dynamic>?) ?? const {}),
			connections:
					HeroConnections.fromJson((json['connections'] as Map<String, dynamic>?) ?? const {}),
		);
	}
}

class HeroPowerstats {
	HeroPowerstats({
		required this.intelligence,
		required this.strength,
		required this.speed,
		required this.durability,
		required this.power,
		required this.combat,
	});

	final int intelligence;
	final int strength;
	final int speed;
	final int durability;
	final int power;
	final int combat;

	factory HeroPowerstats.fromJson(Map<String, dynamic> json) {
		return HeroPowerstats(
			intelligence: _asInt(json['intelligence']),
			strength: _asInt(json['strength']),
			speed: _asInt(json['speed']),
			durability: _asInt(json['durability']),
			power: _asInt(json['power']),
			combat: _asInt(json['combat']),
		);
	}
}

class HeroBiography {
	HeroBiography({
		required this.fullName,
		required this.alignment,
		required this.publisher,
		required this.placeOfBirth,
		required this.firstAppearance,
		required this.aliases,
	});

	final String fullName;
	final String alignment;
	final String publisher;
	final String placeOfBirth;
	final String firstAppearance;
	final List<String> aliases;

	factory HeroBiography.fromJson(
		Map<String, dynamic> json, {
		String heroName = '',
	}) {
		final rawAliases = (json['aliases'] as List?) ?? const [];
		final publisher = _asString(json['publisher'], fallback: 'Unknown Publisher');
		return HeroBiography(
			fullName: _asString(_pick(json, ['full-name', 'fullName'])),
			alignment: _asString(json['alignment'], fallback: 'unknown'),
			publisher: publisher.toLowerCase() == heroName.toLowerCase()
					? 'Unknown Publisher'
					: publisher,
			placeOfBirth: _asString(_pick(json, ['place-of-birth', 'placeOfBirth'])),
			firstAppearance: _asString(_pick(json, ['first-appearance', 'firstAppearance'])),
			aliases: rawAliases
					.whereType<String>()
					.map((a) => a.trim())
					.where((a) => a.isNotEmpty && a != '-')
					.toList(),
		);
	}
}

class HeroAppearance {
	HeroAppearance({
		required this.gender,
		required this.race,
		required this.height,
		required this.weight,
		required this.eyeColor,
		required this.hairColor,
	});

	final String gender;
	final String race;
	final List<String> height;
	final List<String> weight;
	final String eyeColor;
	final String hairColor;

	factory HeroAppearance.fromJson(Map<String, dynamic> json) {
		return HeroAppearance(
			gender: _asString(json['gender']),
			race: _asString(json['race'], fallback: 'Unknown'),
			height: _asStringList(json['height']),
			weight: _asStringList(json['weight']),
			eyeColor: _asString(_pick(json, ['eye-color', 'eyeColor'])),
			hairColor: _asString(_pick(json, ['hair-color', 'hairColor'])),
		);
	}
}

class HeroWork {
	HeroWork({required this.occupation, required this.base});

	final String occupation;
	final String base;

	factory HeroWork.fromJson(Map<String, dynamic> json) {
		return HeroWork(
			occupation: _asString(json['occupation']),
			base: _asString(json['base']),
		);
	}
}

class HeroConnections {
	HeroConnections({required this.groupAffiliation, required this.relatives});

	final String groupAffiliation;
	final String relatives;

	factory HeroConnections.fromJson(Map<String, dynamic> json) {
		return HeroConnections(
			groupAffiliation: _asString(_pick(json, ['group-affiliation', 'groupAffiliation'])),
			relatives: _asString(json['relatives']),
		);
	}
}

String _resolveImageUrl(Map<String, dynamic> json) {
	final imageMap = json['image'] as Map<String, dynamic>?;
	final imagesMap = json['images'] as Map<String, dynamic>?;

	final fromSuperheroApi = _asString(imageMap?['url']);
	if (fromSuperheroApi != 'Unknown') {
		return fromSuperheroApi;
	}

	return _asString(
		imagesMap?['lg'] ?? imagesMap?['md'] ?? imagesMap?['sm'] ?? imagesMap?['xs'],
		fallback: '',
	);
}

dynamic _pick(Map<String, dynamic> json, List<String> keys) {
	for (final key in keys) {
		if (json.containsKey(key)) {
			return json[key];
		}
	}
	return null;
}

String _asString(dynamic value, {String fallback = 'Unknown'}) {
	final text = value?.toString().trim() ?? '';
	if (text.isEmpty || text == '-' || text.toLowerCase() == 'null') {
		return fallback;
	}
	return text;
}

int _asInt(dynamic value) {
	final text = value?.toString().trim() ?? '';
	final parsed = int.tryParse(text);
	if (parsed == null) {
		return 0;
	}
	return parsed.clamp(0, 100).toInt();
}

List<String> _asStringList(dynamic value) {
	if (value is List) {
		return value
				.map((item) => item.toString().trim())
				.where((item) => item.isNotEmpty && item != '-')
				.toList();
	}
	return const [];
}

String _slugify(String value) {
	final cleaned = value.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]+'), '-');
	return cleaned.replaceAll(RegExp(r'-+'), '-').replaceAll(RegExp(r'^-|-$'), '');
}
