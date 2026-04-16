import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';

class DeckProvider extends ChangeNotifier {
	static const int maxDeckSize = 5;

	final List<HeroModel> _deck = [];

	List<HeroModel> get deck => List.unmodifiable(_deck);
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
}
