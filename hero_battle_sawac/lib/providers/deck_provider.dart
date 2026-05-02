import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';

class SavedDeck {
	const SavedDeck({
		required this.id,
		required this.name,
		required this.heroes,
		required this.createdAt,
	});

	final String id;
	final String name;
	final List<HeroModel> heroes;
	final DateTime createdAt;
}

class DeckProvider extends ChangeNotifier {
	static const int maxDeckSize = 5;
	static const int maxSavedDecks = 12;

	final List<HeroModel> _deck = [];
	final List<SavedDeck> _savedDecks = [];

	List<HeroModel> get deck => List.unmodifiable(_deck);
	List<SavedDeck> get savedDecks => List.unmodifiable(_savedDecks);
	int get count => _deck.length;

	bool isInDeck(HeroModel hero) => _deck.any((h) => h.id == hero.id);

	bool addHero(HeroModel hero) {
		if (isInDeck(hero) || _deck.length >= maxDeckSize) {
			return false;
		}
		_deck.add(hero);
		notifyListeners();
		return true;
	}

	void removeHero(HeroModel hero) {
		_deck.removeWhere((h) => h.id == hero.id);
		notifyListeners();
	}

	void clear() {
		_deck.clear();
		notifyListeners();
	}

	bool saveCurrentDeckAsNew({String? name}) {
		if (_deck.length != maxDeckSize) {
			return false;
		}

		final trimmedName = name?.trim() ?? '';
		final baseName = trimmedName.isEmpty ? 'Deck ${_savedDecks.length + 1}' : trimmedName;
		final deckName = _resolveUniqueName(baseName);
		final id = DateTime.now().microsecondsSinceEpoch.toString();

		_savedDecks.insert(
			0,
			SavedDeck(
				id: id,
				name: deckName,
				heroes: List<HeroModel>.from(_deck),
				createdAt: DateTime.now(),
			),
		);

		if (_savedDecks.length > maxSavedDecks) {
			_savedDecks.removeLast();
		}

		notifyListeners();
		return true;
	}

	String _resolveUniqueName(String base) {
		final normalizedBase = base.trim();
		if (normalizedBase.isEmpty) {
			return 'Deck ${_savedDecks.length + 1}';
		}

		final used = _savedDecks
				.map((deck) => deck.name.trim().toLowerCase())
				.toSet();
		final candidate = normalizedBase;
		if (!used.contains(candidate.toLowerCase())) {
			return candidate;
		}

		var suffix = 2;
		while (used.contains('$candidate $suffix'.toLowerCase())) {
			suffix++;
		}
		return '$candidate $suffix';
	}

	bool loadSavedDeck(String deckId) {
		final index = _savedDecks.indexWhere((deck) => deck.id == deckId);
		if (index < 0) {
			return false;
		}

		final saved = _savedDecks[index];
		_deck
			..clear()
			..addAll(saved.heroes.take(maxDeckSize));
		notifyListeners();
		return true;
	}

	bool deleteSavedDeck(String deckId) {
		final before = _savedDecks.length;
		_savedDecks.removeWhere((deck) => deck.id == deckId);
		if (before == _savedDecks.length) {
			return false;
		}
		notifyListeners();
		return true;
	}

	void clearSavedDecks() {
		if (_savedDecks.isEmpty) {
			return;
		}
		_savedDecks.clear();
		notifyListeners();
	}
}
