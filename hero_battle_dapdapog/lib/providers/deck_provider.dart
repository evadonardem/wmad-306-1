import 'package:flutter/foundation.dart';

import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';

class DeckProvider extends ChangeNotifier {
	static const int maxDeckSize = 5;

	final List<HeroModel> _deck = <HeroModel>[];

	List<HeroModel> get deck => List<HeroModel>.unmodifiable(_deck);
	int get deckCount => _deck.length;

	bool isInDeck(HeroModel hero) {
		return _deck.any((item) => item.id == hero.id);
	}

	void toggleHero(HeroModel hero) {
		if (isInDeck(hero)) {
			_deck.removeWhere((item) => item.id == hero.id);
		} else {
			if (_deck.length >= maxDeckSize) {
				return;
			}
			_deck.add(hero);
		}
		notifyListeners();
	}

	void addHero(HeroModel hero) {
		if (isInDeck(hero) || _deck.length >= maxDeckSize) {
			return;
		}
		_deck.add(hero);
		notifyListeners();
	}

	void removeHero(HeroModel hero) {
		_deck.removeWhere((item) => item.id == hero.id);
		notifyListeners();
	}

	void clearDeck() {
		_deck.clear();
		notifyListeners();
	}

	Future<void> saveDeck(String name) async {
		if (name.trim().isEmpty || _deck.isEmpty) {
			return;
		}
		await DatabaseService().saveDeck(name.trim(), _deck);
	}
}
