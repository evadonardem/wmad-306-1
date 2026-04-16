import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';
import '../services/superhero_api_service.dart';

enum HeroSortMode {
	nameAsc,
	overallPowerDesc,
	intelligenceDesc,
}

class HeroSearchProvider extends ChangeNotifier {
	HeroSearchProvider({required SuperheroApiService api}) : _api = api;

	final SuperheroApiService _api;

	Timer? _debounce;
	String _query = '';
	bool _isLoading = false;
	bool _isCatalogLoaded = false;
	String? _error;
	String _alignment = 'all';
	String _publisher = 'all';
	int _minPower = 0;
	HeroSortMode _sortMode = HeroSortMode.nameAsc;

	List<HeroModel> _catalog = [];

	String get query => _query;
	bool get isLoading => _isLoading;
	bool get isCatalogLoaded => _isCatalogLoaded;
	String? get error => _error;
	String get alignment => _alignment;
	String get publisher => _publisher;
	int get minPower => _minPower;
	HeroSortMode get sortMode => _sortMode;

	List<String> get publishers {
		final source = _catalog.isEmpty ? filteredResults : _catalog;
		final heroNames = source.map((h) => h.name.toLowerCase()).toSet();
		final counts = <String, int>{};

		for (final hero in source) {
			final publisher = hero.biography.publisher.trim();
			if (publisher.isEmpty || publisher == 'Unknown Publisher') {
				continue;
			}
			if (heroNames.contains(publisher.toLowerCase())) {
				continue;
			}
			counts[publisher] = (counts[publisher] ?? 0) + 1;
		}

		final list = counts.entries
				.where((entry) => entry.value > 1 || _looksLikePublisher(entry.key))
				.map((entry) => entry.key)
				.toList()
			..sort();
		return ['all', ...list];
	}

	List<HeroModel> get results {
		final filtered = filteredResults;

		filtered.sort((a, b) {
			switch (_sortMode) {
				case HeroSortMode.nameAsc:
					return a.name.toLowerCase().compareTo(b.name.toLowerCase());
				case HeroSortMode.overallPowerDesc:
					return b.overallPower.compareTo(a.overallPower);
				case HeroSortMode.intelligenceDesc:
					return b.powerstats.intelligence.compareTo(a.powerstats.intelligence);
			}
		});

		return filtered;
	}

	List<HeroModel> get filteredResults {
		return _catalog.where((hero) {
			final alignmentOk =
					_alignment == 'all' || hero.biography.alignment.toLowerCase() == _alignment;
			final publisherOk =
					_publisher == 'all' || hero.biography.publisher == _publisher;
			final powerOk = hero.overallPower >= _minPower;
			final searchOk = _query.trim().isEmpty || _matchesQuery(hero, _query);
			return alignmentOk && publisherOk && powerOk && searchOk;
		}).toList();
	}

	Future<void> loadCatalog() async {
		if (_isCatalogLoaded) {
			return;
		}

		_isLoading = true;
		_error = null;
		notifyListeners();

		try {
			_catalog = await _api.fetchHeroCatalog();
			_isCatalogLoaded = true;
		} catch (e) {
			_error = e.toString();
			_catalog = [];
		} finally {
			_isLoading = false;
			notifyListeners();
		}
	}

	void setQuery(String value) {
		_query = value;
		_error = null;
		notifyListeners();

		_debounce?.cancel();
		_debounce = Timer(const Duration(milliseconds: 420), () {
			unawaited(searchNow());
		});
	}

	Future<void> searchNow() async {
		await loadCatalog();
	}

	void setAlignment(String value) {
		_alignment = value;
		notifyListeners();
	}

	void setPublisher(String value) {
		_publisher = value;
		notifyListeners();
	}

	void setMinPower(int value) {
		_minPower = value;
		notifyListeners();
	}

	void setSortMode(HeroSortMode value) {
		_sortMode = value;
		notifyListeners();
	}

	void resetFilters() {
		_alignment = 'all';
		_publisher = 'all';
		_minPower = 0;
		_sortMode = HeroSortMode.nameAsc;
		notifyListeners();
	}

	bool _matchesQuery(HeroModel hero, String query) {
		final normalizedQuery = query.trim().toLowerCase();
		if (normalizedQuery.isEmpty) {
			return true;
		}

		return hero.name.toLowerCase().contains(normalizedQuery) ||
				hero.biography.fullName.toLowerCase().contains(normalizedQuery) ||
				hero.biography.publisher.toLowerCase().contains(normalizedQuery) ||
				hero.biography.aliases.any((alias) => alias.toLowerCase().contains(normalizedQuery));
	}

	bool _looksLikePublisher(String value) {
		final lower = value.toLowerCase();
		return lower.contains('comics') ||
				lower.contains('publishing') ||
				lower.contains('studios') ||
				lower.contains('media') ||
				lower.contains('inc') ||
				lower.contains('idw') ||
				lower.contains('image') ||
				lower.contains('dark horse') ||
				lower.contains('marvel') ||
				lower.contains('dc') ||
				lower.contains('lucas');
	}

	@override
	void dispose() {
		_debounce?.cancel();
		super.dispose();
	}
}
