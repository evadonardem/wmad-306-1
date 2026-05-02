import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';

class SuperheroApiService {
	SuperheroApiService({Dio? dio})
			: _dio = dio ??
						Dio(
							BaseOptions(
								connectTimeout: const Duration(seconds: 10),
								receiveTimeout: const Duration(seconds: 10),
							),
						);

	final Dio _dio;

	static const String _baseUrl = 'https://superheroapi.com/api';
	static const String _token = String.fromEnvironment('SUPERHERO_API_TOKEN');
	static const String _webProxy = 'https://corsproxy.io/?';
	static const String _catalogUrl = 'https://akabab.github.io/superhero-api/api/all.json';

	String get _rootPath {
		final normalizedToken = _normalizeToken(_token);
		if (normalizedToken.isEmpty) {
			throw const SuperheroApiException(
				'Missing API token. Run with --dart-define=SUPERHERO_API_TOKEN=<token>.',
			);
		}
		return '$_baseUrl/$normalizedToken';
	}

	Future<List<HeroModel>> searchHeroes(String query) async {
		final trimmed = query.trim();
		if (trimmed.isEmpty) {
			return const [];
		}

		try {
			final data = await _getJson('search/${Uri.encodeComponent(trimmed)}');
			if (data['response'] == 'error') {
				final error = (data['error'] ?? 'Unknown API error').toString();
				if (error.toLowerCase().contains('character with given name')) {
					return const [];
				}
				throw SuperheroApiException(error);
			}

			final rawResults = (data['results'] as List?) ?? const [];
			return rawResults
					.whereType<Map<String, dynamic>>()
					.map(HeroModel.fromJson)
					.toList();
		} on DioException catch (e) {
			throw SuperheroApiException(_mapDioError(e));
		}
	}

	Future<HeroModel> getHeroById(String heroId) async {
		try {
			final data = await _getJson(Uri.encodeComponent(heroId));

			if (data['response'] == 'error') {
				throw SuperheroApiException((data['error'] ?? 'Hero not found').toString());
			}

			return HeroModel.fromJson(data);
		} on DioException catch (e) {
			throw SuperheroApiException(_mapDioError(e));
		}
	}

	Future<List<HeroModel>> fetchHeroCatalog() async {
		try {
			final response = await _dio.get<dynamic>(_catalogUrl);
			final payload = response.data;

			if (payload is List) {
				return payload
						.whereType<Map<String, dynamic>>()
						.map(HeroModel.fromJson)
						.toList();
			}

			if (payload is String) {
				final decoded = jsonDecode(payload);
				if (decoded is List) {
					return decoded
							.whereType<Map<String, dynamic>>()
							.map(HeroModel.fromJson)
							.toList();
				}
			}

			throw const SuperheroApiException('Invalid hero catalog response.');
		} on DioException catch (e) {
			throw SuperheroApiException(_mapDioError(e));
		}
	}

	Future<Map<String, dynamic>> _getJson(String path) async {
		final target = '$_rootPath/$path';
		final url = kIsWeb ? '$_webProxy${Uri.encodeComponent(target)}' : target;

		final response = await _dio.get<dynamic>(url);
		final payload = response.data;

		if (payload is Map<String, dynamic>) {
			return payload;
		}

		if (payload is String) {
			final decoded = jsonDecode(payload);
			if (decoded is Map<String, dynamic>) {
				return decoded;
			}
		}

		throw const SuperheroApiException('Invalid response from Superhero API.');
	}

	String _normalizeToken(String raw) {
		final token = raw.trim();
		if (token.isEmpty) {
			return '';
		}

		final uri = Uri.tryParse(token);
		if (uri != null && uri.hasScheme) {
			final segments = uri.pathSegments.where((s) => s.trim().isNotEmpty).toList();
			if (segments.isNotEmpty) {
				return segments.last;
			}
		}

		return token;
	}

	String _mapDioError(DioException e) {
		switch (e.type) {
			case DioExceptionType.connectionTimeout:
			case DioExceptionType.receiveTimeout:
			case DioExceptionType.sendTimeout:
				return 'Request timed out. Check your connection and try again.';
			case DioExceptionType.connectionError:
				return kIsWeb
						? 'Connection blocked (likely CORS/network). Retrying via web proxy failed.'
						: 'Unable to connect to Superhero API.';
			default:
				return 'Failed to load data from Superhero API.';
		}
	}
}

class SuperheroApiException implements Exception {
	const SuperheroApiException(this.message);

	final String message;

	@override
	String toString() => message;
}
