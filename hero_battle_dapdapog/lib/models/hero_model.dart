import 'package:flutter/foundation.dart';

@immutable
class HeroModel {
	final int id;
	final String name;
	final String imageUrl;
	final int intelligence;
	final int strength;
	final int speed;
	final int durability;
	final int power;
	final int combat;

	const HeroModel({
		required this.id,
		required this.name,
		required this.imageUrl,
		required this.intelligence,
		required this.strength,
		required this.speed,
		required this.durability,
		required this.power,
		required this.combat,
	});

	int get totalPower =>
			intelligence + strength + speed + durability + power + combat;

	HeroModel copyWith({
		int? id,
		String? name,
		String? imageUrl,
		int? intelligence,
		int? strength,
		int? speed,
		int? durability,
		int? power,
		int? combat,
	}) {
		return HeroModel(
			id: id ?? this.id,
			name: name ?? this.name,
			imageUrl: imageUrl ?? this.imageUrl,
			intelligence: intelligence ?? this.intelligence,
			strength: strength ?? this.strength,
			speed: speed ?? this.speed,
			durability: durability ?? this.durability,
			power: power ?? this.power,
			combat: combat ?? this.combat,
		);
	}

	factory HeroModel.fromJson(Map<String, dynamic> json) {
		return HeroModel(
			id: json['id'] as int,
			name: json['name'] as String,
			imageUrl: json['imageUrl'] as String,
			intelligence: json['intelligence'] as int,
			strength: json['strength'] as int,
			speed: json['speed'] as int,
			durability: json['durability'] as int,
			power: json['power'] as int,
			combat: json['combat'] as int,
		);
	}

	Map<String, dynamic> toJson() {
		return {
			'id': id,
			'name': name,
			'imageUrl': imageUrl,
			'intelligence': intelligence,
			'strength': strength,
			'speed': speed,
			'durability': durability,
			'power': power,
			'combat': combat,
		};
	}
}
