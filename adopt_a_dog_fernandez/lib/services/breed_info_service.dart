import 'dart:convert';

import 'package:adopt_a_dog/models/breed_info.dart';
import 'package:adopt_a_dog/models/favorite_dog.dart';
import 'package:http/http.dart' as http;

class BreedInfoService {
  static const _breedInfoUrl = 'https://dogapi.dog/api/v2/breeds';
  static const Map<String, List<String>> _breedAliases = {
    'germanshepherd': ['German Shepherd Dog'],
    'mexicanhairless': ['Xoloitzcuintli'],
    'stbernard': ['Saint Bernard'],
    'sheepdogenglish': ['Old English Sheepdog'],
    'retrieverchesapeake': ['Chesapeake Bay Retriever'],
    'retrieverflatcoated': ['Flat-Coated Retriever'],
    'retrievergolden': ['Golden Retriever'],
    'setterenglish': ['English Setter'],
    'wolfhoundirish': ['Irish Wolfhound'],
    'bulldogfrench': ['French Bulldog'],
    'bulldogenglish': ['Bulldog'],
    'spanielcocker': ['Cocker Spaniel'],
    'terrierbull': ['Bull Terrier'],
    'terrieryorkshire': ['Yorkshire Terrier'],
    'houndafghan': ['Afghan Hound'],
  };

  Future<Map<String, String>> fetchBreedDescriptions() async {
    final response = await http.get(Uri.parse(_breedInfoUrl));

    if (response.statusCode != 200) {
      throw Exception('Failed to load breed descriptions');
    }

    final Map<String, dynamic> data = jsonDecode(response.body);
    final List<dynamic> breeds = data['data'] as List<dynamic>;
    final breedInfos = breeds
        .map((breed) {
          final attributes = breed['attributes'] as Map<String, dynamic>;
          return BreedInfo(
            name: attributes['name'] as String,
            description: (attributes['description'] as String?)?.trim() ?? '',
          );
        })
        .where((breed) => breed.description.isNotEmpty)
        .toList();

    final descriptions = <String, String>{};

    for (final breed in breedInfos) {
      descriptions[_normalize(breed.name)] = breed.description;
      descriptions[_sortTokens(breed.name)] = breed.description;
    }

    return descriptions;
  }

  String descriptionForFavorite(
    FavoriteDog favorite,
    Map<String, String> descriptions,
  ) {
    final candidates = _buildCandidates(favorite);

    for (final candidate in candidates) {
      final exactMatch = descriptions[_normalize(candidate)];
      if (exactMatch != null) {
        return exactMatch;
      }

      final tokenMatch = descriptions[_sortTokens(candidate)];
      if (tokenMatch != null) {
        return tokenMatch;
      }
    }

    return '${_titleCase(favorite.displayName)} description unavailable from the breed metadata source.';
  }

  List<String> _buildCandidates(FavoriteDog favorite) {
    final candidates = <String>[
      favorite.breedName,
      if (favorite.subBreed != null)
        '${favorite.subBreed} ${favorite.breedName}',
      if (favorite.subBreed != null)
        '${favorite.breedName} ${favorite.subBreed}',
    ];
    final aliasKeys = <String>{
      _normalize(favorite.breedName),
      _sortTokens(favorite.breedName),
      if (favorite.subBreed != null)
        _normalize('${favorite.subBreed}${favorite.breedName}'),
      if (favorite.subBreed != null)
        _sortTokens('${favorite.subBreed} ${favorite.breedName}'),
    };

    for (final key in aliasKeys) {
      final aliases = _breedAliases[key];
      if (aliases != null) {
        candidates.addAll(aliases);
      }
    }

    return candidates;
  }

  String _normalize(String value) {
    return value.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
  }

  String _sortTokens(String value) {
    final tokens =
        value
            .toLowerCase()
            .split(RegExp(r'[^a-z0-9]+'))
            .where((token) => token.isNotEmpty)
            .toList()
          ..sort();
    return tokens.join();
  }

  String _titleCase(String value) {
    return value
        .split(RegExp(r'[-_\s]+'))
        .where((part) => part.isNotEmpty)
        .map((part) => '${part[0].toUpperCase()}${part.substring(1)}')
        .join(' ');
  }
}
